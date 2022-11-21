import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"
import { Localization } from "./Localization"

export class Dropdown extends Base {
	public static activeDropdown: Nullable<Dropdown>
	public static readonly dropdownPopupElementsLimit = 4
	public static OnWindowSizeChanged(): void {
		Dropdown.dropdownOffset.x = GUIInfo.ScaleWidth(14)
		Dropdown.dropdownOffset.y = GUIInfo.ScaleWidth(11)
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
		Dropdown.dropdownEndGap = GUIInfo.ScaleWidth(24)
	}

	private static readonly dropdownPath = "menu/dropdown.svg"
	private static readonly dropdownArrowPath = "menu/dropdown_arrow.svg"
	private static readonly dropdownPopupPath = "menu/dropdown_popup.svg"
	private static readonly scrollbarPath = "menu/scrollbar.svg"
	private static readonly dropdownPopupElementActiveColor = new Color(8, 7, 14)
	private static readonly dropdownPopupElementHoveredColor = new Color(
		24,
		23,
		40
	)
	private static readonly dropdownPopupElementInactiveColor = new Color(
		16,
		16,
		28
	)
	private static readonly dropdownBackgroundColor = new Color(16, 16, 28)
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

	public ValuesNames: string[]
	public SelectedID = 0
	public currentlyAtID = 0
	protected ValuesSizes: Vector3[] = []
	protected readonly longestValueSize = new Vector2()

	constructor(
		parent: IMenu,
		name: string,
		public InternalValuesNames: string[],
		defaultValue = 0,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.ValuesNames = InternalValuesNames
		this.SelectedID = defaultValue
	}

	public get ConfigValue() {
		return this.SelectedID
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || typeof value !== "number") return
		this.SelectedID = value ?? this.SelectedID
		this.FixSelectedID()
		this.currentlyAtID =
			this.SelectedID - Math.floor(Dropdown.dropdownPopupElementsLimit / 2) + 1
	}
	public get DropdownRect(): Rectangle {
		const rect = this.Rect
		return new Rectangle(
			new Vector2(
				rect.pos1.x + Dropdown.dropdownOffset.x,
				rect.pos2.y -
					Dropdown.dropdownOffset.y -
					this.longestValueSize.y -
					Dropdown.dropdownTextOffset.y * 2
			),
			rect.pos2.Subtract(Dropdown.dropdownOffset).AddScalarX(2) // because dropdownOffset includes bar size
		)
	}
	public get PopupElementHeight(): number {
		return (
			this.longestValueSize.y + Dropdown.dropdownPopupElementTextOffset.y * 2
		)
	}

	public get ClassPriority(): number {
		return 4
	}

	public Update(): boolean {
		if (!super.Update()) return false
		this.ValuesSizes = this.ValuesNames.map(value =>
			this.GetTextSizeDefault(value)
		)
		this.ValuesSizes.reduce((prev, cur) => {
			prev.x = Math.max(prev.x, cur.x)
			prev.y = Math.max(prev.y, cur.y + cur.z)
			return prev
		}, new Vector2()).CopyTo(this.longestValueSize)
		this.Size.x = Math.max(
			this.nameSize.x + this.textOffset.x * 2,
			this.longestValueSize.x +
				Dropdown.dropdownTextOffset.x * 2 +
				Dropdown.dropdownOffset.x * 2 -
				2 + // because dropdownOffset includes bar size
				Dropdown.dropdownEndGap
		)
		this.Size.y =
			this.nameSize.y +
			this.textOffset.y +
			Dropdown.nameDropdownGap +
			Dropdown.dropdownTextOffset.y * 2 +
			this.longestValueSize.y +
			Dropdown.dropdownOffset.y
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
				dropdownRect.Size.y +
				popupRectSize.y +
				Dropdown.dropdownPopupOffset.y * 2
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
		if (!popupElementsRect.Contains(mousePos)) return -1
		return (
			this.currentlyAtID +
			Math.floor(
				popupElementsRect.GetOffset(mousePos).y / this.PopupElementHeight
			)
		)
	}

	public Render(): void {
		this.isActive = Dropdown.activeDropdown === this
		this.FixSelectedID()
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))
		const dropdownRect = this.DropdownRect
		RendererSDK.Image(
			Dropdown.dropdownPath,
			dropdownRect.pos1,
			-1,
			dropdownRect.Size
		)
		RendererSDK.FilledRect(
			dropdownRect.pos1.Add(Dropdown.dropdownBorderSize),
			dropdownRect.Size.SubtractForThis(
				Dropdown.dropdownBorderSize.MultiplyScalar(2)
			),
			Dropdown.dropdownBackgroundColor
		)
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
		if (!this.isActive) return
		const popupRect = this.GetPopupRect(this.DropdownRect)
		const popupElementsRect = this.GetPopupElementsRect(popupRect)
		this.currentlyAtID = Math.max(
			0,
			Math.min(
				this.currentlyAtID,
				this.ValuesNames.length - Dropdown.dropdownPopupElementsLimit
			)
		)
		RendererSDK.Image(
			Dropdown.dropdownPopupPath,
			popupRect.pos1,
			-1,
			popupRect.Size
		)
		const currentElementPos = popupElementsRect.pos1.Clone(),
			elementSize = new Vector2(
				popupElementsRect.Size.x,
				this.PopupElementHeight
			),
			hoveredID = this.GetHoveredID(popupElementsRect)
		this.ValuesNames.forEach((value, i) => {
			if (
				i < this.currentlyAtID ||
				i >= Dropdown.dropdownPopupElementsLimit + this.currentlyAtID
			)
				return
			if (this.SelectedID === i)
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementActiveColor
				)
			else if (hoveredID === i)
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementHoveredColor
				)
			else
				RendererSDK.FilledRect(
					currentElementPos,
					elementSize,
					Dropdown.dropdownPopupElementInactiveColor
				)
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
		if (Dropdown.activeDropdown === this) Dropdown.activeDropdown = undefined
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
		const dropdownRect = this.DropdownRect,
			mousePos = this.MousePosition
		if (this.isActive) {
			const popupElementsRect = this.GetPopupElementsRect(
				this.GetPopupRect(dropdownRect)
			)
			if (popupElementsRect.Contains(mousePos)) {
				this.SelectedID = this.GetHoveredID(popupElementsRect)
				this.isActive = false
				Dropdown.activeDropdown = undefined
				this.TriggerOnValueChangedCBs()
			}
		}
		if (dropdownRect.Contains(mousePos)) {
			this.isActive = !this.isActive
			if (this.isActive) Dropdown.activeDropdown = this
			else if (Dropdown.activeDropdown === this)
				Dropdown.activeDropdown = undefined
		}
		return false
	}
	public OnMouseWheel(up: boolean): boolean {
		if (!this.GetPopupRect(this.DropdownRect).Contains(this.MousePosition))
			return false
		if (up) this.currentlyAtID--
		else this.currentlyAtID++
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
				popupElementsRect.pos1.y +
					Dropdown.dropdownPopupElementsScrollbarOffset.y
			),
			popupElementsRect.pos2.Subtract(
				Dropdown.dropdownPopupElementsScrollbarOffset
			)
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
			.AddScalarY(
				(positionsSize.y * this.currentlyAtID) / this.ValuesNames.length
			)
		return new Rectangle(scrollbarPos, scrollbarPos.Add(scrollbarSize))
	}
	private FixSelectedID(): void {
		this.SelectedID = Math.max(
			Math.min(this.InternalValuesNames.length - 1, this.SelectedID),
			0
		)
	}
}

EventsSDK.on("WindowSizeChanged", () => Dropdown.OnWindowSizeChanged())
