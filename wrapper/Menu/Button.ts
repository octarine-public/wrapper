import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"

export default class Button extends Base {
	private static readonly button_path = "menu/button.svg"
	private static readonly text_button_gap = 5
	private static readonly text_vertical_button_gap = 8
	private static readonly button_offset = new Vector2(14, 11)

	public readonly FontSize = 16

	protected readonly execute_on_add = false

	private get ButtonRect() {
		return new Rectangle(
			this.Position.Add(Button.button_offset),
			this.Position
				.Add(this.TotalSize)
				.SubtractForThis(Button.button_offset)
				.AddScalarX(2), // because text_button_gap includes bar size
		)
	}
	public Update(): void {
		super.Update()
		Button.button_offset
			.MultiplyScalar(2)
			.SubtractScalarX(2) // because text_button_gap includes bar size
			.AddForThis(Vector2.FromVector3(this.name_size))
			.AddScalarX(Button.text_button_gap * 2)
			.AddScalarY(Button.text_vertical_button_gap * 2)
			.CopyTo(this.OriginalSize)
	}
	public Render(): void {
		super.Render()

		const button_rect = this.ButtonRect
		RendererSDK.Image(Button.button_path, button_rect.pos1, -1, button_rect.pos2.Subtract(button_rect.pos1))
		this.RenderTextDefault(
			this.Name,
			new Vector2(
				(button_rect.pos1.x + button_rect.pos2.x - this.name_size.x) / 2,
				button_rect.pos1.y + Button.text_vertical_button_gap,
			),
		)
	}
	public OnMouseLeftDown(): boolean {
		return !this.ButtonRect.Contains(this.MousePosition)
	}
	public OnMouseLeftUp(): boolean {
		if (this.ButtonRect.Contains(this.MousePosition))
			this.OnValueChangedCBs.forEach(f => f(this))
		return false
	}
}
