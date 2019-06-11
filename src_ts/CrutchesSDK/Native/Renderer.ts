import Vector2 from "../Base/Vector2";
import Vector3 from "../Base/Vector3";
import Color from "../Base/Color";
import EventsSDK from "../Managers/Events";
import { Sleeper } from "../Helpers/Sleeper";

let sleeper = new Sleeper();

let CursorOnWorld = new Vector3(),
	CursorOnScreen = new Vector2(),
	WindowSize = new Vector2();

class RendererSDK {
	/**
	 * Default Size of Text = Size 18 x Weight 200
	 * @param font Size as X | default: 18
	 * @param font Weight as Y | default: 200
	 */
	get DefaultTextSize(): Vector2 {
		return new Vector2(18, 200);
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
	 * Cached. Updating every 10 sec
	 */
	get WindowSize(): Vector2 {
		return Vector2.CopyFrom(WindowSize);
	}
	get CursorOnWorld(): Vector3 {
		return Vector3.CopyFrom(CursorOnWorld);
	}
	get CursorOnScreen(): Vector2 {
		return Vector2.CopyFrom(CursorOnScreen);
	}
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or invalid Vector2 (WorldToScreen(...).IsValid === false)
	 */
	WorldToScreen(position: Vector3): Vector2 {
		position.toIOBuffer()
		return Vector2.fromIOBuffer(Renderer.WorldToScreen());
	}
	/**
	 * 
	 */
	FilledCircle(vec = new Vector2(), radius: number, color?: Color): void {
		
		if (color !== undefined)
			Renderer.FilledCircle(vec.x, vec.y, radius, color.r, color.g, color.b, color.a)
		else
			Renderer.FilledCircle(vec.x, vec.y, radius)
	}
	/**
	 * 
	 */
	OutlinedCircle(vec = new Vector2(), radius: number, color?: Color): void {
		
		if (color !== undefined)
			Renderer.OutlinedCircle(vec.x, vec.y, radius, color.r, color.g, color.b, color.a)
		else
			Renderer.OutlinedCircle(vec.x, vec.y, radius)
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	Line(vecPos = new Vector2(), vecSize = this.DefaultShapeSize, color?: Color): void {
		
		if (color === undefined)
			Renderer.Line(vecPos.x, vecPos.y, vecSize.x, vecSize.y)
		else
			Renderer.Line(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a);
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	FilledRect(vecPos = new Vector2(), vecSize = this.DefaultShapeSize, color?: Color): void {
		
		if (color === undefined)
			Renderer.FilledRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y)
		else
			Renderer.FilledRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a);
	}
	/**
	 * @param vecSize default Weight 5 x Height 5
	 * @param vecSize Weight as X from Vector2
	 * @param vecSize Height as Y from Vector2
	 */
	OutlinedRect(vecPos = new Vector2(), vecSize = this.DefaultShapeSize, color?: Color): void {
		
		if (color === undefined)
			Renderer.OutlinedRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y)
		else
			Renderer.OutlinedRect(vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a);
	}
	/**
	 * @param path start it with "~/" (without double-quotes) to load image from "%loader_path%/scripts_files/path"
	 * @param path also must end with "_c" (without double-quotes), if that's vtex_c
	 */
	Image(path: string, vecPos = new Vector2(), vecSize?: Vector2, color?: Color): void {
		
		if (vecSize === undefined)
			Renderer.Image(path, vecPos.x, vecPos.y)
		
		else if (color === undefined) 
			Renderer.Image(path, vecPos.x, vecPos.y, vecSize.x, vecSize.y)

		else Renderer.Image(path, vecPos.x, vecPos.y, vecSize.x, vecSize.y, color.r, color.g, color.b, color.a);
	}
	/**
	 * @param font Size as X from Vector2 | default: 14
	 * @param font Weight as Y from Vector2 | default: 200
	 * @param font_name default: "Calibri"
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 */
	Text(text: string, vec = new Vector2(), color?: Color, font_name?: string, font = this.DefaultTextSize, flags = FontFlags_t.OUTLINE): void {

		if (color === undefined)
			Renderer.Text(vec.x, vec.y, text);

		else if (font_name === undefined)
			Renderer.Text(vec.x, vec.y, text, color.r, color.g, color.b, color.a);
		
		else Renderer.Text(vec.x, vec.y, text, color.r, color.g, color.b, color.a, font_name, font.x, font.y, flags)
	}
	/**
	 * @param color default: Yellow
	 * @param font_name default: "Calibri"
	 * @param font_size default: 30
	 * @param font_weight default: 0
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.ANTIALIAS
	 */
	TextAroundMouse(text: string, vec?: Vector2 | false, color = Color.Yellow, font_name = "Calibri", font = new Vector2(30), flags = FontFlags_t.ANTIALIAS): void {
		
		let vecMouse = Vector2.CopyFrom(CursorOnScreen).AddScalarX(30).AddScalarY(15)
		
		if (vec !== undefined && vec !== false)
			vecMouse = vecMouse.Add(vec);
		
		this.Text(text, vecMouse, color, font_name, font, flags)
	}
}

export default new RendererSDK();

EventsSDK.on("onUpdate", cmd => {
	CursorOnWorld = cmd.VectorUnderCursor

	/* CursorOnScreen.CopyFrom(WindowSize)
		.MultiplyScalarX(cmd.MouseX)
		.MultiplyScalarY(cmd.MouseY); */
});

const Xparam = BigInt(0xFFFF), Yparam = BigInt(0xFFFF0000);

EventsSDK.on("onWndProc", (message_type, wParam, lParam) => {
	
	if (message_type !== 0x0200) // WM_MOUSEMOVE
		return true;
	
	CursorOnScreen.SetVector(Number(lParam & Xparam), Number((lParam & Yparam) >> 16n));
	
	return true;
})

EventsSDK.on("onTick", () => {

	if (sleeper.Sleeping("WindowSize"))
		return;

	WindowSize = Vector2.fromIOBuffer(Renderer.WindowSize);
	sleeper.Sleep(10000, "WindowSize");
})