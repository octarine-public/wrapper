import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"
import { FontFlags_t } from "../Enums/FontFlags_t"

export default class Slider extends Base {
	public min = -200
	public max = 200
	public value = 50
	public is_mouse_down = false
	protected readonly text_offset = new Vector2(8, 8)
	protected readonly slider_width = 4
	protected readonly slider_color = new Color(64, 128, 255)
	protected readonly slider_filler_color = new Color(14, 99, 152)
	protected readonly value_text_offset = new Vector2(10, 10)
	protected readonly MousePosition = new Vector2()

	constructor(parent: IMenu, name: string, default_value = 0, min = 0, max = 100, tooltip?: string) {
		super(parent, name)
		this.value = default_value
		this.min = min
		this.max = max
		this.tooltip = tooltip
		this.TotalSize_.x =
			RendererSDK.GetTextSize(this.name, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).x
			+ RendererSDK.GetTextSize(this.max.toFixed(1), this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).x
			+ 10
			+ this.border_size.x * 2
			+ this.text_offset.x * 2
		super.Update()
	}

	public get ConfigValue() { return this.value }
	public set ConfigValue(value) { this.value = value !== undefined ? value : this.value }

	public Render(): void {
		super.Render()
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.background_color)
		let node_position = this.NodeRect.pos1,
			total = this.TotalSize
		let node_height = total.y - this.border_size.y * 2
		let slider_pos = node_position.Clone().AddScalarX((total.x - this.border_size.x * 2 - this.slider_width) / (this.max - this.min) * (this.value - this.min))
		RendererSDK.FilledRect(node_position, slider_pos.Subtract(node_position).AddScalarY(node_height), this.slider_filler_color)
		RendererSDK.FilledRect(slider_pos, new Vector2(this.slider_width, node_height), this.slider_color)
		RendererSDK.Text(this.name, this.Position.Add(this.text_offset), this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		let text = this.value.toString()
		let text_pos = this.Position.Add(total).SubtractForThis(this.value_text_offset).SubtractScalarX(text.length * this.FontSize / 2).SubtractScalarY(this.FontSize)
		RendererSDK.Text(text, text_pos, this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		super.RenderTooltip()
	}
	public OnValueChanged(): void {
		let off = Math.max(this.NodeRect.GetOffset(this.MousePosition).x, 0)
		this.value = Math.floor(Math.min(this.max, this.min + (off / (this.TotalSize.x - this.border_size.x * 2)) * (this.max - this.min)))
		this.OnValueChangedCBs.forEach(f => f(this))
	}

	public OnMouseLeftDown(): boolean {
		if (!this.NodeRect.Contains(this.MousePosition))
			return true
		this.is_mouse_down = true
		this.OnValueChanged()
		return false
	}
	public OnMouseLeftUp(): boolean {
		this.is_mouse_down = false
		return false
	}
	public OnMousePositionChanged(MousePosition: Vector2): boolean {
		super.OnMousePositionChanged(MousePosition)
		let node_rect = this.NodeRect
		if (this.is_mouse_down)
			this.OnValueChanged()
		return !node_rect.Contains(this.MousePosition) && !this.is_mouse_down
	}
}
