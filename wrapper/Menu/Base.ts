import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Localization } from "./Localization"

export interface IMenu {
	entries: Base[]
	EntriesSizeX: number
	EntriesSizeY: number
	IsOpen: boolean
	IsVisible: boolean
}

export class Base {
	public static ForwardConfigASAP = false
	public static SaveConfigASAP = true
	public static triggerOnChat = false
	public static barWidth = 0
	public static OnWindowSizeChanged(): void {
		Base.barWidth = GUIInfo.ScaleWidth(
			RendererSDK.GetImageSize(Base.barInactivePath).x
		)
		Base.tooltipOffset = GUIInfo.ScaleWidth(3)
		Base.tooltipIconSize.x = GUIInfo.ScaleWidth(24)
		Base.tooltipIconSize.y = GUIInfo.ScaleHeight(24)
		Base.tooltipIconOffset.x = GUIInfo.ScaleWidth(7)
		Base.tooltipIconOffset.y = GUIInfo.ScaleHeight(6)
		Base.tooltipIconTextGap = GUIInfo.ScaleWidth(9)
		Base.tooltipTextOffset.x = GUIInfo.ScaleWidth(8)
		Base.tooltipTextOffset.y = GUIInfo.ScaleHeight(11)
		Base.tooltipTextBottomGap = GUIInfo.ScaleHeight(8)
		Base.DefaultSize.x = GUIInfo.ScaleWidth(Base.UnscaledDefaultSize.x)
		Base.DefaultSize.y = GUIInfo.ScaleHeight(Base.UnscaledDefaultSize.y)
		Base.textOffset.x = GUIInfo.ScaleWidth(14)
		Base.textOffset.y = GUIInfo.ScaleHeight(14)
	}

	private static readonly backgroundInactivePath = "menu/background_inactive.svg"
	private static readonly backgroundActivePath = "menu/background_active.svg"
	private static readonly tooltipPath = "menu/tooltip.svg"
	private static readonly barInactivePath = "menu/bar_inactive.svg"
	private static readonly barActivePath = "menu/bar_active.svg"
	private static tooltipOffset = 0
	private static readonly tooltipIconSize = new Vector2()
	private static readonly tooltipIconOffset = new Vector2()
	private static tooltipIconTextGap = 0
	private static readonly tooltipTextOffset = new Vector2()
	private static tooltipTextBottomGap = 0
	private static readonly UnscaledDefaultSize = RendererSDK.GetImageSize(
		Base.backgroundInactivePath
	)
	private static readonly DefaultSize = new Vector2()
	private static readonly textOffset = new Vector2()

	public IsHidden = false
	public IsHiddenBecauseOfSearch = false
	public Name = ""
	public Tooltip = ""
	public FontSize = 16
	public FontName = "PT Sans"
	public FontColor = Color.White
	public FontWeight = 400
	public TooltipIcon = "menu/icons/info.svg"
	public TooltipIconColor = new Color(104, 4, 255)
	public Priority = 0
	public QueuedUpdate = true
	public QueuedUpdateRecursive = false
	public NeedsRootUpdate = true
	public SaveConfig = true

	public readonly Position = new Vector2()
	public readonly Size = new Vector2()

	protected isActive = false
	protected configDirty = true
	protected readonly TooltipSize = new Vector2()
	protected readonly TooltipTextSize = new Vector3()
	protected readonly textOffset = Base.textOffset
	protected readonly nameSize = new Vector3()

	protected readonly executeOnAdd: boolean = true
	protected readonly OnValueChangedCBs: ((caller: Base) => any)[] = []

	constructor(
		public parent: IMenu,
		public readonly InternalName: string = "",
		public readonly InternalTooltipName: string
	) {
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
	public get ClassPriority(): number {
		return 0
	}
	public get RenderSize() {
		return new Vector2(this.parent.EntriesSizeX, this.Size.y)
	}
	protected get Rect() {
		return new Rectangle(
			this.Position,
			this.Position.Clone()
				.AddScalarX(this.parent.EntriesSizeX)
				.AddScalarY(this.Size.y)
		)
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
		return !this.configDirty
	}

	public OnConfigLoaded() {
		if (!this.configDirty) {
			return
		}
		this.configDirty = false
		if (this.executeOnAdd) {
			this.TriggerOnValueChangedCBs()
		}
	}

	public OnValue(func: (caller: this) => any): this {
		this.OnValueChangedCBs.push(func as any)
		if (this.executeOnAdd) {
			func(this)
		}
		return this
	}

	public Update(recursive = false): boolean {
		if (!RendererSDK.IsInDraw) {
			this.QueuedUpdate = true
			this.QueuedUpdateRecursive = recursive
			return false
		}
		this.ApplyLocalization()
		this.NeedsRootUpdate = true
		this.Size.CopyFrom(Base.DefaultSize)
		this.GetTextSizeDefault(this.Name).CopyTo(this.nameSize)
		if (this.Tooltip === "") {
			return true
		}
		Vector2.FromVector3(
			this.GetTextSizeDefault(this.Tooltip).CopyTo(this.TooltipTextSize)
		)
			.CopyTo(this.TooltipSize)
			.AddScalarX(
				Base.tooltipIconOffset.x +
					Base.tooltipIconSize.x +
					Base.tooltipIconTextGap
			)
			.AddForThis(Base.tooltipTextOffset)
			.AddScalarY(Base.tooltipTextBottomGap)
			.AddScalarY(this.TooltipTextSize.z)
		this.TooltipSize.y = Math.max(
			this.TooltipSize.y,
			Base.tooltipIconSize.y + Base.tooltipIconOffset.y * 2
		)
		return true
	}

	public Render(drawBar = true): void {
		if (this.isActive) {
			RendererSDK.Image(
				Base.backgroundActivePath,
				this.Position,
				-1,
				this.RenderSize
			)
		} else {
			RendererSDK.Image(
				Base.backgroundInactivePath,
				this.Position,
				-1,
				this.RenderSize
			)
		}
		const isHovered = this.IsHovered
		if (drawBar) {
			const barSize = new Vector2(Base.barWidth, this.Size.y)
			if (isHovered || this.isActive) {
				RendererSDK.Image(Base.barActivePath, this.Position, -1, barSize)
			} else {
				RendererSDK.Image(Base.barInactivePath, this.Position, -1, barSize)
			}
		}
		if (isHovered) {
			this.RenderTooltip()
		}
	}
	public PostRender(): void {
		// to be implemented in child classes
	}

	public OnParentNotVisible(): void {
		// to be implemented in child classes
	}

	public OnPreMouseLeftDown(): boolean {
		return true
	}
	public OnMouseLeftDown(): boolean {
		return true
	}

	public OnMouseLeftUp(): boolean {
		return true
	}

	/**
	 * @returns true on success
	 */
	public DetachFromParent(): boolean {
		return this.parent.entries.remove(this)
	}
	protected ApplyLocalization() {
		this.Name = Localization.Localize(this.InternalName)
		this.Tooltip = Localization.Localize(this.InternalTooltipName)
	}

	protected GetTextSizeDefault(text: string): Vector3 {
		return RendererSDK.GetTextSize(
			text,
			this.FontName,
			GUIInfo.ScaleHeight(this.FontSize),
			this.FontWeight,
			false
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
			false,
			false
		)
	}
	public TriggerOnValueChangedCBs(): void {
		for (let i = this.OnValueChangedCBs.length - 1; i > -1; i--) {
			this.OnValueChangedCBs[i](this)
		}
	}

	private RenderTooltip(): void {
		if (this.Tooltip === "") {
			return
		}

		const position = this.Position.Clone()
			.AddScalarX(this.parent.EntriesSizeX + Base.tooltipOffset)
			.AddScalarY((this.Size.y - this.TooltipSize.y) / 2)
			.FloorForThis()

		RendererSDK.Image(Base.tooltipPath, position, -1, this.TooltipSize)

		RendererSDK.Image(
			this.TooltipIcon,
			position
				.Clone()
				.AddScalarX(Base.tooltipIconOffset.x)
				.AddScalarY((this.TooltipSize.y - Base.tooltipIconSize.y) / 2),
			-1,
			Base.tooltipIconSize,
			this.TooltipIconColor
		)

		this.RenderTextDefault(
			this.Tooltip,
			position
				.Add(this.TooltipSize)
				.SubtractScalarX(Base.tooltipTextOffset.x + this.TooltipTextSize.x)
				.SubtractScalarY(Base.tooltipTextOffset.y + this.TooltipTextSize.y)
		)
	}
}

EventsSDK.on("WindowSizeChanged", () => Base.OnWindowSizeChanged())
