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
		ShortDescription.underlineHeight = ScaleHeight(2)
	}

	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly textOffsetWithIcon = new Vector2()
	private static readonly textOffsetNode = new Vector2(15, 14)
	private static readonly underlineColor = new Color(255, 25, 25)
	private static underlineHeight = 0

	public searchQuery = ""

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
		if (this.searchQuery !== "") {
			this.RenderSearchUnderlines(textPos)
		}
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

	private RenderSearchUnderlines(textPos: Vector2): void {
		const nameLower = this.Name.toLowerCase()
		const queryLower = this.searchQuery.toLowerCase()
		const fontSize = ScaleHeight(this.FontSize)
		let searchFrom = 0
		for (;;) {
			const idx = nameLower.indexOf(queryLower, searchFrom)
			if (idx === -1) break
			const beforeMatch = this.Name.substring(0, idx)
			const matchText = this.Name.substring(idx, idx + queryLower.length)
			const beforeX = RendererSDK.GetTextSize(
				beforeMatch,
				this.FontName,
				fontSize,
				this.FontWeight,
				false
			).x
			const matchX = RendererSDK.GetTextSize(
				matchText,
				this.FontName,
				fontSize,
				this.FontWeight,
				false
			).x
			RendererSDK.FilledRect(
				new Vector2(
					textPos.x + beforeX,
					textPos.y + fontSize + ShortDescription.underlineHeight * 2
				),
				new Vector2(matchX, ShortDescription.underlineHeight),
				ShortDescription.underlineColor
			)
			searchFrom = idx + queryLower.length
		}
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => ShortDescription.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
