import { Color } from "../Base/Color"
import { QAngle } from "../Base/QAngle"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { TextFlags } from "../Enums/TextFlags"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager } from "../Managers/InputManager"
import { ParseMaterial } from "../Resources/ParseMaterial"
import { StringToUTF8Cb } from "../Utils/ArrayBufferUtils"
import { tryFindFile } from "../Utils/readFile"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { ConVarsSDK } from "./ConVarsSDK"
import * as WASM from "./WASM"

const enum CommandID {
	BEGINCLIP = 0,
	ENDCLIP,

	TRANSLATE,
	ROTATE,
	SETSCISSOR,

	// PATH_*
	PATHMOVE_TO,
	PATHLINE_TO,
	PATH_ADD_RECT,
	PATH_ADD_ROUND_RECT,
	PATH_ADD_ELLIPSE,
	PATH_ADD_ARC,
	PATHCUBIC_TO,
	PATH_QUAD_TO,
	PATHCLOSE,

	// DRAW
	TEXT,
	SVG,
	PATH,

	// relative translate (non-draw): STORE writes the C++ offset map, LOAD selects the current offset
	TRANSLATE_RELATIVE_STORE = 17,
	TRANSLATE_RELATIVE_LOAD
}

/** Identifies one of the renderer's command lists (separate command streams). */
export const enum RenderList {
	/** Per-frame screen-anchor updates (TRANSLATE_RELATIVE_STORE). Submitted first. */
	Coords3D,
	/** Persisted heavy draws, rebuilt only on the throttled Draw2D pass. Submitted second. */
	Draw2D,
	/** Per-frame draws (PreDraw/Draw) + the menu. Submitted last. */
	Draw3D
}

/**
 * One independent command stream. The renderer keeps several of these and submits them in a chosen
 * order each frame, so e.g. the per-frame coords-update list runs before the persisted Draw2D list
 * that consumes those coords via TRANSLATE_RELATIVE_LOAD — eliminating the one-frame anchor lag.
 */
class CommandList {
	public cache = new Uint8Array()
	public stream = new ViewBinaryStream(new DataView(new ArrayBuffer(0)))
	public size = 0
	public smallFrames = 0
}

/**
 * Well-known relative-anchor kinds, shared across scripts so two consumers that want the same point
 * (e.g. a unit's health bar) collapse to one map cell. Bespoke anchors use AllocateAnchorKind().
 */
export const enum AnchorKind {
	HealthBar = 0,
	Origin = 1
}

// fallback anchor for an entity whose screen position doesn't resolve this frame (block clipped away)
const RELATIVE_OFFSCREEN = new Vector2(-1e5, -1e5)

const enum PathFlags {
	LINECAP_OFFSET = 2,
	LINE_JOIN_OFFSET = 4,

	GRAYSCALE = 1 << 0,
	IMAGESHADER = 1 << 1,
	LINECAP_BITS = (1 << LINECAP_OFFSET) | (1 << (LINECAP_OFFSET + 1)),
	LINE_JOIN_BITS = (1 << LINE_JOIN_OFFSET) | (1 << (LINE_JOIN_OFFSET + 1)),
	FILL = 1 << 6,
	STROKE = 1 << 7,
	STROKE_AND_FILL = FILL | STROKE,
	FILL_AA_ON = 1 << 8,
	STROKE_AA_OFF = 1 << 9
}
export const enum LineCap {
	Butt = 1,
	Round = 2,
	Square = 3
}
export const enum LineJoin {
	Miter = 1,
	Round = 2,
	Bevel = 3
}

class Font {
	constructor(
		public readonly FontID: number,
		public readonly Weight: number,
		public readonly Italic: boolean
	) {}
}

class CRendererSDK {
	// Looks like it's hardcoded
	// Do not change it unless anything breaks.
	public readonly ProportionalBase = 1080

	public readonly DefaultFontName = "Roboto"
	public readonly DefaultTextSize = 18
	/**
	 * Default Size of Shape = Width 32 x Height 32
	 *
	 * @param vecSize Width as X
	 * @param vecSize Height as Y
	 */
	public readonly DefaultShapeSize: Vector2 = new Vector2(32, 32)

	public readonly WindowSize = new Vector2(1, 1)

	// Separate command streams submitted in a fixed order each frame (see EmitDraw):
	// Coords3D first so its STOREs land before Draw2D's LOADs read them (zero anchor lag).
	private readonly coords3DList = new CommandList()
	private readonly draw2DList = new CommandList()
	private readonly draw3DList = new CommandList()
	private activeList: CommandList = this.draw3DList
	private readonly listStack: CommandList[] = []
	private lastDraw2DTime = 0
	private lastPreDataUpdateTime = 0
	private draw2DInvalidated = false
	private readonly draw2DInterval = 1000 / 30
	// true while a relative offset is loaded, so zero-offset draws still emit a TRANSLATE
	private relativeOffsetActive = false
	// debug stats, captured each frame in EmitDraw and exposed via DebugStats
	private relStoreCounter = 0
	private relLoadCounter = 0
	private readonly debugStats = {
		coords3D: 0,
		draw2D: 0,
		draw3D: 0,
		relStores: 0,
		relLoads: 0
	}
	// per-entity anchor registry: id -> live screen-position source, refilled each Draw2D and stored
	// once per frame in EmitDraw (a Map keyed by id dedupes consumers that share an anchor)
	private readonly anchorRefs = new Map<number, () => Nullable<Vector2>>()
	private nextAnchorKind = 64 // custom kinds; 0..63 reserved for built-in AnchorKind
	// proxies so the many `this.commandStream.WriteX(...)` and `this.commandCacheSize` call sites
	// keep writing into whichever list is currently active
	private get commandStream(): ViewBinaryStream {
		return this.activeList.stream
	}
	private get commandCacheSize(): number {
		return this.activeList.size
	}
	private set commandCacheSize(value: number) {
		this.activeList.size = value
	}
	private readonly fontCache = new Map<string, Font[]>()
	private readonly textureCache = new Map</* path */ string, number>()
	private clearTextureCache = false
	private readonly tex2size = new Map</* textureID */ number, Vector2>()
	// key: fontID * 4096 + roundedSize  ->  Map<text, measured Vector3 (post-Ceil)>.
	// Avoids the per-frame V8 round-trip + UTF-8 conversion + shared renderer mutex
	// for repeated (text, font, size) measurements during Draw2D.
	private readonly textSizeCache = new Map<number, Map<string, Vector3>>()
	private textSizeCacheCount = 0
	private readonly maxTextSizeCache = 8192
	private readonly queuedFonts: [string, string, number, boolean, string][] = []
	private inDraw = false
	private opacityMul = 1

	public get IsInDraw(): boolean {
		return this.inDraw
	}
	/**
	 * Global alpha (0..1) multiplied into the alpha of every draw command queued while < 1.
	 * Lets the menu fade whole groups of elements in/out without threading an alpha through
	 * each Image/Text/Rect call. Defaults to 1 (no change); set it right before a batch of
	 * draws and reset it to 1 right after. It only affects commands queued while it is set,
	 * and is re-applied every frame, so a stray value self-heals on the next render.
	 */
	public get OpacityMultiplier(): number {
		return this.opacityMul
	}
	public set OpacityMultiplier(value: number) {
		this.opacityMul = value < 0 ? 0 : value > 1 ? 1 : value
	}

	public get CameraDistance() {
		const dist = Camera.Distance
		if (dist !== -1) {
			return dist
		}
		const cv = ConVarsSDK.GetFloat("dota_camera_distance", -1)
		return cv !== -1 ? cv : 1200
	}
	public IsInScreenArea(position: Vector2, scale: number = 1): boolean {
		const size = RendererSDK.WindowSize
		const areaWidth = size.x * scale,
			areaHeight = size.y * scale
		const minX = (size.x - areaWidth) / 2,
			minY = (size.y - areaHeight) / 2
		return position.IsUnderRectangle(minX, minY, areaWidth, areaHeight)
	}
	public GetWidthScale(screenSize = this.WindowSize): number {
		let screenHeight = screenSize.y
		if (screenSize.x === 1280 && screenHeight === 1024) {
			screenHeight = 960
		} else if (screenSize.x === 720 && screenHeight === 576) {
			screenHeight = 540
		}
		return screenHeight / this.ProportionalBase
	}
	public GetHeightScale(screenSize = this.WindowSize): number {
		const screenHeight = screenSize.y
		return screenHeight / this.ProportionalBase
	}
	public ScaleWidth(w: number, screenSize = this.WindowSize): number {
		return Math.round(w * this.GetWidthScale(screenSize))
	}
	public ScaleHeight(h: number, screenSize = this.WindowSize): number {
		return Math.round(h * this.GetHeightScale(screenSize))
	}
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(position: Vector2 | Vector3, cull = true): Nullable<Vector2> {
		if (!position.IsValid) {
			return undefined
		}
		if (position instanceof Vector2) {
			position = Vector3.FromVector2(position).SetZ(
				WASM.GetPositionHeight(position)
			)
		}
		const vec = WASM.WorldToScreenNew(position, this.WindowSize)?.FloorForThis()
		if (!cull || vec === undefined) {
			return vec
		}
		vec.DivideForThis(this.WindowSize)
		// cut returned screen space to 1.5x screen size
		if (vec.x < -0.25 || vec.x > 1.25) {
			return undefined
		}
		if (vec.y < -0.25 || vec.y > 1.25) {
			return undefined
		}
		return vec.MultiplyForThis(this.WindowSize)
	}
	/**
	 * @returns screen position with x and y in range {0, 1}, or undefined
	 */
	public WorldToScreenCustom(
		position: Vector2 | Vector3,
		cameraPosition: Vector2 | Vector3,
		cameraDistance = 1200,
		cameraAngles = new QAngle(60, 90, 0),
		windowSize = this.WindowSize
	): Nullable<Vector2> {
		if (position instanceof Vector2) {
			position = Vector3.FromVector2(position).SetZ(
				WASM.GetPositionHeight(position)
			)
		}
		if (cameraPosition instanceof Vector2) {
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
		}
		const vec = WASM.WorldToScreen(
			position,
			cameraPosition,
			cameraDistance,
			cameraAngles,
			windowSize
		)?.DivideForThis(windowSize)
		if (vec === undefined) {
			return undefined
		}
		// cut returned screen space to 2x screen size
		if (vec.x < -0.5 || vec.x > 1.5) {
			return undefined
		}
		if (vec.y < -0.5 || vec.y > 1.5) {
			return undefined
		}
		return vec
	}

	/**
	 * Projects given screen vector onto camera matrix. Can be used to connect ScreenToWorldFar and camera position dots.
	 *
	 * @param screen screen position
	 */
	public ScreenToWorld(screen: Vector2): Vector3 {
		const vec = screen.Divide(this.WindowSize).MultiplyScalarForThis(2)
		vec.x = vec.x - 1
		vec.y = 1 - vec.y
		const cameraPos = Camera.Position ? Vector3.fromIOBuffer() : new Vector3()
		const cameraAng = Camera.Angles ? QAngle.fromIOBuffer() : new QAngle()
		return WASM.ScreenToWorld(
			vec,
			cameraPos,
			this.CameraDistance,
			cameraAng,
			this.WindowSize
		)
	}
	/**
	 * Projects given screen vector onto camera matrix. Can be used to connect ScreenToWorldFar and camera position dots.
	 *
	 * @param screen screen position with x and y in range {0, 1}
	 */
	public ScreenToWorldCustom(
		screen: Vector2,
		cameraPosition: Vector2 | Vector3,
		cameraDistance = 1200,
		cameraAngles = new QAngle(60, 90, 0),
		windowSize = this.WindowSize
	): Vector3 {
		if (cameraPosition instanceof Vector2) {
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
		}
		return WASM.ScreenToWorld(
			screen,
			cameraPosition,
			cameraDistance,
			cameraAngles,
			windowSize
		)
	}
	/**
	 * @param screen screen position with x and y in range {0, 1}
	 */
	public ScreenToWorldFar(
		screens: Vector2[],
		cameraPosition: Vector2 | Vector3,
		cameraDistance = 1200,
		cameraAngles = new QAngle(60, 90, 0),
		windowSize = this.WindowSize,
		fov = -1
	): Vector3[] {
		if (cameraPosition instanceof Vector2) {
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
		}
		return WASM.ScreenToWorldFar(
			screens,
			windowSize,
			cameraPosition,
			cameraDistance,
			cameraAngles,
			fov
		)
	}
	public FilledCircle(
		vecPos: Vector2,
		vecSize: Vector2,
		color = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false
	): void {
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		this.Rotate(rotationDeg)
		this.Ellipse(vecSize, 0, PathFlags.FILL, color, grayscale)
	}
	/**
	 *
	 */
	public OutlinedCircle(
		vecPos: Vector2,
		vecSize: Vector2,
		color = Color.White,
		width = 5,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false
	): void {
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		this.Rotate(rotationDeg)
		this.Ellipse(vecSize, width, PathFlags.STROKE, color, grayscale)
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public Line(
		start: Vector2 = new Vector2(),
		end = start.Add(this.DefaultShapeSize),
		fillColor = Color.White,
		width = 5,
		rotationDeg = 0,
		customScissor?: Rectangle,
		strokeColor = fillColor,
		grayscale = false
	): void {
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(start)
		this.Rotate(rotationDeg)
		this.PathMoveTo(0, 0)
		this.PathLineTo(end.x - start.x, end.y - start.y)
		this.Path(width, fillColor, strokeColor, PathFlags.STROKE_AND_FILL, grayscale)
	}
	public LineArrow(
		start: Vector2,
		end: Vector2,
		color = Color.White,
		width = 5,
		arrowLength = 10,
		arrowAngleDeg = 30
	) {
		this.Line(start, end, color, width)
		const dir = start.GetDirectionTo(end)
		const angle = Math.degreesToRadian(arrowAngleDeg)
		for (let i = 0; i < 2; i++) {
			const sign = i === 0 ? 1 : -1
			const sideDir = dir.Rotated(sign * angle).MultiplyScalar(arrowLength)
			this.Line(end, end.Subtract(sideDir), color, width)
		}
	}
	public TriangleFilled(
		p1: Vector2,
		p2: Vector2,
		p3: Vector2,
		fillColor = Color.White,
		strokeColor = fillColor,
		grayscale = false
	) {
		this.PathMoveTo(p1.x, p1.y)
		this.PathLineTo(p2.x, p2.y)
		this.PathLineTo(p3.x, p3.y)
		this.PathLineTo(p1.x, p1.y)

		this.Path(
			1,
			fillColor,
			strokeColor,
			PathFlags.FILL | PathFlags.FILL_AA_ON,
			grayscale,
			LineCap.Square,
			LineJoin.Miter
		)
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public FilledRect(
		vecPos = new Vector2(),
		vecSize = this.DefaultShapeSize,
		fillColor = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false,
		strokeColor = fillColor,
		width = 0,
		cap = LineCap.Square,
		join = LineJoin.Round
	): void {
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		this.Rotate(rotationDeg)
		this.Rect(
			vecSize,
			width,
			width === 0 ? PathFlags.FILL : PathFlags.STROKE_AND_FILL,
			fillColor,
			strokeColor,
			grayscale,
			cap,
			join
		)
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public OutlinedRect(
		vecPos = new Vector2(),
		vecSize = this.DefaultShapeSize,
		width = 1,
		color = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false,
		cap = LineCap.Square,
		join = LineJoin.Round
	): void {
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		this.Rotate(rotationDeg)
		this.Rect(vecSize, width, PathFlags.STROKE, color, color, grayscale, cap, join)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 * @param round < 0 no rounding, 0 = circle, > 0 = rounded corners
	 */
	public Image(
		path: string,
		vecPos: Vector2,
		round = -1,
		vecSize = new Vector2(-1, -1),
		color = Color.White,
		rotationDeg = 0, // not currently working? // works, but not for svg's
		customScissor?: Rectangle,
		grayscale = false,
		subtexOffset?: Vector2,
		subtexSize?: Vector2
	): void {
		// TODO: need add for the script or add new logic
		// const vecPos = vecPos_.Clone()
		// if (rotationDeg !== 0) {
		// 	//rotate around the center instead of top left corner
		// 	const angle = Math.degreesToRadian(rotationDeg),
		// 		s = Math.sin(angle),
		// 		c = Math.cos(angle)
		// 	const centerOffset = vecSize.DivideScalar(2)
		// 	const adjust = new Vector2(
		// 		centerOffset.x * c - centerOffset.y * s,
		// 		centerOffset.x * s + centerOffset.y * c
		// 	)
		// 	vecPos.SubtractForThis(adjust).AddForThis(centerOffset)
		// }

		const textureID = this.GetTexture(path) // better put it BEFORE new command
		if (textureID === -1) {
			return
		}
		const origSize = this.tex2size.get(textureID)!
		const halfRound = round / 2

		if (path.endsWith(".svg") || path.endsWith(".vsvg_c")) {
			const useRound = round >= 0,
				useScissors = customScissor !== undefined

			if (useRound || useScissors) {
				this.BeginClip(false)
				if (useRound) {
					this.FilledCircle(
						vecPos.AddScalar(halfRound),
						vecSize.SubtractScalar(halfRound),
						Color.White,
						0,
						customScissor
					)
				}
				if (useScissors) {
					this.FilledRect(customScissor.pos1, customScissor.pos2)
				}
				this.EndClip()
			}

			if (customScissor !== undefined) {
				this.SetScissor(customScissor)
			}
			this.Translate(vecPos)
			this.Rotate(rotationDeg)
			this.AllocateCommandSpace(CommandID.SVG, 4 * 4 + 1)
			this.commandStream.WriteUint32(textureID)
			this.commandStream.WriteFloat32(vecSize.x)
			this.commandStream.WriteFloat32(vecSize.y)
			this.WriteScaledColor(color)
			this.commandStream.WriteBoolean(grayscale)
			return
		}
		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}

		this.Translate(vecPos, false)
		this.Rotate(rotationDeg)

		let flags = PathFlags.IMAGESHADER | PathFlags.FILL | PathFlags.FILL_AA_ON
		if (round < 0) {
			//no rounding
			flags &= ~PathFlags.FILL_AA_ON
			this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
			this.commandStream.WriteFloat32(0)
			this.commandStream.WriteFloat32(0)
			this.commandStream.WriteFloat32(vecSize.x)
			this.commandStream.WriteFloat32(vecSize.y)
		} else if (round > 0) {
			// rounded corners
			this.AllocateCommandSpace(CommandID.PATH_ADD_ROUND_RECT, 4 * 5)
			this.commandStream.WriteFloat32(0)
			this.commandStream.WriteFloat32(0)
			this.commandStream.WriteFloat32(vecSize.x)
			this.commandStream.WriteFloat32(vecSize.y)
			this.commandStream.WriteFloat32(halfRound)
		} else {
			// round == 0, force circle
			this.AllocateCommandSpace(CommandID.PATH_ADD_ELLIPSE, 4 * 4)
			this.commandStream.WriteFloat32(halfRound)
			this.commandStream.WriteFloat32(halfRound)
			this.commandStream.WriteFloat32(vecSize.x - halfRound)
			this.commandStream.WriteFloat32(vecSize.y - halfRound)
		}

		let texOffset, texSize

		if (subtexOffset === undefined || subtexSize === undefined) {
			const ratio = vecSize.x / vecSize.y
			const origRatio = origSize.x / origSize.y
			const cut = new Vector2(
				ratio >= origRatio ? 0 : (ratio - origRatio) / ratio,
				ratio <= origRatio ? 0 : (origRatio - ratio) / origRatio
			)
			texOffset = vecSize.Multiply(cut).DivideScalar(-2)
			texSize = new Vector2(1, 1).Subtract(cut).Multiply(vecSize)
		} else {
			texOffset = vecSize.Divide(subtexSize).Multiply(subtexOffset)
			texSize = origSize.Divide(subtexSize).Multiply(vecSize)
		}

		this.Path(
			1,
			color,
			color,
			flags,
			grayscale,
			LineCap.Square,
			LineJoin.Round,
			textureID,
			texOffset.x,
			texOffset.y,
			texSize.x,
			texSize.y
		)
	}
	public GetImageSize(path: string): Vector2 {
		return this.tex2size.get(this.GetTexture(path)) ?? new Vector2(1, 1)
	}
	public Text(
		text: string,
		vecPos = new Vector2(),
		color = Color.White,
		fontName = this.DefaultFontName,
		fontSize = this.DefaultTextSize,
		weight = 400,
		italic = false,
		outlined = true
	): void {
		if (text.length === 0) {
			return
		}

		let fontID = this.GetFont(fontName, weight, italic)
		if (fontID === -1) {
			return
		}
		if (outlined) {
			fontID |= 0x8000
		}

		this.Translate(vecPos)
		this.AllocateCommandSpace(CommandID.TEXT, 2 * 2 + 2 * 4)
		this.commandStream.WriteUint16(fontID)
		this.commandStream.WriteUint16(Math.round(fontSize + 4))
		this.WriteScaledColor(color)
		const lengthPos = this.commandStream.pos
		this.commandStream.WriteUint32(0)
		{
			// preserve 2 bytes per 1 char, we'll allocate more later if needed
			const preallocLength = text.length * 2
			this.commandCacheSize += preallocLength
			this.ResizeCommandCache()
			this.commandCacheSize -= preallocLength
		}
		StringToUTF8Cb(text, b => {
			this.commandCacheSize++
			this.ResizeCommandCache()
			this.commandStream.WriteUint8(b)
		})
		const endPos = this.commandStream.pos,
			bytesLen = endPos - lengthPos - 4
		this.commandStream.RelativeSeek(lengthPos - endPos)
		this.commandStream.WriteUint32(bytesLen)
		this.commandStream.RelativeSeek(bytesLen)
	}
	public TextByFlags(
		text: string,
		position: Rectangle,
		color = Color.White,
		division = 1.2,
		flags = TextFlags.Center,
		width = 400,
		fontName = this.DefaultFontName,
		fixDigits = true,
		italic = false,
		outlined = true,
		filledRect = false,
		filledRectColor = Color.Black.SetA(200)
	) {
		const digits = fixDigits ? text.slice().replace(/\d/g, "0") : text
		const size = position.Height / Math.max(division, 1.2)
		const getTextSize = this.GetTextSize(digits, fontName, size, width, italic)

		const textSize = Vector2.FromVector3(getTextSize)
		const newPosition = this.flagPositionBox(getTextSize, position, flags)

		if (filledRect) {
			RendererSDK.FilledRect(newPosition, textSize, filledRectColor)
		}
		this.Text(text, newPosition, color, fontName, size, width, italic, outlined)
		return new Rectangle(newPosition, textSize)
	}
	/**
	 * @returns text size defined as new Vector3(width, height, underLine)
	 */
	public GetTextSize(
		text: string,
		fontName = this.DefaultFontName,
		fontSize = this.DefaultTextSize,
		weight = 400,
		italic = false
	): Vector3 {
		if (!this.inDraw) {
			console.error(
				"Unsafe GetTextSize usage outside of Draw event",
				new Error().stack
			)
		}

		if (text === "") {
			return new Vector3()
		}

		const fontID = this.GetFont(fontName, weight, italic)
		if (fontID === -1) {
			return new Vector3()
		}
		const roundedSize = Math.round(fontSize + 4)
		const bucketKey = fontID * 4096 + roundedSize
		let bucket = this.textSizeCache.get(bucketKey)
		const cached = bucket?.get(text)
		if (cached !== undefined) {
			return cached.Clone()
		}
		Renderer.GetTextSize(text, fontID, roundedSize)
		const result = new Vector3(IOBuffer[0], IOBuffer[1], IOBuffer[2]).CeilForThis()
		if (bucket === undefined) {
			bucket = new Map()
			this.textSizeCache.set(bucketKey, bucket)
		}
		bucket.set(text, result.Clone())
		if (++this.textSizeCacheCount > this.maxTextSizeCache) {
			this.textSizeCache.clear()
			this.textSizeCacheCount = 0
		}
		return result
	}
	/**
	 * @param color default: Yellow
	 * @param fontWeight default: 0
	 * @param flags see FontFlagsT. You can use it like (FontFlagsT.OUTLINE | FontFlagsT.BOLD)
	 * @param flags default: FontFlagsT.ANTIALIAS
	 */
	public TextAroundMouse(
		text: string,
		vec?: Vector2 | false,
		color = Color.Yellow,
		fontName = this.DefaultFontName,
		fontSize = 30,
		weight = 400,
		italic = false,
		outlined = true
	): void {
		let vecMouse = InputManager.CursorOnScreen.AddScalarX(30).AddScalarY(15)

		if (vec !== undefined && vec !== false) {
			vecMouse = vecMouse.Add(vec)
		}

		this.Text(text, vecMouse, color, fontName, fontSize, weight, italic, outlined)
	}
	public BeforeDraw(w: number, h: number) {
		this.inDraw = true

		// per-frame lists start fresh each frame; the persisted Draw2D list is kept until rebuilt
		this.ResetList(this.coords3DList)
		this.ResetList(this.draw3DList)
		this.activeList = this.draw3DList
		this.listStack.length = 0
		this.relativeOffsetActive = false
		this.relStoreCounter = 0

		// eslint-disable-next-line prettier/prettier
		if (this.WindowSize.x !== w ||
			this.WindowSize.y !== h) {
			this.WindowSize.x = w
			this.WindowSize.y = h

			EventsSDK.emit("WindowSizeChanged", false)
		}
		if (this.clearTextureCache) {
			this.clearTextureCache = false
			this.textureCache.forEach(tex => {
				if (tex !== -1) {
					this.FreeTexture(tex)
				}
			})
			this.textureCache.clear()
			this.tex2size.clear()
			this.draw2DInvalidated = true
		}
		if (this.queuedFonts.length) {
			this.queuedFonts.forEach(font => {
				this.CreateFont(...font)
			})
			this.queuedFonts.clear()
		}
	}
	public OnTick(): void {
		this.lastPreDataUpdateTime = hrtime()
	}
	// use to remove 30 fps cap, e.g. during panel dragging
	public InvalidateDraw2D(): void {
		this.draw2DInvalidated = true
	}
	public ShouldEmitDraw2D(): boolean {
		const now = hrtime()
		if (
			this.draw2DInvalidated ||
			(now - this.lastDraw2DTime >= this.draw2DInterval &&
				now - this.lastPreDataUpdateTime > 1000 / 30 / 2)
		) {
			this.lastDraw2DTime = now
			this.draw2DInvalidated = false
			return true
		}
		return false
	}
	// Draw2D is just "build the persisted Draw2D list from scratch" — kept for callers.
	public BeforeDraw2D(): void {
		this.relLoadCounter = 0
		this.anchorRefs.clear()
		this.BeginCommandList(RenderList.Draw2D, true)
	}
	public AfterDraw2D(): void {
		this.EndCommandList()
	}
	/**
	 * Make a command list the active write target. Subsequent draw calls go into it until the
	 * matching EndCommandList(). `reset` clears the list first (rebuild) vs appending.
	 */
	public BeginCommandList(id: RenderList, reset = true): void {
		const list = this.ListByID(id)
		this.listStack.push(this.activeList)
		this.activeList = list
		if (reset) {
			this.ResetList(list)
		}
	}
	public EndCommandList(): void {
		this.activeList = this.listStack.pop() ?? this.draw3DList
	}
	public EmitDraw() {
		// store each referenced entity anchor once (deduped) into coords3D before it is flushed
		this.anchorRefs.forEach((getPos, id) =>
			this.TranslateRelativeStore(id, getPos() ?? RELATIVE_OFFSCREEN, false)
		)
		// Submit order is the whole point: coords (STOREs) before the persisted Draw2D (LOADs),
		// then the per-frame Draw3D + menu. SetCommandCache appends, so these accumulate in order.
		this.FlushList(this.coords3DList)
		this.FlushList(this.draw2DList)
		this.FlushList(this.draw3DList)
		this.debugStats.coords3D = this.coords3DList.size
		this.debugStats.draw2D = this.draw2DList.size
		this.debugStats.draw3D = this.draw3DList.size
		this.debugStats.relStores = this.relStoreCounter
		this.debugStats.relLoads = this.relLoadCounter
		this.inDraw = false
	}
	/**
	 * Debug counters captured at the end of the previous frame: byte size of each command list and
	 * the number of relative STORE / LOAD ops emitted (LOAD count is from the last Draw2D rebuild).
	 */
	public get DebugStats(): Readonly<{
		coords3D: number
		draw2D: number
		draw3D: number
		relStores: number
		relLoads: number
	}> {
		return this.debugStats
	}
	private ResetList(list: CommandList): void {
		list.stream.pos = 0
		list.size = 0
	}
	private ListByID(id: RenderList): CommandList {
		switch (id) {
			case RenderList.Coords3D:
				return this.coords3DList
			case RenderList.Draw2D:
				return this.draw2DList
			default:
				return this.draw3DList
		}
	}
	private FlushList(list: CommandList): void {
		if (list.size > 0) {
			Renderer.ExecuteCommandBuffer(list.cache.subarray(0, list.size))
		}
		// shrink an oversized buffer after sustained low usage
		const shrinkFactor = 3,
			shrinkMul = 2,
			shrinkFrames = 5
		if (list.size * shrinkFactor < list.cache.byteLength) {
			if (list.smallFrames++ > shrinkFrames) {
				const shrunk = new Uint8Array(list.size * shrinkMul)
				shrunk.set(list.cache.subarray(0, list.size))
				list.cache = shrunk
				list.stream = new ViewBinaryStream(
					new DataView(
						list.cache.buffer,
						list.cache.byteOffset,
						list.cache.byteLength
					),
					list.stream.pos
				)
				list.smallFrames = 0
			}
		} else {
			list.smallFrames = 0
		}
	}
	public GetAspectRatio(windowSize = this.WindowSize) {
		const res = windowSize.x / windowSize.y
		if (res >= 1.25 && res <= 1.35) {
			return "4x3"
		} else if (res >= 1.7 && res <= 1.85) {
			return "16x9"
		} else if (res >= 1.5 && res <= 1.69) {
			return "16x10"
		} else if (res >= 2.2 && res <= 2.4) {
			return "21x9"
		}
		return "unknown"
	}
	public Radial(
		startAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fillColor = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		strokeColor = fillColor,
		grayscale = false,
		outlineWidth = -1,
		outer = false,
		cap = LineCap.Square,
		join = LineJoin.Round
	): void {
		outer = outer && outlineWidth !== -1
		const sizeOff = outer ? Math.round(outlineWidth / 2) : 0,
			posOff = outer ? -Math.round(outlineWidth / 4) : 0
		vecPos.AddScalarForThis(posOff)
		vecSize.AddScalarForThis(sizeOff)

		percent = Math.min(Math.max(percent / 100, -1), 1)
		if (percent >= 1) {
			if (outlineWidth !== -1) {
				this.OutlinedRect(
					vecPos,
					vecSize,
					outlineWidth,
					strokeColor,
					rotationDeg,
					customScissor,
					grayscale
				)
			} else {
				this.FilledRect(
					vecPos,
					vecSize,
					fillColor,
					rotationDeg,
					customScissor,
					grayscale
				)
			}
			vecSize.SubtractScalarForThis(sizeOff)
			vecPos.SubtractScalarForThis(posOff)
			return
		}
		vecPos.AddScalarForThis(posOff)
		vecSize.AddScalarForThis(sizeOff)

		if (outlineWidth !== -1) {
			this.BeginClip(false)
		}

		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		this.Rotate(rotationDeg)

		let angle = this.NormalizedAngle(Math.degreesToRadian(360 * percent))
		const startAngleSign = Math.sign(startAngle)
		startAngle = Math.degreesToRadian(startAngle)
		if (startAngleSign < 0) {
			startAngle -= angle
		}
		startAngle = this.NormalizedAngle(startAngle)

		this.PathMoveTo(vecSize.x / 2, vecSize.y / 2)
		const pi4 = Math.PI / 4
		const startAngleModPI4 = startAngle % pi4
		if (startAngleModPI4 !== 0) {
			const pt = this.PointOnBounds(startAngle, vecSize)
			this.PathLineTo(pt.x, pt.y)
			const diff = pi4 - startAngleModPI4
			startAngle += diff
			angle -= Math.min(diff, angle)
		}
		for (let a = 0; a < angle; a += pi4) {
			const pt = this.PointOnBounds(startAngle + a, vecSize)
			this.PathLineTo(pt.x, pt.y)
		}
		{
			const pt = this.PointOnBounds(startAngle + angle, vecSize)
			this.PathLineTo(pt.x, pt.y)
		}
		this.Path(
			1,
			outlineWidth !== -1 ? Color.White : fillColor,
			outlineWidth !== -1 ? Color.White : strokeColor,
			PathFlags.STROKE_AND_FILL | PathFlags.FILL_AA_ON,
			grayscale,
			cap,
			join
		)

		vecSize.SubtractScalarForThis(sizeOff)
		vecPos.SubtractScalarForThis(posOff)
		if (outlineWidth !== -1) {
			this.EndClip()
			this.OutlinedRect(
				vecPos,
				vecSize,
				outlineWidth,
				strokeColor,
				rotationDeg,
				customScissor,
				grayscale
			)
		}
		vecSize.SubtractScalarForThis(sizeOff)
		vecPos.SubtractScalarForThis(posOff)
	}
	public Arc(
		baseAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fill = false,
		width = 5,
		color = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false,
		outer = false,
		cap = LineCap.Butt
	): void {
		if (Number.isNaN(baseAngle) || !Number.isFinite(baseAngle)) {
			baseAngle = 0
		}
		if (Number.isNaN(percent) || !Number.isFinite(percent)) {
			percent = 100
		}
		percent = Math.min(Math.max(percent / 100, -1), 1)

		const sizeOff = outer ? Math.round(width / 2) : 0,
			posOff = outer ? -Math.round(width / 4) : 0

		if (percent >= 1) {
			vecPos = vecPos.AddScalar(posOff)
			vecSize = vecSize.AddScalar(sizeOff)
			if (fill) {
				this.FilledCircle(
					vecPos,
					vecSize,
					color,
					rotationDeg,
					customScissor,
					grayscale
				)
			} else {
				this.OutlinedCircle(
					vecPos,
					vecSize,
					color,
					width,
					rotationDeg,
					customScissor,
					grayscale
				)
			}
			return
		}

		if (customScissor !== undefined) {
			this.SetScissor(customScissor)
		}
		this.Translate(vecPos)
		if (outer) {
			this.Translate(new Vector2(posOff, posOff))
		}
		this.Rotate(rotationDeg)

		baseAngle = Math.degreesToRadian(baseAngle)
		const sweepAngle = Math.degreesToRadian(360 * percent * Math.sign(baseAngle))

		this.AllocateCommandSpace(CommandID.PATH_ADD_ARC, 6 * 4 + 1)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x + sizeOff)
		this.commandStream.WriteFloat32(vecSize.y + sizeOff)
		this.commandStream.WriteFloat32(baseAngle)
		this.commandStream.WriteFloat32(sweepAngle)
		this.commandStream.WriteBoolean(fill)
		this.Path(
			width,
			color,
			color,
			fill ? PathFlags.FILL : PathFlags.STROKE,
			grayscale,
			cap
		)
	}
	public AllocateCommandSpace_(commandID: CommandID, bytes: number): ViewBinaryStream {
		this.AllocateCommandSpace(commandID, bytes)
		return this.commandStream
	}
	public FreeTextureCache(): void {
		this.clearTextureCache = true
	}
	public CreateFont(
		name: string,
		path: string,
		weight: number,
		italic: boolean,
		stack = new Error().stack!
	): void {
		const realPath = tryFindFile(path, 1)
		if (realPath === undefined) {
			console.error(`Reading font "${name}" with path "${path}" failed`, stack)
			return
		}

		if (!this.inDraw) {
			this.queuedFonts.push([name, realPath, weight, italic, stack])
			return
		}

		const fontID = Renderer.CreateFont(realPath)
		if (fontID === -1) {
			console.error(`Loading font "${name}" with path "${path}" failed`, stack)
			return
		}

		let fontAr = this.fontCache.get(name)
		if (fontAr === undefined) {
			fontAr = []
			this.fontCache.set(name, fontAr)
		}
		fontAr.push(new Font(fontID, weight, italic))
	}
	public BeginClip(diffOp: boolean): void {
		this.AllocateCommandSpace(CommandID.BEGINCLIP, 1)
		this.commandStream.WriteBoolean(diffOp)
	}
	public EndClip(): void {
		this.AllocateCommandSpace(CommandID.ENDCLIP, 0)
	}
	private Rect(
		vecSize: Vector2,
		width: number,
		pathFlags: PathFlags,
		fillColor: Color,
		strokeColor: Color,
		grayscale: boolean,
		cap: LineCap,
		join: LineJoin
	): void {
		this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		pathFlags |= PathFlags.STROKE_AA_OFF
		this.Path(width, fillColor, strokeColor, pathFlags, grayscale, cap, join)
	}
	public RectRounded(
		vecPos: Vector2,
		vecSize: Vector2,
		roundDiameter: number,
		fillColor: Color,
		strokeColor: Color,
		width: number
	): void {
		this.Translate(vecPos)

		const round = roundDiameter > 0

		this.AllocateCommandSpace(
			round ? CommandID.PATH_ADD_ROUND_RECT : CommandID.PATH_ADD_RECT,
			4 * 4 + (round ? 4 : 0)
		)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		if (round) {
			this.commandStream.WriteFloat32(
				Math.min(roundDiameter, vecSize.x - 1, vecSize.y - 1) / 2
			)
		}

		let pathFlags = 0
		if (fillColor.toUint32() !== 0) {
			pathFlags |= PathFlags.FILL
		}
		if (strokeColor.toUint32() !== 0) {
			pathFlags |= PathFlags.STROKE | PathFlags.STROKE_AA_OFF
		}
		if (round) {
			pathFlags &= ~PathFlags.STROKE_AA_OFF
			pathFlags |= PathFlags.FILL_AA_ON
		}

		this.Path(width, fillColor, strokeColor, pathFlags, false)
	}
	private Ellipse(
		vecSize: Vector2,
		width: number,
		pathFlags: PathFlags,
		color: Color,
		grayscale: boolean
	): void {
		this.AllocateCommandSpace(CommandID.PATH_ADD_ELLIPSE, 4 * 4)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		pathFlags |= PathFlags.FILL_AA_ON
		this.Path(width, color, color, pathFlags, grayscale)
	}
	private FreeTexture(textureID: number): void {
		Renderer.FreeTexture(textureID)
	}
	private GetTexture(path: string): number {
		let textureID = this.textureCache.get(path)
		if (textureID !== undefined) {
			return textureID
		}

		let readPath = tryFindFile(path, 2)
		if (readPath === undefined) {
			readPath = "panorama/images/spellicons/empty_png.vtex_c"
		}

		if (readPath === undefined) {
			console.error("CreateTexture failed file lookup for", path, new Error().stack)
			this.textureCache.set(path, -1)
			return -1
		}

		if (readPath.endsWith(".vmat_c")) {
			try {
				const vmat = ParseMaterial(readPath)
				const tColor = vmat.TextureParams.get("g_tColor")
				if (tColor !== undefined) {
					readPath = tColor
					if (readPath.endsWith(".vtex")) {
						readPath += "_c"
					}
				}
			} catch {
				readPath = ""
			}
		}

		textureID = readPath !== "" ? Renderer.CreateTexture(readPath) : -1
		if (textureID === -1) {
			console.error("CreateTexture failed for", path)
		}
		this.textureCache.set(path, textureID)
		this.tex2size.set(textureID, Vector2.fromIOBuffer())
		return textureID
	}
	public GetFont(fontName: string, weight: number, italic: boolean): number {
		const fontAr = this.fontCache.get(fontName)
		if (fontAr === undefined) {
			return -1
		}
		return (
			fontAr.orderByFirst(
				font =>
					Math.abs(font.Weight - weight) - (font.Italic === italic ? 10000 : 0)
			)?.FontID ?? -1
		)
	}

	private OnCommandCacheChanged() {
		const list = this.activeList
		list.stream = new ViewBinaryStream(
			new DataView(list.cache.buffer, list.cache.byteOffset, list.cache.byteLength),
			list.stream.pos
		)
	}
	private ResizeCommandCache(): void {
		const list = this.activeList
		if (list.size <= list.cache.byteLength) {
			return
		}
		const growFactor = 2
		const buf = new Uint8Array(
			Math.max(list.cache.byteLength * growFactor, list.size)
		)
		buf.set(list.cache, 0)
		list.cache = buf
		this.OnCommandCacheChanged()
	}
	private AllocateCommandSpace(commandID: CommandID, bytes: number): void {
		bytes += 1 // msgid
		this.activeList.size += bytes
		this.ResizeCommandCache()
		this.activeList.stream.WriteUint8(commandID)
	}
	// writes a color into the command stream, scaling its alpha by OpacityMultiplier
	private WriteScaledColor(color: Color): void {
		if (this.opacityMul >= 1) {
			this.commandStream.WriteColor(color)
			return
		}
		this.commandStream.WriteUint8(Math.max(Math.min(color.r, 255), 0))
		this.commandStream.WriteUint8(Math.max(Math.min(color.g, 255), 0))
		this.commandStream.WriteUint8(Math.max(Math.min(color.b, 255), 0))
		this.commandStream.WriteUint8(
			Math.max(Math.min(color.a * this.opacityMul, 255), 0)
		)
	}
	private SetScissor(rect: Rectangle): void {
		this.AllocateCommandSpace(CommandID.SETSCISSOR, 4 * 4)
		this.commandStream.WriteFloat32(rect.pos1.x)
		this.commandStream.WriteFloat32(rect.pos1.y)
		this.commandStream.WriteFloat32(rect.pos2.x)
		this.commandStream.WriteFloat32(rect.pos2.y)
	}
	/*private PathClose(): void {
		this.AllocateCommandSpace(CommandID.PATHCLOSE, 0)
	}*/
	private PathMoveTo(x: number, y: number): void {
		this.AllocateCommandSpace(CommandID.PATHMOVE_TO, 2 * 4)
		this.commandStream.WriteFloat32(x)
		this.commandStream.WriteFloat32(y)
	}
	private PathLineTo(x: number, y: number): void {
		this.AllocateCommandSpace(CommandID.PATHLINE_TO, 2 * 4)
		this.commandStream.WriteFloat32(x)
		this.commandStream.WriteFloat32(y)
	}
	/*private PathSetStyle(style: PathFillType): void {
		this.AllocateCommandSpace(CommandID.PATHSET_FILL_TYPE, 1)
		this.commandStream.WriteUint8(style)
	}*/
	private Path(
		width: number,
		fillColor: Color,
		strokeColor: Color,
		flags: PathFlags,
		grayscale: boolean,
		cap = LineCap.Square,
		join = LineJoin.Round,
		texID?: number,
		texOffsetX?: number,
		texOffsetY?: number,
		texW?: number,
		texH?: number
	): void {
		if (grayscale) {
			flags |= PathFlags.GRAYSCALE
		}
		flags |=
			Math.max(Math.min(cap, LineCap.Square), LineCap.Butt) <<
			PathFlags.LINECAP_OFFSET
		flags |=
			Math.max(Math.min(join, LineJoin.Bevel), LineJoin.Miter) <<
			PathFlags.LINE_JOIN_OFFSET
		const hasImage = flags.hasMask(PathFlags.IMAGESHADER)
		this.AllocateCommandSpace(CommandID.PATH, 3 * 4 + 2 + (hasImage ? 5 * 4 : 0))
		this.WriteScaledColor(fillColor)
		this.WriteScaledColor(strokeColor)
		this.commandStream.WriteFloat32(width / 2)
		this.commandStream.WriteUint16(flags)
		if (hasImage) {
			this.commandStream.WriteUint32(texID!)
			this.commandStream.WriteFloat32(-texOffsetX!)
			this.commandStream.WriteFloat32(-texOffsetY!)
			this.commandStream.WriteFloat32(texW!)
			this.commandStream.WriteFloat32(texH!)
		}
	}
	private Rotate(ang: number): void {
		while (ang >= 360) {
			ang -= 360
		}
		if (ang === 0) {
			return
		}
		this.AllocateCommandSpace(CommandID.ROTATE, 4)
		this.commandStream.WriteFloat32(Math.degreesToRadian(ang))
	}
	private Translate(vecPos: Vector2, round: boolean = true): void {
		// While a relative offset is loaded, a zero local offset is NOT a no-op: it must still emit
		// a TRANSLATE so the C++ side adds the loaded offset (a shape sitting exactly on the anchor).
		if (vecPos.IsZero() && !this.relativeOffsetActive) {
			return
		}
		if (round) {
			vecPos.RoundForThis()
		}
		this.AllocateCommandSpace(CommandID.TRANSLATE, 2 * 4)
		this.commandStream.WriteFloat32(vecPos.x)
		this.commandStream.WriteFloat32(vecPos.y)
	}
	/**
	 * Store a per-id screen anchor in the C++ offset map (written to the Coords3D list, which is
	 * submitted before Draw2D so the value is current when Draw2D's LOAD reads it). Zero deletes it.
	 */
	public TranslateRelativeStore(id: number, vecPos: Vector2, round = true): void {
		this.relStoreCounter++
		this.BeginCommandList(RenderList.Coords3D, false)
		if (round) {
			vecPos.RoundForThis()
		}
		this.AllocateCommandSpace(CommandID.TRANSLATE_RELATIVE_STORE, 4 + 2 * 4)
		this.commandStream.WriteUint32(id >>> 0)
		this.commandStream.WriteFloat32(vecPos.x)
		this.commandStream.WriteFloat32(vecPos.y)
		this.EndCommandList()
	}
	/** Remove a per-id anchor (e.g. on entity destroy or when off-screen). */
	public TranslateRelativeDelete(id: number): void {
		this.relStoreCounter++
		this.BeginCommandList(RenderList.Coords3D, false)
		this.AllocateCommandSpace(CommandID.TRANSLATE_RELATIVE_STORE, 4 + 2 * 4)
		this.commandStream.WriteUint32(id >>> 0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.EndCommandList()
	}
	/**
	 * Select the per-id anchor as the current relative offset; every following TRANSLATE in the
	 * active draw list is shifted by it until the next Load/Reset. Prefer DrawRelative.
	 */
	public TranslateRelativeLoad(id: number): void {
		this.relLoadCounter++
		this.AllocateCommandSpace(CommandID.TRANSLATE_RELATIVE_LOAD, 4)
		this.commandStream.WriteUint32(id >>> 0)
		this.relativeOffsetActive = true
	}
	/** Clear the current relative offset back to (0,0). Id 0 is reserved and never stored. */
	public TranslateRelativeReset(): void {
		this.AllocateCommandSpace(CommandID.TRANSLATE_RELATIVE_LOAD, 4)
		this.commandStream.WriteUint32(0)
		this.relativeOffsetActive = false
	}
	/**
	 * Draw a block anchored to a per-id screen point: every draw in `cb` is shifted by the offset
	 * stored for `id`. The offset is reset afterwards even if `cb` throws, so it can't leak.
	 */
	public DrawRelative(id: number, cb: () => void): void {
		this.TranslateRelativeLoad(id)
		try {
			cb()
		} finally {
			this.TranslateRelativeReset()
		}
	}
	/** Allocate a process-unique custom anchor kind for script-specific anchors (vs shared AnchorKind). */
	public AllocateAnchorKind(): number {
		return this.nextAnchorKind++
	}
	/**
	 * Register a per-(entity, kind) anchor and return its relative-coord id. The registry stores it
	 * once per frame (deduped) from `getPos`, so multiple scripts using the same (entity, kind) share
	 * one cell while different kinds stay separate. Call during the Draw2D build (alongside the draw).
	 */
	public UseEntityAnchor(
		entityIndex: number,
		kind: number,
		getPos: () => Nullable<Vector2>
	): number {
		const id = (entityIndex * 4096 + kind) >>> 0
		this.anchorRefs.set(id, getPos)
		return id
	}
	/** Convenience: register the anchor (UseEntityAnchor) and draw the block relative to it. */
	public DrawEntityRelative(
		entityIndex: number,
		kind: number,
		getPos: () => Nullable<Vector2>,
		cb: () => void
	): void {
		this.DrawRelative(this.UseEntityAnchor(entityIndex, kind, getPos), cb)
	}
	private NormalizedAngle(ang: number): number {
		while (ang < 0) {
			ang += 2 * Math.PI
		}
		while (ang > 2 * Math.PI) {
			ang -= 2 * Math.PI
		}
		return ang
	}
	private NormalizedPoint(ang: number): Vector2 {
		ang = this.NormalizedAngle(ang)
		const pi4 = Math.PI / 4
		const s = Math.floor(ang / pi4) % 8,
			p = s % 2 === 0 ? Math.tan(ang % pi4) : Math.tan(pi4 - (ang % pi4))

		switch (s) {
			case 0:
				return new Vector2(1, p)
			case 1:
				return new Vector2(p, 1)
			case 2:
				return new Vector2(-p, 1)
			case 3:
				return new Vector2(-1, p)
			case 4:
				return new Vector2(-1, -p)
			case 5:
				return new Vector2(-p, -1)
			case 6:
				return new Vector2(p, -1)
			default:
				return new Vector2(1, -p)
		}
	}
	private PointOnBounds(ang: number, vecSize: Vector2): Vector2 {
		const res = this.NormalizedPoint(ang).AddScalarForThis(1).DivideScalarForThis(2)
		res.x = Math.min(Math.max(res.x, 0), 1)
		res.y = Math.min(Math.max(res.y, 0), 1)
		return res.MultiplyForThis(vecSize)
	}
	private flagPositionBox(textSize: Vector3, box: Rectangle, flag: TextFlags) {
		const position = Vector2.FromVector3(
			textSize
				.MultiplyScalarForThis(-1)
				.AddScalarX(box.Width)
				.AddScalarY(box.Height + textSize.z)
		)
		switch (true) {
			case flag.hasMask(TextFlags.Bottom | TextFlags.Right):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x + position.x)
					.AddScalarY(box.y + position.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Bottom | TextFlags.Left):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x - position.x)
					.AddScalarY(box.y + position.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Center | TextFlags.Right):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x + position.x)
					.AddScalarY(box.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Center | TextFlags.Left):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x - position.x)
					.AddScalarY(box.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Top | TextFlags.Right):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x + position.x)
					.AddScalarY(box.y - position.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Top | TextFlags.Left):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x - position.x)
					.AddScalarY(box.y - position.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Bottom):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x)
					.AddScalarY(box.y + position.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Center):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x)
					.AddScalarY(box.y)
					.RoundForThis()
			case flag.hasMask(TextFlags.Top):
				return position
					.DivideScalarForThis(2)
					.AddScalarX(box.x)
					.AddScalarY(box.y - position.y)
					.RoundForThis()
			default:
				return position
		}
	}
}

export const RendererSDK = new CRendererSDK()

EventsSDK.on("UnitAbilityDataUpdated", () => RendererSDK.FreeTextureCache())
EventsSDK.on("PreDataUpdate", () => RendererSDK.OnTick())
