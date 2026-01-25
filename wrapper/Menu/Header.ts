import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class Header extends Base {
	public static OnWindowSizeChanged(): void {
		Header.LogoOffset.x = ScaleWidth(14)
		Header.LogoOffset.y = ScaleHeight(7)

		// Header.CapOffset.x = ScaleWidth(4)
		// Header.CapOffset.y = ScaleHeight(2)

		Header.TextOffset.x = ScaleWidth(49)
		Header.TextOffset.y = ScaleHeight(12)
		Header.FontSize = ScaleHeight(18)

		const logoSize = RendererSDK.GetImageSize(this.logoPath)
		Header.LogoSize.x = ScaleWidth(logoSize.x)
		Header.LogoSize.y = ScaleHeight(logoSize.y)

		// const capSize = RendererSDK.GetImageSize(this.capPath)
		// Header.CapSize.x = ScaleWidth(capSize.x)
		// Header.CapSize.y = ScaleHeight(capSize.y)

		const actualOriginalSize = RendererSDK.GetImageSize(this.imagePath)
		Header.OriginalSize_.x = ScaleWidth(actualOriginalSize.x)
		Header.OriginalSize_.y = ScaleHeight(actualOriginalSize.y)
	}

	private static readonly imagePath = "menu/header.svg"
	private static readonly logoPath = "menu/logo.svg"

	// private static readonly capPath = "menu/cap.png"
	// private static readonly CapOffset = new Vector2()
	// private static readonly CapSize = new Vector2()

	private static readonly TextOffset = new Vector2()
	private static readonly LogoOffset = new Vector2()
	private static readonly LogoSize = new Vector2()

	private static readonly OriginalSize_ = new Vector2()
	private static FontSize = 0

	public readonly Size = Header.OriginalSize_
	protected dragging = false
	protected readonly draggingOffset = new Vector2()

	constructor(parent: IMenu) {
		super(parent, "", "")
	}

	public get ConfigValue() {
		return this.Position.toArray()
	}
	public set ConfigValue(value) {
		if (!Array.isArray(value) || this.ShouldIgnoreNewConfigValue) {
			return
		}
		Vector2.fromArray(value).Max(0).CopyTo(this.Position)
	}

	public Render(): void {
		const windowSize = this.WindowSize
		if (this.Position.IsZero()) {
			this.Position.CopyFrom(windowSize.DivideScalar(2))
		}
		if (this.dragging) {
			this.MousePosition.SubtractForThis(this.draggingOffset)
				.Max(1)
				.CopyTo(this.Position)
		}
		this.Position.x = Math.max(
			Math.min(this.Position.x, windowSize.x - this.parent.EntriesSizeX),
			0
		)
		this.Position.y = Math.max(
			Math.min(this.Position.y, windowSize.y - this.parent.EntriesSizeY),
			0
		)
		this.Position.RoundForThis()

		RendererSDK.Image(Header.imagePath, this.Position, -1, this.RenderSize)
		RendererSDK.Image(
			Header.logoPath,
			this.Position.Add(Header.LogoOffset),
			-1,
			Header.LogoSize
		)
		// const capPos = this.Position.Add(Header.LogoOffset.Add(Header.CapOffset))
		// 	.Subtract(Header.LogoSize.DivideScalar(2))
		// 	.SubtractScalarX(Header.CapOffset.x)
		// RendererSDK.Image(Header.capPath, capPos, -1, Header.CapSize)
		RendererSDK.Text(
			"octarine",
			this.Position.Add(Header.TextOffset),
			Color.White,
			this.FontName,
			Header.FontSize,
			this.FontWeight,
			false,
			false
		)
	}

	public OnMouseLeftDown(): boolean {
		if (!this.IsHovered) {
			return true
		}
		this.dragging = true
		this.MousePosition.Subtract(this.Position).CopyTo(this.draggingOffset)
		return false
	}
	public OnMouseLeftUp(): boolean {
		if (!this.dragging) {
			return !this.IsHovered
		}
		this.dragging = false
		return false
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => Header.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
