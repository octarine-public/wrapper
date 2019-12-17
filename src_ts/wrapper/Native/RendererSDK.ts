import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { QAngle } from "../Imports"
import { default as Input } from "../Managers/InputManager"
import * as WASM from "./WASM"
import Events from "../Managers/Events"
import { FontFlags_t } from "../Enums/FontFlags_t"

let WindowSize = new Vector2().Invalidate()

enum CommandID {
	SET_COLOR = 0,
	FILLED_CIRCLE,
	OUTLINED_CIRCLE,
	LINE,
	FILLED_RECT,
	OUTLINED_RECT,
	TEXTURE_DATA,
	IMAGE,
	TEXT,
}
let RendererSDK_ = new (class RendererSDK {
	private static StringToUTF16(str): Uint8Array {
		let buf = new Uint16Array(str.length)
		for (let i = str.length; i--;)
			buf[i] = str.charCodeAt(i)
		return new Uint8Array(buf.buffer)
	}
	/**
	 * Default Size of Text = Size 18 x Weight 200
	 * @param font Size as X | default: 18
	 * @param font Weight as Y | default: 200
	 */
	public readonly DefaultTextSize: Vector2 = new Vector2(18, 200)
	/**
	 * Default Size of Shape = Weight 5 x Height 5
	 * @param vecSize Weight as X
	 * @param vecSize Height as Y
	 */
	public readonly DefaultShapeSize: Vector2 = new Vector2(5, 5)

	public AlternateW2S = false

	private commandCache = new Uint8Array()
	private commandCacheSize = 0
	private font_cache = new Map</* name */string, Map</* size */number, Map</* weight */number, Map</* flags */number, /* font_id */number>>>>()
	private texture_cache = new Map</* path */string, number>()
	private tex2size = new Map</* texture_id */number, Vector2>()
	private last_color = new Color(-1, -1, -1, -1)
	/**
	 * Cached. Updating every 5 sec
	 */
	public get WindowSize(): Vector2 {
		if (!WindowSize.IsValid)
			Vector2.fromIOBuffer(Renderer.WindowSize).CopyTo(WindowSize)
		return WindowSize.Clone()
	}
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or undefined
	 */
	public WorldToScreen(position: Vector2 | Vector3): Vector2 {
		if (this.AlternateW2S) {
			let vec = WASM.WorldToScreenCached(position)
			if (vec !== undefined)
				vec.MultiplyForThis(this.WindowSize)
			return vec
		} else {
			position.toIOBuffer()
			if (position instanceof Vector2)
				IOBuffer[2] = this.GetPositionHeight(position)
			return Vector2.fromIOBuffer(Renderer.WorldToScreen())
		}
	}
	/**
	 * @returns screen position with x and y in range {0, 1}, or undefined
	 */
	public WorldToScreenCustom(position: Vector2 | Vector3, camera_position: Vector2 | Vector3, camera_distance = 1134, camera_angles = new QAngle(60, 90, 0), window_size = this.WindowSize): Vector2 {
		return WASM.WorldToScreen(position, camera_position, camera_distance, camera_angles, window_size)
	}
	/**
	 * @param screen screen position
	 */
	public ScreenToWorld(screen: Vector2): Vector3 {
		let vec = screen.Divide(this.WindowSize).MultiplyScalarForThis(2)
		vec.x = vec.x - 1
		vec.y = 1 - vec.y
		return WASM.ScreenToWorldCached(vec)
	}
	/**
	 * @param screen screen position with x and y in range {0, 1}
	 */
	public ScreenToWorldCustom(screen: Vector2, camera_position: Vector2 | Vector3, camera_distance = 1134, camera_angles = new QAngle(60, 90, 0), window_size = this.WindowSize): Vector3 {
		return WASM.ScreenToWorld(screen, camera_position, camera_distance, camera_angles, window_size)
	}
	public FilledCircle(vecPos: Vector2 = new Vector2(), radius: number, color = new Color(255, 255, 255)): void {
		let vecSize = new Vector2(radius, radius).MultiplyScalarForThis(2)
		if (!(vecPos.x > 0 && vecPos.y > 0 && vecPos.x <= this.WindowSize.x && vecPos.y <= this.WindowSize.y)) {
			let vec = vecPos.Add(vecSize)
			if (!(vec.x > 0 && vec.y > 0))
				return
		}
		vecSize = vecSize.Add(vecPos).Max(0).Min(this.WindowSize).SubtractForThis(vecPos)
		if (vecSize.x <= 0 || vecSize.y <= 0)
			return
		this.SetColor(color)

		let view = this.AllocateCommandSpace(3 * 4)
		let off = 0
		view.setUint8(off, CommandID.FILLED_CIRCLE)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, radius, true)
	}
	/**
	 *
	 */
	public OutlinedCircle(vecPos: Vector2 = new Vector2(), radius: number, color = new Color(255, 255, 255)): void {
		let vecSize = new Vector2(radius, radius).MultiplyScalarForThis(2)
		if (!(vecPos.x > 0 && vecPos.y > 0 && vecPos.x <= this.WindowSize.x && vecPos.y <= this.WindowSize.y)) {
			let vec = vecPos.Add(vecSize)
			if (!(vec.x > 0 && vec.y > 0))
				return
		}
		vecSize = vecSize.Add(vecPos).Max(0).Min(this.WindowSize).SubtractForThis(vecPos)
		if (vecSize.x <= 0 || vecSize.y <= 0)
			return
		this.SetColor(color)

		let view = this.AllocateCommandSpace(3 * 4)
		let off = 0
		view.setUint8(off, CommandID.OUTLINED_CIRCLE)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setFloat32(off += 4, radius, true)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public Line(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		if (!(vecPos.x > 0 && vecPos.y > 0 && vecPos.x <= this.WindowSize.x && vecPos.y <= this.WindowSize.y)) {
			let vec = vecPos.Add(vecSize)
			if (!(vec.x > 0 && vec.y > 0))
				return
		}
		vecSize = vecSize.Add(vecPos).Max(0).Min(this.WindowSize).SubtractForThis(vecPos)
		if (vecSize.x <= 0 || vecSize.y <= 0)
			return
		this.SetColor(color)

		let view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.LINE)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, vecSize.x, true)
		view.setInt32(off += 4, vecSize.y, true)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public FilledRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		if (!(vecPos.x > 0 && vecPos.y > 0 && vecPos.x <= this.WindowSize.x && vecPos.y <= this.WindowSize.y)) {
			let vec = vecPos.Add(vecSize)
			if (!(vec.x > 0 && vec.y > 0))
				return
		}
		vecSize = vecSize.Add(vecPos).Max(0).Min(this.WindowSize).SubtractForThis(vecPos)
		if (vecSize.x <= 0 || vecSize.y <= 0)
			return
		this.SetColor(color)

		let view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.FILLED_RECT)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, vecPos.x + vecSize.x, true)
		view.setInt32(off += 4, vecPos.y + vecSize.y, true)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	public OutlinedRect(vecPos: Vector2 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		if (!(vecPos.x > 0 && vecPos.y > 0 && vecPos.x <= this.WindowSize.x && vecPos.y <= this.WindowSize.y)) {
			let vec = vecPos.Add(vecSize)
			if (!(vec.x > 0 && vec.y > 0))
				return
		}
		vecSize = vecSize.Add(vecPos).Max(0).Min(this.WindowSize).SubtractForThis(vecPos)
		if (vecSize.x <= 0 || vecSize.y <= 0)
			return
		this.SetColor(color)

		let view = this.AllocateCommandSpace(4 * 4)
		let off = 0
		view.setUint8(off, CommandID.OUTLINED_RECT)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, vecPos.x + vecSize.x, true)
		view.setInt32(off += 4, vecPos.y + vecSize.y, true)
	}
	/**
	 * @param path start it with "~/" (without double-quotes) to load image from "%loader_path%/scripts_files/path"
	 * @param path also must end with "_c" (without double-quotes), if that's vtex_c
	 */
	public Image(path: string, vecPos: Vector2 | Vector3 = new Vector2(), vecSize = new Vector2(-1, -1), color = new Color(255, 255, 255)): void {
		this.SetColor(color)

		let texture_id = this.GetTexture(path) // better put it BEFORE new command
		if (vecSize.x <= 0 || vecSize.y <= 0) {
			let size = this.tex2size.get(texture_id)
			if (vecSize.x <= 0)
				vecSize.x = size.x
			if (vecSize.y <= 0)
				vecSize.y = size.y
		}
		let view = this.AllocateCommandSpace(5 * 4)
		let off = 0
		view.setUint8(off, CommandID.IMAGE)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, vecSize.x, true)
		view.setInt32(off += 4, vecSize.y, true)
		view.setInt32(off += 4, texture_id, true)
	}
	/**
	 * @param font Size as X from Vector2 | default: 14
	 * @param font Weight as Y from Vector2 | default: 200
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	public Text(text: string, vecPos: Vector2 | Vector3 = new Vector2(), color = new Color(255, 255, 255), font_name = "Calibri", font: Vector2 | number = this.DefaultTextSize, flags = FontFlags_t.OUTLINE): void {
		this.SetColor(color)

		if (!(font instanceof Vector2))
			font = new Vector2(font, this.DefaultTextSize.y)
		let font_id = this.GetFont(font_name, font, flags)
		let text_buf = RendererSDK.StringToUTF16(text)
		let view = this.AllocateCommandSpace(4 * 4 + text_buf.byteLength)
		let off = 0
		view.setUint8(off, CommandID.TEXT)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, font_id, true)
		view.setInt32(off += 4, text.length, true)
		new Uint8Array(view.buffer, view.byteOffset + (off += 4)).set(text_buf)
	}
	public GetTextSize(text: string, font_name = "Calibri", font: Vector2 | number = this.DefaultTextSize, flags = FontFlags_t.OUTLINE): Vector2 {
		if (!(font instanceof Vector2))
			font = new Vector2(font, this.DefaultTextSize.y)
		return Vector2.fromIOBuffer(Renderer.GetTextSize(text, this.GetFont(font_name, font, flags)))
	}
	/**
	 * @param color default: Yellow
	 * @param font_name default: "Calibri"
	 * @param font_size default: 30
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	public TextAroundMouse(text: string, vec?: Vector2 | Vector3 | false, color = Color.Yellow, font_name = "Calibri", font = new Vector2(30), flags = FontFlags_t.ANTIALIAS): void {
		let vecMouse = Input.CursorOnScreen.AddScalarX(30).AddScalarY(15)

		if (vec !== undefined && vec !== false)
			vecMouse = vecMouse.Add(vec as Vector2)

		this.Text(text, vecMouse, color, font_name, font, flags)
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
	public GetPositionHeight(position: Vector2) {
		position.toIOBuffer()
		return Renderer.GetPositionHeight()
	}

	public EmitDraw() {
		if (this.commandCacheSize === 0)
			return
		Renderer.ExecuteCommandBuffer(this.commandCache.slice(0, this.commandCacheSize))
		if (this.commandCacheSize < this.commandCache.byteLength / 3)
			this.commandCache = new Uint8Array()
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
	private SetTextureData(texture_id: number, rgba: Uint8Array, size: Vector2) {
		if (rgba.byteLength !== size.x * size.y * 4)
			throw "Invalid RGBA buffer or size"
		let view = this.AllocateCommandSpace(3 * 4 + rgba.byteLength)
		let off = 0
		view.setUint8(off, CommandID.TEXTURE_DATA)
		view.setInt32(off += 1, texture_id, true)
		view.setInt32(off += 4, size.x, true)
		view.setInt32(off += 4, size.y, true)
		new Uint8Array(view.buffer, view.byteOffset + (off += 4)).set(rgba)
	}
	private GetTexture(path: string): number {
		let texture_id = this.texture_cache.get(path)
		if (texture_id === undefined) {
			texture_id = Renderer.CreateTextureID()
			let [parsed, size] = WASM.ParseImage(readFile(path))
			this.tex2size.set(texture_id, size)
			this.SetTextureData(texture_id, parsed, size)
			this.texture_cache.set(path, texture_id)
		}
		return texture_id
	}
	private GetFont(font_name: string, font: Vector2, flags: number): number {
		let font_name_map = this.font_cache.get(font_name)
		if (font_name_map === undefined) {
			font_name_map = new Map()
			let size_map = new Map</* weight */number, Map</* flags */number, /* font_id */number>>()
			let weight_map = new Map</* flags */number, /* font_id */number>()
			let font_id = Renderer.CreateFontID()
			Renderer.EditFont(font_id, font_name, font.x, font.y, flags)
			weight_map.set(flags, font_id)
			size_map.set(font.y, weight_map)
			font_name_map.set(font.x, size_map)
			this.font_cache.set(font_name, font_name_map)
			return font_id
		}
		let size_map = font_name_map.get(font.x)
		if (size_map === undefined) {
			size_map = new Map()
			let weight_map = new Map</* flags */number, /* font_id */number>()
			let font_id = Renderer.CreateFontID()
			Renderer.EditFont(font_id, font_name, font.x, font.y, flags)
			weight_map.set(flags, font_id)
			size_map.set(font.y, weight_map)
			font_name_map.set(font.x, size_map)
			return font_id
		}
		let weight_map = size_map.get(font.y)
		if (weight_map === undefined) {
			weight_map = new Map()
			let font_id = Renderer.CreateFontID()
			Renderer.EditFont(font_id, font_name, font.x, font.y, flags)
			weight_map.set(flags, font_id)
			size_map.set(font.y, weight_map)
			return font_id
		}
		let font_id = weight_map.get(flags)
		if (font_id === undefined) {
			let font_id = Renderer.CreateFontID()
			Renderer.EditFont(font_id, font_name, font.x, font.y, flags)
			weight_map.set(flags, font_id)
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
		view.setUint8(off, CommandID.SET_COLOR)
		view.setUint8(off += 1, Math.min(color.r, 255))
		view.setUint8(off += 1, Math.min(color.g, 255))
		view.setUint8(off += 1, Math.min(color.b, 255))
		view.setUint8(off += 1, Math.min(color.a, 255))
	}
})()

Events.after("Draw", () => WindowSize = Vector2.fromIOBuffer(Renderer.WindowSize))

export default globalThis.RendererSDK = RendererSDK_
