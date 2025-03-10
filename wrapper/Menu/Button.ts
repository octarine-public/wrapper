import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base } from "./Base"

export class Button extends Base {
	public static OnWindowSizeChanged(): void {
		Button.textButtonGap = GUIInfo.ScaleWidth(8)
		Button.textVerticalButtonGap = GUIInfo.ScaleHeight(8)
		Button.buttonOffset.x = GUIInfo.ScaleWidth(14)
		Button.buttonOffset.y = GUIInfo.ScaleWidth(11)
	}

	private static readonly buttonPath = "menu/button.svg"
	private static textButtonGap = 0
	private static textVerticalButtonGap = 0
	private static readonly buttonOffset = new Vector2(14, 11)

	public readonly FontSize = 16

	public executeOnAdd = false

	public get ClassPriority(): number {
		return 8
	}
	private get ButtonRect() {
		return new Rectangle(
			this.Position.Add(Button.buttonOffset),
			this.Position.Clone()
				.AddScalarX(this.parent.EntriesSizeX)
				.AddScalarY(this.Size.y)
				.SubtractForThis(Button.buttonOffset)
				.AddScalarX(Base.barWidth)
		)
	}
	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		Button.buttonOffset
			.MultiplyScalar(2)
			.SubtractScalarX(Base.barWidth)
			.AddForThis(Vector2.FromVector3(this.nameSize))
			.AddScalarX(Button.textButtonGap * 2)
			.AddScalarY(Button.textVerticalButtonGap * 2)
			.CopyTo(this.Size)
		return true
	}
	public Render(): void {
		super.Render()

		const buttonRect = this.ButtonRect
		RendererSDK.Image(
			Button.buttonPath,
			buttonRect.pos1,
			-1,
			buttonRect.pos2.Subtract(buttonRect.pos1)
		)
		this.RenderTextDefault(
			this.Name,
			new Vector2(
				(buttonRect.pos1.x + buttonRect.pos2.x - this.nameSize.x) / 2,
				buttonRect.pos1.y + Button.textVerticalButtonGap
			)
		)
	}
	public OnMouseLeftDown(): boolean {
		return !this.IsHovered
	}
	public OnMouseLeftUp(): boolean {
		if (this.IsHovered) {
			this.TriggerOnValueChangedCBs()

			// update after reseting settings with button
			if (this.parent instanceof Base) {
				this.parent.UpdateIsDefault()
			}
		}
		return false
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => Button.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
