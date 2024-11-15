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
	public static HoveredElement: Nullable<Base>
	public static ActiveElement: Nullable<Base>

	public static ForwardConfigASAP = false
	public static SaveConfigASAP = true
	public static NoWriteConfig = false // set on suspicion of bad config
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
	private static readonly textOffset = new Vector2()
	public static readonly DefaultSize = new Vector2()

	public static DrawMarksNew = true
	public static DrawMarksNonDefault = true

	public static markColorNew = new Color(34, 177, 76)
	public static markColorNonDefault = Color.fromUint32(0xffbbbbbb)
	public markColorCustom = Color.ZeroReadonly

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
	public IsDefaultValue = true
	public FirstTime = false

	public readonly Position = new Vector2()
	public readonly Size = new Vector2()

	protected isActive = false
	protected configDirty = true
	protected readonly TooltipSize = new Vector2()
	protected readonly TooltipTextSize = new Vector3()
	protected readonly textOffset = Base.textOffset
	protected readonly nameSize = new Vector3()

	public executeOnAdd: boolean = true
	protected readonly OnValueChangedCBs: ((caller: Base) => any)[] = []

	constructor(
		public parent: IMenu,
		public InternalName: string = "",
		public InternalTooltipName: string
	) {
		this.Name = this.InternalName
		this.Tooltip = this.InternalTooltipName
	}
	public ResetToDefault(): void {
		this.IsDefaultValue = this.configDirty = true
	}
	public IsDefault(): boolean {
		return true
	}
	public UpdateIsDefault(fast = false): void {
		const isDefault = !this.SaveConfig || (!fast && this.IsDefault())
		if (this.IsDefaultValue !== isDefault) {
			this.IsDefaultValue = isDefault

			if (this.parent instanceof Base) {
				this.parent.UpdateIsDefault(!isDefault)
			}
		}
	}
	public get ConfigValue(): any {
		return undefined
	}
	public set ConfigValue(_value: any) {
		// to be implemented in child classes
	}
	public get IsNode(): boolean {
		return false
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
	public get IsHovered(): boolean {
		const hovered = this.Rect.Contains(this.MousePosition)
		if (hovered) {
			Base.HoveredElement = this as Base
		}

		return Base.ActiveElement ? Base.ActiveElement === this : hovered
	}
	protected get ShouldIgnoreNewConfigValue(): boolean {
		return !this.configDirty
	}
	public OnConfigLoaded() {
		if (this.configDirty && this.SaveConfig) {
			if (this.executeOnAdd) {
				this.TriggerOnValueChangedCBs()
			}
		}
		this.configDirty = false
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
		if (this.FirstTime) {
			let isVisible = true
			this.foreachParent(node => {
				if ((isVisible &&= !node.IsHidden)) {
					node.FirstTime = true
				}
			}, true)
		}

		this.UpdateIsDefault()

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
		RendererSDK.Image(
			this.isActive ? Base.backgroundActivePath : Base.backgroundInactivePath,
			this.Position,
			-1,
			this.RenderSize
		)
		if (drawBar) {
			RendererSDK.Image(
				this.IsHovered || this.isActive
					? Base.barActivePath
					: Base.barInactivePath,
				this.Position,
				-1,
				new Vector2(Base.barWidth, this.Size.y)
			)
		}

		let col

		if (this.markColorCustom.a) {
			col = this.markColorCustom
		} else if (!this.SaveConfig) {
			//
		} else if (Base.DrawMarksNew && this.FirstTime) {
			col = Base.markColorNew
		} else if (Base.DrawMarksNonDefault && !this.IsDefaultValue && drawBar) {
			col = Base.markColorNonDefault
		}

		if (col && col.a) {
			const sizepad = new Vector2(-1, +1).MultiplyScalarForThis(
				Base.DefaultSize.y / 8
			)
			RendererSDK.FilledCircle(
				this.Position.Add(sizepad).AddScalarX(this.RenderSize.x),
				sizepad,
				col
			)
		}
		if (this.IsHovered) {
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

		if (this.FirstTime && (!this.IsNode || this.Tooltip)) {
			const prefix = Localization.Localize("[New]")
			this.Tooltip = prefix + this.Tooltip
		}
	}

	protected GetTextSizeDefault(text: string): Vector3 {
		return RendererSDK.GetTextSize(
			text,
			this.FontName,
			GUIInfo.ScaleHeight(this.FontSize),
			this.FontWeight,
			false
		).DivideScalarZ(2)
	}
	protected RenderTextDefault(text: string, position: Vector2, color?: Color): void {
		RendererSDK.Text(
			text,
			position,
			color ?? Color.White,
			this.FontName,
			GUIInfo.ScaleHeight(this.FontSize),
			this.FontWeight,
			false,
			false
		)
	}
	public foreachParent(cb: (node: Base) => any, includeThis = false) {
		for (
			let node = includeThis ? (this as Base) : this.parent;
			node instanceof Base;
			node = node.parent
		) {
			cb(node)
		}
	}
	public everyParent(cb: (node: Base) => boolean, includeThis = false): boolean {
		let result = true
		let node = includeThis ? (this as Base) : this.parent
		while (node instanceof Base && (result = cb(node))) {
			node = node.parent
		}
		return result
	}

	public TriggerOnValueChangedCBs(): void {
		for (let i = this.OnValueChangedCBs.length - 1; i > -1; i--) {
			this.OnValueChangedCBs[i](this)
		}
		this.UpdateIsDefault()
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
