import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import QAngle from "../Base/QAngle"
import { default as Input } from "../Managers/InputManager"
import * as WASM from "./WASM"
import { FontFlags_t } from "../Enums/FontFlags_t"
import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import { ParseMapName } from "../Utils/Utils"
import readFile from "../Utils/readFile"
import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import GameState from "../Utils/GameState"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import Entity from "../Objects/Base/Entity"
import Manifest from "../Managers/Manifest"

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
	PAINT_SET_FILTER_QUALITY,
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
	STROKE_AND_FILL
}

class CRendererSDK {
	/**
	 * Default Size of Text = Size 18
	 * @param font Size as X | default: 18
	 */
	public readonly DefaultTextSize = 18
	/**
	 * Default Size of Shape = Weight 5 x Height 5
	 * @param vecSize Weight as X
	 * @param vecSize Height as Y
	 */
	public readonly DefaultShapeSize: Vector2 = new Vector2(5, 5)

	public WindowSize_ = new Vector2()
	public HeightMap: Nullable<WASM.HeightMap>

	private commandCache = new Uint8Array()
	private commandCacheSize = 0
	private font_cache = new Map</* name */string, Map</* weight */number, Map</* width */number, Map</* italic */boolean, /* font_id */number>>>>()
	private texture_cache = new Map</* path */string, number>()
	private tex2size = new Map</* texture_id */number, Vector2>()
	private last_color = new Color(-1, -1, -1, -1)
	private last_fill_type = PaintType.FILL
	private last_color_filter_type = ColorFilterType.NONE
	private last_color_filter_color = new Color(-1, -1, -1, -1)

	/**
	 * Cached. Updating every 5 sec
	 */
	public get WindowSize(): Vector2 {
		return this.WindowSize_.Clone()
	}

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
		value3 = 0
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
			value3
		)
	}

	public EmitStartSoundEvent(
		name: string,
		position = new Vector3(),
		source_entity?: Entity,
		seed = ((Math.random() * (2 ** 32 - 1)) | 0)
	): void {
		position.toIOBuffer()
		EmitStartSoundEvent(Manifest.SoundNameToHash(name), source_entity?.Index ?? 0, seed)
	}
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(position: Vector2 | Vector3): Nullable<Vector2> {
		position.toIOBuffer()
		if (position instanceof Vector2)
			IOBuffer[2] = this.GetPositionHeight(position)
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
			position = position.toVector3().SetZ(this.GetPositionHeight(position))
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.WorldToScreen(position, camera_position, camera_distance, camera_angles, window_size)
	}
	/**
	 * Projects given screen vector onto camera matrix. Can be used to connect ScreenToWorldFar and camera position dots.
	 * @param screen screen position
	 */
	public ScreenToWorld(screen: Vector2): Vector3 {
		let vec = screen.Divide(this.WindowSize).MultiplyScalarForThis(2)
		vec.x = vec.x - 1
		vec.y = 1 - vec.y
		return WASM.ScreenToWorld(vec, Vector3.fromIOBuffer(Camera.Position)!, Camera.Distance ?? 1200, QAngle.fromIOBuffer(Camera.Angles)!, this.WindowSize)
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
		if (this.HeightMap === undefined)
			return new Vector3().Invalidate()
		if (camera_position instanceof Vector2)
			camera_position = WASM.GetCameraPosition(camera_position, camera_distance, camera_angles)
		return WASM.ScreenToWorldFar(screen, window_size, camera_position, camera_distance, camera_angles)
	}
	public FilledCircle(vecPos: Vector2, vecSize: Vector2, color = new Color(255, 255, 255)): void {
		this.SetColor(color)
		this.Oval(vecPos, vecSize)
	}
	/**
	 *
	 */
	public OutlinedCircle(vecPos: Vector2, vecSize: Vector2, color = new Color(255, 255, 255)): void {
		this.SetColor(color)
		this.SetFillType(PaintType.STROKE)
		this.Oval(vecPos, vecSize)
		this.SetFillType(PaintType.STROKE_AND_FILL)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public Line(start: Vector2 = new Vector2(), end = start.Add(this.DefaultShapeSize), color = new Color(255, 255, 255)): void {
		this.SetColor(color)

		let view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.LINE)
		view.setInt32(off += 1, start.x, true)
		view.setInt32(off += 4, start.y, true)
		view.setInt32(off += 4, end.x, true)
		view.setInt32(off += 4, end.y, true)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public FilledRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		this.SetColor(color)
		this.Rect(vecPos, vecSize)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public OutlinedRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		this.SetColor(color)
		this.SetFillType(PaintType.STROKE)
		this.Rect(vecPos, vecSize)
		this.SetFillType(PaintType.STROKE_AND_FILL)
	}
	/**
	 * @param path must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public Image(path: string, vecPos: Vector2, round = -1, vecSize = new Vector2(-1, -1), color = new Color(255, 255, 255)): void {
		this.SetColor(new Color(255, 255, 255, color.a))
		this.SetColorFilter(new Color(color.r, color.g, color.b), BlendMode.Modulate)

		let texture_id = this.GetTexture(path) // better put it BEFORE new command
		if (vecSize.x <= 0 || vecSize.y <= 0) {
			let size = this.tex2size.get(texture_id)!
			if (vecSize.x <= 0)
				vecSize.x = size.x
			if (vecSize.y <= 0)
				vecSize.y = size.y
		}
		if (round >= 0) {
			this.SaveState()
			this.SetOvalClip(vecPos.AddScalar(round / 2), vecSize.SubtractScalar(round / 2))
		}

		let view = this.AllocateCommandSpace(5 * 4)
		let off = 0
		view.setUint8(off, CommandID.IMAGE)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecSize.x, true)
		view.setFloat32(off += 4, vecSize.y, true)
		view.setUint32(off += 4, texture_id, true)

		if (round >= 0)
			this.RestoreState()
		this.ClearColorFilter()
	}
	// TODO: use paths for this
	/*public Radial(
		baseAngle: number,
		percent: number,
		radialColor: Color,
		backgroundColor: Color,
		vecPos: Vector2,
		vecSize: Vector2,
		round = -1,
		color = new Color(255, 255, 255)
	): void {
		baseAngle = DegreesToRadian(baseAngle)
		const rgba = new Uint8Array(vecSize.x * vecSize.y * 4),
			maxAngle = 2 * Math.PI * percent / 100 - baseAngle
		for (let x = 0; x < vecSize.x; x++)
			for (let y = 0; y < vecSize.y; y++)
				this.DrawConditionalColorPixel(rgba, vecSize, x, y, radialColor, baseAngle, maxAngle, backgroundColor)
		this.TempImage(rgba, vecPos, vecSize, vecSize, round, color)
	}*/
	// TODO: use ARC and some other setup for this
	/**
	 * @param round distance in pixels to distant from end of vecSize
	 */
	/*public Arc(
		baseAngle: number,
		percent: number,
		radialColor: Color,
		backgroundColor: Color,
		vecPos: Vector2,
		vecSize: Vector2,
		round = 0,
		width = 5,
		color = new Color(255, 255, 255)
	): void {
		baseAngle = DegreesToRadian(baseAngle)
		const rgba = new Uint8Array(vecSize.x * vecSize.y * 4),
			maxAngle = 2 * Math.PI * percent / 100 - baseAngle
		const outer = vecSize.x / 2 - round,
			inner = (outer - width),
			center = ((outer + inner) / 2)
		const outer_sqr = Math.round(outer * outer) | 0,
			inner_sqr = Math.round(inner * inner) | 0,
			x_end = Math.ceil(vecSize.x / 2) | 0,
			y_end = Math.ceil(vecSize.y / 2) | 0
		for (let x = 0; x < x_end; x++) {
			const x_sqr = x * x
			for (let y = 0; y < y_end; y++) {
				const dist_sqr = x_sqr + (y * y)
				if (dist_sqr > outer_sqr || dist_sqr <= inner_sqr)
					continue
				this.DrawConditionalColorPixel4(
					rgba,
					vecSize,
					x,
					y,
					radialColor,
					baseAngle,
					maxAngle,
					backgroundColor,
					Math.min(1, 1.2 - Math.abs((Math.sqrt(dist_sqr) - center) / width))
				)
			}
		}
		this.TempImage(rgba, vecPos, vecSize, vecSize, -1, color)
	}*/
	/**
	 * @param font_size Size | default: 14
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	private Text_(text: string, vecPos: Vector2, color: Color, font_name: string, font_size: number, weight: number, width: number, italic: boolean, flags: FontFlags_t, scaleX: number, skewX: number): void {
		this.SetColor(color)

		let font_id = this.GetFont(font_name, weight, width, italic)
		let text_buf = StringToUTF8(text)
		let view = this.AllocateCommandSpace(7 * 4 + 2 + text_buf.byteLength)
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
	}
	public Text(text: string, vecPos = new Vector2(), color = new Color(255, 255, 255), font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): void {
		const pos = vecPos.Clone()
		text.split("\n").reverse().forEach(line => {
			this.Text_(line, pos, color, font_name, font_size, weight, width, italic, flags, scaleX, skewX)
			pos.SubtractScalarY(font_size)
		})
	}
	public GetTextSize(text: string, font_name = "Calibri", font_size = this.DefaultTextSize, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): Vector2 {
		const font = this.GetFont(font_name, weight, width, italic)
		let max_x = 0,
			y = 0
		text.split("\n").forEach(line => {
			IOBuffer[0] = font_size
			IOBuffer[1] = scaleX
			IOBuffer[2] = skewX
			Renderer.GetTextSize(line, font)
			max_x = Math.max(Math.ceil(IOBuffer[0]), max_x)
			y += Math.ceil(IOBuffer[1])
		})
		return new Vector2(max_x, y)
	}
	/**
	 * @param color default: Yellow
	 * @param font_name default: "Calibri"
	 * @param font_size default: 30
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	public TextAroundMouse(text: string, vec?: Vector2 | false, color = Color.Yellow, font_name = "Calibri", font_size = 30, weight = 400, width = 5, italic = false, flags = FontFlags_t.OUTLINE, scaleX = 1, skewX = 0): void {
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
	public DrawMiniMapIcon(name: string, worldPos: Vector3, size = 800, color = new Color(255, 255, 255), end_time = 1) {
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
	public DrawMiniMapPing(worldPos: Vector3, color = new Color(255, 255, 255), end_time = 1, key = Math.round(Math.random() * 1000)) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawPing(end_time, -key)
	}
	public GetPositionHeight(position: Vector2): number {
		return this.HeightMap !== undefined ? WASM.GetHeightForLocation(position) : 0
	}

	public EmitDraw() {
		if (this.commandCacheSize === 0)
			return
		Renderer.ExecuteCommandBuffer(this.commandCache.buffer, this.commandCacheSize)
		if (this.commandCacheSize < this.commandCache.byteLength / 3)
			this.commandCache = new Uint8Array(this.commandCache.byteLength / 3)
		this.commandCacheSize = 0
		this.last_color = new Color(-1, -1, -1, -1)
	}
	public GetAspectRatio() {
		let res = this.WindowSize.x / this.WindowSize.y
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
	private Oval(vecPos: Vector2, vecSize: Vector2): void {
		let view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.OVAL)
		view.setFloat32(off += 1, vecPos.x, true)
		view.setFloat32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
		view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
	}
	private Rect(vecPos: Vector2, vecSize: Vector2): void {
		let view = this.AllocateCommandSpace(4 * 4)
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
		let texture_id = Renderer.CreateTexture(rgba.buffer)
		this.tex2size.set(texture_id, size)
		return texture_id
	}
	/*private FreeTexture(texture_id: number): void {
		Renderer.FreeTexture(texture_id)
	}*/
	private GetTexture(path: string): number {
		if (this.texture_cache.has(path))
			return this.texture_cache.get(path)!
		let [parsed, size] = WASM.ParseImage(readFile(path))
		let texture_id = this.MakeTexture(parsed, size)
		this.texture_cache.set(path, texture_id)
		return texture_id
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
		let current_len = this.commandCacheSize
		if (current_len + bytes > this.commandCache.byteLength) {
			const grow_factor = 2
			let buf = new Uint8Array(Math.max(this.commandCache.byteLength * grow_factor, current_len + bytes))
			buf.set(this.commandCache, 0)
			this.commandCache = buf
		}
		this.commandCacheSize += bytes
		return new DataView(this.commandCache.buffer, current_len)
	}
	private SetColor(color: Color): void {
		if (this.last_color.Equals(color))
			return
		this.last_color = color.Clone()
		let view = this.AllocateCommandSpace(4)
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
		let view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_STYLE)
		view.setUint8(off += 1, fillType)
	}
	private SetColorFilter(color: Color, blendMode: BlendMode): void {
		if (this.last_color_filter_type === ColorFilterType.BLEND && this.last_color_filter_color.Equals(color))
			return
		this.last_color_filter_type = ColorFilterType.BLEND
		let view = this.AllocateCommandSpace(6)
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
		if (this.last_color_filter_type === ColorFilterType.NONE)
			return
		this.last_color_filter_type = ColorFilterType.NONE
		let view = this.AllocateCommandSpace(1)
		let off = 0
		view.setUint8(off, CommandID.PAINT_SET_COLOR_FILTER)
		view.setUint8(off += 1, ColorFilterType.NONE)
	}
	private SetOvalClip(vecPos: Vector2, vecSize: Vector2): void {
		{
			let view = this.AllocateCommandSpace(0)
			view.setUint8(0, CommandID.PATH_RESET)
		}
		{
			let view = this.AllocateCommandSpace(4 * 4)
			let off = 0
			view.setUint8(off, CommandID.PATH_ADD_OVAL)
			view.setFloat32(off += 1, vecPos.x, true)
			view.setFloat32(off += 4, vecPos.y, true)
			view.setFloat32(off += 4, vecPos.x + vecSize.x, true)
			view.setFloat32(off += 4, vecPos.y + vecSize.y, true)
		}
		{
			let view = this.AllocateCommandSpace(2)
			let off = 0
			view.setUint8(off, CommandID.CLIP_PATH)
			view.setUint8(off += 1, 1) // do_antialias
			view.setUint8(off += 1, 0) // diff_op
		}
	}
	private SaveState(): void {
		let view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.SAVE_STATE)
	}
	private RestoreState(): void {
		let view = this.AllocateCommandSpace(0)
		view.setUint8(0, CommandID.RESTORE_STATE)
	}
}
let RendererSDK = new CRendererSDK()

let last_loaded_map_name = "<empty>"
try {
	let map_name = GetLevelNameShort()
	if (map_name === "start")
		map_name = "dota"
	let buf = readFile(`maps/${map_name}.vhcg`)
	if (buf !== undefined) {
		RendererSDK.HeightMap = WASM.ParseVHCG(buf)
		GameState.MapName = last_loaded_map_name = map_name
	}
} catch (e) {
	console.log("Error in RendererSDK.HeightMap static init: " + e)
}

Events.on("PostAddSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined)
		return

	let buf = readFile(`maps/${map_name}.vhcg`)
	if (buf === undefined)
		return

	try {
		RendererSDK.HeightMap = WASM.ParseVHCG(buf)
		GameState.MapName = last_loaded_map_name = map_name
	} catch (e) {
		console.log("Error in RendererSDK.HeightMap dynamic init: " + e)
		RendererSDK.HeightMap = undefined
	}
})

Events.on("PostRemoveSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined || last_loaded_map_name !== map_name)
		return

	RendererSDK.HeightMap = undefined
	last_loaded_map_name = "<empty>"
})

Events.on("Draw", () => {
	Renderer.GetWindowSize()
	Vector2.fromIOBuffer()!.CopyTo(RendererSDK.WindowSize_)
	EventsSDK.emit("Draw")
})

export default RendererSDK
