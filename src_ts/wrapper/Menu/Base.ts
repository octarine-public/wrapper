import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import InputManager from "../Managers/InputManager"

export interface IMenu {
	entries: Base[]
}

export default class Base {
	public tooltip?: string = ""
	public OnValueChangedCBs: ((caller: Base) => void)[] = []
	public readonly Position = new Vector2()
	public FontSize = 18
	public FontColor = new Color(255, 255, 255, 255)
	public FontName = "Consolas"
	public readonly TotalSize_ = new Vector2(750 / 5, 40)
	public readonly TotalSize = this.TotalSize_.Clone()
	protected tooltip_size = new Vector2()
	protected readonly border_size = new Vector2(1, 1)
	protected readonly border_color = new Color(14, 14, 14, 254)
	protected readonly background_color = new Color(19, 19, 19, 249)
	protected readonly text_offset = new Vector2(7, 7)
	protected hovered = false
	protected readonly execute_on_add: boolean = true

	constructor(public parent: IMenu, public name: string = "") { this.name = name }
	public get ConfigValue(): any { return undefined }
	public set ConfigValue(value: any) { return }
	protected get Rect() {
		return new Rectangle(this.Position, this.Position.Add(this.TotalSize))
	}
	protected get NodeRect() {
		return new Rectangle(this.Position.Add(this.border_size), this.Position.Add(this.TotalSize).Subtract(this.border_size.MultiplyScalar(2)))
	}

	protected get MousePosition(): Vector2 {
		return InputManager.CursorOnScreen
	}

	public OnValue(func: (caller: this) => void): this {
		this.OnValueChangedCBs.push(func as any)
		if (this.execute_on_add)
			func(this)
		return this
	}
	public Update(): void {
		if (this.tooltip === undefined || this.tooltip.length === 0)
			return
		this.tooltip_size = RendererSDK.GetTextSize(this.tooltip, this.FontName, this.FontSize)
	}
	public Render(): void {
		RendererSDK.FilledRect(this.Position, this.TotalSize, this.border_color)
	}
	public SetTooltip(tooltip: string) {
		this.tooltip = tooltip
		return this
	}
	public OnMouseLeftDown(): boolean { return true }
	public OnMouseLeftUp(): boolean { return true }

	public RenderTooltip(): void {
		if (this.tooltip === undefined || this.tooltip.length === 0 || !this.Rect.Contains(this.MousePosition))
			return
		this.Update()

		const Addscalar = 5
		const SizeImage = new Vector2(18, 18)
		const Position = this.Position.Clone()
			.AddScalarX(this.TotalSize.x + Addscalar)

		let TotalSize = this.tooltip_size.Clone()
			.AddForThis(this.border_size)
			.AddScalarX(SizeImage.x + (Addscalar * 2))
			.AddScalarY(Addscalar)

		RendererSDK.FilledRect(Position, TotalSize, this.background_color)
		RendererSDK.OutlinedRect(Position, TotalSize, this.border_color)

		RendererSDK.Image(
			"panorama/images/status_icons/information_psd.vtex_c",
			Position.Clone().AddScalarX(2).AddScalarY(4),
			-1,
			SizeImage,
			Color.RoyalBlue
		)

		RendererSDK.Text(
			this.tooltip,
			Position
				.AddForThis(this.border_size)
				.AddScalarX(SizeImage.x + Addscalar)
				.AddScalarY(this.tooltip_size.y),

			Color.White,
			this.FontName,
			this.FontSize
		)
	}

	/**
	 * @returns true on success
	 */
	public DetachFromParent(): boolean {
		return ArrayExtensions.arrayRemove(this.parent.entries, this)
	}
}
