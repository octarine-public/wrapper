import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"
import Localization from "./Localization"

export default class Dropdown extends Base {
	public static active_dropdown: Nullable<Dropdown>
	public static readonly dropdown_popup_elements_limit = 4
	public static OnWindowSizeChanged(): void {
		Dropdown.dropdown_offset.x = GUIInfo.ScaleWidth(14)
		Dropdown.dropdown_offset.y = GUIInfo.ScaleWidth(11)
		Dropdown.dropdown_border_size.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdown_border_size.y = GUIInfo.ScaleWidth(2)
		Dropdown.dropdown_arrow_size.x = GUIInfo.ScaleWidth(Dropdown.orig_dropdown_arrow_size.x)
		Dropdown.dropdown_arrow_size.y = GUIInfo.ScaleHeight(Dropdown.orig_dropdown_arrow_size.y)
		Dropdown.dropdown_text_offset.x = GUIInfo.ScaleWidth(9)
		Dropdown.dropdown_text_offset.y = GUIInfo.ScaleHeight(8)
		Dropdown.dropdown_popup_offset.x = 0
		Dropdown.dropdown_popup_offset.y = GUIInfo.ScaleHeight(-2)
		Dropdown.dropdown_popup_elements_offset.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdown_popup_elements_offset.y = GUIInfo.ScaleHeight(2)
		Dropdown.dropdown_popup_element_text_offset.x = GUIInfo.ScaleWidth(7)
		Dropdown.dropdown_popup_element_text_offset.y = GUIInfo.ScaleHeight(7)
		Dropdown.dropdown_popup_elements_scrollbar_offset.x = GUIInfo.ScaleWidth(2)
		Dropdown.dropdown_popup_elements_scrollbar_offset.y = GUIInfo.ScaleHeight(2)
		Dropdown.dropdown_popup_elements_scrollbar_width = GUIInfo.ScaleWidth(3)
		Dropdown.name_dropdown_gap = GUIInfo.ScaleHeight(8)
		Dropdown.dropdown_end_gap = GUIInfo.ScaleWidth(24)
	}

	private static readonly dropdown_path = "menu/dropdown.svg"
	private static readonly dropdown_arrow_path = "menu/dropdown_arrow.svg"
	private static readonly dropdown_popup_path = "menu/dropdown_popup.svg"
	private static readonly scrollbar_path = "menu/scrollbar.svg"
	private static readonly dropdown_popup_element_active_color = new Color(8, 7, 14)
	private static readonly dropdown_popup_element_hovered_color = new Color(24, 23, 40)
	private static readonly dropdown_popup_element_inactive_color = new Color(16, 16, 28)
	private static readonly dropdown_background_color = new Color(16, 16, 28)
	private static readonly dropdown_arrow_active_color = new Color(104, 4, 255)
	private static readonly dropdown_arrow_inactive_color = new Color(47, 45, 77)
	private static readonly dropdown_offset = new Vector2()
	private static readonly dropdown_border_size = new Vector2()
	private static readonly orig_dropdown_arrow_size = RendererSDK.GetImageSize(Dropdown.dropdown_arrow_path)
	private static readonly dropdown_arrow_size = new Vector2()
	private static readonly dropdown_text_offset = new Vector2()
	private static readonly dropdown_popup_offset = new Vector2()
	private static readonly dropdown_popup_elements_offset = new Vector2()
	private static readonly dropdown_popup_element_text_offset = new Vector2()
	private static readonly dropdown_popup_elements_scrollbar_offset = new Vector2()
	private static dropdown_popup_elements_scrollbar_width = 0
	private static name_dropdown_gap = 0
	private static dropdown_end_gap = 0

	public ValuesNames: string[]
	public selected_id = 0
	public currently_at_id = 0
	protected ValuesSizes: Vector3[] = []
	protected readonly longest_value_size = new Vector2()

	constructor(parent: IMenu, name: string, public InternalValuesNames: string[], default_value = 0, tooltip = "") {
		super(parent, name, tooltip)
		this.ValuesNames = InternalValuesNames
		this.selected_id = default_value
	}

	public get ConfigValue() { return this.selected_id }
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || typeof value !== "number")
			return
		this.selected_id = value ?? this.selected_id
		this.FixSelectedID()
		this.currently_at_id = this.selected_id - Math.floor(Dropdown.dropdown_popup_elements_limit / 2) + 1
	}
	public get DropdownRect(): Rectangle {
		const rect = this.Rect
		return new Rectangle(
			new Vector2(
				rect.pos1.x + Dropdown.dropdown_offset.x,
				rect.pos2.y - Dropdown.dropdown_offset.y - this.longest_value_size.y - (Dropdown.dropdown_text_offset.y * 2),
			),
			rect.pos2
				.Subtract(Dropdown.dropdown_offset)
				.AddScalarX(2), // because dropdown_offset includes bar size
		)
	}
	public get PopupElementHeight(): number {
		return this.longest_value_size.y + Dropdown.dropdown_popup_element_text_offset.y * 2
	}

	public get ClassPriority(): number {
		return 4
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false
		this.ValuesSizes = this.ValuesNames.map(value => this.GetTextSizeDefault(value))
		this.ValuesSizes.reduce((prev, cur) => {
			prev.x = Math.max(prev.x, cur.x)
			prev.y = Math.max(prev.y, cur.y + cur.z)
			return prev
		}, new Vector2()).CopyTo(this.longest_value_size)
		this.Size.x = Math.max(
			this.name_size.x + this.text_offset.x * 2,
			this.longest_value_size.x
			+ (Dropdown.dropdown_text_offset.x * 2)
			+ (Dropdown.dropdown_offset.x * 2)
			- 2 // because dropdown_offset includes bar size
			+ Dropdown.dropdown_end_gap,
		)
		this.Size.y =
			this.name_size.y
			+ this.text_offset.y
			+ Dropdown.name_dropdown_gap
			+ (Dropdown.dropdown_text_offset.y * 2)
			+ this.longest_value_size.y
			+ Dropdown.dropdown_offset.y
		return true
	}

	public GetArrowRect(dropdown_rect: Rectangle): Rectangle {
		const base_pos = dropdown_rect.pos2.Subtract(Dropdown.dropdown_border_size)
		return new Rectangle(
			base_pos.Subtract(Dropdown.dropdown_arrow_size),
			base_pos,
		)
	}
	public GetPopupRect(dropdown_rect: Rectangle): Rectangle {
		const y = dropdown_rect.pos2.y + Dropdown.dropdown_popup_offset.y
		const popup_rect = new Rectangle(
			new Vector2(
				dropdown_rect.pos1.x + Dropdown.dropdown_popup_offset.x,
				y,
			),
			new Vector2(
				dropdown_rect.pos2.x + Dropdown.dropdown_popup_offset.x,
				y + (Dropdown.dropdown_popup_elements_offset.y * 2),
			).AddScalarY(
				this.PopupElementHeight
				* Math.min(
					Dropdown.dropdown_popup_elements_limit,
					this.ValuesNames.length,
				),
			),
		)
		const popup_rect_size = popup_rect.Size
		if (popup_rect.pos1.y + popup_rect_size.y > this.WindowSize.y) {
			const off = dropdown_rect.Size.y + popup_rect_size.y + Dropdown.dropdown_popup_offset.y * 2
			popup_rect.pos1.SubtractScalarY(off)
			popup_rect.pos2.SubtractScalarY(off)
		}
		return popup_rect
	}
	public GetPopupElementsRect(popup_rect: Rectangle): Rectangle {
		return new Rectangle(
			popup_rect.pos1.Add(Dropdown.dropdown_popup_elements_offset),
			popup_rect.pos2.Subtract(Dropdown.dropdown_popup_elements_offset),
		)
	}
	public GetHoveredID(popup_elements_rect: Rectangle): number {
		const mouse_pos = this.MousePosition
		if (!popup_elements_rect.Contains(mouse_pos))
			return -1
		return this.currently_at_id + Math.floor(popup_elements_rect.GetOffset(mouse_pos).y / this.PopupElementHeight)
	}

	public async Render(): Promise<void> {
		this.is_active = Dropdown.active_dropdown === this
		this.FixSelectedID()
		await super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))
		const dropdown_rect = this.DropdownRect
		RendererSDK.Image(Dropdown.dropdown_path, dropdown_rect.pos1, -1, dropdown_rect.Size)
		RendererSDK.FilledRect(
			dropdown_rect.pos1.Add(Dropdown.dropdown_border_size),
			dropdown_rect.Size.SubtractForThis(Dropdown.dropdown_border_size.MultiplyScalar(2)),
			Dropdown.dropdown_background_color,
		)
		const arrow_rect = this.GetArrowRect(dropdown_rect)
		RendererSDK.Image(
			Dropdown.dropdown_arrow_path,
			arrow_rect.pos1,
			-1,
			arrow_rect.Size,
			this.is_active
				? Dropdown.dropdown_arrow_active_color
				: Dropdown.dropdown_arrow_inactive_color,
		)
		if (this.ValuesNames.length !== 0) {
			const value_size = this.ValuesSizes[this.selected_id]
			this.RenderTextDefault(
				this.ValuesNames[this.selected_id],
				dropdown_rect.pos1
					.Clone()
					.AddScalarX(Dropdown.dropdown_text_offset.x)
					.AddScalarY((dropdown_rect.Size.y - (value_size.y + value_size.z)) / 2),
			)
		}
	}
	public async PostRender(): Promise<void> {
		if (!this.is_active)
			return
		const popup_rect = this.GetPopupRect(this.DropdownRect)
		const popup_elements_rect = this.GetPopupElementsRect(popup_rect)
		this.currently_at_id = Math.max(
			0,
			Math.min(
				this.currently_at_id,
				this.ValuesNames.length - Dropdown.dropdown_popup_elements_limit,
			),
		)
		RendererSDK.Image(Dropdown.dropdown_popup_path, popup_rect.pos1, -1, popup_rect.Size)
		const current_element_pos = popup_elements_rect.pos1.Clone(),
			element_size = new Vector2(popup_elements_rect.Size.x, this.PopupElementHeight),
			hovered_id = this.GetHoveredID(popup_elements_rect)
		this.ValuesNames.forEach((value, i) => {
			if (
				i < this.currently_at_id
				|| i >= (Dropdown.dropdown_popup_elements_limit + this.currently_at_id)
			)
				return
			if (this.selected_id === i)
				RendererSDK.FilledRect(
					current_element_pos,
					element_size,
					Dropdown.dropdown_popup_element_active_color,
				)
			else if (hovered_id === i)
				RendererSDK.FilledRect(
					current_element_pos,
					element_size,
					Dropdown.dropdown_popup_element_hovered_color,
				)
			else
				RendererSDK.FilledRect(
					current_element_pos,
					element_size,
					Dropdown.dropdown_popup_element_inactive_color,
				)
			const value_size = this.ValuesSizes[i]
			this.RenderTextDefault(
				value,
				current_element_pos
					.Clone()
					.AddScalarX(Dropdown.dropdown_popup_element_text_offset.x)
					.AddScalarY((element_size.y - value_size.y + value_size.z) / 2),
			)
			current_element_pos.AddScalarY(element_size.y)
		})
		if (this.ValuesNames.length > Dropdown.dropdown_popup_elements_limit) {
			const rect = this.GetScrollbarRect(this.GetScrollbarPositionsRect(popup_elements_rect))
			RendererSDK.Image(Dropdown.scrollbar_path, rect.pos1, -1, rect.Size)
		}
	}
	public OnParentNotVisible(): void {
		if (Dropdown.active_dropdown === this)
			Dropdown.active_dropdown = undefined
		this.is_active = false
	}

	public async OnPreMouseLeftDown(): Promise<boolean> {
		return !(
			this.is_active
			&& this.GetPopupRect(this.DropdownRect).Contains(this.MousePosition)
		)
	}
	public async OnMouseLeftDown(): Promise<boolean> {
		return !this.IsHovered
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		const dropdown_rect = this.DropdownRect,
			mouse_pos = this.MousePosition
		if (this.is_active) {
			const popup_elements_rect = this.GetPopupElementsRect(this.GetPopupRect(dropdown_rect))
			if (popup_elements_rect.Contains(mouse_pos)) {
				this.selected_id = this.GetHoveredID(popup_elements_rect)
				this.is_active = false
				Dropdown.active_dropdown = undefined
				await this.TriggerOnValueChangedCBs()
			}
		}
		if (dropdown_rect.Contains(mouse_pos)) {
			this.is_active = !this.is_active
			if (this.is_active)
				Dropdown.active_dropdown = this
			else if (Dropdown.active_dropdown === this)
				Dropdown.active_dropdown = undefined
		}
		return false
	}
	public OnMouseWheel(up: boolean): boolean {
		if (!this.GetPopupRect(this.DropdownRect).Contains(this.MousePosition))
			return false
		if (up)
			this.currently_at_id--
		else
			this.currently_at_id++
		return true
	}

	protected async ApplyLocalization() {
		this.ValuesNames = this.InternalValuesNames.map(name => Localization.Localize(name))
		await super.ApplyLocalization()
	}
	private GetScrollbarPositionsRect(popup_elements_rect: Rectangle): Rectangle {
		return new Rectangle(
			new Vector2(
				popup_elements_rect.pos2.x
				- Dropdown.dropdown_popup_elements_scrollbar_offset.x
				- Dropdown.dropdown_popup_elements_scrollbar_width,
				popup_elements_rect.pos1.y
				+ Dropdown.dropdown_popup_elements_scrollbar_offset.y,
			),
			popup_elements_rect.pos2.Subtract(Dropdown.dropdown_popup_elements_scrollbar_offset),
		)
	}
	private GetScrollbarRect(scrollbar_positions_rect: Rectangle): Rectangle {
		const positions_size = scrollbar_positions_rect.Size
		const scrollbar_size = new Vector2(
			Dropdown.dropdown_popup_elements_scrollbar_width,
			positions_size.y * Dropdown.dropdown_popup_elements_limit / this.ValuesNames.length,
		)
		const scrollbar_pos = scrollbar_positions_rect.pos1.Clone().AddScalarY(
			positions_size.y * this.currently_at_id / this.ValuesNames.length,
		)
		return new Rectangle(
			scrollbar_pos,
			scrollbar_pos.Add(scrollbar_size),
		)
	}
	private FixSelectedID(): void {
		this.selected_id = Math.max(Math.min(this.InternalValuesNames.length - 1, this.selected_id), 0)
	}
}

EventsSDK.on("WindowSizeChanged", () => Dropdown.OnWindowSizeChanged())
