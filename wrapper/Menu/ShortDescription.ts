import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleVector, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class ShortDescription extends Base {
	public static OnWindowSizeChanged(): void {
		ShortDescription.iconSize.CopyFrom(ScaleVector(24, 24))
		ShortDescription.iconOffset.x = ScaleWidth(12)
		ShortDescription.iconOffset.y = ScaleHeight(8)

		ShortDescription.textOffsetNode.x = ScaleWidth(15)
		ShortDescription.textOffsetNode.y = ScaleHeight(13)

		ShortDescription.textOffsetWithIcon.x = ScaleWidth(48)
		ShortDescription.textOffsetWithIcon.y = ShortDescription.textOffsetNode.y
	}

	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly textOffsetWithIcon = new Vector2()
	private static readonly textOffsetNode = new Vector2(15, 14)

	constructor(
		parent: IMenu,
		name: string,
		tooltip = "",
		private iconPath_ = "",
		private iconRound_ = -1
	) {
		super(parent, name, tooltip)
	}

	public get IconPath(): string {
		return this.iconPath_
	}
	public set IconPath(val: string) {
		this.iconPath_ = val
		this.Update()
	}
	public get IconRound(): number {
		return this.iconRound_
	}
	public set IconRound(val: number) {
		this.iconRound_ = val
		this.Update()
	}
	public Render(): void {
		super.Render()
		const textPos = this.Position.Clone()
		if (this.IconPath !== "") {
			textPos.AddForThis(ShortDescription.textOffsetWithIcon)
			RendererSDK.Image(
				this.IconPath,
				this.Position.Add(ShortDescription.iconOffset),
				this.IconRound,
				ShortDescription.iconSize,
				Color.White
			)
		} else {
			textPos.AddForThis(this.textOffset)
		}
		this.RenderTextDefault(this.Name, textPos)
	}
	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		this.Size.x = this.textOffset.x + this.nameSize.x
		if (this.IconPath !== "") {
			this.Size.AddScalarX(ShortDescription.textOffsetWithIcon.x)
		} else {
			this.Size.AddScalarX(this.textOffset.x)
		}
		return true
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => ShortDescription.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
