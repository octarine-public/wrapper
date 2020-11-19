import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import InputManager from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import Localization from "./Localization"

export interface IMenu {
	entries: Base[]
}

export interface ILanguage {
	Ru: string,
	En: string,
	Cn: string
}

export default class Base {
	public Name = ""
	public Tooltip = ""
	public FontSize = 18
	public FontName = "Consolas"
	public FontColor = new Color(255, 255, 255, 255)
	public readonly OnValueChangedCBs: ((caller: Base) => void)[] = []

	public readonly Position = new Vector2(0, 0)
	public readonly TotalSize = new Vector2(750 / 5, 40)

	protected hovered = false
	protected tooltip_size = new Vector2()
	protected readonly border_size = new Vector2(1, 1)
	protected readonly border_color = new Color(14, 14, 14, 254)
	protected readonly background_color = new Color(19, 19, 19, 249)
	protected readonly text_offset = new Vector2(7, 7)

	protected readonly execute_on_add: boolean = true

	constructor(public parent: IMenu, public readonly InternalName: string = "", public readonly InternalTooltipName: string) {
		this.Name = this.InternalName
		this.Tooltip = this.InternalTooltipName
	}
	public get ConfigValue(): any { return undefined }
	public set ConfigValue(_value: any) {
		// to be implemented in child classes
	}
	protected get Rect() {
		return new Rectangle(this.Position, this.Position.Add(this.TotalSize))
	}

	protected get NodeRect() {
		return new Rectangle(this.Position.Add(this.border_size), this.Position.Add(this.TotalSize).Subtract(this.border_size.MultiplyScalar(2)))
	}

	protected get MousePosition(): Vector2 {
		return InputManager.CursorOnScreen
	}
	public OnConfigLoaded() {
		// to be implemented in child classes
	}
	public ApplyLocalization() {
		this.Name = Localization.Localize(this.InternalName)
		this.Tooltip = Localization.Localize(this.InternalTooltipName)
		this.Update()
	}

	public OnValue(func: (caller: this) => void): this {
		this.OnValueChangedCBs.push(func as any)
		if (this.execute_on_add)
			func(this)
		return this
	}

	public Update(): void {
		if (this.Tooltip === "")
			return
		this.tooltip_size = RendererSDK.GetTextSize(this.Tooltip, this.FontName, this.FontSize)
	}

	public Render(): void {
		RendererSDK.FilledRect(this.Position, this.TotalSize, this.border_color)
	}

	public OnMouseLeftDown(): boolean {
		return true
	}

	public OnMouseLeftUp(): boolean {
		return true
	}

	public RenderTooltip(): void {
		if (this.Tooltip === "" || !this.Rect.Contains(this.MousePosition))
			return

		const Addscalar = 5
		const SizeImage = new Vector2(18, 18)
		const Position = this.Position.Clone()
			.AddScalarX(this.TotalSize.x + Addscalar)

		const TotalSize = this.tooltip_size.Clone()
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
			this.Tooltip,
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
