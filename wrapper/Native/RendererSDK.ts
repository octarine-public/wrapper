import Color from "../Base/Color"
import Matrix4x4 from "../Base/Matrix4x4"
import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { FontFlags_t } from "../Enums/FontFlags_t"
import EntityManager from "../Managers/EntityManager"
import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import { default as Input } from "../Managers/InputManager"
import { DefaultWorldLayers, ParseEntityLump, ResetEntityLump } from "../Resources/ParseEntityLump"
import { ParseGNV, ResetGNV } from "../Resources/ParseGNV"
import { parseKVFile } from "../Resources/ParseKV"
import { ParseMaterial } from "../Resources/ParseMaterial"
import { CMeshDrawCall, ParseMesh } from "../Resources/ParseMesh"
import { ParseModel } from "../Resources/ParseModel"
import { GetMapNumberProperty, GetMapStringProperty, MapToMatrix4x4, MapToNumberArray, MapToStringArray } from "../Resources/ParseUtils"
import { StringToUTF8Cb } from "../Utils/ArrayBufferUtils"
import BinaryStream from "../Utils/BinaryStream"
import { HasBit } from "../Utils/BitsExtensions"
import GameState from "../Utils/GameState"
import { DegreesToRadian } from "../Utils/Math"
import readFile from "../Utils/readFile"
import * as WASM from "./WASM"
import Workers from "./Workers"

enum CommandID {
	// state related
	TRANSLATE = 0,
	SCALE,
	SKEW,
	ROTATE,
	CLIP_RECT,
	CLIP_ROUND_RECT,
	CLIP_PATH,

	// PAINT_*
	PAINT_SET_COLOR,
	PAINT_SET_COLOR_FILTER,
	PAINT_SET_STYLE,
	PAINT_SET_STROKE_WIDTH,
	PAINT_SET_STROKE_MITER,
	PAINT_SET_STROKE_CAP,
	PAINT_SET_STROKE_JOIN,
	PAINT_SET_PATH_EFFECT,
	PAINT_SET_SHADER,

	// PATH_*
	PATH_RESET,
	PATH_SET_FILL_TYPE,
	PATH_MOVE_TO,
	PATH_LINE_TO,
	PATH_ADD_RECT,
	PATH_ADD_ROUND_RECT,
	PATH_ADD_OVAL,
	PATH_ADD_ARC,
	PATH_QUAD_TO,
	PATH_CONIC_TO,
	PATH_CUBIC_TO,
	PATH_CLOSE,
	PATH_OFFSET,

	// DRAW
	IMAGE,
	TEXT,
	PATH,
}
enum ColorFilterType {
	NONE = 0,
	BLEND,
	MATRIX,
}
enum BlendMode {
	Clear, // replaces destination with zero: fully transparent
	Src, // replaces destination
	Dst, // preserves destination
	SrcOver, // source over destination
	DstOver, // destination over source
	SrcIn, // source trimmed inside destination
	DstIn, // destination trimmed by source
	SrcOut, // source trimmed outside destination
	DstOut, // destination trimmed outside source
	SrcATop, // source inside destination blended with destination
	DstATop, // destination inside source blended with source
	Xor, // each of source and destination trimmed outside the other
	Plus, // sum of colors
	Modulate, // product of premultiplied colors; darkens destination
	Screen, // multiply inverse of pixels, inverting result; brightens destination

	Overlay, // multiply or screen, depending on destination
	Darken, // darker of source and destination
	Lighten, // lighter of source and destination
	ColorDodge, // brighten destination to reflect source
	ColorBurn, // darken destination to reflect source
	HardLight, // multiply or screen, depending on source
	SoftLight, // lighten or darken, depending on source
	Difference, // subtract darker from lighter with higher contrast
	Exclusion, // subtract darker from lighter with lower contrast
	Multiply, // multiply source with destination, darkening image

	Hue, // hue of source with saturation and luminosity of destination
	Saturation, // saturation of source with hue and luminosity of destination
	Color, // hue and saturation of source with luminosity of destination
	Luminosity, // luminosity of source with hue and saturation of destination
}
// @ts-ignore
// TODO
enum PathEffectType {
	NONE = 0,
	DISCRETE,
	DASH,
}
// @ts-ignore
// TODO
enum ShaderType {
	NONE = 0,
	GRADIENT_LINEAR,
	GRADIENT_RADIAL,
	GRADIENT_SWEEP,
}
enum PaintType {
	FILL = 0,
	STROKE,
	STROKE_AND_FILL,
}

abstract class Gradient {
	public apply(): void {
		// to be implemented in child classes
	}
}

export class GradientLinear extends Gradient {
	constructor(
		public startPos: Vector2,
		public endPos: Vector2,
		public premul: boolean,
		public colors: Color[],
		public positions?: number[],
	) {
		super()
	}
	public apply(): void {
		const have_positions = this.positions !== undefined
		const color_count = this.colors.length
		if (color_count < 2)
			throw "Number of colors should be >=2"
		if (color_count > 255)
			throw "Number of colors should be <255"
		if (have_positions && this.positions!.length !== color_count)
			throw "Positions should be either undefined or match color count"

		const commandStream = RendererSDK.AllocateCommandSpace_(
			CommandID.PAINT_SET_SHADER,
			1 + (4 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		commandStream.WriteUint8(ShaderType.GRADIENT_LINEAR)
		commandStream.WriteFloat32(this.startPos.x)
		commandStream.WriteFloat32(this.startPos.y)
		commandStream.WriteFloat32(this.endPos.x)
		commandStream.WriteFloat32(this.endPos.y)
		commandStream.WriteUint8(this.premul ? 1 : 0)
		commandStream.WriteUint8(color_count)
		commandStream.WriteUint8(have_positions ? 1 : 0)
		this.colors.forEach(color => {
			commandStream.WriteUint8(color.r)
			commandStream.WriteUint8(color.g)
			commandStream.WriteUint8(color.b)
			commandStream.WriteUint8(color.a)
		})
		if (have_positions)
			this.positions!.forEach(position => commandStream.WriteFloat32(position / 100))
	}
}

export class GradientRadial extends Gradient {
	constructor(
		public centerPos: Vector2,
		public radius: number,
		public premul: boolean,
		public colors: Color[],
		public positions?: number[],
	) {
		super()
	}
	public apply(): void {
		const have_positions = this.positions !== undefined
		const color_count = this.colors.length
		if (color_count < 2)
			throw "Number of colors should be >=2"
		if (color_count > 255)
			throw "Number of colors should be <255"
		if (have_positions && this.positions!.length !== color_count)
			throw "Positions should be either undefined or match color count"

		const commandStream = RendererSDK.AllocateCommandSpace_(
			CommandID.PAINT_SET_SHADER,
			1 + (3 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		commandStream.WriteUint8(ShaderType.GRADIENT_RADIAL)
		commandStream.WriteFloat32(this.centerPos.x)
		commandStream.WriteFloat32(this.centerPos.y)
		commandStream.WriteFloat32(this.radius)
		commandStream.WriteUint8(this.premul ? 1 : 0)
		commandStream.WriteUint8(color_count)
		commandStream.WriteUint8(have_positions ? 1 : 0)
		this.colors.forEach(color => {
			commandStream.WriteUint8(color.r)
			commandStream.WriteUint8(color.g)
			commandStream.WriteUint8(color.b)
			commandStream.WriteUint8(color.a)
		})
		if (have_positions)
			this.positions!.forEach(position => commandStream.WriteFloat32(position / 100))
	}
}

export class GradientSweep extends Gradient {
	constructor(
		public centerPos: Vector2,
		public startAngle: number,
		public endAngle: number,
		public premul: boolean,
		public colors: Color[],
		public positions?: number[],
	) {
		super()
	}
	public apply(): void {
		const have_positions = this.positions !== undefined
		const color_count = this.colors.length
		if (color_count < 2)
			throw "Number of colors should be >=2"
		if (color_count > 255)
			throw "Number of colors should be <255"
		if (have_positions && this.positions!.length !== color_count)
			throw "Positions should be either undefined or match color count"

		const commandStream = RendererSDK.AllocateCommandSpace_(
			CommandID.PAINT_SET_SHADER,
			1 + (4 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		commandStream.WriteUint8(ShaderType.GRADIENT_SWEEP)
		commandStream.WriteFloat32(this.centerPos.x)
		commandStream.WriteFloat32(this.centerPos.y)
		commandStream.WriteFloat32(this.startAngle)
		commandStream.WriteFloat32(this.endAngle)
		commandStream.WriteUint8(this.premul ? 1 : 0)
		commandStream.WriteUint8(color_count)
		commandStream.WriteUint8(have_positions ? 1 : 0)
		this.colors.forEach(color => {
			commandStream.WriteUint8(color.r)
			commandStream.WriteUint8(color.g)
			commandStream.WriteUint8(color.b)
			commandStream.WriteUint8(color.a)
		})
		if (have_positions)
			this.positions!.forEach(position => commandStream.WriteFloat32(position / 100))
	}
}

type Matrix = number[]
type RenderColor = Color | Matrix | Gradient
class CRendererSDK {
	/**
	 * Default Size of Text = Size 18
	 * @param font Size as X | default: 18
	 */
	public readonly DefaultTextSize = 18
	/**
	 * Default Size of Shape = Width 32 x Height 32
	 * @param vecSize Width as X
	 * @param vecSize Height as Y
	 */
	public readonly DefaultShapeSize: Vector2 = new Vector2(32, 32)

	public readonly WindowSize = new Vector2()
	public readonly GrayScale: Matrix = [
		0.2126, 0.7152, 0.0722, 0, 0,
		0.2126, 0.7152, 0.0722, 0, 0,
		0.2126, 0.7152, 0.0722, 0, 0,
		0, 0, 0, 1, 0,
	]

	private commandCache = new Uint8Array()
	private commandStream = new BinaryStream(new DataView(
		this.commandCache.buffer,
		this.commandCache.byteOffset,
		this.commandCache.byteLength,
	))
	private commandCacheSize = 0
	private font_cache = new Map</* name */string, Map</* weight */number, Map</* width */number, Map</* italic */boolean, /* font_id */number>>>>()
	private texture_cache = new Map</* path */string, number>()
	private clear_texture_cache = false
	private tex2size = new Map</* texture_id */number, Vector2>()

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
		return WASM.ScreenToWorld(vec, camera_pos, Camera.Distance ?? 1200, camera_ang, this.WindowSize)
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
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		this.Oval(vecSize, 1, color)
	}
	/**
	 *
	 */
	public OutlinedCircle(
		vecPos: Vector2,
		vecSize: Vector2,
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		this.SetFillType(PaintType.STROKE)
		this.Oval(vecSize, 1, color)
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public Line(
		start: Vector2 = new Vector2(),
		end = start.Add(this.DefaultShapeSize),
		color: RenderColor = Color.White,
		width = 5,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(start)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(start), custom_clip_size)
		this.Rotate(rotation_deg)
		this.PathMoveTo(0, 0)
		this.PathLineTo(end.x - start.x, end.y - start.y)
		this.SetFillType(PaintType.STROKE_AND_FILL)
		this.Path(width, color)
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public FilledRect(
		vecPos = new Vector2(),
		vecSize = this.DefaultShapeSize,
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		this.Path(1, color)
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
		color: RenderColor = Color.White,
		rotation_deg = 0,
	): void {
		// TODO: rewrite it without using negative values
		const tmpVecSize = new Vector2()
		tmpVecSize.x = vecSize.x
		tmpVecSize.y = width
		this.FilledRect(vecPos, tmpVecSize, color, rotation_deg)
		tmpVecSize.x = width
		tmpVecSize.y = vecSize.y
		this.FilledRect(vecPos, tmpVecSize, color, rotation_deg)

		const vecPos2 = vecPos.Add(vecSize)
		tmpVecSize.x = -vecSize.x
		tmpVecSize.y = -width
		this.FilledRect(vecPos2, tmpVecSize, color, rotation_deg)
		tmpVecSize.x = -width
		tmpVecSize.y = -vecSize.y
		this.FilledRect(vecPos2, tmpVecSize, color, rotation_deg)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public Image(
		path: string,
		vecPos: Vector2,
		round = -1,
		vecSize = new Vector2(-1, -1),
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		this.SetColorFilter(color, BlendMode.Modulate)

		const texture_id = this.GetTexture(path) // better put it BEFORE new command
		if (vecSize.x <= 0 || vecSize.y <= 0) {
			const size = this.tex2size.get(texture_id)!
			if (vecSize.x <= 0)
				vecSize.x = size.x
			if (vecSize.y <= 0)
				vecSize.y = size.y
		}
		if (round >= 0)
			this.SetClipOval(
				new Vector2().AddScalarForThis(round / 2),
				vecSize.SubtractScalar(round / 2),
			)

		this.AllocateCommandSpace(CommandID.IMAGE, 3 * 4)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		this.commandStream.WriteUint32(texture_id)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public ImagePart(
		path: string,
		vecPos: Vector2,
		round = -1,
		imagePos = new Vector2(),
		imageSize = new Vector2(-1, -1),
		vecSize = new Vector2(-1, -1),
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		const texture_id = this.GetTexture(path)
		const tex_size = this.tex2size.get(texture_id)!
		if (imageSize.x === -1)
			imageSize.x = tex_size.x
		if (imageSize.y === -1)
			imageSize.y = tex_size.y
		if (vecSize.x === -1)
			vecSize.x = imageSize.x
		if (vecSize.y === -1)
			vecSize.y = imageSize.y
		const size = tex_size.Multiply(vecSize).DivideForThis(imageSize)
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		if (round >= 0)
			this.SetClipOval(
				new Vector2().AddScalar(round / 2),
				vecSize.SubtractScalar(round / 2),
			)
		else
			this.SetClipRect(new Vector2(), vecSize)
		this.Image(
			path,
			imagePos.Multiply(vecSize).DivideForThis(imageSize).Negate(),
			-1,
			size,
			color,
			0,
		)
	}
	public GetImageSize(path: string): Vector2 {
		return this.tex2size.get(this.GetTexture(path))!
	}
	/**
	 * @param font_size Size | default: 14
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	public Text(text: string, vecPos = new Vector2(), color: RenderColor = Color.White, font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): void {
		if (text === "")
			return

		this.Translate(vecPos)
		this.SetColor(color)
		const font_id = this.GetFont(font_name, weight, width, italic)
		this.AllocateCommandSpace(CommandID.TEXT, 5 * 4 + 2)
		this.commandStream.WriteUint32(font_id)
		this.commandStream.WriteFloat32(font_size)
		this.commandStream.WriteFloat32(scaleX)
		this.commandStream.WriteFloat32(skewX)
		this.commandStream.WriteUint16(flags)
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
	}
	/**
	 * @returns text size defined as new Vector3(width, height, under_line)
	 */
	public GetTextSize(text: string, font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): Vector3 {
		if (text === "")
			return new Vector3()

		const font = this.GetFont(font_name, weight, width, italic)
		IOBuffer[0] = font_size
		IOBuffer[1] = scaleX
		IOBuffer[2] = skewX
		Renderer.GetTextSize(text, font)
		return new Vector3(
			IOBuffer[0],
			IOBuffer[1],
			IOBuffer[2],
		).CeilForThis()
	}
	/**
	 * @param color default: Yellow
	 * @param font_name default: "Calibri"
	 * @param font_size default: 30
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	public TextAroundMouse(text: string, vec?: Vector2 | false, color: RenderColor = Color.Yellow, font_name = "Calibri", font_size = 30, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): void {
		let vecMouse = Input.CursorOnScreen.AddScalarX(30).AddScalarY(15)

		if (vec !== undefined && vec !== false)
			vecMouse = vecMouse.Add(vec)

		this.Text(text, vecMouse, color, font_name, font_size, weight, width, italic, flags, scaleX, skewX)
	}

	public async BeforeDraw() {
		WASM.CloneWorldToProjection(IOBuffer.slice(0, 16))
		const prev_width = this.WindowSize.x,
			prev_height = this.WindowSize.y
		this.WindowSize.x = IOBufferView.getInt32(17 * 4, true)
		this.WindowSize.y = IOBufferView.getInt32(18 * 4, true)
		if (this.WindowSize.x !== prev_width || this.WindowSize.y !== prev_height)
			await EventsSDK.emit("WindowSizeChanged", false)
		if (this.clear_texture_cache) {
			this.texture_cache.forEach(id => this.FreeTexture(id))
			this.texture_cache.clear()
			this.clear_texture_cache = false
		}
	}
	public EmitDraw() {
		Renderer.ExecuteCommandBuffer(this.commandCache.subarray(0, this.commandCacheSize))
		if (this.commandCacheSize < this.commandCache.byteLength / 3) {
			this.commandCache = new Uint8Array(this.commandCache.byteLength / 3)
			this.OnCommandCacheChanged()
		}
		this.commandStream.pos = 0
		this.commandCacheSize = 0
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
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		percent = Math.min(percent, 100)

		let angle = this.NormalizedAngle(DegreesToRadian(360 * percent / 100))
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
		this.Path(1, color)
	}
	public Arc(
		baseAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fill = false,
		width = 5,
		color: RenderColor = Color.White,
		rotation_deg = 0,
		custom_clip_pos?: Vector2,
		custom_clip_size?: Vector2,
	): void {
		this.Translate(vecPos)
		if (custom_clip_pos !== undefined && custom_clip_size !== undefined)
			this.SetClipRect(custom_clip_pos.Subtract(vecPos), custom_clip_size)
		this.Rotate(rotation_deg)
		if (Number.isNaN(baseAngle) || !Number.isFinite(baseAngle))
			baseAngle = 0
		if (Number.isNaN(percent) || !Number.isFinite(percent))
			percent = 100
		percent = Math.min(Math.max(percent / 100, 0), 1)
		this.SetFillType(fill ? PaintType.STROKE_AND_FILL : PaintType.STROKE)

		this.AllocateCommandSpace(CommandID.PATH_ADD_ARC, 6 * 4 + 1)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		this.commandStream.WriteFloat32(baseAngle)
		this.commandStream.WriteFloat32(360 * percent * Math.sign(baseAngle))
		this.commandStream.WriteUint8(fill ? 1 : 0)
		this.Path(width, color)
	}
	public AllocateCommandSpace_(commandID: CommandID, bytes: number): BinaryStream {
		this.AllocateCommandSpace(commandID, bytes)
		return this.commandStream
	}
	public FreeTextureCache(): void {
		this.clear_texture_cache = true
	}
	private Oval(vecSize: Vector2, width: number, color: RenderColor): void {
		this.AllocateCommandSpace(CommandID.PATH_ADD_OVAL, 4 * 4)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(0)
		this.commandStream.WriteFloat32(vecSize.x)
		this.commandStream.WriteFloat32(vecSize.y)
		this.Path(width, color)
	}
	private MakeTexture(rgba: Uint8Array, size: Vector2): number {
		if (rgba.byteLength !== size.x * size.y * 4)
			throw "Invalid RGBA buffer or size"
		size.toIOBuffer()
		const texture_id = Renderer.CreateTexture(rgba)
		this.tex2size.set(texture_id, size)
		return texture_id
	}
	private FreeTexture(texture_id: number): void {
		Renderer.FreeTexture(texture_id)
	}
	private MakeTextureSVG(buf: Uint8Array): number {
		const texture_id = Renderer.CreateTextureSVG(buf)
		this.tex2size.set(texture_id, Vector2.fromIOBuffer())
		return texture_id
	}
	private GetTexture(path: string): number {
		if (this.texture_cache.has(path))
			return this.texture_cache.get(path)!
		let read_path = path
		if (path.endsWith(".vmat_c")) {
			const buf = fread(path)
			if (buf !== undefined) {
				const vmat = ParseMaterial(buf)
				const g_tColor = vmat.TextureParams.get("g_tColor")
				if (g_tColor !== undefined) {
					read_path = g_tColor
					if (read_path.endsWith(".vtex"))
						read_path += "_c"
				}
			}
		}
		const read = readFile(read_path, 2) // 1 for ourselves, 1 for caller [Image]
		if (read === undefined) {
			// 1 white pixel for any rendering API to be happy
			const texture_id = this.MakeTexture(
				new Uint8Array(new Array(4).fill(0xFF)),
				new Vector2(1, 1),
			)
			this.texture_cache.set(path, texture_id)
			return texture_id
		} else {
			const texture_id = read_path.endsWith(".svg")
				? this.MakeTextureSVG(read)
				: this.MakeTexture(...WASM.ParseImage(read))
			this.texture_cache.set(path, texture_id)
			return texture_id
		}
	}
	private GetFont(font_name: string, weight: number, width: number, italic: boolean): number {
		let weight_map = this.font_cache.get(font_name)
		if (weight_map === undefined) {
			weight_map = new Map()
			this.font_cache.set(font_name, weight_map)
		}
		let width_map = weight_map.get(weight)
		if (width_map === undefined) {
			width_map = new Map()
			weight_map.set(weight, width_map)
		}
		let italic_map = width_map.get(width)
		if (italic_map === undefined) {
			italic_map = new Map()
			width_map.set(width, italic_map)
		}
		let font_id = italic_map.get(italic)
		if (font_id === undefined) {
			font_id = Renderer.CreateFont(font_name, weight, width, italic)
			italic_map.set(italic, font_id)
		}
		return font_id
	}

	private OnCommandCacheChanged() {
		this.commandStream = new BinaryStream(new DataView(
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
	private SetColor(color: RenderColor): void {
		if (color instanceof Gradient) {
			color.apply()
			return
		}
		if (!(color instanceof Color)) {
			this.SetMatrixColorFilter(color)
			return
		}
		this.AllocateCommandSpace(CommandID.PAINT_SET_COLOR, 4)
		this.commandStream.WriteUint8(Math.min(color.r, 255))
		this.commandStream.WriteUint8(Math.min(color.g, 255))
		this.commandStream.WriteUint8(Math.min(color.b, 255))
		this.commandStream.WriteUint8(Math.min(color.a, 255))
	}
	private SetFillType(fillType: PaintType): void {
		this.AllocateCommandSpace(CommandID.PAINT_SET_STYLE, 1)
		this.commandStream.WriteUint8(fillType)
	}
	private SetWidth(width: number): void {
		this.AllocateCommandSpace(CommandID.PAINT_SET_STROKE_WIDTH, 4)
		this.commandStream.WriteFloat32(width)
	}
	private SetMatrixColorFilter(mat: Matrix): void {
		this.AllocateCommandSpace(CommandID.PAINT_SET_COLOR_FILTER, 1 + 20 * 4)
		this.commandStream.WriteUint8(ColorFilterType.MATRIX)
		for (let i = 0; i < 20; i++)
			this.commandStream.WriteFloat32(mat[i] ?? 0)
	}
	private SetColorFilter(color: RenderColor, blendMode: BlendMode): void {
		if (color instanceof Gradient) {
			color.apply()
			return
		}
		if (!(color instanceof Color)) {
			this.SetMatrixColorFilter(color)
			return
		}
		this.AllocateCommandSpace(CommandID.PAINT_SET_COLOR_FILTER, 6)
		this.commandStream.WriteUint8(ColorFilterType.BLEND)
		this.commandStream.WriteUint8(Math.min(color.r, 255))
		this.commandStream.WriteUint8(Math.min(color.g, 255))
		this.commandStream.WriteUint8(Math.min(color.b, 255))
		this.commandStream.WriteUint8(Math.min(color.a, 255))
		this.commandStream.WriteUint8(blendMode)
	}
	private SetClipOval(vecPos: Vector2, vecSize: Vector2): void {
		{
			this.AllocateCommandSpace(CommandID.PATH_ADD_OVAL, 4 * 4)
			this.commandStream.WriteFloat32(vecPos.x)
			this.commandStream.WriteFloat32(vecPos.y)
			this.commandStream.WriteFloat32(vecPos.x + vecSize.x)
			this.commandStream.WriteFloat32(vecPos.y + vecSize.y)
		}
		{
			this.AllocateCommandSpace(CommandID.CLIP_PATH, 2)
			this.commandStream.WriteUint8(1) // do_antialias
			this.commandStream.WriteUint8(0) // diff_op
		}
		this.PathReset()
	}
	private SetClipRect(vecPos: Vector2, vecSize: Vector2): void {
		{
			this.AllocateCommandSpace(CommandID.PATH_ADD_RECT, 4 * 4)
			this.commandStream.WriteFloat32(vecPos.x)
			this.commandStream.WriteFloat32(vecPos.y)
			this.commandStream.WriteFloat32(vecPos.x + vecSize.x)
			this.commandStream.WriteFloat32(vecPos.y + vecSize.y)
		}
		{
			this.AllocateCommandSpace(CommandID.CLIP_PATH, 2)
			this.commandStream.WriteUint8(1) // do_antialias
			this.commandStream.WriteUint8(0) // diff_op
		}
		this.PathReset()
	}
	private PathReset(): void {
		this.AllocateCommandSpace(CommandID.PATH_RESET, 0)
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
	private Path(width = 5, color: RenderColor = Color.White): void {
		this.SetColor(color)
		this.SetWidth(width)
		this.AllocateCommandSpace(CommandID.PATH, 0)
	}
	private Rotate(ang: number): void {
		if (ang === 0)
			return
		this.AllocateCommandSpace(CommandID.ROTATE, 4)
		this.commandStream.WriteFloat32(ang)
	}
	private Translate(vecPos: Vector2): void {
		if (vecPos.IsZero())
			return
		this.AllocateCommandSpace(CommandID.TRANSLATE, 2 * 4)
		this.commandStream.WriteFloat32(vecPos.x)
		this.commandStream.WriteFloat32(vecPos.y)
	}
	private NormalizedAngle(ang: number): number {
		ang = ang % (Math.PI * 2)
		if (ang < 0)
			ang += 2 * Math.PI
		if (ang > 2 * Math.PI)
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
		return this.NormalizedPoint(ang).AddScalarForThis(1).DivideScalarForThis(2).MultiplyForThis(vecSize)
	}
}
const RendererSDK = new CRendererSDK()

let vhcg_succeeded = false,
	gnv_succeeded = false,
	entity_lump_succeeded = false,
	current_world_promise: Nullable<Promise<WorkerIPCType>>
function TryLoadWorld(world_kv: RecursiveMap): void {
	const worldNodes = world_kv.get("m_worldNodes")
	if (!(worldNodes instanceof Map || Array.isArray(worldNodes)))
		return
	const meshes: [string, number[]][] = [],
		models: [string, number[]][] = []
	worldNodes.forEach((node: RecursiveMapValue) => {
		if (!(node instanceof Map))
			return
		const path = GetMapStringProperty(node, "m_worldNodePrefix")
		const node_kv = parseKVFile(`${path}.vwnod_c`)

		const layerNames: string[] = []
		const layerNamesMap = node_kv.get("m_layerNames")
		if (layerNamesMap instanceof Map || Array.isArray(layerNamesMap))
			layerNames.push(...MapToStringArray(layerNamesMap))

		const sceneObjectLayers: string[] = []
		const sceneObjectLayerIndicesMap = node_kv.get("m_sceneObjectLayerIndices")
		if (sceneObjectLayerIndicesMap instanceof Map || Array.isArray(sceneObjectLayerIndicesMap))
			sceneObjectLayers.push(
				...MapToNumberArray(sceneObjectLayerIndicesMap)
					.map(index => layerNames[index]),
			)

		const sceneObjects = node_kv.get("m_sceneObjects")
		if (!(sceneObjects instanceof Map || Array.isArray(sceneObjects)))
			return
		let i = 0
		sceneObjects.forEach((sceneObject: RecursiveMapValue) => {
			if (!(sceneObject instanceof Map))
				return
			const layerName = sceneObjectLayers[i++] ?? "world_layer_base"
			if (!DefaultWorldLayers.includes(layerName))
				return
			const transformMap = sceneObject.get("m_vTransform")
			const transform = transformMap instanceof Map || Array.isArray(transformMap)
				? MapToMatrix4x4(transformMap)
				: Matrix4x4.Identity
			const model_path = GetMapStringProperty(sceneObject, "m_renderableModel"),
				mesh_path = GetMapStringProperty(sceneObject, "m_renderable"),
				objectTypeFlags = GetMapNumberProperty(sceneObject, "m_nObjectTypeFlags")
			// visual only, doesn't affect height calculations/etc
			if (HasBit(objectTypeFlags, 7))
				return
			if (model_path !== "")
				models.push([model_path, [...transform.values]])
			if (mesh_path !== "")
				meshes.push([mesh_path, [...transform.values]])
		})
	})
	const world_promise = current_world_promise = Workers.CallRPCEndPoint(
		"LoadAndOptimizeWorld",
		[models, meshes],
		false,
		{
			forward_events: false,
			forward_server_messages: false,
		},
	)
	world_promise.then(data => {
		if (world_promise !== current_world_promise || !Array.isArray(data))
			return
		current_world_promise = undefined
		const [VB, IB, BVH1, BVH2] = data
		if (!(
			VB instanceof Uint8Array
			&& IB instanceof Uint8Array
			&& BVH1 instanceof Uint8Array
			&& BVH2 instanceof Uint8Array
		))
			return
		WASM.LoadWorldModel(VB, 4 * 4, IB, 4, Matrix4x4.Identity.values, -1)
		WASM.FinishWorldCached([BVH1, BVH2])
	}, console.error)
}
async function TryLoadMapFiles(): Promise<void> {
	const map_name = GameState.MapName
	if (!vhcg_succeeded) {
		const buf = fread(`maps/${map_name}.vhcg`)
		if (buf !== undefined) {
			vhcg_succeeded = true
			WASM.ParseVHCG(buf)
			await EventsSDK.emit("MapDataLoaded", false)
		} else
			WASM.ResetVHCG()
	}
	if (!gnv_succeeded) {
		const buf = fread(`maps/${map_name}.gnv`)
		if (buf !== undefined) {
			gnv_succeeded = true
			ParseGNV(buf)
			await EventsSDK.emit("MapDataLoaded", false)
		} else
			ResetGNV()
	}
	if (!entity_lump_succeeded) {
		ResetEntityLump()
		WASM.ResetWorld()
		const world_kv = parseKVFile(`maps/${map_name}/world.vwrld_c`)
		const m_entityLumps = world_kv.get("m_entityLumps")
		if (m_entityLumps instanceof Map || Array.isArray(m_entityLumps))
			m_entityLumps.forEach((path: RecursiveMapValue) => {
				if (typeof path !== "string")
					return
				const buf = fread(`${path}_c`)
				if (buf === undefined)
					return
				entity_lump_succeeded = true
				ParseEntityLump(buf)
			})
		if (entity_lump_succeeded) {
			if (IS_MAIN_WORKER)
				TryLoadWorld(world_kv)
			await EventsSDK.emit("MapDataLoaded", false)
		}
	}
}

EventsSDK.on("ServerInfo", async info => {
	let map_name = (info.get("map_name") as string) ?? "<empty>"
	if (map_name === undefined)
		return
	if (map_name === "start")
		map_name = "dota"
	GameState.MapName = map_name
	vhcg_succeeded = false
	gnv_succeeded = false
	entity_lump_succeeded = false
	await TryLoadMapFiles()
})

Events.on("PostAddSearchPath", async () => TryLoadMapFiles())

Events.on("Draw", async visual_data => {
	await RendererSDK.BeforeDraw()
	const stream = new BinaryStream(new DataView(visual_data))
	while (!stream.Empty()) {
		const entity_id = stream.ReadUint32()
		const ent = EntityManager.EntityByIndex(entity_id)
		if (ent === undefined) {
			stream.RelativeSeek(2 * 3 * 4)
			continue
		}
		ent.VisualPosition.x = stream.ReadFloat32()
		ent.VisualPosition.y = stream.ReadFloat32()
		ent.VisualPosition.z = stream.ReadFloat32()
		ent.VisualAngles.x = stream.ReadFloat32()
		ent.VisualAngles.y = stream.ReadFloat32()
		ent.VisualAngles.z = stream.ReadFloat32()
	}
	GameState.IsInDraw = true
	await EventsSDK.emit("PreDraw")
	await EventsSDK.emit("Draw")
	GameState.IsInDraw = false
})

export default RendererSDK

Workers.RegisterRPCEndPoint("LoadAndOptimizeWorld", data => {
	if (!Array.isArray(data) || !Array.isArray(data[0]) || !Array.isArray(data[1]))
		throw "Data should be [models, meshes]"
	const models = data[0] as [string, number[]][],
		meshes = data[1] as [string, number[]][],
		draw_calls_cache = new Map<string, CMeshDrawCall[]>()
	WASM.ResetWorld()
	const draw_calls: [CMeshDrawCall, number[]][] = []
	models.forEach(([model_path, transform]) => {
		if (draw_calls_cache.has(model_path)) {
			draw_calls_cache.get(model_path)!
				.forEach(drawCall => draw_calls.push([drawCall, transform]))
			return
		}
		const buf = fread(`${model_path}_c`)
		if (buf === undefined)
			return
		const model = ParseModel(buf)
		const mesh = model.Meshes[0]
		const mesh_draw_calls = mesh?.DrawCalls ?? []
		mesh_draw_calls.forEach(drawCall => draw_calls.push([drawCall, transform]))
		draw_calls_cache.set(model_path, mesh_draw_calls)
	})
	meshes.forEach(([mesh_path, transform]) => {
		if (draw_calls_cache.has(mesh_path)) {
			draw_calls_cache.get(mesh_path)!
				.forEach(drawCall => draw_calls.push([drawCall, transform]))
			return
		}
		const buf = fread(`${mesh_path}_c`)
		const mesh_draw_calls = buf !== undefined
			? ParseMesh(buf).DrawCalls
			: []
		mesh_draw_calls.forEach(drawCall => draw_calls.push([drawCall, transform]))
		draw_calls_cache.set(mesh_path, mesh_draw_calls)
	})
	draw_calls.forEach(([drawCall, transform]) => WASM.LoadWorldModel(
		drawCall.VertexBuffer.Data,
		drawCall.VertexBuffer.ElementSize,
		drawCall.IndexBuffer.Data,
		drawCall.IndexBuffer.ElementSize,
		transform,
		drawCall.Flags,
	))
	{ // big plate underneath the world to make any valid tracing actually end
		const VB = new Uint8Array(new Float32Array([
			-10000000, -10000000, -16384,
			10000000, -10000000, -16384,
			-10000000, 10000000, -16384,
			10000000, 10000000, -16384,
		]).buffer)
		const IB = new Uint8Array([
			0, 1, 2, 1, 2, 3,
		])
		WASM.LoadWorldModel(
			VB,
			3 * 4,
			IB,
			1,
			Matrix4x4.Identity.values,
			0,
		)
	}
	WASM.FinishWorld()
	return WASM.ExtractWorld()
})
