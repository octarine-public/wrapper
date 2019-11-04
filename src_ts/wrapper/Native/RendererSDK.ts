import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { default as Input } from "../Managers/InputManager"
import { QAngle } from "../Imports"
import * as WASM from "./WASM"

let WindowSize = new Vector2().Invalidate()

enum CommandID {
	SET_COLOR = 0,
	FILLED_CIRCLE,
	OUTLINED_CIRCLE,
	LINE,
	FILLED_RECT,
	OUTLINED_RECT,
	IMAGE,
	TEXT,
}
let RendererSDK = new (class RendererSDK {
	private commandCache = new Uint8Array()
	private last_color = new Color(-1, -1, -1, -1)

	private AllocateCommandSpace(bytes: number): DataView {
		let current_len = this.commandCache.byteLength
		let buf = new Uint8Array(current_len + 1 + bytes)
		buf.set(this.commandCache, 0)
		return new DataView((this.commandCache = buf).buffer, current_len)
	}
	private SetColor(color: Color): void {
		if (this.last_color.Equals(color))
			return
		this.last_color = color
		let view = this.AllocateCommandSpace(4)
		let off = 0
		view.setUint8(off, CommandID.SET_COLOR)
		view.setUint8(off += 1, Math.min(color.r, 255))
		view.setUint8(off += 1, Math.min(color.g, 255))
		view.setUint8(off += 1, Math.min(color.b, 255))
		view.setUint8(off += 1, Math.min(color.a, 255))
	}
	private static StringToUTF8(str): Uint8Array {
		let buf = new Uint8Array(str.length)
		for (let i = str.length; i--;)
			buf[i] = str.charCodeAt(i)
		return buf
	}
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
		let vec = WASM.WorldToScreenCached(position)
		if (vec !== undefined)
			vec.MultiplyForThis(this.WindowSize)
		return vec
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
	/**
	 *
	 */
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

		let path_buf = RendererSDK.StringToUTF8(path)
		let view = this.AllocateCommandSpace(5 * 4 + path_buf.byteLength)
		let off = 0
		view.setUint8(off, CommandID.IMAGE)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, vecSize.x, true)
		view.setInt32(off += 4, vecSize.y, true)
		view.setInt32(off += 4, path_buf.byteLength, true)
		new Uint8Array(view.buffer, view.byteOffset + (off += 4)).set(path_buf)
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
		let text_buf = RendererSDK.StringToUTF16(text)
		let font_name_buf = RendererSDK.StringToUTF8(font_name)
		let view = this.AllocateCommandSpace(5 * 4 + 2 * 2 + text_buf.byteLength + font_name_buf.byteLength)
		let off = 0
		view.setUint8(off, CommandID.TEXT)
		view.setInt32(off += 1, vecPos.x, true)
		view.setInt32(off += 4, vecPos.y, true)
		view.setInt32(off += 4, flags, true)
		view.setInt16(off += 4, font.x, true)
		view.setInt16(off += 2, font.y, true)
		view.setInt32(off += 2, text.length, true)
		view.setInt32(off += 4, font_name_buf.byteLength, true)
		new Uint8Array(view.buffer, view.byteOffset + (off += 4)).set(text_buf)
		new Uint8Array(view.buffer, view.byteOffset + (off += text_buf.byteLength)).set(font_name_buf)
	}
	public GetTextSize(text: string, font_name = "Calibri", font: Vector2 | number = this.DefaultTextSize, flags = FontFlags_t.OUTLINE): Vector2 {
		if (!(font instanceof Vector2))
			font = new Vector2(font, this.DefaultTextSize.y)
		return Vector2.fromIOBuffer(Renderer.GetTextSize(text, font_name, font.x, font.y, flags))
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
	public DrawMiniMapIcon(name: string, worldPos: Vector3, size: number = 800, color: Color = new Color(255, 255, 255), end_time: number = 1) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawIcon(name, size, end_time, 0x80000000)
	}
	public GetPositionHeight(position: Vector2) {
		position.toIOBuffer()
		return Renderer.GetPositionHeight()
	}

	public EmitDraw() {
		if (this.commandCache.byteLength === 0)
			return
		Renderer.ExecuteCommandBuffer(this.commandCache.buffer)
		this.commandCache = new Uint8Array()
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
})()

Events.after("Draw", () => WindowSize = Vector2.fromIOBuffer(Renderer.WindowSize))

export default global.RendererSDK = RendererSDK
