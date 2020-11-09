import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"

export default class Button extends Base {
	protected readonly button_offset = new Vector2(8, 3)
	protected readonly button_color = new Color(14, 99, 152)
	protected readonly buttom_activated_color = new Color(36, 40, 50) // while not MouseLeftUp
	protected readonly execute_on_add = false
	protected name_size = new Vector2(0, 0)

	private get ButtonRect() {
		const base_pos = this.Position.Add(this.button_offset).AddForThis(this.border_size)
		return new Rectangle(base_pos, base_pos.Add(this.TotalSize)
			.SubtractForThis(this.button_offset.MultiplyScalar(2))
			.SubtractForThis(this.border_size.MultiplyScalar(2))
		)
	}
	public Update(): void {
		this.name_size = RendererSDK.GetTextSize(this.Name, this.FontName, this.FontSize)
			.SubtractScalarY(25)
		this.TotalSize.x = this.name_size.x + 10 + this.border_size.x * 2
	}
	public Render(): void {
		super.Render()
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.background_color)
		const button_rect = this.ButtonRect
		RendererSDK.FilledRect(button_rect.pos1, button_rect.pos2.Subtract(button_rect.pos1), this.button_color)
		RendererSDK.Text(this.Name, button_rect.pos1.Add(button_rect.pos2).DivideScalarForThis(2).SubtractForThis(this.name_size.DivideScalar(2)), this.FontColor, this.FontName, this.FontSize)
		if (!this.ButtonRect.Contains(this.MousePosition))
			super.RenderTooltip()
	}
	public OnMouseLeftDown(): boolean {
		return !this.Rect.Contains(this.MousePosition)
	}
	public OnMouseLeftUp(): boolean {
		if (this.ButtonRect.Contains(this.MousePosition))
			this.OnValueChangedCBs.forEach(f => f(this))
		return false
	}
}
