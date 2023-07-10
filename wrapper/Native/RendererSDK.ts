import { Color } from "../Base/Color"
import { Matrix4x4Identity } from "../Base/Matrix"
import { QAngle } from "../Base/QAngle"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager } from "../Managers/InputManager"
import { ParseMaterial } from "../Resources/ParseMaterial"
import { CMeshDrawCall, ParseMesh } from "../Resources/ParseMesh"
import { ParseModel } from "../Resources/ParseModel"
import { StringToUTF8Cb } from "../Utils/ArrayBufferUtils"
import { orderByFirst } from "../Utils/ArrayExtensions"
import { HasMask } from "../Utils/BitsExtensions"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { fread } from "../Utils/fread"
import { DegreesToRadian } from "../Utils/Math"
import { tryFindFile } from "../Utils/readFile"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { ConVarsSDK } from "./ConVarsSDK"
import * as WASM from "./WASM"
import { Workers } from "./Workers"

enum CommandID {
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
}

enum PathFlags {
	LINECAP_OFFSET = 2,
	LINE_JOIN_OFFSET = 4,

	GRAYSCALE = 1 << 0,
	IMAGESHADER = 1 << 1,
	LINECAP_BITS = (1 << LINECAP_OFFSET) | (1 << (LINECAP_OFFSET + 1)),
	LINE_JOIN_BITS = (1 << LINE_JOIN_OFFSET) | (1 << (LINE_JOIN_OFFSET + 1)),
	FILL = 1 << 6,
	STROKE = 1 << 7,
	STROKE_AND_FILL = FILL | STROKE,
}
export enum LineCap {
	Butt = 1,
	Round = 2,
	Square = 3,
}
export enum LineJoin {
	Miter = 1,
	Round = 2,
	Bevel = 3,
}

class Font {
	constructor(
		public readonly FontID: number,
		public readonly Weight: number,
		public readonly Italic: boolean
	) {}
}

class CRendererSDK {
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

	private commandCache = new Uint8Array()
	private commandStream = new ViewBinaryStream(
		new DataView(
			this.commandCache.buffer,
			this.commandCache.byteOffset,
			this.commandCache.byteLength
		)
	)
	private commandCacheSize = 0
	private smallCommandCacheFrames = 0
	private readonly fontCache = new Map<string, Font[]>()
	private readonly textureCache = new Map</* path */ string, number>()
	private clearTextureCache = false
	private readonly tex2size = new Map</* textureID */ number, Vector2>()
	private readonly queuedFonts: [string, string, number, boolean, string][] = []
	private inDraw = false

	public get IsInDraw(): boolean {
		return this.inDraw
	}

	public get CameraDistance() {
		const dist = Camera.Distance
		if (dist !== -1) return dist
		const cv = ConVarsSDK.GetFloat("dota_camera_distance", -1)
		return cv !== -1 ? cv : 1200
	}

	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(
		position: Vector2 | Vector3,
		cull = true
	): Nullable<Vector2> {
		if (position instanceof Vector2)
			position = Vector3.FromVector2(position).SetZ(
				WASM.GetPositionHeight(position)
			)
		const vec = WASM.WorldToScreenNew(position, this.WindowSize)?.FloorForThis()
		if (!cull || vec === undefined) return vec
		vec.DivideForThis(this.WindowSize)
		// cut returned screen space to 1.5x screen size
		if (vec.x < -0.25 || vec.x > 1.25) return undefined
		if (vec.y < -0.25 || vec.y > 1.25) return undefined
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
		if (position instanceof Vector2)
			position = Vector3.FromVector2(position).SetZ(
				WASM.GetPositionHeight(position)
			)
		if (cameraPosition instanceof Vector2)
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
		const vec = WASM.WorldToScreen(
			position,
			cameraPosition,
			cameraDistance,
			cameraAngles,
			windowSize
		)?.DivideForThis(windowSize)
		if (vec === undefined) return undefined
		// cut returned screen space to 2x screen size
		if (vec.x < -0.5 || vec.x > 1.5) return undefined
		if (vec.y < -0.5 || vec.y > 1.5) return undefined
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
		if (cameraPosition instanceof Vector2)
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
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
		if (cameraPosition instanceof Vector2)
			cameraPosition = WASM.GetCameraPosition(
				cameraPosition,
				cameraDistance,
				cameraAngles
			)
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
		if (customScissor !== undefined) this.SetScissor(customScissor)
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
		if (customScissor !== undefined) this.SetScissor(customScissor)
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
		if (customScissor !== undefined) this.SetScissor(customScissor)
		this.Translate(start)
		this.Rotate(rotationDeg)
		this.PathMoveTo(0, 0)
		this.PathLineTo(end.x - start.x, end.y - start.y)
		this.Path(
			width,
			fillColor,
			strokeColor,
			PathFlags.STROKE_AND_FILL,
			grayscale
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
		if (customScissor !== undefined) this.SetScissor(customScissor)
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
		if (customScissor !== undefined) this.SetScissor(customScissor)
		this.Translate(vecPos)
		this.Rotate(rotationDeg)
		this.Rect(
			vecSize,
			width,
			PathFlags.STROKE,
			color,
			color,
			grayscale,
			cap,
			join
		)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtexC
	 */
	public Image(
		path: string,
		vecPos: Vector2,
		round = -1,
		vecSize = new Vector2(-1, -1),
		color = Color.White,
		rotationDeg = 0,
		customScissor?: Rectangle,
		grayscale = false,
		subtexOffset?: Vector2,
		subtexSize?: Vector2
	): void {
		const textureID = this.GetTexture(path) // better put it BEFORE new command
		if (textureID === -1) return
		const origSize = this.tex2size.get(textureID)!
		const halfRound = round / 2
		if (vecSize.x <= 0) vecSize.x = subtexSize?.x ?? origSize.x
		if (vecSize.y <= 0) vecSize.y = subtexSize?.y ?? origSize.y
		if (path.endsWith(".svg")) {
			if (round >= 0) {
				this.BeginClip(false)
				this.FilledCircle(
					vecPos.AddScalar(halfRound),
					vecSize.SubtractScalar(halfRound),
					Color.White,
					rotationDeg,
					customScissor
				)
				this.EndClip()
			}

			if (customScissor !== undefined) this.SetScissor(customScissor)
			this.Translate(vecPos)
			this.Rotate(rotationDeg)
			this.AllocateCommandSpace(CommandID.SVG, 4 * 4 + 1)
			this.commandStream.WriteUint32(textureID)
			this.commandStream.WriteFloat32(vecSize.x)
			this.commandStream.WriteFloat32(vecSize.y)
			this.commandStream.WriteColor(color)
			this.commandStream.WriteBoolean(grayscale)
		} else {
			if (customScissor !== undefined) this.SetScissor(customScissor)
			this.Translate(vecPos)
			this.Rotate(rotationDeg)
			if (round >= 0) {
				this.AllocateCommandSpace(CommandID.PATH_ADD_ELLIPSE, 4 * 4)
				this.commandStream.WriteFloat32(halfRound)
				this.commandStream.WriteFloat32(halfRound)
				this.commandStream.WriteFloat32(vecSize.x - halfRound)
				this.commandStream.WriteFloat32(vecSize.y - halfRound)
			} else {
				this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
				this.commandStream.WriteFloat32(0)
				this.commandStream.WriteFloat32(0)
				this.commandStream.WriteFloat32(vecSize.x)
				this.commandStream.WriteFloat32(vecSize.y)
			}
			const flags = PathFlags.FILL | PathFlags.IMAGESHADER
			const sizeX = subtexSize?.x ?? origSize.x,
				sizey = subtexSize?.y ?? origSize.y
			this.Path(
				1,
				color,
				color,
				flags,
				grayscale,
				LineCap.Square,
				LineJoin.Round,
				textureID,
				(subtexOffset?.x ?? 0) * (vecSize.x / sizeX),
				(subtexOffset?.y ?? 0) * (vecSize.x / sizey),
				vecSize.x * (origSize.x / sizeX),
				vecSize.y * (origSize.y / sizey)
			)
		}
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
		if (text === "") return

		const fontID = this.GetFont(fontName, weight, italic)
		if (fontID === -1) return

		this.Translate(
			outlined ? vecPos.Clone().SubtractScalarX(1).AddScalarY(1) : vecPos
		)
		const startPos = this.commandCacheSize
		this.AllocateCommandSpace(CommandID.TEXT, 2 * 2 + 2 * 4)
		this.commandStream.WriteUint16(fontID)
		this.commandStream.WriteUint16(Math.round(fontSize + 4))
		this.commandStream.WriteColor(outlined ? Color.Black : color)
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

		if (outlined) {
			this.Translate(vecPos)
			const newPos = this.commandCacheSize,
				cmdSize = endPos - startPos
			this.AllocateCommandSpace(CommandID.TEXT, cmdSize - 1)
			this.commandCache.copyWithin(newPos, startPos, endPos)
			this.commandStream.RelativeSeek(2 * 2)
			this.commandStream.WriteColor(color)
			this.commandStream.RelativeSeek(
				cmdSize - (this.commandStream.pos - newPos)
			)
		}
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
		if (!this.inDraw)
			console.error(
				"Unsafe GetTextSize usage outside of Draw event",
				new Error().stack
			)

		if (text === "") return new Vector3()

		const fontID = this.GetFont(fontName, weight, italic)
		if (fontID === -1) return new Vector3()
		Renderer.GetTextSize(text, fontID, Math.round(fontSize + 4))
		return new Vector3(IOBuffer[0], IOBuffer[1], IOBuffer[2]).CeilForThis()
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

		if (vec !== undefined && vec !== false) vecMouse = vecMouse.Add(vec)

		this.Text(
			text,
			vecMouse,
			color,
			fontName,
			fontSize,
			weight,
			italic,
			outlined
		)
	}

	public BeforeDraw(w: number, h: number) {
		this.inDraw = true
		const prevWidth = this.WindowSize.x,
			prevHeight = this.WindowSize.y
		WASM.CloneWorldToProjection(DrawMatrix)
		this.WindowSize.x = w
		this.WindowSize.y = h
		if (this.WindowSize.x !== prevWidth || this.WindowSize.y !== prevHeight)
			EventsSDK.emit("WindowSizeChanged", false)
		if (this.clearTextureCache) {
			for (const tex of this.textureCache.values())
				if (tex !== -1) this.FreeTexture(tex)
			this.textureCache.clear()
			this.tex2size.clear()
			this.clearTextureCache = false
		}

		this.queuedFonts.forEach(([name, path, weight, italic, stack]) =>
			this.CreateFont(name, path, weight, italic, stack)
		)
		this.queuedFonts.splice(0)
	}
	public EmitDraw() {
		Renderer.ExecuteCommandBuffer(
			this.commandCache.subarray(0, this.commandCacheSize)
		)
		const shrinkFactor = 3,
			shrinkMul = 2,
			shrinkFrames = 5
		if (this.commandCacheSize * shrinkFactor < this.commandCache.byteLength) {
			if (this.smallCommandCacheFrames++ > shrinkFrames) {
				this.commandCache = new Uint8Array(this.commandCacheSize * shrinkMul)
				this.OnCommandCacheChanged()
				this.smallCommandCacheFrames = 0
			}
		} else this.smallCommandCacheFrames = 0
		this.commandStream.pos = 0
		this.commandCacheSize = 0
		this.inDraw = false
	}
	public GetAspectRatio(windowSize = this.WindowSize) {
		const res = windowSize.x / windowSize.y
		if (res >= 1.25 && res <= 1.35) return "4x3"
		else if (res >= 1.7 && res <= 1.85) return "16x9"
		else if (res >= 1.5 && res <= 1.69) return "16x10"
		else if (res >= 2.2 && res <= 2.4) return "21x9"
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
			if (outlineWidth !== -1)
				this.OutlinedRect(
					vecPos,
					vecSize,
					outlineWidth,
					strokeColor,
					rotationDeg,
					customScissor,
					grayscale
				)
			else
				this.FilledRect(
					vecPos,
					vecSize,
					fillColor,
					rotationDeg,
					customScissor,
					grayscale
				)
			vecSize.SubtractScalarForThis(sizeOff)
			vecPos.SubtractScalarForThis(posOff)
			return
		}
		vecPos.AddScalarForThis(posOff)
		vecSize.AddScalarForThis(sizeOff)

		if (outlineWidth !== -1) this.BeginClip(false)

		if (customScissor !== undefined) this.SetScissor(customScissor)
		this.Translate(vecPos)
		this.Rotate(rotationDeg)

		let angle = this.NormalizedAngle(DegreesToRadian(360 * percent))
		const startAngleSign = Math.sign(startAngle)
		startAngle = DegreesToRadian(startAngle)
		if (startAngleSign < 0) startAngle -= angle
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
			PathFlags.STROKE_AND_FILL,
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
		if (Number.isNaN(baseAngle) || !Number.isFinite(baseAngle)) baseAngle = 0
		if (Number.isNaN(percent) || !Number.isFinite(percent)) percent = 100
		percent = Math.min(Math.max(percent / 100, -1), 1)

		const sizeOff = outer ? Math.round(width / 2) : 0,
			posOff = outer ? -Math.round(width / 4) : 0

		if (percent >= 1) {
			vecPos = vecPos.AddScalar(posOff)
			vecSize = vecSize.AddScalar(sizeOff)
			if (fill)
				this.FilledCircle(
					vecPos,
					vecSize,
					color,
					rotationDeg,
					customScissor,
					grayscale
				)
			else
				this.OutlinedCircle(
					vecPos,
					vecSize,
					color,
					width,
					rotationDeg,
					customScissor,
					grayscale
				)
			return
		}

		if (customScissor !== undefined) this.SetScissor(customScissor)
		this.Translate(vecPos)
		if (outer) this.Translate(new Vector2(posOff, posOff))
		this.Rotate(rotationDeg)

		baseAngle = DegreesToRadian(baseAngle)
		const sweepAngle = DegreesToRadian(360 * percent * Math.sign(baseAngle))

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
	public AllocateCommandSpace_(
		commandID: CommandID,
		bytes: number
	): ViewBinaryStream {
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

		const data = fread(realPath)
		if (data === undefined) {
			console.error(`Reading font "${name}" with path "${path}" failed`, stack)
			return
		}

		const fontID = Renderer.CreateFont(data)
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
		this.Path(width, fillColor, strokeColor, pathFlags, grayscale, cap, join)
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
		this.Path(width, color, color, pathFlags, grayscale)
	}
	private FreeTexture(textureID: number): void {
		Renderer.FreeTexture(textureID)
	}
	private GetTexture(path: string): number {
		if (this.textureCache.has(path)) return this.textureCache.get(path)!

		let readPath = tryFindFile(path, 2)
		// TODO
		// if (readPath === undefined || !(readPath.length > 0))
		// 	readPath = "panorama/images/spellicons/empty_png.vtex_c"

		if (readPath === undefined) {
			console.error(
				"CreateTexture failed file lookup for",
				path,
				new Error().stack
			)
			this.textureCache.set(path, -1)
			return -1
		}

		if (readPath.endsWith(".vmat_c")) {
			const buf = fopen(path)
			if (buf !== undefined)
				try {
					const vmat = ParseMaterial(new FileBinaryStream(buf))
					const tColor = vmat.TextureParams.get("g_tColor")
					if (tColor !== undefined) {
						readPath = tColor
						if (readPath.endsWith(".vtex")) readPath += "_c"
					}
				} finally {
					buf.close()
				}
		}

		const textureID = Renderer.CreateTexture(readPath)
		if (textureID === -1) console.error("CreateTexture failed for", path)
		this.textureCache.set(path, textureID)
		this.tex2size.set(textureID, Vector2.fromIOBuffer())
		return textureID
	}
	private GetFont(fontName: string, weight: number, italic: boolean): number {
		const fontAr = this.fontCache.get(fontName)
		if (fontAr === undefined) return -1
		return (
			orderByFirst(
				fontAr,
				font =>
					Math.abs(font.Weight - weight) - (font.Italic === italic ? 10000 : 0)
			)?.FontID ?? -1
		)
	}

	private OnCommandCacheChanged() {
		this.commandStream = new ViewBinaryStream(
			new DataView(
				this.commandCache.buffer,
				this.commandCache.byteOffset,
				this.commandCache.byteLength
			),
			this.commandStream.pos
		)
	}
	private ResizeCommandCache(): void {
		const updatedLen = this.commandCacheSize
		if (updatedLen <= this.commandCache.byteLength) return
		const growFactor = 2
		const buf = new Uint8Array(
			Math.max(this.commandCache.byteLength * growFactor, updatedLen)
		)
		buf.set(this.commandCache, 0)
		this.commandCache = buf
		this.OnCommandCacheChanged()
	}
	private AllocateCommandSpace(commandID: CommandID, bytes: number): void {
		bytes += 1 // msgid
		this.commandCacheSize += bytes
		this.ResizeCommandCache()
		this.commandStream.WriteUint8(commandID)
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
		if (grayscale) flags |= PathFlags.GRAYSCALE
		flags |=
			Math.max(Math.min(cap, LineCap.Square), LineCap.Butt) <<
			PathFlags.LINECAP_OFFSET
		flags |=
			Math.max(Math.min(join, LineJoin.Bevel), LineJoin.Miter) <<
			PathFlags.LINE_JOIN_OFFSET
		const hasImage = HasMask(flags, PathFlags.IMAGESHADER)
		this.AllocateCommandSpace(
			CommandID.PATH,
			3 * 4 + 1 + (hasImage ? 5 * 4 : 0)
		)
		this.commandStream.WriteColor(fillColor)
		this.commandStream.WriteColor(strokeColor)
		this.commandStream.WriteFloat32(width / 2)
		this.commandStream.WriteUint8(flags)
		if (hasImage) {
			this.commandStream.WriteUint32(texID!)
			this.commandStream.WriteFloat32(-texOffsetX!)
			this.commandStream.WriteFloat32(-texOffsetY!)
			this.commandStream.WriteFloat32(texW!)
			this.commandStream.WriteFloat32(texH!)
		}
	}
	private Rotate(ang: number): void {
		while (ang >= 360) ang -= 360
		if (ang === 0) return
		this.AllocateCommandSpace(CommandID.ROTATE, 4)
		this.commandStream.WriteFloat32(DegreesToRadian(ang))
	}
	private Translate(vecPos: Vector2): void {
		if (vecPos.IsZero()) return
		this.AllocateCommandSpace(CommandID.TRANSLATE, 2 * 4)
		this.commandStream.WriteFloat32(vecPos.x)
		this.commandStream.WriteFloat32(vecPos.y)
	}
	private NormalizedAngle(ang: number): number {
		while (ang < 0) ang += 2 * Math.PI
		while (ang > 2 * Math.PI) ang -= 2 * Math.PI
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
		const res = this.NormalizedPoint(ang)
			.AddScalarForThis(1)
			.DivideScalarForThis(2)
		res.x = Math.min(Math.max(res.x, 0), 1)
		res.y = Math.min(Math.max(res.y, 0), 1)
		return res.MultiplyForThis(vecSize)
	}
}

export const RendererSDK = new CRendererSDK()

EventsSDK.on("UnitAbilityDataUpdated", () => RendererSDK.FreeTextureCache())

Workers.RegisterRPCEndPoint("LoadAndOptimizeWorld", data => {
	if (!Array.isArray(data)) throw "Data should be objects"
	const objects = data as [string, number[]][],
		path2meshes = new Map<string, number[]>(),
		paths: string[] = [""]
	let nextMeshID = 0
	WASM.ResetWorld()
	for (const [path] of objects) {
		if (path2meshes.has(path)) continue
		const buf = fopen(`${path}_c`)
		if (buf === undefined) continue
		let filesOpen: FileStream[] = []
		try {
			let drawCalls: CMeshDrawCall[] = []
			if (path.endsWith(".vmdl")) {
				const model = ParseModel(new FileBinaryStream(buf))
				const mesh = model.Meshes[0]
				if (mesh !== undefined) {
					drawCalls = mesh.DrawCalls
					filesOpen = model.FilesOpen
				} else model.FilesOpen.forEach(file => file.close())
			} else if (path.endsWith(".vmesh"))
				drawCalls = ParseMesh(new FileBinaryStream(buf)).DrawCalls
			else throw `Invalid path ${path}`
			const pathMeshes: number[] = []
			path2meshes.set(path, pathMeshes)
			const pathID = paths.length
			paths.push(path)
			for (const drawCall of drawCalls) {
				const meshID = nextMeshID++
				WASM.LoadWorldMesh(
					meshID,
					drawCall.VertexBuffer.Data,
					drawCall.VertexBuffer.ElementSize,
					drawCall.IndexBuffer.Data,
					drawCall.IndexBuffer.ElementSize,
					drawCall.Flags,
					pathID
				)
				pathMeshes.push(meshID)
			}
		} catch (e: any) {
			const err = e instanceof Error ? e : new Error(e)
			throw `${path} ${err.message} ${err.stack ?? ""}`
		} finally {
			filesOpen.forEach(file => file.close())
			buf.close()
		}
	}
	objects.forEach(([path, transform]) => {
		const meshes = path2meshes.get(path)
		if (meshes !== undefined)
			for (const mesh of meshes) WASM.SpawnWorldMesh(mesh, transform)
	})
	{
		const vb = new Uint8Array(
			new Float32Array([
				-100000, -100000, -16384, 100000, -100000, -16384, -100000, 100000,
				-16384, 100000, 100000, -16384,
			]).buffer
		)
		const ib = new Uint8Array(new Uint8Array([0, 1, 2, 1, 2, 3]).buffer)
		const plateMeshID = nextMeshID++
		WASM.LoadWorldMesh(plateMeshID, vb, 3 * 4, ib, 1, 0, 0)
		path2meshes.set("", [plateMeshID])
		WASM.SpawnWorldMesh(plateMeshID, Matrix4x4Identity)
	}
	WASM.FinishWorld()
	const pathsData: [
		string,
		[number, Uint8Array, Uint8Array, Uint8Array, number, number][]
	][] = []
	for (const [path, meshes] of path2meshes) {
		const meshesData: [
			number,
			Uint8Array,
			Uint8Array,
			Uint8Array,
			number,
			number
		][] = []
		for (const meshID of meshes) {
			const meshData = WASM.ExtractMeshData(meshID)
			if (meshData !== undefined) meshesData.push(meshData)
		}
		pathsData.push([path, meshesData])
	}
	return [WASM.ExtractWorldBVH(), pathsData, paths]
})
