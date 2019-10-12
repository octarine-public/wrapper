import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"

export default class Base {
	tooltip: string = ""
	protected tooltip_size: Vector2
	public OnValueChangedCBs: Array<(caller: this) => void> = []
	public readonly Position = new Vector2()
	protected readonly border_size = new Vector2(1, 1)
	protected readonly border_color = new Color(14, 14, 14, 254)
	protected readonly background_color = new Color(19, 19, 19, 249)
	protected readonly text_offset = new Vector2(8, 8)
	protected hovered = false
	public FontSize = 20
	public FontColor = new Color(255, 255, 255, 255)
	public FontName = "Consolas"
	public readonly TotalSize_ = new Vector2(750 / 5, 40)
	public readonly TotalSize = this.TotalSize_.Clone()
	protected readonly MousePosition = new Vector2()
	protected readonly execute_on_add: boolean = true

	constructor(public name: string = "") { this.name = name }
	public OnValue(func: (caller: this) => void): this {
		this.OnValueChangedCBs.push(func)
		if (this.execute_on_add)
			func(this)
		return this
	}
	public Update(): void {
		if (this.tooltip === undefined || this.tooltip.length === 0)
			return
		this.tooltip_size = RendererSDK.GetTextSize(this.tooltip, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
	}
	protected get Rect() {
		return new Rectangle(this.Position, this.Position.Add(this.TotalSize))
	}
	protected get NodeRect() {
		return new Rectangle(this.Position.Add(this.border_size), this.Position.Add(this.TotalSize).Subtract(this.border_size.MultiplyScalar(2)))
	}
	public Render(): void {
		RendererSDK.FilledRect(this.Position, this.TotalSize, this.border_color)
	}
	public SetTooltip(tooltip: string) {
		this.tooltip = tooltip
		return this
	}
	public get ConfigValue(): any { return undefined }
	public set ConfigValue(value: any) {}
	public OnMouseLeftDown(): boolean { return true }
	public OnMouseLeftUp(): boolean { return true }
	public OnMousePositionChanged(MousePosition: Vector2): boolean {
		MousePosition.CopyTo(this.MousePosition)
		return !this.Rect.Contains(this.MousePosition)
	}
	public RenderTooltip(): void {
		if (this.tooltip === undefined || this.tooltip.length === 0 || !this.Rect.Contains(this.MousePosition))
			return
	}
}
