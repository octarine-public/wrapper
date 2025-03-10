import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { EventPriority } from "../Enums/EventPriority"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"
import { Localization } from "./Localization"

export class Dropdown extends Base {
	public static activeDropdown: Nullable<Dropdown>
	public static readonly dropdownPopupElementsLimit = 6
	public static OnWindowSizeChanged(): void {
		Dropdown.dropdownOffset.x = GUIInfo.ScaleWidth(14)
		Dropdown.dropdownOffset.y = GUIInfo.ScaleWidth(6)
		Dropdown.dropdownBorderSize.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdownBorderSize.y = GUIInfo.ScaleWidth(2)
		Dropdown.dropdownArrowSize.x = GUIInfo.ScaleWidth(
			Dropdown.origDropdownArrowSize.x
		)
		Dropdown.dropdownArrowSize.y = GUIInfo.ScaleHeight(
			Dropdown.origDropdownArrowSize.y
		)
		Dropdown.dropdownTextOffset.x = GUIInfo.ScaleWidth(9)
		Dropdown.dropdownTextOffset.y = GUIInfo.ScaleHeight(8)
		Dropdown.dropdownPopupOffset.x = 0
		Dropdown.dropdownPopupOffset.y = GUIInfo.ScaleHeight(-2)
		Dropdown.dropdownPopupElementsOffset.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdownPopupElementsOffset.y = GUIInfo.ScaleHeight(2)
		Dropdown.dropdownPopupElementTextOffset.x = GUIInfo.ScaleWidth(7)
		Dropdown.dropdownPopupElementTextOffset.y = GUIInfo.ScaleHeight(7)
		Dropdown.dropdownPopupElementsScrollbarOffset.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdownPopupElementsScrollbarOffset.y = GUIInfo.ScaleHeight(2)
		Dropdown.dropdownPopupElementsScrollbarWidth = GUIInfo.ScaleWidth(3)
		Dropdown.nameDropdownGap = GUIInfo.ScaleHeight(8)
		Dropdown.dropdownEndGap = GUIInfo.ScaleWidth(20)

		Dropdown.textOffsetWithIcon.x = GUIInfo.ScaleWidth(48)
		Dropdown.textOffsetWithIcon.y = Dropdown.dropdownTextOffset.y

		Dropdown.iconSize.x = GUIInfo.ScaleWidth(24)
		Dropdown.iconSize.y = GUIInfo.ScaleHeight(24)
		Dropdown.iconOffset.x = GUIInfo.ScaleWidth(12)
		Dropdown.iconOffset.y = GUIInfo.ScaleHeight(8)
	}

	private static readonly dropdownPath = "menu/dropdown.svg"
	private static readonly dropdownArrowPath = "menu/dropdown_arrow.svg"
	private static readonly dropdownPopupPath = "menu/dropdown_popup.svg"
	private static readonly scrollbarPath = "menu/scrollbar.svg"
	private static readonly dropdownPopupElementActiveColor = new Color(8, 7, 14)
	private static readonly dropdownPopupElementHoveredColor = new Color(24, 23, 40)
	private static readonly dropdownPopupElementInactiveColor = new Color(16, 16, 28)
	private static readonly dropdownArrowActiveColor = new Color(104, 4, 255)
	private static readonly dropdownArrowInactiveColor = new Color(47, 45, 77)
	private static readonly dropdownOffset = new Vector2()
	private static readonly dropdownBorderSize = new Vector2()
	private static readonly origDropdownArrowSize = RendererSDK.GetImageSize(
		Dropdown.dropdownArrowPath
	)
	private static readonly dropdownArrowSize = new Vector2()
	private static readonly dropdownTextOffset = new Vector2()
	private static readonly dropdownPopupOffset = new Vector2()
	private static readonly dropdownPopupElementsOffset = new Vector2()
	private static readonly dropdownPopupElementTextOffset = new Vector2()
	private static readonly dropdownPopupElementsScrollbarOffset = new Vector2()
	private static dropdownPopupElementsScrollbarWidth = 0
	private static nameDropdownGap = 0
	private static dropdownEndGap = 0

	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly textOffsetWithIcon = new Vector2()

	public ValuesNames: string[]
	private SelectedID_ = 0
	/** keep space for longest value + arrow. false is used for language dropdown */
	public KeepArrowGap = true
	public UseOneLine = true

	public currentlyAtID = 0
	protected ValuesSizes: Vector3[] = []
	protected readonly longestValueSize = new Vector2()

	constructor(
		parent: IMenu,
		name: string,
		public InternalValuesNames: string[],
		public readonly defaultValue = 0,
		tooltip = "",
		private iconPath_ = "menu/icons/drop-down.svg"
	) {
		super(parent, name, tooltip)
		this.ValuesNames = InternalValuesNames
		this.ResetToDefault()
	}
	public get IconPath(): string {
		return this.iconPath_
	}
	public set IconPath(val: string) {
		this.iconPath_ = val
		this.Update()
	}
	public get SelectedID(): number {
		return this.SelectedID_
	}
	public set SelectedID(value: number) {
		this.SelectedID_ = Math.max(
			Math.min(value, this.InternalValuesNames.length - 1),
			0
		)
		this.UpdateIsDefault()
	}
	public ResetToDefault(): void {
		this.SelectedID = this.defaultValue
		super.ResetToDefault()
	}
	public IsDefault(): boolean {
		return this.SelectedID === this.defaultValue
	}
	public get ConfigValue() {
		return this.SelectedID
	}
	public set ConfigValue(value) {
		if (typeof value !== "number" || this.ShouldIgnoreNewConfigValue) {
			return
		}
		this.currentlyAtID = this.SelectedID = value
		this.currentlyAtID -= Math.floor(Dropdown.dropdownPopupElementsLimit / 2) + 1
	}
	public get DropdownRect(): Rectangle {
		const rect = this.Rect,
			offset = Dropdown.dropdownOffset,
			arrowGap = Dropdown.dropdownEndGap,
			staticSize = Dropdown.dropdownTextOffset
				.MultiplyScalar(2)
				.AddForThis(offset)
				.AddScalarX(arrowGap),
			textSize = this.longestValueSize

		if (!this.KeepArrowGap) {
			textSize.x = Math.max(
				textSize.x - arrowGap,
				this.ValuesSizes[this.SelectedID].x
			)
		}

		let x, y
		if (this.UseOneLine) {
			x = rect.pos2.x - textSize.x - staticSize.x
			y = rect.pos1.y + offset.y
		} else {
			x = rect.pos1.x + offset.x
			y = rect.pos2.y - textSize.y - staticSize.y
		}
		return new Rectangle(
			new Vector2(x, y),
			rect.pos2.Subtract(offset).AddScalarX(Base.barWidth)
		)
	}
	public get PopupElementHeight(): number {
		return this.longestValueSize.y + Dropdown.dropdownPopupElementTextOffset.y * 2
	}

	public get ClassPriority(): number {
		return 4
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		this.ValuesSizes = this.ValuesNames.map(value => this.GetTextSizeDefault(value))
		this.ValuesSizes.reduce((prev, cur) => {
			prev.x = Math.max(prev.x, cur.x)
			prev.y = Math.max(prev.y, cur.y + cur.z)
			return prev
		}, new Vector2()).CopyTo(this.longestValueSize)

		const nameWidth = this.nameSize.x + this.textOffset.x
		let dropdownWidth = this.longestValueSize.x
		if (!this.KeepArrowGap) {
			dropdownWidth = Math.max(
				dropdownWidth - Dropdown.dropdownEndGap,
				this.ValuesSizes[this.SelectedID].x
			)
		}
		const textPad = Dropdown.dropdownTextOffset.MultiplyScalar(2),
			offset = Dropdown.dropdownOffset
		dropdownWidth += Dropdown.dropdownEndGap + textPad.x + offset.x

		if (this.UseOneLine) {
			this.Size.x = nameWidth + dropdownWidth
			this.Size.y = Base.DefaultSize.y
		} else {
			this.Size.x = Math.max(nameWidth, dropdownWidth + offset.x - Base.barWidth)
			this.Size.y = this.nameSize.y + this.textOffset.y + this.longestValueSize.y
			this.Size.y += Dropdown.nameDropdownGap + textPad.y + offset.y
		}

		if (this.IconPath !== "") {
			this.Size.AddScalarX(Dropdown.textOffsetWithIcon.x)
		} else {
			this.Size.AddScalarX(this.textOffset.x)
		}

		return true
	}

	public GetArrowRect(dropdownRect: Rectangle): Rectangle {
		const basePos = dropdownRect.pos2.Subtract(Dropdown.dropdownBorderSize)
		return new Rectangle(basePos.Subtract(Dropdown.dropdownArrowSize), basePos)
	}
	public GetPopupRect(dropdownRect: Rectangle): Rectangle {
		const y = dropdownRect.pos2.y + Dropdown.dropdownPopupOffset.y
		const popupRect = new Rectangle(
			new Vector2(dropdownRect.pos1.x + Dropdown.dropdownPopupOffset.x, y),
			new Vector2(
				dropdownRect.pos2.x + Dropdown.dropdownPopupOffset.x,
				y + Dropdown.dropdownPopupElementsOffset.y * 2
			).AddScalarY(
				this.PopupElementHeight *
					Math.min(Dropdown.dropdownPopupElementsLimit, this.ValuesNames.length)
			)
		)
		const popupRectSize = popupRect.Size
		if (popupRect.pos1.y + popupRectSize.y > this.WindowSize.y) {
			const off =
				dropdownRect.Size.y + popupRectSize.y + Dropdown.dropdownPopupOffset.y * 2
			popupRect.pos1.SubtractScalarY(off)
			popupRect.pos2.SubtractScalarY(off)
		}
		return popupRect
	}
	public GetPopupElementsRect(popupRect: Rectangle): Rectangle {
		return new Rectangle(
			popupRect.pos1.Add(Dropdown.dropdownPopupElementsOffset),
			popupRect.pos2.Subtract(Dropdown.dropdownPopupElementsOffset)
		)
	}
	public GetHoveredID(popupElementsRect: Rectangle): number {
		const mousePos = this.MousePosition
		if (!popupElementsRect.Contains(mousePos)) {
			return -1
		}
		return (
			this.currentlyAtID +
			Math.floor(popupElementsRect.GetOffset(mousePos).y / this.PopupElementHeight)
		)
	}

	public Render(): void {
		this.isActive = Dropdown.activeDropdown === this
		super.Render()

		const textPos = this.Position.Clone()
		if (this.IconPath !== "") {
			textPos.AddScalarX(Dropdown.textOffsetWithIcon.x)
			RendererSDK.Image(
				this.IconPath,
				this.Position.Add(Dropdown.iconOffset),
				undefined,
				Dropdown.iconSize
			)
		} else {
			textPos.AddScalarX(this.textOffset.x)
		}
		textPos.AddScalarY(this.textOffset.y)

		this.RenderTextDefault(this.Name, textPos)

		const dropdownRect = this.DropdownRect
		RendererSDK.Image(Dropdown.dropdownPath, dropdownRect.pos1, -1, dropdownRect.Size)

		const arrowRect = this.GetArrowRect(dropdownRect)
		RendererSDK.Image(
			Dropdown.dropdownArrowPath,
			arrowRect.pos1,
			-1,
			arrowRect.Size,
			this.isActive
				? Dropdown.dropdownArrowActiveColor
				: Dropdown.dropdownArrowInactiveColor
		)
		if (this.ValuesNames.length !== 0) {
			const valueSize = this.ValuesSizes[this.SelectedID]
			this.RenderTextDefault(
				this.ValuesNames[this.SelectedID],
				dropdownRect.pos1
					.Clone()
					.AddScalarX(Dropdown.dropdownTextOffset.x)
					.AddScalarY((dropdownRect.Size.y - (valueSize.y + valueSize.z)) / 2)
			)
		}
	}
	public PostRender(): void {
		if (!this.isActive) {
			return
		}
		const popupRect = this.GetPopupRect(this.DropdownRect)
		const popupElementsRect = this.GetPopupElementsRect(popupRect)
		this.currentlyAtID = Math.max(
			0,
			Math.min(
				this.currentlyAtID,
				this.ValuesNames.length - Dropdown.dropdownPopupElementsLimit
			)
		)
		RendererSDK.Image(Dropdown.dropdownPopupPath, popupRect.pos1, -1, popupRect.Size)
		const currentElementPos = popupElementsRect.pos1.Clone(),
			elementSize = new Vector2(popupElementsRect.Size.x, this.PopupElementHeight),
			hoveredID = this.GetHoveredID(popupElementsRect)
		this.ValuesNames.forEach((value, i) => {
			if (
				i < this.currentlyAtID ||
				i >= Dropdown.dropdownPopupElementsLimit + this.currentlyAtID
			) {
				return
			}
			if (this.SelectedID === i) {
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementActiveColor
				)
			} else if (hoveredID === i) {
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementHoveredColor
				)
			} else {
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementInactiveColor
				)
			}
			const valueSize = this.ValuesSizes[i]
			this.RenderTextDefault(
				value,
				currentElementPos
					.Clone()
					.AddScalarX(Dropdown.dropdownPopupElementTextOffset.x)
					.AddScalarY((elementSize.y - valueSize.y + valueSize.z) / 2)
			)
			currentElementPos.AddScalarY(elementSize.y)
		})
		if (this.ValuesNames.length > Dropdown.dropdownPopupElementsLimit) {
			const rect = this.GetScrollbarRect(
				this.GetScrollbarPositionsRect(popupElementsRect)
			)
			RendererSDK.Image(Dropdown.scrollbarPath, rect.pos1, -1, rect.Size)
		}
	}
	public OnParentNotVisible(): void {
		if (Dropdown.activeDropdown === this) {
			Dropdown.activeDropdown = undefined
		}
		this.isActive = false
	}

	public OnPreMouseLeftDown(): boolean {
		return !(
			this.isActive &&
			this.GetPopupRect(this.DropdownRect).Contains(this.MousePosition)
		)
	}
	public OnMouseLeftDown(): boolean {
		return !this.IsHovered
	}
	public OnMouseLeftUp(): boolean {
		if (this.isActive) {
			const popupElementsRect = this.GetPopupElementsRect(
				this.GetPopupRect(this.DropdownRect)
			)
			if (popupElementsRect.Contains(this.MousePosition)) {
				this.SelectedID = this.GetHoveredID(popupElementsRect)
				this.isActive = false
				Dropdown.activeDropdown = undefined
				this.TriggerOnValueChangedCBs()
			}
		} else if (this.IsHovered) {
			this.isActive = !this.isActive
			if (this.isActive) {
				Dropdown.activeDropdown = this
			} else if (Dropdown.activeDropdown === this) {
				Dropdown.activeDropdown = undefined
			}
		}
		return false
	}
	public OnMouseWheel(up: boolean): boolean {
		if (!this.GetPopupRect(this.DropdownRect).Contains(this.MousePosition)) {
			return false
		}
		if (up) {
			this.currentlyAtID--
		} else {
			this.currentlyAtID++
		}
		return true
	}

	protected ApplyLocalization() {
		this.ValuesNames = this.InternalValuesNames.map(name =>
			Localization.Localize(name)
		)
		super.ApplyLocalization()
	}
	private GetScrollbarPositionsRect(popupElementsRect: Rectangle): Rectangle {
		return new Rectangle(
			new Vector2(
				popupElementsRect.pos2.x -
					Dropdown.dropdownPopupElementsScrollbarOffset.x -
					Dropdown.dropdownPopupElementsScrollbarWidth,
				popupElementsRect.pos1.y + Dropdown.dropdownPopupElementsScrollbarOffset.y
			),
			popupElementsRect.pos2.Subtract(Dropdown.dropdownPopupElementsScrollbarOffset)
		)
	}
	private GetScrollbarRect(scrollbarPositionsRect: Rectangle): Rectangle {
		const positionsSize = scrollbarPositionsRect.Size
		const scrollbarSize = new Vector2(
			Dropdown.dropdownPopupElementsScrollbarWidth,
			(positionsSize.y * Dropdown.dropdownPopupElementsLimit) /
				this.ValuesNames.length
		)
		const scrollbarPos = scrollbarPositionsRect.pos1
			.Clone()
			.AddScalarY((positionsSize.y * this.currentlyAtID) / this.ValuesNames.length)
		return new Rectangle(scrollbarPos, scrollbarPos.Add(scrollbarSize))
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => Dropdown.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
