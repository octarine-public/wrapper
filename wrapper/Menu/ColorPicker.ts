import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import { HSVToRGB, RGBToHSV } from "../Utils/Math"
import Base, { IMenu } from "./Base"

export default class ColorPicker extends Base {
	public static active_colorpicker: Nullable<ColorPicker>
	public static OnWindowSizeChanged(): void {
		ColorPicker.selected_color_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_selected_color_size.x)
		ColorPicker.selected_color_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_selected_color_size.y)
		ColorPicker.color_offset.x = GUIInfo.ScaleWidth(12)
		ColorPicker.color_offset.y = GUIInfo.ScaleHeight(12)
		ColorPicker.text_color_gap = GUIInfo.ScaleWidth(10)
		ColorPicker.colorpicker_background_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_colorpicker_background_size.x)
		ColorPicker.colorpicker_background_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_colorpicker_background_size.y)
		ColorPicker.text_colorpicker_gap = GUIInfo.ScaleHeight(4)
		ColorPicker.colorpicker_color_offset.x = GUIInfo.ScaleWidth(4)
		ColorPicker.colorpicker_color_offset.y = GUIInfo.ScaleHeight(4)
		ColorPicker.colorpicker_color_size = ColorPicker.colorpicker_background_size.x - (ColorPicker.colorpicker_color_offset.x * 2)
		ColorPicker.colorpicker_hue_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_colorpicker_hue_size.x)
		ColorPicker.colorpicker_hue_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_colorpicker_hue_size.y)
		ColorPicker.colorpicker_color_hue_gap = GUIInfo.ScaleHeight(6)
		ColorPicker.colorpicker_alpha_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_colorpicker_alpha_size.x)
		ColorPicker.colorpicker_alpha_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_colorpicker_alpha_size.y)
		ColorPicker.colorpicker_color_alpha_gap = GUIInfo.ScaleHeight(6)
		ColorPicker.colorpicker_picker_circle_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_colorpicker_picker_circle_size.x)
		ColorPicker.colorpicker_picker_circle_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_colorpicker_picker_circle_size.y)
		ColorPicker.colorpicker_picker_rect_size.x = GUIInfo.ScaleWidth(ColorPicker.orig_colorpicker_picker_rect_size.x)
		ColorPicker.colorpicker_picker_rect_size.y = GUIInfo.ScaleHeight(ColorPicker.orig_colorpicker_picker_rect_size.y)
		ColorPicker.colorpicker_text_y_offset = GUIInfo.ScaleHeight(10)
		ColorPicker.colorpicker_text_x_size = GUIInfo.ScaleWidth(43)
		ColorPicker.colorpicker_text_x_gap = GUIInfo.ScaleWidth(3)
	}

	private static readonly selected_color_path = "menu/colorpicker_selected_color.svg"
	private static readonly selected_color_transparency_path = "menu/colorpicker_selected_color_transparency.svg"
	private static readonly orig_selected_color_size = RendererSDK.GetImageSize(ColorPicker.selected_color_path)
	private static readonly selected_color_size = new Vector2()
	private static readonly color_offset = new Vector2()
	private static text_color_gap = 0
	private static readonly colorpicker_background_path = "menu/colorpicker_background.svg"
	private static readonly orig_colorpicker_background_size = RendererSDK.GetImageSize(ColorPicker.colorpicker_background_path)
	private static readonly colorpicker_background_size = new Vector2()
	private static text_colorpicker_gap = 4
	private static readonly colorpicker_color_offset = new Vector2()
	private static colorpicker_color_size = 0
	private static readonly colorpicker_color_path = "menu/colorpicker_color.svg"
	private static readonly colorpicker_overlay_path = "menu/colorpicker_overlay.svg"
	private static readonly colorpicker_hue_path = "menu/colorpicker_hue.svg"
	private static readonly orig_colorpicker_hue_size = RendererSDK.GetImageSize(ColorPicker.colorpicker_hue_path)
	private static readonly colorpicker_hue_size = new Vector2()
	private static colorpicker_color_hue_gap = 0
	private static readonly colorpicker_alpha_path = "menu/colorpicker_alpha.svg"
	private static readonly orig_colorpicker_alpha_size = RendererSDK.GetImageSize(ColorPicker.colorpicker_alpha_path)
	private static readonly colorpicker_alpha_size = new Vector2()
	private static colorpicker_color_alpha_gap = 0
	private static readonly colorpicker_picker_circle_path = "menu/colorpicker_picker_circle.svg"
	private static readonly orig_colorpicker_picker_circle_size = RendererSDK.GetImageSize(ColorPicker.colorpicker_picker_circle_path)
	private static readonly colorpicker_picker_circle_size = new Vector2()
	private static readonly colorpicker_picker_rect_path = "menu/colorpicker_picker_rect.svg"
	private static readonly orig_colorpicker_picker_rect_size = RendererSDK.GetImageSize(ColorPicker.colorpicker_picker_rect_path)
	private static readonly colorpicker_picker_rect_size = new Vector2()
	private static colorpicker_text_y_offset = 0
	private static colorpicker_text_x_size = 0
	private static colorpicker_text_x_gap = 0

	public readonly selected_color = new Color()
	protected dragging_color = false
	protected dragging_hue = false
	protected dragging_alpha = false
	protected readonly dragging_offset = new Vector2()

	constructor(parent: IMenu, name: string, default_color = Color.White, tooltip = "") {
		super(parent, name, tooltip)
		default_color.CopyTo(this.selected_color)
	}

	public get ConfigValue() {
		return this.selected_color.toArray()
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || value === undefined || !Array.isArray(value))
			return
		this.selected_color.r = Math.max(0, Math.min(255, value[0] ?? this.selected_color.r))
		this.selected_color.g = Math.max(0, Math.min(255, value[1] ?? this.selected_color.g))
		this.selected_color.b = Math.max(0, Math.min(255, value[2] ?? this.selected_color.b))
		this.selected_color.a = Math.max(0, Math.min(255, value[3] ?? this.selected_color.a))
	}
	private get SelectedColorRect() {
		const base_pos = this.Position.Add(this.TotalSize).SubtractForThis(ColorPicker.color_offset)
		return new Rectangle(base_pos.Subtract(ColorPicker.selected_color_size), base_pos)
	}
	private get ColorPickerRect(): Rectangle {
		const base_pos = this.Position.Add(this.text_offset).AddScalarY(this.name_size.y + ColorPicker.text_colorpicker_gap)
		const colorpicker_rect = new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_background_size),
		)
		if (colorpicker_rect.pos2.y > this.WindowSize.y) {
			const move_y = this.name_size.y + ColorPicker.colorpicker_background_size.y + ColorPicker.text_colorpicker_gap * 2
			colorpicker_rect.pos1.SubtractScalarY(move_y)
			colorpicker_rect.pos2.SubtractScalarY(move_y)
		}
		return colorpicker_rect
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false
		this.OriginalSize.x =
			this.text_offset.x
			+ this.name_size.x
			+ ColorPicker.text_color_gap
			+ ColorPicker.selected_color_size.x
			+ ColorPicker.color_offset.x
		return true
	}

	public async Render(): Promise<void> {
		this.is_active = ColorPicker.active_colorpicker === this
		await super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))
		const selected_color_rect = this.SelectedColorRect
		RendererSDK.Image(
			ColorPicker.selected_color_transparency_path,
			selected_color_rect.pos1,
			-1,
			selected_color_rect.Size,
		)
		RendererSDK.Image(
			ColorPicker.selected_color_path,
			selected_color_rect.pos1,
			-1,
			selected_color_rect.Size,
			this.selected_color,
		)
	}
	public async PostRender(): Promise<void> {
		if (!this.is_active)
			return
		const colorpicker_rect = this.ColorPickerRect,
			selected_color_no_alpha = this.selected_color.Clone().SetA(255)
		RendererSDK.Image(ColorPicker.colorpicker_background_path, colorpicker_rect.pos1, -1, colorpicker_rect.Size)
		const [h] = RGBToHSV(this.selected_color.r, this.selected_color.g, this.selected_color.b)
		const hue_color = new Color(...HSVToRGB(h, 1, 1))
		const colorpicker_color_rect = this.GetColorPickerColorRect(colorpicker_rect)
		RendererSDK.Image(
			ColorPicker.colorpicker_color_path,
			colorpicker_color_rect.pos1,
			-1,
			colorpicker_color_rect.Size,
			hue_color,
		)
		RendererSDK.Image(
			ColorPicker.colorpicker_overlay_path,
			colorpicker_color_rect.pos1,
			-1,
			colorpicker_color_rect.Size,
		)

		const colorpicker_circle_rect = this.GetColorPickerCircleRect(colorpicker_color_rect)
		RendererSDK.FilledRect(
			colorpicker_circle_rect.pos1.AddScalar(4),
			colorpicker_circle_rect.Size.SubtractScalarForThis(8),
			selected_color_no_alpha,
		)
		RendererSDK.Image(
			ColorPicker.colorpicker_picker_circle_path,
			colorpicker_circle_rect.pos1,
			-1,
			colorpicker_circle_rect.Size,
		)

		const colorpicker_hue_rect = this.GetColorPickerHueRect(colorpicker_color_rect)
		RendererSDK.Image(ColorPicker.colorpicker_hue_path, colorpicker_hue_rect.pos1, -1, colorpicker_hue_rect.Size)

		const colorpicker_hue_picker_rect = this.GetColorPickerHuePickerRect(colorpicker_hue_rect)
		RendererSDK.FilledRect(
			colorpicker_hue_picker_rect.pos1.AddScalar(1),
			colorpicker_hue_picker_rect.Size.SubtractScalarForThis(2),
			hue_color,
		)
		RendererSDK.Image(
			ColorPicker.colorpicker_picker_rect_path,
			colorpicker_hue_picker_rect.pos1,
			-1,
			colorpicker_hue_picker_rect.Size,
		)

		const colorpicker_alpha_rect = this.GetColorPickerAlphaRect(colorpicker_hue_rect)
		RendererSDK.Image(
			ColorPicker.colorpicker_alpha_path,
			colorpicker_alpha_rect.pos1,
			-1,
			colorpicker_alpha_rect.Size,
			selected_color_no_alpha,
		)

		const colorpicker_alpha_picker_rect = this.GetColorPickerAlphaPickerRect(colorpicker_alpha_rect)
		RendererSDK.FilledRect(
			colorpicker_alpha_picker_rect.pos1.AddScalar(1),
			colorpicker_alpha_picker_rect.Size.SubtractScalarForThis(2),
			this.selected_color,
		)
		RendererSDK.Image(
			ColorPicker.colorpicker_picker_rect_path,
			colorpicker_alpha_picker_rect.pos1,
			-1,
			colorpicker_alpha_picker_rect.Size,
		)

		const text_base_pos = colorpicker_rect.pos1
			.Clone()
			.AddScalarX(ColorPicker.colorpicker_color_offset.x)
			.AddScalarY(colorpicker_rect.Height - ColorPicker.colorpicker_text_y_offset)
		const r_text = Math.round(this.selected_color.r).toString(),
			g_text = Math.round(this.selected_color.g).toString(),
			b_text = Math.round(this.selected_color.b).toString()
		const r_text_size = this.GetTextSizeDefault(r_text),
			g_text_size = this.GetTextSizeDefault(g_text),
			b_text_size = this.GetTextSizeDefault(b_text)
		this.RenderTextDefault(
			r_text,
			text_base_pos
				.Clone()
				.AddScalarX((ColorPicker.colorpicker_text_x_size - r_text_size.x) / 2)
				.SubtractScalarY(r_text_size.y + r_text_size.z),
		)
		text_base_pos.AddScalarX(ColorPicker.colorpicker_text_x_size + ColorPicker.colorpicker_text_x_gap)
		this.RenderTextDefault(
			g_text,
			text_base_pos
				.Clone()
				.AddScalarX((ColorPicker.colorpicker_text_x_size - g_text_size.x) / 2)
				.SubtractScalarY(g_text_size.y + g_text_size.z),
		)
		text_base_pos.AddScalarX(ColorPicker.colorpicker_text_x_size + ColorPicker.colorpicker_text_x_gap)
		this.RenderTextDefault(
			b_text,
			text_base_pos
				.Clone()
				.AddScalarX((ColorPicker.colorpicker_text_x_size - b_text_size.x) / 2)
				.SubtractScalarY(b_text_size.y + b_text_size.z),
		)

		const mouse_pos = this.MousePosition.SubtractForThis(this.dragging_offset)
		if (this.dragging_color) {
			const sv = mouse_pos.SubtractForThis(colorpicker_color_rect.pos1).DivideForThis(colorpicker_color_rect.Size)
			const s = Math.min(Math.max(sv.x, 0), 1),
				v = 1 - Math.min(Math.max(sv.y, 0), 1)
			const [r, g, b] = HSVToRGB(h, s, v)
			this.selected_color.SetColor(r, g, b, this.selected_color.a)
		} else if (this.dragging_hue) {
			const hue = Math.min(Math.max((mouse_pos.x - colorpicker_hue_rect.pos1.x) / colorpicker_hue_rect.Width, 0), 0.99)
			const [, s, v] = RGBToHSV(this.selected_color.r, this.selected_color.g, this.selected_color.b)
			const [r, g, b] = HSVToRGB(hue, s, v)
			this.selected_color.SetColor(r, g, b, this.selected_color.a)
		} else if (this.dragging_alpha) {
			const alpha = Math.min(Math.max((mouse_pos.x - colorpicker_hue_rect.pos1.x) / colorpicker_hue_rect.Width, 0), 1)
			this.selected_color.SetA(Math.round(alpha * 255))
		}
		if (this.dragging_color || this.dragging_hue || this.dragging_alpha)
			await this.TriggerOnValueChangedCBs()
	}
	public OnParentNotVisible(): void {
		if (ColorPicker.active_colorpicker === this)
			ColorPicker.active_colorpicker = undefined
		this.is_active = false
	}
	public async OnPreMouseLeftDown(): Promise<boolean> {
		const colorpicker_rect = this.ColorPickerRect,
			mouse_pos = this.MousePosition
		if (!(this.is_active && colorpicker_rect.Contains(mouse_pos)))
			return true
		const colorpicker_color_rect = this.GetColorPickerColorRect(colorpicker_rect)
		const colorpicker_color_picker_rect = this.GetColorPickerCircleRect(colorpicker_color_rect)
		const colorpicker_hue_rect = this.GetColorPickerHueRect(colorpicker_color_rect)
		const colorpicker_hue_picker_rect = this.GetColorPickerHuePickerRect(colorpicker_hue_rect)
		const colorpicker_alpha_rect = this.GetColorPickerAlphaRect(colorpicker_hue_rect)
		const colorpicker_alpha_picker_rect = this.GetColorPickerAlphaPickerRect(colorpicker_alpha_rect)
		if (colorpicker_color_picker_rect.Contains(mouse_pos)) {
			this.dragging_color = true
			this.dragging_hue = this.dragging_alpha = false
			mouse_pos.SubtractForThis(colorpicker_color_picker_rect.Center).CopyTo(this.dragging_offset)
		} else if (colorpicker_color_rect.Contains(mouse_pos)) {
			this.dragging_color = true
			this.dragging_hue = this.dragging_alpha = false
			this.dragging_offset.SetX(0).SetY(0)
		} else if (colorpicker_hue_picker_rect.Contains(mouse_pos)) {
			this.dragging_hue = true
			this.dragging_color = this.dragging_alpha = false
			mouse_pos.SubtractForThis(colorpicker_hue_picker_rect.Center).CopyTo(this.dragging_offset)
		} else if (colorpicker_hue_rect.Contains(mouse_pos)) {
			this.dragging_hue = true
			this.dragging_color = this.dragging_alpha = false
			this.dragging_offset.SetX(0).SetY(0)
		} else if (colorpicker_alpha_picker_rect.Contains(mouse_pos)) {
			this.dragging_alpha = true
			this.dragging_color = this.dragging_hue = false
			mouse_pos.SubtractForThis(colorpicker_alpha_picker_rect.Center).CopyTo(this.dragging_offset)
		} else if (colorpicker_alpha_rect.Contains(mouse_pos)) {
			this.dragging_alpha = true
			this.dragging_color = this.dragging_hue = false
			this.dragging_offset.SetX(0).SetY(0)
		}
		return false
	}
	public async OnMouseLeftDown(): Promise<boolean> {
		if (!this.IsHovered)
			return true
		if (ColorPicker.active_colorpicker !== this) {
			ColorPicker.active_colorpicker = this
			this.is_active = true
		} else {
			ColorPicker.active_colorpicker = undefined
			this.is_active = false
		}
		return false
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		this.dragging_color = this.dragging_hue = this.dragging_alpha = false
		return false
	}
	private GetColorPickerColorRect(colorpicker_rect: Rectangle): Rectangle {
		const base_pos = colorpicker_rect.pos1.Add(ColorPicker.colorpicker_color_offset)
		return new Rectangle(
			base_pos,
			base_pos.AddScalar(ColorPicker.colorpicker_color_size),
		)
	}
	private GetColorPickerCircleRect(colorpicker_color_rect: Rectangle): Rectangle {
		const [, s, v] = RGBToHSV(this.selected_color.r, this.selected_color.g, this.selected_color.b)
		const base_pos = colorpicker_color_rect.pos1
			.Add(colorpicker_color_rect.Size.MultiplyScalarX(s).MultiplyScalarY(1 - v))
			.SubtractForThis(ColorPicker.colorpicker_picker_circle_size.DivideScalar(2))
		return new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_picker_circle_size),
		)
	}
	private GetColorPickerHueRect(colorpicker_color_rect: Rectangle): Rectangle {
		const base_pos = colorpicker_color_rect.pos1
			.Clone()
			.AddScalarY(colorpicker_color_rect.Height + ColorPicker.colorpicker_color_hue_gap)
		return new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_hue_size),
		)
	}
	private GetColorPickerHuePickerRect(colorpicker_hue_rect: Rectangle): Rectangle {
		const [h] = RGBToHSV(this.selected_color.r, this.selected_color.g, this.selected_color.b)
		const base_pos = colorpicker_hue_rect.pos1
			.Clone()
			.AddScalarX(colorpicker_hue_rect.Size.x * h)
			.SubtractScalarX(ColorPicker.colorpicker_picker_rect_size.x / 2)
			.AddScalarY((colorpicker_hue_rect.Height - ColorPicker.colorpicker_picker_rect_size.y) / 2)
		return new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_picker_rect_size),
		)
	}
	private GetColorPickerAlphaRect(colorpicker_hue_rect: Rectangle): Rectangle {
		const base_pos = colorpicker_hue_rect.pos1
			.Clone()
			.AddScalarY(colorpicker_hue_rect.Height + ColorPicker.colorpicker_color_alpha_gap)
		return new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_alpha_size),
		)
	}
	private GetColorPickerAlphaPickerRect(colorpicker_alpha_rect: Rectangle): Rectangle {
		const base_pos = colorpicker_alpha_rect.pos1
			.Clone()
			.AddScalarX(colorpicker_alpha_rect.Size.x * this.selected_color.a / 255)
			.SubtractScalarX(ColorPicker.colorpicker_picker_rect_size.x / 2)
			.AddScalarY((colorpicker_alpha_rect.Height - ColorPicker.colorpicker_picker_rect_size.y) / 2)
		return new Rectangle(
			base_pos,
			base_pos.Add(ColorPicker.colorpicker_picker_rect_size),
		)
	}
}

EventsSDK.on("WindowSizeChanged", () => ColorPicker.OnWindowSizeChanged())
