import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import EventsSDK from "../Managers/Events"

let WindowSize = new Vector2()

class RendererSDK {
	/**
	 * Default Size of Text = Size 18 x Weight 200
	 * @param font Size as X | default: 18
	 * @param font Weight as Y | default: 200
	 */
	get DefaultTextSize(): Vector2 {
		return new Vector2(18, 200)
	}
	/**
	 * Default Size of Shape = Weight 5 x Height 5
	 * @param vecSize Weight as X
	 * @param vecSize Height as Y
	 */
	get DefaultShapeSize(): Vector2 {
		return new Vector2(5, 5)
	}
	/**
	 * Cached. Updating every 5 sec
	 */
	get WindowSize(): Vector2 {
		return Vector2.CopyFrom(WindowSize)
	}
	get CursorOnScreen(): Vector2 {
		return Vector2.fromIOBuffer(Renderer.CursorPos)
	}
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or invalid Vector2 (WorldToScreen(...).IsValid === false)
	 */
	WorldToScreen(position: Vector2 | Vector3): Vector2 {
		position.toIOBuffer()
		return Vector2.fromIOBuffer(Renderer.WorldToScreen())
	}
	/**
	 *
	 */
	FilledCircle(vec: Vector2 | Vector3 = new Vector2(), radius: number, color = new Color(255, 255, 255)): void {
		Renderer.FilledCircle(vec.x, vec.y, radius, color.r, color.g, color.b, color.a)
	}
	/**
	 *
	 */
	OutlinedCircle(vec: Vector2 | Vector3 = new Vector2(), radius: number, color = new Color(255, 255, 255)): void {
		Renderer.OutlinedCircle(vec.x, vec.y, radius, color.r, color.g, color.b, color.a)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	Line(vecPos: Vector2 | Vector3 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		Renderer.Line(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	FilledRect(vecPos: Vector2 | Vector3 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		Renderer.FilledRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	OutlinedRect(vecPos: Vector2 | Vector3 = new Vector2(), vecSize = this.DefaultShapeSize, color = new Color(255, 255, 255)): void {
		Renderer.OutlinedRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a)
	}
	/**
	 * @param path start it with "~/" (without double-quotes) to load image from "%loader_path%/scripts_files/path"
	 * @param path also must end with "_c" (without double-quotes), if that's vtex_c
	 */
	Image(path: string, vecPos: Vector2 | Vector3 = new Vector2(), vecSize = new Vector2(-1, -1), color = new Color(255, 255, 255)): void {
		Renderer.Image(path, vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a)
	}
	/**
	 * @param font Size as X from Vector2 | default: 14
	 * @param font Weight as Y from Vector2 | default: 200
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	Text(text: string, vec: Vector2 | Vector3 = new Vector2(), color = new Color(255, 255, 255), font_name = "Calibri", font: Vector2 | number = this.DefaultTextSize, flags = FontFlags_t.OUTLINE): void {
		if (font instanceof Vector2)
			Renderer.Text(vec.x, vec.y, text, color.r, color.g, color.b, color.a, font_name, font.x, font.y, flags)
		else
			Renderer.Text(vec.x, vec.y, text, color.r, color.g, color.b, color.a, font_name, font, this.DefaultTextSize.y, flags)
	}
	/**
	 * @param color default: Yellow
	 * @param font_name default: "Calibri"
	 * @param font_size default: 30
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	TextAroundMouse(text: string, vec?: Vector2 | Vector3 | false, color = Color.Yellow, font_name = "Calibri", font = new Vector2(30), flags = FontFlags_t.ANTIALIAS): void {
		let vecMouse = this.CursorOnScreen.AddScalarX(30).AddScalarY(15)

		if (vec !== undefined && vec !== false)
			vecMouse = vecMouse.Add(vec as Vector2)

		this.Text(text, vecMouse, color, font_name, font, flags)
	}
	DrawMiniMapIcon(name: string, worldPos: Vector3, size: number = 800, color: Color = new Color(255, 255, 255)) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawIcon(name, size, 1, 0x80000000)
	}
}

export default global.RendererSDK = new RendererSDK()

EventsSDK.on("Update", () => WindowSize = Vector2.fromIOBuffer(Renderer.WindowSize))
