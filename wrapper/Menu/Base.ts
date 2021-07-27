import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { FontFlags_t } from "../Enums/FontFlags_t"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import InputManager from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import Localization from "./Localization"

export interface IMenu {
	entries: Base[]
	EntriesSizeX: number
	EntriesSizeY: number
}

export interface ILanguage {
	Ru: string,
	En: string,
	Cn: string
}

export default class Base {
	public static ForwardConfigASAP = false
	public static SaveConfigASAP = true
	public static trigger_on_chat = false
	public static OnWindowSizeChanged(): void {
		Base.bar_width = GUIInfo.ScaleWidth(RendererSDK.GetImageSize(Base.bar_inactive_path).x)
		Base.tooltip_offset = GUIInfo.ScaleWidth(3)
		Base.tooltip_icon_size.x = GUIInfo.ScaleWidth(24)
		Base.tooltip_icon_size.y = GUIInfo.ScaleHeight(24)
		Base.tooltip_icon_offset.x = GUIInfo.ScaleWidth(7)
		Base.tooltip_icon_offset.y = GUIInfo.ScaleHeight(6)
		Base.tooltip_icon_text_gap = GUIInfo.ScaleWidth(9)
		Base.tooltip_text_offset.x = GUIInfo.ScaleWidth(8)
		Base.tooltip_text_offset.y = GUIInfo.ScaleHeight(12)
		Base.tooltip_text_bottom_gap = GUIInfo.ScaleHeight(8)
		Base.OriginalSize.x = GUIInfo.ScaleWidth(Base.ActualOriginalSize.x)
		Base.OriginalSize.y = GUIInfo.ScaleHeight(Base.ActualOriginalSize.y)
		Base.text_offset.x = GUIInfo.ScaleWidth(14)
		Base.text_offset.y = GUIInfo.ScaleHeight(14)
	}

	private static readonly background_inactive_path = "menu/background_inactive.svg"
	private static readonly background_active_path = "menu/background_active.svg"
	private static readonly bar_inactive_path = "menu/bar_inactive.svg"
	private static readonly bar_active_path = "menu/bar_active.svg"
	private static bar_width = 0
	private static tooltip_offset = 0
	private static readonly tooltip_icon_size = new Vector2()
	private static readonly tooltip_icon_offset = new Vector2()
	private static tooltip_icon_text_gap = 0
	private static readonly tooltip_text_offset = new Vector2()
	private static tooltip_text_bottom_gap = 0
	private static readonly ActualOriginalSize = RendererSDK.GetImageSize(Base.background_inactive_path)
	private static readonly OriginalSize = new Vector2()
	private static readonly text_offset = new Vector2()

	public IsHidden = false
	public IsHiddenBecauseOfSearch = false
	public Name = ""
	public Tooltip = ""
	public FontSize = 16
	public FontName = "PT Sans"
	public FontColor = Color.White
	public FontWeight = 400
	public FontWidth = 5
	public FontFlags = FontFlags_t.NONE
	public TooltipIcon = "menu/icons/info.svg"
	public TooltipIconColor = new Color(104, 4, 255)
	public readonly OnValueChangedCBs: ((caller: Base) => any)[] = []

	public readonly Position = new Vector2()
	public readonly OriginalSize = new Vector2()
	public readonly TotalSize = this.OriginalSize.Clone()

	protected is_active = false
	protected config_dirty = true
	protected readonly TooltipSize = new Vector2()
	protected readonly TooltipTextSize = new Vector3()
	protected readonly text_offset = Base.text_offset
	protected readonly name_size = new Vector3()

	protected readonly execute_on_add: boolean = true
	protected readonly disable_tooltips: boolean = false

	constructor(public parent: IMenu, public readonly InternalName: string = "", public readonly InternalTooltipName: string) {
		this.Name = this.InternalName
		this.Tooltip = this.InternalTooltipName
	}

	public get ConfigValue(): any {
		return undefined
	}
	public set ConfigValue(_value: any) {
		// to be implemented in child classes
	}
	public get IsVisible(): boolean {
		return !this.IsHidden && !this.IsHiddenBecauseOfSearch
	}
	protected get Rect() {
		return new Rectangle(this.Position, this.Position.Add(this.TotalSize))
	}
	protected get MousePosition(): Vector2 {
		return InputManager.CursorOnScreen
	}
	protected get WindowSize(): Vector2 {
		return RendererSDK.WindowSize
	}
	protected get IsHovered(): boolean {
		return this.Rect.Contains(this.MousePosition)
	}
	protected get ShouldIgnoreNewConfigValue(): boolean {
		return !this.config_dirty
	}

	public OnConfigLoaded() {
		if (!this.config_dirty)
			return
		this.config_dirty = false
		if (this.execute_on_add)
			this.TriggerOnValueChangedCBs()
	}
	public ApplyLocalization() {
		this.Name = Localization.Localize(this.InternalName)
		this.Tooltip = Localization.Localize(this.InternalTooltipName)
		this.Update()
	}

	public async OnValue(func: (caller: this) => any): Promise<this> {
		if (!IS_MAIN_WORKER)
			return this // workers shouldn't propagate configs
		this.OnValueChangedCBs.push(func as any)
		if (this.execute_on_add)
			await func(this)
		return this
	}

	public Update(_recursive = false): void {
		this.OriginalSize.CopyFrom(Base.OriginalSize)
		this.GetTextSizeDefault(this.Name).CopyTo(this.name_size)
		if (this.Tooltip === "")
			return
		Vector2.FromVector3(this.GetTextSizeDefault(this.Tooltip).CopyTo(this.TooltipTextSize))
			.CopyTo(this.TooltipSize)
			.AddScalarX(
				Base.tooltip_icon_offset.x
				+ Base.tooltip_icon_size.x
				+ Base.tooltip_icon_text_gap,
			)
			.AddForThis(Base.tooltip_text_offset)
			.AddScalarY(Base.tooltip_text_bottom_gap)
			.AddScalarY(this.TooltipTextSize.z)
		this.TooltipSize.y = Math.max(
			this.TooltipSize.y,
			Base.tooltip_icon_size.y + Base.tooltip_icon_offset.y * 2,
		)
	}

	public async Render(draw_bar = true): Promise<void> {
		if (this.is_active)
			RendererSDK.Image(Base.background_active_path, this.Position, -1, this.TotalSize)
		else
			RendererSDK.Image(Base.background_inactive_path, this.Position, -1, this.TotalSize)
		const is_hovered = this.IsHovered
		if (draw_bar) {
			const bar_size = new Vector2(Base.bar_width, this.TotalSize.y)
			if (is_hovered || this.is_active)
				RendererSDK.Image(Base.bar_active_path, this.Position, -1, bar_size)
			else
				RendererSDK.Image(Base.bar_inactive_path, this.Position, -1, bar_size)
		}
		if (!this.disable_tooltips && is_hovered)
			this.RenderTooltip()
	}
	public async PostRender(): Promise<void> {
		// to be implemented in child classes
	}

	public OnParentNotVisible(): void {
		// to be implemented in child classes
	}

	public async OnPreMouseLeftDown(): Promise<boolean> {
		return true
	}
	public async OnMouseLeftDown(): Promise<boolean> {
		return true
	}

	public async OnMouseLeftUp(): Promise<boolean> {
		return true
	}

	/**
	 * @returns true on success
	 */
	public DetachFromParent(): boolean {
		return ArrayExtensions.arrayRemove(this.parent.entries, this)
	}

	protected GetTextSizeDefault(text: string): Vector3 {
		return RendererSDK.GetTextSize(
			text,
			this.FontName,
			GUIInfo.ScaleHeight(this.FontSize),
			this.FontWeight,
			this.FontWidth,
			false,
			this.FontFlags,
		)
	}
	protected RenderTextDefault(text: string, position: Vector2): void {
		RendererSDK.Text(
			text,
			position,
			Color.White,
			this.FontName,
			GUIInfo.ScaleHeight(this.FontSize),
			this.FontWeight,
			this.FontWidth,
			false,
			this.FontFlags,
		)
	}
	protected async TriggerOnValueChangedCBs(): Promise<void> {
		for (const cb of this.OnValueChangedCBs)
			await cb(this)
	}

	private RenderTooltip(): void {
		if (this.Tooltip === "")
			return

		const Position = this.Position.Clone()
			.AddScalarX(this.TotalSize.x + Base.tooltip_offset)
			.AddScalarY((this.TotalSize.y - this.TooltipSize.y) / 2)
			.FloorForThis()

		RendererSDK.Image(
			Base.background_active_path,
			Position,
			-1,
			this.TooltipSize,
		)

		RendererSDK.Image(
			this.TooltipIcon,
			Position
				.Clone()
				.AddScalarX(Base.tooltip_icon_offset.x)
				.AddScalarY((this.TooltipSize.y - Base.tooltip_icon_size.y) / 2),
			-1,
			Base.tooltip_icon_size,
			this.TooltipIconColor,
		)

		this.RenderTextDefault(
			this.Tooltip,
			Position
				.Add(this.TooltipSize)
				.SubtractScalarX(
					Base.tooltip_text_offset.x
					+ this.TooltipTextSize.x,
				)
				.SubtractScalarY(
					Base.tooltip_text_offset.y
					+ this.TooltipTextSize.y,
				),
		)
	}
}

EventsSDK.on("WindowSizeChanged", () => Base.OnWindowSizeChanged())
