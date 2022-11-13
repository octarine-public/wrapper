import { Color } from "../Base/Color"
import { Matrix4x4 } from "../Base/Matrix4x4"
import { QAngle } from "../Base/QAngle"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager } from "../Managers/InputManager"
import { ParseImage } from "../Resources/ParseImage"
import { ParseMaterial } from "../Resources/ParseMaterial"
import { CMeshDrawCall, ParseMesh } from "../Resources/ParseMesh"
import { ParseModel } from "../Resources/ParseModel"
import { StringToUTF8Cb } from "../Utils/ArrayBufferUtils"
import { orderByFirst } from "../Utils/ArrayExtensions"
import { HasMask } from "../Utils/BitsExtensions"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { fread } from "../Utils/fread"
import { DegreesToRadian } from "../Utils/Math"
import { readFile, tryFindFile } from "../Utils/readFile"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { ConVarsSDK } from "./ConVarsSDK"
import * as WASM from "./WASM"
import { Workers } from "./Workers"

enum CommandID {
	BEGIN_CLIP = 0,
	END_CLIP,

	TRANSLATE,
	ROTATE,
	SET_SCISSOR,

	// PATH_*
	PATH_MOVE_TO,
	PATH_LINE_TO,
	PATH_ADD_RECT,
	PATH_ADD_ROUND_RECT,
	PATH_ADD_ELLIPSE,
	PATH_ADD_ARC,
	PATH_CUBIC_TO,
	PATH_QUAD_TO,
	PATH_CLOSE,

	// DRAW
	TEXT,
	SVG,
	PATH,
}

enum PathFlags {
	LINE_CAP_OFFSET = 2,
	LINE_JOIN_OFFSET = 4,

	GRAYSCALE = 1 << 0,
	IMAGE_SHADER = 1 << 1,
	LINE_CAP_BITS = (1 << LINE_CAP_OFFSET) | (1 << (LINE_CAP_OFFSET + 1)),
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
		public readonly Italic: boolean,
	) { }
}

class CRendererSDK {
	public readonly DefaultFontName = "Roboto"
	public readonly DefaultTextSize = 18
	/**
	 * Default Size of Shape = Width 32 x Height 32
	 * @param vecSize Width as X
	 * @param vecSize Height as Y
	 */
	public readonly DefaultShapeSize: Vector2 = new Vector2(32, 32)

	public readonly WindowSize = new Vector2()

	private commandCache = new Uint8Array()
	private commandStream = new ViewBinaryStream(new DataView(
		this.commandCache.buffer,
		this.commandCache.byteOffset,
		this.commandCache.byteLength,
	))
	private commandCacheSize = 0
	private smallCommandCacheFrames = 0
	private readonly font_cache = new Map<string, Font[]>()
	private readonly texture_cache = new Map</* path */string, [number, boolean]>()
	private empty_texture: Nullable<[number, boolean]>
	private clear_texture_cache = false
	private readonly tex2size = new Map</* texture_id */number, Vector2>()
	private readonly queued_fonts: [string, string, number, boolean, string][] = []
	private in_draw = false

	public get IsInDraw(): boolean {
		return this.in_draw
	}

	public get CameraDistance() {
		const dist = Camera.Distance
		if (dist !== -1)
			return dist
		const cv = ConVarsSDK.GetFloat("dota_camera_distance", -1)
		return cv !== -1
			? cv
			: 1200
	}

	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(
		position: Vector2 | Vector3,
		cull = true,
	): Nullable<Vector2> {
		if (position instanceof Vector2)
			position = Vector3.FromVector2(position).SetZ(WASM.GetPositionHeight(position))
		const vec = WASM.WorldToScreenNew(position, this.WindowSize)?.FloorForThis()
		if (!cull || vec === undefined)
			return vec
		vec.DivideForThis(this.WindowSize)
		// cut returned screen space to 1.5x screen size
		if (vec.x < -0.25 || vec.x > 1.25)
			return undefined
		if (vec.y < -0.25 || vec.y > 1.25)
			return undefined
		return vec.MultiplyForThis(this.WindowSize)
	}
	/**
	 * @returns screen position with x and y in range {0, 1}, or undefined
	 */
	public WorldToScreenCustom(
		position: Vector2 | Vector3,
		camera_position: Vector2 | Vector3,
		camera_distance = 1200,
		camera_angles = new QAngle(60, 90, 0),
		window_size = this.WindowSize,
	): Nullable<Vector2> {
		if (position instanceof Vector2)
			position = Vector3.FromVector2(position).SetZ(WASM.GetPositionHeight(position))
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		const vec = WASM.WorldToScreen(position, camera_position, camera_distance, camera_angles, window_size)?.DivideForThis(window_size)
		if (vec === undefined)
			return undefined
		// cut returned screen space to 2x screen size
		if (vec.x < -0.5 || vec.x > 1.5)
			return undefined
		if (vec.y < -0.5 || vec.y > 1.5)
			return undefined
		return vec
	}

	/**
	 * Projects given screen vector onto camera matrix. Can be used to connect ScreenToWorldFar and camera position dots.
	 * @param screen screen position
	 */
	public ScreenToWorld(screen: Vector2): Vector3 {
		const vec = screen.Divide(this.WindowSize).MultiplyScalarForThis(2)
		vec.x = vec.x - 1
		vec.y = 1 - vec.y
		const camera_pos = Camera.Position ? Vector3.fromIOBuffer() : new Vector3()
		const camera_ang = Camera.Angles ? QAngle.fromIOBuffer() : new QAngle()
		return WASM.ScreenToWorld(vec, camera_pos, this.CameraDistance, camera_ang, this.WindowSize)
	}
	/**
	 * Projects given screen vector onto camera matrix. Can be used to connect ScreenToWorldFar and camera position dots.
	 * @param screen screen position with x and y in range {0, 1}
	 */
	public ScreenToWorldCustom(screen: Vector2, camera_position: Vector2 | Vector3, camera_distance = 1200, camera_angles = new QAngle(60, 90, 0), window_size = this.WindowSize): Vector3 {
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.ScreenToWorld(screen, camera_position, camera_distance, camera_angles, window_size)
	}
	/**
	 * @param screen screen position with x and y in range {0, 1}
	 */
	public ScreenToWorldFar(
		screens: Vector2[],
		camera_position: Vector2 | Vector3,
		camera_distance = 1200,
		camera_angles = new QAngle(60, 90, 0),
		window_size = this.WindowSize,
		fov = -1,
	): Vector3[] {
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.ScreenToWorldFar(screens, window_size, camera_position, camera_distance, camera_angles, fov)
	}
	public FilledCircle(
		vecPos: Vector2,
		vecSize: Vector2,
		color = Color.White,
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
	): void {
		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		this.Rotate(rotation_deg)
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
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
	): void {
		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		this.Rotate(rotation_deg)
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
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		strokeColor = fillColor,
		grayscale = false,
	): void {
		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(start)
		this.Rotate(rotation_deg)
		this.PathMoveTo(0, 0)
		this.PathLineTo(end.x - start.x, end.y - start.y)
		this.Path(width, fillColor, strokeColor, PathFlags.STROKE_AND_FILL, grayscale)
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
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
		strokeColor = fillColor,
		width = 0,
		cap = LineCap.Square,
		join = LineJoin.Round,
	): void {
		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		this.Rotate(rotation_deg)
		this.Rect(
			vecSize,
			width,
			width === 0 ? PathFlags.FILL : PathFlags.STROKE_AND_FILL,
			fillColor,
			strokeColor,
			grayscale,
			cap,
			join,
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
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
		cap = LineCap.Square,
		join = LineJoin.Round,
	): void {
		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		this.Rotate(rotation_deg)
		this.Rect(vecSize, width, PathFlags.STROKE, color, color, grayscale, cap, join)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public Image(
		path: string,
		vecPos: Vector2,
		round = -1,
		vecSize = new Vector2(-1, -1),
		color = Color.White,
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
		subtexOffset?: Vector2,
		subtexSize?: Vector2,
	): void {
		const texture_id = this.GetTexture(path) // better put it BEFORE new command
		const orig_size = this.tex2size.get(texture_id[0])!
		const half_round = round / 2
		if (vecSize.x <= 0)
			vecSize.x = subtexSize?.x ?? orig_size.x
		if (vecSize.y <= 0)
			vecSize.y = subtexSize?.y ?? orig_size.y
		if (texture_id[1]) {
			if (round >= 0) {
				this.BeginClip(false)
				this.FilledCircle(
					vecPos.AddScalar(half_round),
					vecSize.SubtractScalar(half_round),
					Color.White,
					rotation_deg,
					custom_scissor,
				)
				this.EndClip()
			}

			if (custom_scissor !== undefined)
				this.SetScissor(custom_scissor)
			this.Translate(vecPos)
			this.Rotate(rotation_deg)
			this.AllocateCommandSpace(CommandID.SVG, 4 * 4 + 1)
			this.commandStream.WriteUint32(texture_id[0])
			this.commandStream.WriteFloat32(vecSize.x)
			this.commandStream.WriteFloat32(vecSize.y)
			this.commandStream.WriteColor(color)
			this.commandStream.WriteBoolean(grayscale)
		} else {
			if (custom_scissor !== undefined)
				this.SetScissor(custom_scissor)
			this.Translate(vecPos)
			this.Rotate(rotation_deg)
			if (round >= 0) {
				this.AllocateCommandSpace(CommandID.PATH_ADD_ELLIPSE, 4 * 4)
				this.commandStream.WriteFloat32(half_round)
				this.commandStream.WriteFloat32(half_round)
				this.commandStream.WriteFloat32(vecSize.x - half_round)
				this.commandStream.WriteFloat32(vecSize.y - half_round)
			} else {
				this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
				this.commandStream.WriteFloat32(0)
				this.commandStream.WriteFloat32(0)
				this.commandStream.WriteFloat32(vecSize.x)
				this.commandStream.WriteFloat32(vecSize.y)
			}
			const flags = PathFlags.FILL | PathFlags.IMAGE_SHADER
			const size_x = subtexSize?.x ?? orig_size.x,
				size_y = subtexSize?.y ?? orig_size.y
			this.Path(
				1,
				color,
				color,
				flags,
				grayscale,
				LineCap.Square,
				LineJoin.Round,
				texture_id[0],
				(subtexOffset?.x ?? 0) * (vecSize.x / size_x),
				(subtexOffset?.y ?? 0) * (vecSize.x / size_y),
				vecSize.x * (orig_size.x / size_x),
				vecSize.y * (orig_size.y / size_y),
			)
		}
	}
	public GetImageSize(path: string): Vector2 {
		return this.tex2size.get(this.GetTexture(path)[0])!
	}
	public Text(text: string, vecPos = new Vector2(), color = Color.White, font_name = this.DefaultFontName, font_size = this.DefaultTextSize, weight = 400, italic = false, outlined = true): void {
		if (text === "")
			return

		const font_id = this.GetFont(font_name, weight, italic)
		if (font_id === -1)
			return

		this.Translate(outlined ? vecPos.Clone().SubtractScalarX(1).AddScalarY(1) : vecPos)
		const start_pos = this.commandCacheSize
		this.AllocateCommandSpace(CommandID.TEXT, 2 * 2 + 2 * 4)
		this.commandStream.WriteUint16(font_id)
		this.commandStream.WriteUint16(Math.round(font_size + 4))
		this.commandStream.WriteColor(outlined ? Color.Black : color)
		const length_pos = this.commandStream.pos
		this.commandStream.WriteUint32(0)
		{
			// preserve 2 bytes per 1 char, we'll allocate more later if needed
			const prealloc_length = text.length * 2
			this.commandCacheSize += prealloc_length
			this.ResizeCommandCache()
			this.commandCacheSize -= prealloc_length
		}
		StringToUTF8Cb(text, b => {
			this.commandCacheSize++
			this.ResizeCommandCache()
			this.commandStream.WriteUint8(b)
		})
		const end_pos = this.commandStream.pos,
			bytes_len = end_pos - length_pos - 4
		this.commandStream.RelativeSeek(length_pos - end_pos)
		this.commandStream.WriteUint32(bytes_len)
		this.commandStream.RelativeSeek(bytes_len)

		if (outlined) {
			this.Translate(vecPos)
			const new_pos = this.commandCacheSize,
				cmd_size = end_pos - start_pos
			this.AllocateCommandSpace(CommandID.TEXT, cmd_size - 1)
			this.commandCache.copyWithin(new_pos, start_pos, end_pos)
			this.commandStream.RelativeSeek(2 * 2)
			this.commandStream.WriteColor(color)
			this.commandStream.RelativeSeek(cmd_size - (this.commandStream.pos - new_pos))
		}
	}
	/**
	 * @returns text size defined as new Vector3(width, height, under_line)
	 */
	public GetTextSize(text: string, font_name = this.DefaultFontName, font_size = this.DefaultTextSize, weight = 400, italic = false): Vector3 {
		if (!this.in_draw)
			console.error("Unsafe GetTextSize usage outside of Draw event", new Error().stack)

		if (text === "")
			return new Vector3()

		const font_id = this.GetFont(font_name, weight, italic)
		if (font_id === -1)
			return new Vector3()
		Renderer.GetTextSize(text, font_id, Math.round(font_size + 4))
		return new Vector3(
			IOBuffer[0],
			IOBuffer[1],
			IOBuffer[2],
		).CeilForThis()
	}
	/**
	 * @param color default: Yellow
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	public TextAroundMouse(text: string, vec?: Vector2 | false, color = Color.Yellow, font_name = this.DefaultFontName, font_size = 30, weight = 400, italic = false, outlined = true): void {
		let vecMouse = InputManager.CursorOnScreen.AddScalarX(30).AddScalarY(15)

		if (vec !== undefined && vec !== false)
			vecMouse = vecMouse.Add(vec)

		this.Text(text, vecMouse, color, font_name, font_size, weight, italic, outlined)
	}

	public BeforeDraw(w: number, h: number) {
		this.in_draw = true
		const prev_width = this.WindowSize.x,
			prev_height = this.WindowSize.y
		WASM.CloneWorldToProjection(DrawMatrix)
		this.WindowSize.x = w
		this.WindowSize.y = h
		if (this.WindowSize.x !== prev_width || this.WindowSize.y !== prev_height)
			EventsSDK.emit("WindowSizeChanged", false)
		if (this.clear_texture_cache) {
			this.texture_cache.forEach(tex => {
				if (tex !== this.empty_texture)
					this.FreeTexture(tex[0])
			})
			if (this.empty_texture !== undefined)
				this.FreeTexture(this.empty_texture[0])
			this.texture_cache.clear()
			this.tex2size.clear()
			this.empty_texture = undefined
			this.clear_texture_cache = false
		}

		this.queued_fonts.forEach(([name, path, weight, italic, stack]) =>
			this.CreateFont(name, path, weight, italic, stack),
		)
		this.queued_fonts.splice(0)
	}
	public EmitDraw() {
		Renderer.ExecuteCommandBuffer(this.commandCache.subarray(0, this.commandCacheSize))
		const shrink_factor = 3,
			shrink_mul = 2,
			shrink_frames = 5
		if (this.commandCacheSize * shrink_factor < this.commandCache.byteLength) {
			if (this.smallCommandCacheFrames++ > shrink_frames) {
				this.commandCache = new Uint8Array(this.commandCacheSize * shrink_mul)
				this.OnCommandCacheChanged()
				this.smallCommandCacheFrames = 0
			}
		} else
			this.smallCommandCacheFrames = 0
		this.commandStream.pos = 0
		this.commandCacheSize = 0
		this.in_draw = false
	}
	public GetAspectRatio(window_size = this.WindowSize) {
		const res = window_size.x / window_size.y
		if (res >= 1.25 && res <= 1.35)
			return "4x3"
		else if (res >= 1.7 && res <= 1.85)
			return "16x9"
		else if (res >= 1.5 && res <= 1.69)
			return "16x10"
		else if (res >= 2.2 && res <= 2.4)
			return "21x9"
		return "unknown"
	}
	public Radial(
		startAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fillColor = Color.White,
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		strokeColor = fillColor,
		grayscale = false,
		outline_width = -1,
		outer = false,
		cap = LineCap.Square,
		join = LineJoin.Round,
	): void {
		outer = outer && outline_width !== -1
		const size_off = outer ? Math.round(outline_width / 2) : 0,
			pos_off = outer ? -Math.round(outline_width / 4) : 0
		vecPos.AddScalarForThis(pos_off)
		vecSize.AddScalarForThis(size_off)

		percent = Math.min(Math.max(percent / 100, -1), 1)
		if (percent >= 1) {
			if (outline_width !== -1)
				this.OutlinedRect(vecPos, vecSize, outline_width, strokeColor, rotation_deg, custom_scissor, grayscale)
			else
				this.FilledRect(vecPos, vecSize, fillColor, rotation_deg, custom_scissor, grayscale)
			vecSize.SubtractScalarForThis(size_off)
			vecPos.SubtractScalarForThis(pos_off)
			return
		}
		vecPos.AddScalarForThis(pos_off)
		vecSize.AddScalarForThis(size_off)

		if (outline_width !== -1)
			this.BeginClip(false)

		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		this.Rotate(rotation_deg)

		let angle = this.NormalizedAngle(DegreesToRadian(360 * percent))
		const startAngleSign = Math.sign(startAngle)
		startAngle = DegreesToRadian(startAngle)
		if (startAngleSign < 0)
			startAngle -= angle
		startAngle = this.NormalizedAngle(startAngle)

		this.PathMoveTo(vecSize.x / 2, vecSize.y / 2)
		const PI4 = Math.PI / 4
		const startAngleModPI4 = startAngle % PI4
		if (startAngleModPI4 !== 0) {
			const pt = this.PointOnBounds(startAngle, vecSize)
			this.PathLineTo(pt.x, pt.y)
			const diff = PI4 - startAngleModPI4
			startAngle += diff
			angle -= Math.min(diff, angle)
		}
		for (let a = 0; a < angle; a += PI4) {
			const pt = this.PointOnBounds(startAngle + a, vecSize)
			this.PathLineTo(pt.x, pt.y)
		}
		{
			const pt = this.PointOnBounds(startAngle + angle, vecSize)
			this.PathLineTo(pt.x, pt.y)
		}
		this.Path(
			1,
			outline_width !== -1 ? Color.White : fillColor,
			outline_width !== -1 ? Color.White : strokeColor,
			PathFlags.STROKE_AND_FILL,
			grayscale,
			cap,
			join,
		)

		vecSize.SubtractScalarForThis(size_off)
		vecPos.SubtractScalarForThis(pos_off)
		if (outline_width !== -1) {
			this.EndClip()
			this.OutlinedRect(vecPos, vecSize, outline_width, strokeColor, rotation_deg, custom_scissor, grayscale)
		}
		vecSize.SubtractScalarForThis(size_off)
		vecPos.SubtractScalarForThis(pos_off)
	}
	public Arc(
		baseAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fill = false,
		width = 5,
		color = Color.White,
		rotation_deg = 0,
		custom_scissor?: Rectangle,
		grayscale = false,
		outer = false,
		cap = LineCap.Butt,
	): void {
		if (Number.isNaN(baseAngle) || !Number.isFinite(baseAngle))
			baseAngle = 0
		if (Number.isNaN(percent) || !Number.isFinite(percent))
			percent = 100
		percent = Math.min(Math.max(percent / 100, -1), 1)

		const size_off = outer ? Math.round(width / 2) : 0,
			pos_off = outer ? -Math.round(width / 4) : 0

		if (percent >= 1) {
			vecPos = vecPos.AddScalar(pos_off)
			vecSize = vecSize.AddScalar(size_off)
			if (fill)
				this.FilledCircle(vecPos, vecSize, color, rotation_deg, custom_scissor, grayscale)
			else
				this.OutlinedCircle(vecPos, vecSize, color, width, rotation_deg, custom_scissor, grayscale)
			return
		}

		if (custom_scissor !== undefined)
			this.SetScissor(custom_scissor)
		this.Translate(vecPos)
		if (outer)
			this.Translate(new Vector2(pos_off, pos_off))
		this.Rotate(rotation_deg)

		baseAngle = DegreesToRadian(baseAngle)
		const sweepAngle = DegreesToRadian(360 * percent * Math.sign(baseAngle))

		this.AllocateCommandSpace(CommandID.PATH_ADD_ARC, 6 * 4 + 1)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x + size_off)
		this.commandStream.WriteFloat32(vecSize.y + size_off)
		this.commandStream.WriteFloat32(baseAngle)
		this.commandStream.WriteFloat32(sweepAngle)
		this.commandStream.WriteBoolean(fill)
		this.Path(
			width,
			color,
			color,
			fill
				? PathFlags.FILL
				: PathFlags.STROKE,
			grayscale,
			cap,
		)
	}
	public AllocateCommandSpace_(commandID: CommandID, bytes: number): ViewBinaryStream {
		this.AllocateCommandSpace(commandID, bytes)
		return this.commandStream
	}
	public FreeTextureCache(): void {
		this.clear_texture_cache = true
	}
	public CreateFont(name: string, path: string, weight: number, italic: boolean, stack = new Error().stack!): void {
		const realPath = tryFindFile(path, 1)
		if (realPath === undefined) {
			console.error(`Reading font "${name}" with path "${path}" failed`, stack)
			return
		}

		if (!this.in_draw) {
			this.queued_fonts.push([name, realPath, weight, italic, stack])
			return
		}

		const data = fread(realPath)
		if (data === undefined) {
			console.error(`Reading font "${name}" with path "${path}" failed`, stack)
			return
		}

		const font_id = Renderer.CreateFont(data)
		if (font_id === -1) {
			console.error(`Loading font "${name}" with path "${path}" failed`, stack)
			return
		}

		let font_ar = this.font_cache.get(name)
		if (font_ar === undefined) {
			font_ar = []
			this.font_cache.set(name, font_ar)
		}
		font_ar.push(new Font(font_id, weight, italic))
	}
	public BeginClip(diff_op: boolean): void {
		this.AllocateCommandSpace(CommandID.BEGIN_CLIP, 1)
		this.commandStream.WriteBoolean(diff_op)
	}
	public EndClip(): void {
		this.AllocateCommandSpace(CommandID.END_CLIP, 0)
	}
	private Rect(
		vecSize: Vector2,
		width: number,
		pathFlags: PathFlags,
		fillColor: Color,
		strokeColor: Color,
		grayscale: boolean,
		cap: LineCap,
		join: LineJoin,
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
		grayscale: boolean,
	): void {
		this.AllocateCommandSpace(CommandID.PATH_ADD_ELLIPSE, 4 * 4)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		this.Path(width, color, color, pathFlags, grayscale)
	}
	private MakeTexture(rgba: Uint8Array, size: Vector2): number {
		if (rgba.byteLength !== size.x * size.y * 4)
			throw "Invalid RGBA buffer or size"
		size.toIOBuffer()
		const texture_id = Renderer.CreateTexture(rgba)
		if (texture_id === -1)
			throw "MakeTexture failed"
		this.tex2size.set(texture_id, size)
		return texture_id
	}
	private FreeTexture(texture_id: number): void {
		Renderer.FreeTexture(texture_id)
	}
	private MakeTextureSVG(stream: ReadableBinaryStream): number {
		const texture_id = Renderer.CreateTextureSVG(stream.ReadSlice(stream.Remaining))
		if (texture_id === -1)
			throw "MakeTextureSVG failed"
		this.tex2size.set(texture_id, Vector2.fromIOBuffer())
		return texture_id
	}
	private GetTexture(path: string): [number, boolean] {
		if (this.texture_cache.has(path))
			return this.texture_cache.get(path)!
		let read_path = path
		if (path.endsWith(".vmat_c")) {
			const buf = fopen(path)
			if (buf !== undefined)
				try {
					const vmat = ParseMaterial(new FileBinaryStream(buf))
					const g_tColor = vmat.TextureParams.get("g_tColor")
					if (g_tColor !== undefined) {
						read_path = g_tColor
						if (read_path.endsWith(".vtex"))
							read_path += "_c"
					}
				} finally {
					buf.close()
				}
		}
		const read = readFile(read_path, 2) // 1 for ourselves, 1 for caller [Image]
		if (read === undefined) {
			// 1 white pixel for any rendering API to be happy
			this.empty_texture ??= [this.MakeTexture(
				new Uint8Array(new Array(4).fill(0xFF)),
				new Vector2(1, 1),
			), false]
			this.texture_cache.set(path, this.empty_texture)
			return this.empty_texture
		} else
			try {
				const is_svg = read_path.endsWith(".svg")
				const texture = [
					is_svg
						? this.MakeTextureSVG(new FileBinaryStream(read))
						: this.MakeTexture(...ParseImage(new FileBinaryStream(read))),
					is_svg,
				] as [number, boolean]
				this.texture_cache.set(path, texture)
				return texture
			} finally {
				read.close()
			}
	}
	private GetFont(font_name: string, weight: number, italic: boolean): number {
		const font_ar = this.font_cache.get(font_name)
		if (font_ar === undefined)
			return -1
		return orderByFirst(
			font_ar,
			font => Math.abs(font.Weight - weight) - (font.Italic === italic ? 10000 : 0),
		)?.FontID ?? -1
	}

	private OnCommandCacheChanged() {
		this.commandStream = new ViewBinaryStream(new DataView(
			this.commandCache.buffer,
			this.commandCache.byteOffset,
			this.commandCache.byteLength,
		), this.commandStream.pos)
	}
	private ResizeCommandCache(): void {
		const updated_len = this.commandCacheSize
		if (updated_len <= this.commandCache.byteLength)
			return
		const grow_factor = 2
		const buf = new Uint8Array(Math.max(this.commandCache.byteLength * grow_factor, updated_len))
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
		this.AllocateCommandSpace(CommandID.SET_SCISSOR, 4 * 4)
		this.commandStream.WriteFloat32(rect.pos1.x)
		this.commandStream.WriteFloat32(rect.pos1.y)
		this.commandStream.WriteFloat32(rect.pos2.x)
		this.commandStream.WriteFloat32(rect.pos2.y)
	}
	/*private PathClose(): void {
		this.AllocateCommandSpace(CommandID.PATH_CLOSE, 0)
	}*/
	private PathMoveTo(x: number, y: number): void {
		this.AllocateCommandSpace(CommandID.PATH_MOVE_TO, 2 * 4)
		this.commandStream.WriteFloat32(x)
		this.commandStream.WriteFloat32(y)
	}
	private PathLineTo(x: number, y: number): void {
		this.AllocateCommandSpace(CommandID.PATH_LINE_TO, 2 * 4)
		this.commandStream.WriteFloat32(x)
		this.commandStream.WriteFloat32(y)
	}
	/*private PathSetStyle(style: PathFillType): void {
		this.AllocateCommandSpace(CommandID.PATH_SET_FILL_TYPE, 1)
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
		tex_id?: number,
		tex_offset_x?: number,
		tex_offset_y?: number,
		tex_w?: number,
		tex_h?: number,
	): void {
		if (grayscale)
			flags |= PathFlags.GRAYSCALE
		flags |= Math.max(Math.min(cap, LineCap.Square), LineCap.Butt) << PathFlags.LINE_CAP_OFFSET
		flags |= Math.max(Math.min(join, LineJoin.Bevel), LineJoin.Miter) << PathFlags.LINE_JOIN_OFFSET
		const has_image = HasMask(flags, PathFlags.IMAGE_SHADER)
		this.AllocateCommandSpace(
			CommandID.PATH,
			3 * 4 + 1 + (has_image ? 5 * 4 : 0),
		)
		this.commandStream.WriteColor(fillColor)
		this.commandStream.WriteColor(strokeColor)
		this.commandStream.WriteFloat32(width / 2)
		this.commandStream.WriteUint8(flags)
		if (has_image) {
			this.commandStream.WriteUint32(tex_id!)
			this.commandStream.WriteFloat32(-tex_offset_x!)
			this.commandStream.WriteFloat32(-tex_offset_y!)
			this.commandStream.WriteFloat32(tex_w!)
			this.commandStream.WriteFloat32(tex_h!)
		}
	}
	private Rotate(ang: number): void {
		while (ang >= 360)
			ang -= 360
		if (ang === 0)
			return
		this.AllocateCommandSpace(CommandID.ROTATE, 4)
		this.commandStream.WriteFloat32(DegreesToRadian(ang))
	}
	private Translate(vecPos: Vector2): void {
		if (vecPos.IsZero())
			return
		this.AllocateCommandSpace(CommandID.TRANSLATE, 2 * 4)
		this.commandStream.WriteFloat32(vecPos.x)
		this.commandStream.WriteFloat32(vecPos.y)
	}
	private NormalizedAngle(ang: number): number {
		while (ang < 0)
			ang += 2 * Math.PI
		while (ang > 2 * Math.PI)
			ang -= 2 * Math.PI
		return ang
	}
	private NormalizedPoint(ang: number): Vector2 {
		ang = this.NormalizedAngle(ang)
		const PI4 = Math.PI / 4
		const s = Math.floor(ang / PI4) % 8,
			p = (s % 2 === 0) ? Math.tan(ang % PI4) : Math.tan(PI4 - ang % PI4)

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
}

export const RendererSDK = new CRendererSDK()

EventsSDK.on("UnitAbilityDataUpdated", () => RendererSDK.FreeTextureCache())

Workers.RegisterRPCEndPoint("LoadAndOptimizeWorld", data => {
	if (!Array.isArray(data))
		throw "Data should be objects"
	const objects = data as [string, number[]][],
		path2meshes = new Map<string, number[]>(),
		paths: string[] = [""]
	let next_mesh_id = 0
	WASM.ResetWorld()
	for (const [path] of objects) {
		if (path2meshes.has(path))
			continue
		const buf = fopen(`${path}_c`)
		if (buf === undefined)
			continue
		let filesOpen: FileStream[] = []
		try {
			let draw_calls: CMeshDrawCall[] = []
			if (path.endsWith(".vmdl")) {
				const model = ParseModel(new FileBinaryStream(buf))
				const mesh = model.Meshes[0]
				if (mesh !== undefined) {
					draw_calls = mesh.DrawCalls
					filesOpen = model.FilesOpen
				} else
					model.FilesOpen.forEach(file => file.close())
			} else if (path.endsWith(".vmesh"))
				draw_calls = ParseMesh(new FileBinaryStream(buf)).DrawCalls
			else
				throw `Invalid path ${path}`
			const path_meshes: number[] = []
			path2meshes.set(path, path_meshes)
			const path_id = paths.length
			paths.push(path)
			for (const draw_call of draw_calls) {
				const mesh_id = next_mesh_id++
				WASM.LoadWorldMesh(
					mesh_id,
					draw_call.VertexBuffer.Data,
					draw_call.VertexBuffer.ElementSize,
					draw_call.IndexBuffer.Data,
					draw_call.IndexBuffer.ElementSize,
					draw_call.Flags,
					path_id,
				)
				path_meshes.push(mesh_id)
			}
		} finally {
			filesOpen.forEach(file => file.close())
			buf.close()
		}
	}
	objects.forEach(([path, transform]) => {
		const meshes = path2meshes.get(path)
		if (meshes !== undefined)
			for (const mesh of meshes)
				WASM.SpawnWorldMesh(mesh, transform)
	})
	{
		const VB = new ViewBinaryStream(new DataView(new Float32Array([
			-100000, -100000, -16384,
			100000, -100000, -16384,
			-100000, 100000, -16384,
			100000, 100000, -16384,
		]).buffer))
		const IB = new ViewBinaryStream(new DataView(new Uint8Array([
			0, 1, 2, 1, 2, 3,
		]).buffer))
		const plate_mesh_id = next_mesh_id++
		WASM.LoadWorldMesh(
			plate_mesh_id,
			VB,
			3 * 4,
			IB,
			1,
			0,
			0,
		)
		path2meshes.set("", [plate_mesh_id])
		WASM.SpawnWorldMesh(plate_mesh_id, Matrix4x4.Identity.values)
	}
	WASM.FinishWorld()
	const paths_data: [string, [number, Uint8Array, Uint8Array, Uint8Array, number, number][]][] = []
	for (const [path, meshes] of path2meshes) {
		const meshes_data: [number, Uint8Array, Uint8Array, Uint8Array, number, number][] = []
		for (const mesh_id of meshes) {
			const mesh_data = WASM.ExtractMeshData(mesh_id)
			if (mesh_data !== undefined)
				meshes_data.push(mesh_data)
		}
		paths_data.push([path, meshes_data])
	}
	return [WASM.ExtractWorldBVH(), paths_data, paths]
})
