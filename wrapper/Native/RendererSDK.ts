import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import { FontFlags_t } from "../Enums/FontFlags_t"
import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import { default as Input } from "../Managers/InputManager"
import { LoadTreeMapByName } from "../Objects/Base/Tree"
import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import GameState from "../Utils/GameState"
import { DegreesToRadian } from "../Utils/Math"
import { ParseGNV, ResetGNV } from "../Utils/ParseGNV"
import readFile from "../Utils/readFile"
import { ParseMapName } from "../Utils/Utils"
import * as WASM from "./WASM"

enum CommandID {
	// state related
	SAVE_STATE = 0,
	SAVE_LAYER_STATE,
	RESTORE_STATE,
	TRANSLATE,
	SCALE,
	SKEW,
	ROTATE,
	CLIP_RECT,
	CLIP_ROUND_RECT,
	CLIP_PATH,

	// PAINT_*
	PAINT_RESET,
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
	LINE,
	RECT,
	ROUND_RECT,
	OVAL,
	ARC,
	PAINT,
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

		const view = RendererSDK.AllocateCommandSpace_(
			1 + (4 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_SHADER)
		view.setUint8(off += 1, ShaderType.GRADIENT_LINEAR)
		view.setFloat32(off += 1, this.startPos.x, true)
		view.setFloat32(off += 4, this.startPos.y, true)
		view.setFloat32(off += 4, this.endPos.x, true)
		view.setFloat32(off += 4, this.endPos.y, true)
		view.setUint8(off += 4, this.premul ? 1 : 0)
		view.setUint8(off += 1, color_count)
		view.setUint8(off += 1, have_positions ? 1 : 0)
		this.colors.forEach(color => {
			view.setUint8(off += 1, color.r)
			view.setUint8(off += 1, color.g)
			view.setUint8(off += 1, color.b)
			view.setUint8(off += 1, color.a)
		})
		off += 1
		off -= 4
		if (have_positions)
			this.positions!.forEach(position => view.setFloat32(off += 4, position / 100, true))
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

		const view = RendererSDK.AllocateCommandSpace_(
			1 + (3 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_SHADER)
		view.setUint8(off += 1, ShaderType.GRADIENT_RADIAL)
		view.setFloat32(off += 1, this.centerPos.x, true)
		view.setFloat32(off += 4, this.centerPos.y, true)
		view.setFloat32(off += 4, this.radius, true)
		view.setUint8(off += 4, this.premul ? 1 : 0)
		view.setUint8(off += 1, color_count)
		view.setUint8(off += 1, have_positions ? 1 : 0)
		this.colors.forEach(color => {
			view.setUint8(off += 1, color.r)
			view.setUint8(off += 1, color.g)
			view.setUint8(off += 1, color.b)
			view.setUint8(off += 1, color.a)
		})
		off += 1
		off -= 4
		if (have_positions)
			this.positions!.forEach(position => view.setFloat32(off += 4, position / 100, true))
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

		const view = RendererSDK.AllocateCommandSpace_(
			1 + (4 * 4) + 1 + 1 + 1 + (color_count * 4)
			+ (have_positions ? color_count * 4 : 0),
		)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_SHADER)
		view.setUint8(off += 1, ShaderType.GRADIENT_SWEEP)
		view.setFloat32(off += 1, this.centerPos.x, true)
		view.setFloat32(off += 4, this.centerPos.y, true)
		view.setFloat32(off += 4, this.startAngle, true)
		view.setFloat32(off += 4, this.endAngle, true)
		view.setUint8(off += 4, this.premul ? 1 : 0)
		view.setUint8(off += 1, color_count)
		view.setUint8(off += 1, have_positions ? 1 : 0)
		this.colors.forEach(color => {
			view.setUint8(off += 1, color.r)
			view.setUint8(off += 1, color.g)
			view.setUint8(off += 1, color.b)
			view.setUint8(off += 1, color.a)
		})
		off += 1
		off -= 4
		if (have_positions)
			this.positions!.forEach(position => view.setFloat32(off += 4, position / 100, true))
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
	private commandCacheSize = 0
	private font_cache = new Map</* name */string, Map</* weight */number, Map</* width */number, Map</* italic */boolean, /* font_id */number>>>>()
	private texture_cache = new Map</* path */string, number>()
	private tex2size = new Map</* texture_id */number, Vector2>()
	private readonly last_color: Color = new Color(-1, -1, -1, -1)
	private last_fill_type = PaintType.FILL
	private last_width = 1

	public EmitChatEvent(
		type = DOTA_CHAT_MESSAGE.CHAT_MESSAGE_INVALID,
		value = 0,
		playerid_1 = -1,
		playerid_2 = -1,
		playerid_3 = -1,
		playerid_4 = -1,
		playerid_5 = -1,
		playerid_6 = -1,
		value2 = 0,
		value3 = 0,
	): void {
		EmitChatEvent(
			type,
			value,
			playerid_1,
			playerid_2,
			playerid_3,
			playerid_4,
			playerid_5,
			playerid_6,
			value2,
			value3,
		)
	}

	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(position: Vector2 | Vector3): Nullable<Vector2> {
		position.toIOBuffer()
		if (position instanceof Vector2)
			IOBuffer[2] = WASM.GetPositionHeight(position)
		Renderer.WorldToScreen()
		if (Number.isNaN(IOBuffer[0]) || Number.isNaN(IOBuffer[1]))
			return undefined
		return Vector2.fromIOBuffer()
	}
	/**
	 * @returns screen position with x and y in range {0, 1}, or undefined
	 */
	public WorldToScreenCustom(position: Vector2 | Vector3, camera_position: Vector2 | Vector3, camera_distance = 1200, camera_angles = new QAngle(60, 90, 0), window_size = this.WindowSize): Nullable<Vector2> {
		if (position instanceof Vector2)
			position = position.toVector3().SetZ(WASM.GetPositionHeight(position))
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.WorldToScreen(position, camera_position, camera_distance, camera_angles, window_size)
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
	public ScreenToWorldFar(screen: Vector2, camera_position: Vector2 | Vector3, camera_distance = 1200, camera_angles = new QAngle(60, 90, 0), window_size = this.WindowSize): Vector3 {
		if (WASM.HeightMap === undefined)
			return new Vector3().Invalidate()
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.ScreenToWorldFar(screen, window_size, camera_position, camera_distance, camera_angles)
	}
	public FilledCircle(vecPos: Vector2, vecSize: Vector2, color: RenderColor = Color.White): void {
		this.SetColor(color)
		this.Oval(vecPos, vecSize)
		this.RestorePaint()
	}
	/**
	 *
	 */
	public OutlinedCircle(vecPos: Vector2, vecSize: Vector2, color: RenderColor = Color.White): void {
		this.SetColor(color)
		this.SetFillType(PaintType.STROKE)
		this.Oval(vecPos, vecSize)
		this.SetFillType(PaintType.STROKE_AND_FILL)
		this.RestorePaint()
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public Line(start: Vector2 = new Vector2(), end = start.Add(this.DefaultShapeSize), color: RenderColor = Color.White): void {
		this.SetColor(color)

		const view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.LINE)
		view.setInt32(off += 1, start.x, true)
		view.setInt32(off += 4, start.y, true)
		view.setInt32(off += 4, end.x, true)
		view.setInt32(off += 4, end.y, true)
		this.RestorePaint()
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public FilledRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color: RenderColor = Color.White): void {
		this.SetColor(color)
		this.Rect(vecPos, vecSize)
		this.RestorePaint()
	}
	/**
	 * @param vecSize default Width 5 x Height 5
	 * @param vecSize Width as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public OutlinedRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, width = 1, color: RenderColor = Color.White): void {
		const tmpVecSize = new Vector2()
		tmpVecSize.x = vecSize.x
		tmpVecSize.y = width
		this.FilledRect(vecPos, tmpVecSize, color)
		tmpVecSize.x = width
		tmpVecSize.y = vecSize.y
		this.FilledRect(vecPos, tmpVecSize, color)

		const vecPos2 = vecPos.Add(vecSize)
		tmpVecSize.x = -vecSize.x
		tmpVecSize.y = -width
		this.FilledRect(vecPos2, tmpVecSize, color)
		tmpVecSize.x = -width
		tmpVecSize.y = -vecSize.y
		this.FilledRect(vecPos2, tmpVecSize, color)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public Image(path: string, vecPos: Vector2, round = -1, vecSize = new Vector2(-1, -1), color: RenderColor = Color.White): void {
		this.SetColor(Color.White)
		this.SetColorFilter(color, BlendMode.Modulate)

		const texture_id = this.GetTexture(path) // better put it BEFORE new command
		if (vecSize.x <= 0 || vecSize.y <= 0) {
			const size = this.tex2size.get(texture_id)!
			if (vecSize.x <= 0)
				vecSize.x = size.x
			if (vecSize.y <= 0)
				vecSize.y = size.y
		}
		if (round >= 0) {
			this.SaveState()
			this.SetClipOval(vecPos.AddScalar(round / 2), vecSize.SubtractScalar(round / 2))
		}

		const view = this.AllocateCommandSpace(5 * 4)
		let off = 0
		view.setUint8(off, CommandID.IMAGE)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecSize.x, true)
		view.setFloat32(off += 4, vecSize.y, true)
		view.setUint32(off += 4, texture_id, true)

		if (round >= 0)
			this.RestoreState()
		this.RestorePaint()
	}
	public GetImageSize(path: string): Vector2 {
		return this.tex2size.get(this.GetTexture(path))!
	}
	public Text(text: string, vecPos = new Vector2(), color: RenderColor = Color.White, font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): void {
		const pos = vecPos.Clone()
		text.split("\n").forEach(line => {
			this.Text_(line.replaceAll("\t", "    "), pos, color, font_name, font_size, weight, width, italic, flags, scaleX, skewX)
			pos.AddScalarY(font_size)
		})
	}
	/**
	 * @returns text size defined as new Vector3(width, height, under_line)
	 */
	public GetTextSize(text: string, font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): Vector3 {
		const font = this.GetFont(font_name, weight, width, italic)
		let max_x = 0,
			y = 0,
			under_line = 0
		text.split("\n").forEach(line => {
			IOBuffer[0] = font_size
			IOBuffer[1] = scaleX
			IOBuffer[2] = skewX
			Renderer.GetTextSize(line, font)
			max_x = Math.max(Math.ceil(IOBuffer[0]), max_x)
			y += Math.ceil(IOBuffer[1])
			under_line = IOBuffer[2]
		})
		return new Vector3(max_x, y, under_line)
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

	/**
	 * Draws icon at minimap
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/mod_textures.txt
	 * @param size you can get that value for heroes from ConVars.GetInt("dota_minimap_hero_size")
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawMiniMapIcon(name: string, worldPos: Vector3, size = 800, color: Color = Color.White, end_time = 1) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawIcon(name, size, end_time, 0x80000000)
	}
	/**
	 * Draws ping at minimap
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawMiniMapPing(worldPos: Vector3, color: Color = Color.White, end_time = 1, key = Math.round(Math.random() * 1000)) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawPing(end_time, -key)
	}

	public EmitDraw() {
		if (this.commandCacheSize === 0)
			return
		Renderer.ExecuteCommandBuffer(this.commandCache.subarray(0, this.commandCacheSize))
		if (this.commandCacheSize < this.commandCache.byteLength / 3)
			this.commandCache = new Uint8Array(this.commandCache.byteLength / 3)
		this.commandCacheSize = 0
		this.last_color.SetColor(-1, -1, -1, -1)
		this.last_fill_type = PaintType.FILL
		this.last_width = 1
	}
	public GetAspectRatio() {
		const res = this.WindowSize.x / this.WindowSize.y
		if (res >= 1.25 && res <= 1.35)
			return "4x3"
		else if (res >= 1.7 && res <= 1.85)
			return "16x9"
		else if (res >= 1.5 && res <= 1.69)
			return "16x10"
		else if (res >= 2.2 && res <= 2.4)
			return "21x9"
	}
	public GetProportionalScaledVector(vec: Vector2, apply_screen_scaling = true, magic: number = 1, parent_size = this.WindowSize): Vector2 {
		vec = vec.Clone()
		let h = parent_size.y
		vec.y = Math.floor(h / 0x300 * vec.y / magic)
		if (apply_screen_scaling && parent_size.x === 1280 && h === 1024)
			h = 960
		vec.x = Math.floor(h / 0x300 * vec.x / magic)
		return vec
	}
	public Radial(
		startAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		color: RenderColor = Color.White,
	): void {
		percent = Math.min(percent, 100)

		let angle = this.NormalizedAngle(DegreesToRadian(360 * percent / 100))
		const startAngleSign = Math.sign(startAngle)
		startAngle = DegreesToRadian(startAngle)
		if (startAngleSign < 0)
			startAngle -= angle
		startAngle = this.NormalizedAngle(startAngle)

		const center = vecSize.DivideScalar(2)
		this.PathMoveTo(center)
		const PI4 = Math.PI / 4
		const startAngleModPI4 = startAngle % PI4
		if (startAngleModPI4 !== 0) {
			this.PathLineTo(this.PointOnBounds(startAngle, vecSize))
			const diff = PI4 - startAngleModPI4
			startAngle += diff
			angle -= Math.min(diff, angle)
		}
		for (let a = 0; a < angle; a += PI4)
			this.PathLineTo(this.PointOnBounds(startAngle + a, vecSize))
		this.PathLineTo(this.PointOnBounds(startAngle + angle, vecSize))
		this.Path(vecPos, 1, color)
		this.PathReset()
	}
	public Arc(
		baseAngle: number,
		percent: number,
		vecPos: Vector2,
		vecSize: Vector2,
		fill = false,
		width = 5,
		color: RenderColor = Color.White,
	): void {
		if (Number.isNaN(baseAngle) || !Number.isFinite(baseAngle))
			baseAngle = 0
		if (Number.isNaN(percent) || !Number.isFinite(percent))
			percent = 100
		percent = Math.min(Math.max(percent / 100, 0), 1)
		this.SetColor(color)
		this.SetWidth(width)
		this.SetFillType(fill ? PaintType.STROKE_AND_FILL : PaintType.STROKE)

		const view = this.AllocateCommandSpace(6 * 4 + 1)
		let off = 0
		view.setUint8(off, CommandID.ARC)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
		view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
		view.setFloat32(off += 4, baseAngle, true)
		view.setFloat32(off += 4, 360 * percent * Math.sign(baseAngle), true)
		view.setUint8(off += 4, fill ? 1 : 0)
		this.SetFillType(PaintType.STROKE_AND_FILL)
		this.RestorePaint()
	}
	public AllocateCommandSpace_(bytes: number): DataView {
		return this.AllocateCommandSpace(bytes)
	}
	/**
	 * @param font_size Size | default: 14
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	private Text_(text: string, vecPos: Vector2, color: RenderColor, font_name: string, font_size: number, weight: number, width: number, italic: boolean, flags: FontFlags_t, scaleX: number, skewX: number): void {
		this.SetColor(color)

		const font_id = this.GetFont(font_name, weight, width, italic)
		const text_buf = StringToUTF8(text)
		const view = this.AllocateCommandSpace(7 * 4 + 2 + text_buf.byteLength)
		let off = 0
		view.setUint8(off, CommandID.TEXT)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setUint32(off += 4, font_id, true)
		view.setFloat32(off += 4, font_size, true)
		view.setFloat32(off += 4, scaleX, true)
		view.setFloat32(off += 4, skewX, true)
		view.setUint16(off += 4, flags, true)
		view.setUint32(off += 2, text_buf.byteLength, true)
		new Uint8Array(view.buffer, view.byteOffset + (off += 4)).set(text_buf)
		this.RestorePaint()
	}
	private Oval(vecPos: Vector2, vecSize: Vector2): void {
		const view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.OVAL)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
		view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
	}
	private Rect(vecPos: Vector2, vecSize: Vector2): void {
		const view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.RECT)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecSize.x, true)
		view.setFloat32(off += 4, vecSize.y, true)
	}
	private MakeTexture(rgba: Uint8Array, size: Vector2): number {
		if (rgba.byteLength !== size.x * size.y * 4)
			throw "Invalid RGBA buffer or size"
		size.toIOBuffer()
		const texture_id = Renderer.CreateTexture(rgba)
		this.tex2size.set(texture_id, size)
		return texture_id
	}
	/*private FreeTexture(texture_id: number): void {
		Renderer.FreeTexture(texture_id)
	}*/
	private MakeTextureSVG(buf: Uint8Array): number {
		const texture_id = Renderer.CreateTextureSVG(buf)
		this.tex2size.set(texture_id, Vector2.fromIOBuffer())
		return texture_id
	}
	private GetTexture(path: string): number {
		if (this.texture_cache.has(path))
			return this.texture_cache.get(path)!
		const read = readFile(path, 2) // 1 for ourselves, 1 for caller [Image]
		if (read === undefined) {
			// 1 white pixel for any rendering API to be happy
			const texture_id = this.MakeTexture(
				new Uint8Array(new Array(4).fill(0xFF)),
				new Vector2(1, 1),
			)
			this.texture_cache.set(path, texture_id)
			return texture_id
		} else {
			const texture_id = path.endsWith(".svg")
				? this.MakeTextureSVG(new Uint8Array(read))
				: this.MakeTexture(...WASM.ParseImage(new Uint8Array(read)))
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

	private AllocateCommandSpace(bytes: number): DataView {
		bytes += 1 // msgid
		const current_len = this.commandCacheSize
		if (current_len + bytes > this.commandCache.byteLength) {
			const grow_factor = 2
			const buf = new Uint8Array(Math.max(this.commandCache.byteLength * grow_factor, current_len + bytes))
			buf.set(this.commandCache, 0)
			this.commandCache = buf
		}
		this.commandCacheSize += bytes
		return new DataView(this.commandCache.buffer, current_len)
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
		if (this.last_color.Equals(color))
			return
		this.last_color.CopyFrom(color)
		const view = this.AllocateCommandSpace(4)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_COLOR)
		view.setUint8(off += 1, Math.min(color.r, 255))
		view.setUint8(off += 1, Math.min(color.g, 255))
		view.setUint8(off += 1, Math.min(color.b, 255))
		view.setUint8(off += 1, Math.min(color.a, 255))
	}
	private SetFillType(fillType: PaintType): void {
		if (this.last_fill_type === fillType)
			return
		this.last_fill_type = fillType
		const view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_STYLE)
		view.setUint8(off += 1, fillType)
	}
	private SetWidth(width: number): void {
		if (this.last_width === width)
			return
		this.last_width = width
		const view = this.AllocateCommandSpace(4)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_STROKE_WIDTH)
		view.setFloat32(off += 1, width, true)
	}
	private SetMatrixColorFilter(mat: Matrix): void {
		const view = this.AllocateCommandSpace(1 + 20 * 4)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_COLOR_FILTER)
		view.setUint8(off += 1, ColorFilterType.MATRIX)
		off += 1
		off -= 4
		for (let i = 0; i < 20; i++)
			view.setFloat32(off += 4, mat[i] ?? 0, true)
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
		const view = this.AllocateCommandSpace(6)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_COLOR_FILTER)
		view.setUint8(off += 1, ColorFilterType.BLEND)
		view.setUint8(off += 1, Math.min(color.r, 255))
		view.setUint8(off += 1, Math.min(color.g, 255))
		view.setUint8(off += 1, Math.min(color.b, 255))
		view.setUint8(off += 1, Math.min(color.a, 255))
		view.setUint8(off += 1, blendMode)
	}
	private ClearColorFilter(): void {
		const view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_COLOR_FILTER)
		view.setUint8(off += 1, ColorFilterType.NONE)
	}
	private ClearShader(): void {
		const view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_SHADER)
		view.setUint8(off += 1, ShaderType.NONE)
	}
	private RestorePaint(): void {
		this.SetWidth(0)
		this.ClearColorFilter()
		this.ClearShader()
	}
	private SetClipOval(vecPos: Vector2, vecSize: Vector2): void {
		{
			const view = this.AllocateCommandSpace(4 * 4)
			let off = 0
			view.setUint8(off, CommandID.PATH_ADD_OVAL)
			view.setFloat32(off += 1, vecPos.x, true)
			view.setFloat32(off += 4, vecPos.y, true)
			view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
			view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
		}
		{
			const view = this.AllocateCommandSpace(2)
			let off = 0
			view.setUint8(off, CommandID.CLIP_PATH)
			view.setUint8(off += 1, 1) // do_antialias
			view.setUint8(off += 1, 0) // diff_op
		}
		this.PathReset()
	}
	/*private SetClipRect(vecPos: Vector2, vecSize: Vector2): void {
		{
			const view = this.AllocateCommandSpace(4 * 4)
			let off = 0
			view.setUint8(off, CommandID.PATH_ADD_RECT)
			view.setFloat32(off += 1, vecPos.x, true)
			view.setFloat32(off += 4, vecPos.y, true)
			view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
			view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
		}
		{
			const view = this.AllocateCommandSpace(2)
			let off = 0
			view.setUint8(off, CommandID.CLIP_PATH)
			view.setUint8(off += 1, 1) // do_antialias
			view.setUint8(off += 1, 0) // diff_op
		}
		this.PathReset()
	}*/
	private SaveState(): void {
		const view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.SAVE_STATE)
	}
	private RestoreState(): void {
		const view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.RESTORE_STATE)
	}
	private PathReset(): void {
		const view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.PATH_RESET)
	}
	/*private PathClose(): void {
		const view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.PATH_CLOSE)
	}*/
	private PathMoveTo(vec: Vector2): void {
		const view = this.AllocateCommandSpace(2 * 4)
		let off = 0
		view.setUint8(off, CommandID.PATH_MOVE_TO)
		view.setFloat32(off += 1, vec.x, true)
		view.setFloat32(off += 4, vec.y, true)
	}
	private PathLineTo(vec: Vector2): void {
		const view = this.AllocateCommandSpace(2 * 4)
		let off = 0
		view.setUint8(off, CommandID.PATH_LINE_TO)
		view.setFloat32(off += 1, vec.x, true)
		view.setFloat32(off += 4, vec.y, true)
	}
	/*private PathSetStyle(style: PathFillType): void {
		const view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PATH_SET_FILL_TYPE)
		view.setUint8(off += 1, style)
	}*/
	private Path(vecPos: Vector2, width = 5, color: RenderColor = Color.White): void {
		this.SetColor(color)
		this.SetWidth(width)
		{
			const view = this.AllocateCommandSpace(2 * 4)
			let off = 0
			view.setUint8(off, CommandID.PATH_OFFSET)
			view.setFloat32(off += 1, vecPos.x, true)
			view.setFloat32(off += 4, vecPos.y, true)
		}
		{
			const view = this.AllocateCommandSpace(0)
			view.setUint8(0, CommandID.PATH)
		}
		this.RestorePaint()
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

let last_loaded_map_name = "<empty>"
function StaticInit() {
	let map_name = GetLevelNameShort()
	if (map_name === "start")
		map_name = "dota"
	{
		const buf = fread(`maps/${map_name}.vhcg`)
		if (buf !== undefined) {
			WASM.ParseVHCG(new Uint8Array(buf))
			GameState.MapName = last_loaded_map_name = map_name
		}
	}
	{
		const buf = fread(`maps/${map_name}.gnv`)
		if (buf !== undefined) {
			ParseGNV(buf)
			GameState.MapName = last_loaded_map_name = map_name
		}
	}
	LoadTreeMapByName(map_name)
}
let initialized = false
Events.on("NewConnection", () => {
	if (!initialized) {
		StaticInit()
		initialized = true
	}
})

Events.on("PostAddSearchPath", path => {
	const map_name = ParseMapName(path)
	if (map_name === undefined)
		return

	{
		const buf = fread(`maps/${map_name}.vhcg`)
		if (buf !== undefined) {
			WASM.ParseVHCG(new Uint8Array(buf))
			GameState.MapName = last_loaded_map_name = map_name
		}
	}
	{
		const buf = fread(`maps/${map_name}.gnv`)
		if (buf !== undefined) {
			ParseGNV(buf)
			GameState.MapName = last_loaded_map_name = map_name
		}
	}
	LoadTreeMapByName(map_name)
})

Events.on("PostRemoveSearchPath", path => {
	const map_name = ParseMapName(path)
	if (map_name === undefined || last_loaded_map_name !== map_name)
		return

	WASM.ResetVHCG()
	ResetGNV()
	last_loaded_map_name = "<empty>"
})

Events.on("Draw", () => {
	Renderer.GetWindowSize()
	Vector2.fromIOBuffer().CopyTo(RendererSDK.WindowSize)
	EventsSDK.emit("Draw")
})

export default RendererSDK
