import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"

export default class Header extends Base {
	public readonly FontSize = 34
	public position_dirty = true
	public readonly underline_width = 3
	public readonly background_size = new Vector2(750 / 5, 200 / 5)
	public readonly OriginalSize = this.background_size.Clone().AddScalarY(this.underline_width)
	public readonly TotalSize = this.OriginalSize.Clone()

	protected dragging = false
	protected readonly dragging_offset = new Vector2(0, 0)
	protected readonly underline_color = new Color(0x40, 0x80, 0xff)
	protected readonly text_size: Vector2

	constructor(parent: IMenu) {
		super(parent, "", "")
		this.text_size = RendererSDK.GetTextSize("Fusion", this.FontName, this.FontSize)
	}

	public get ConfigValue() {
		return this.Position.toArray()
	}

	public set ConfigValue(value) {
		if (value === undefined)
			return
		Vector2.fromArray(value).Max(0).CopyTo(this.Position)
		this.position_dirty = true
	}

	public PreRender(): void {
		if (!this.dragging)
			return
		this.position_dirty = true
		this.MousePosition.Subtract(this.dragging_offset).Max(0).CopyTo(this.Position)
		const window_size = RendererSDK.WindowSize
		const total_entries_x = this.parent.entries.reduce((prev, cur) => Math.max(prev, cur.TotalSize.x), this.TotalSize.x)
		if (this.Position.x + total_entries_x > window_size.x)
			this.Position.x = window_size.x - total_entries_x
		const total_entries_y = this.parent.entries.reduce((prev, cur) => prev + cur.TotalSize.y, this.TotalSize.y)
		if (this.Position.y + total_entries_y > window_size.y)
			this.Position.y = window_size.y - total_entries_y
	}
	public Render(): void {
		super.Render()
		RendererSDK.Text("Fusion", this.Position.Add(new Vector2(this.TotalSize.x / 2 - this.text_size.x / 2, 6 + this.text_size.y)), this.FontColor, this.FontName, this.FontSize)
		RendererSDK.FilledRect(this.Position.Clone().AddScalarY(this.background_size.y), new Vector2(this.TotalSize.x, this.underline_width), this.underline_color)
	}

	public OnMouseLeftDown(): boolean {
		if (!this.Rect.Contains(this.MousePosition))
			return true
		this.dragging = true
		this.MousePosition.Subtract(this.Position).CopyTo(this.dragging_offset)
		return false
	}
	public OnMouseLeftUp(): boolean {
		if (!this.dragging)
			return !this.Rect.Contains(this.MousePosition)
		this.dragging = false
		return false
	}
}
