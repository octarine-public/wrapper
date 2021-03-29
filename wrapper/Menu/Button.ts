import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"

export default class Button extends Base {
	public static OnWindowSizeChanged(): void {
		Button.text_button_gap = GUIInfo.ScaleWidth(5)
		Button.text_vertical_button_gap = GUIInfo.ScaleHeight(8)
		Button.button_offset.x = GUIInfo.ScaleWidth(14)
		Button.button_offset.y = GUIInfo.ScaleWidth(11)
	}

	private static readonly button_path = "menu/button.svg"
	private static text_button_gap = 0
	private static text_vertical_button_gap = 0
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
	public async Render(): Promise<void> {
		await super.Render()

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
	public async OnMouseLeftDown(): Promise<boolean> {
		return !this.IsHovered
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		if (this.ButtonRect.Contains(this.MousePosition))
			await this.TriggerOnValueChangedCBs()
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => Button.OnWindowSizeChanged())
