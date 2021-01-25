import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import { FontFlags_t } from "../Enums/FontFlags_t"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"

export default class Header extends Base {
	private static readonly image_path = "menu/header.svg"
	private static readonly logo_path = "menu/logo.svg"
	private static readonly FontSize = 18
	private static readonly FontFlags = FontFlags_t.NONE

	public readonly OriginalSize = RendererSDK.GetImageSize(Header.image_path)
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
		if (value === undefined)
			return
		Vector2.fromArray(value).Max(0).CopyTo(this.Position)
	}

	public Render(): void {
		if (this.Position.IsZero())
			this.Position.CopyFrom(RendererSDK.WindowSize.DivideScalar(2))
		if (this.dragging)
			this.MousePosition.SubtractForThis(this.dragging_offset).Max(1).CopyTo(this.Position)
		this.Position.x = Math.min(
			this.Position.x,
			RendererSDK.WindowSize.x - this.parent.EntriesSizeX,
		)
		this.Position.y = Math.min(
			this.Position.y,
			RendererSDK.WindowSize.y - this.parent.EntriesSizeY,
		)
		this.Position.RoundForThis()
		RendererSDK.Image(Header.image_path, this.Position, -1, this.TotalSize)
		RendererSDK.Image(Header.logo_path, this.Position.Clone().AddScalarX(14).AddScalarY(7))
		RendererSDK.Text(
			"octarine",
			this.Position.Add(new Vector2(49, 13)),
			Color.White,
			this.FontName,
			Header.FontSize,
			this.FontWeight,
			this.FontWidth,
			false,
			Header.FontFlags,
		)
	}

	public OnMouseLeftDown(): boolean {
		if (!this.IsHovered)
			return true
		this.dragging = true
		this.MousePosition.Subtract(this.Position).CopyTo(this.dragging_offset)
		return false
	}
	public OnMouseLeftUp(): boolean {
		if (!this.dragging)
			return !this.IsHovered
		this.dragging = false
		return false
	}
}
