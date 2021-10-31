import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"

export default class Header extends Base {
	public static OnWindowSizeChanged(): void {
		Header.LogoOffset.x = GUIInfo.ScaleWidth(14)
		Header.LogoOffset.y = GUIInfo.ScaleHeight(7)
		Header.TextOffset.x = GUIInfo.ScaleWidth(49)
		Header.TextOffset.y = GUIInfo.ScaleHeight(13)
		Header.FontSize = GUIInfo.ScaleHeight(18)
		Header.LogoSize.x = GUIInfo.ScaleWidth(Header.OriginalLogoSize.x)
		Header.LogoSize.y = GUIInfo.ScaleHeight(Header.OriginalLogoSize.y)
		Header.OriginalSize_.x = GUIInfo.ScaleWidth(Header.ActualOriginalSize_.x)
		Header.OriginalSize_.y = GUIInfo.ScaleHeight(Header.ActualOriginalSize_.y)
	}
	private static readonly image_path = "menu/header.svg"
	private static readonly logo_path = "menu/logo.svg"
	private static readonly TextOffset = new Vector2()
	private static readonly LogoOffset = new Vector2()
	private static readonly OriginalLogoSize = RendererSDK.GetImageSize(Header.logo_path)
	private static readonly LogoSize = new Vector2()
	private static readonly ActualOriginalSize_ = RendererSDK.GetImageSize(Header.image_path)
	private static readonly OriginalSize_ = new Vector2()
	private static FontSize = 0

	public readonly OriginalSize = Header.OriginalSize_
	public readonly TotalSize = this.OriginalSize.Clone()
	protected dragging = false
	protected readonly dragging_offset = new Vector2()
	protected readonly disable_tooltips = true

	constructor(parent: IMenu) {
		super(parent, "", "")
	}

	public get ConfigValue() {
		return this.Position.toArray()
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || value === undefined)
			return
		Vector2.fromArray(value).Max(0).CopyTo(this.Position)
	}

	public async Render(): Promise<void> {
		const window_size = this.WindowSize
		if (this.Position.IsZero())
			this.Position.CopyFrom(window_size.DivideScalar(2))
		if (this.dragging)
			this.MousePosition.SubtractForThis(this.dragging_offset).Max(1).CopyTo(this.Position)
		this.Position.x = Math.max(Math.min(
			this.Position.x,
			window_size.x - this.parent.EntriesSizeX,
		), 0)
		this.Position.y = Math.max(Math.min(
			this.Position.y,
			window_size.y - this.parent.EntriesSizeY,
		), 0)
		this.Position.RoundForThis()
		RendererSDK.Image(Header.image_path, this.Position, -1, this.TotalSize)
		RendererSDK.Image(
			Header.logo_path,
			this.Position.Add(Header.LogoOffset),
			-1,
			Header.LogoSize,
		)
		RendererSDK.Text(
			"octarine",
			this.Position.Add(Header.TextOffset),
			Color.White,
			this.FontName,
			Header.FontSize,
			this.FontWeight,
			false,
			false,
		)
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		if (!this.IsHovered)
			return true
		this.dragging = true
		this.MousePosition.Subtract(this.Position).CopyTo(this.dragging_offset)
		return false
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		if (!this.dragging)
			return !this.IsHovered
		this.dragging = false
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => Header.OnWindowSizeChanged())
