import Vector2 from "../Base/Vector2";
import Vector3 from "../Base/Vector3";

const RendererSDK = {
	
	get WindowSize(): Vector2 {
		return Vector2.fromIOBuffer(Renderer.WindowSize)
	},

	FilledCircle: (x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void => 
		Renderer.FilledCircle(x, y, radius, r, g, b, a),

	OutlinedCircle: (x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void =>
		Renderer.OutlinedCircle(x, y, radius, r, g, b, a),

	Line: (baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void =>
		Renderer.Line(baseX, baseY, baseW, baseH, r, g, b, a),

	FilledRect: (baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void =>
		Renderer.FilledRect(baseX, baseY, baseW, baseH, r, g, b, a),

	OutlinedRect: (baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void =>
		Renderer.OutlinedRect(baseX, baseY, baseW, baseH, r, g, b, a),

	Image: (path: string, baseX: number, baseY: number, baseW?: number, baseH?: number, r?: number, g?: number, b?: number, a?: number): void =>
		Renderer.Image(path, baseX, baseY, baseW, baseH, r, g, b, a),

	Text: (x: number, y: number, text: string, r?: number, g?: number, b?: number, a?: number, font_name?: string, font_size?: number, font_weight?: number, flags?: number): void =>
		Renderer.Text(x, y, text, r, g, b, a, font_name, font_size, font_weight, flags),

	WorldToScreen(position: Vector3): Vector3 {
		position.toIOBuffer()
		return Vector3.fromIOBuffer(Renderer.WorldToScreen());
	}
}


export default RendererSDK;