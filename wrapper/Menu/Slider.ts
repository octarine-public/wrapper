import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import GUIInfo from "../GUI/GUIInfo"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"

export default class Slider extends Base {
	public static OnWindowSizeChanged(): void {
		Slider.slider_background_height = GUIInfo.ScaleHeight(Slider.orig_slider_background_height)
		Slider.slider_background_offset.x = GUIInfo.ScaleWidth(13)
		Slider.slider_background_offset.y = GUIInfo.ScaleHeight(12)
		Slider.text_value_gap = GUIInfo.ScaleWidth(20)
		Slider.text_slider_vertical_gap = GUIInfo.ScaleHeight(10)
	}

	private static readonly slider_background_path = "menu/slider_background.svg"
	private static readonly slider_fill_path = "menu/slider_fill.svg"
	private static readonly orig_slider_background_height = RendererSDK.GetImageSize(Slider.slider_background_path).y
	private static slider_background_height = 0
	private static readonly slider_background_offset = new Vector2()
	private static text_value_gap = 0
	private static text_slider_vertical_gap = 0

	public value = 0
	public is_dragging = false

	constructor(parent: IMenu, name: string, default_value = 0, public min = 0, public max = 100, public precision = 0, tooltip = "") {
		super(parent, name, tooltip)
		this.value = default_value
	}

	public get ConfigValue() {
		return this.value
	}

	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || typeof value !== "number")
			return
		this.value = value !== undefined ? Math.min(Math.max(value, this.min), this.max) : this.value
	}

	private get SliderRect() {
		const rect = this.Rect
		return new Rectangle(
			new Vector2(
				rect.pos1.x + Slider.slider_background_offset.x,
				rect.pos2.y - Slider.slider_background_offset.y - Slider.slider_background_height,
			),
			rect.pos2.Clone()
				.SubtractForThis(Slider.slider_background_offset)
				.AddScalarX(1), // because slider_background_offset includes bar size (?)
		)
	}

	public async Update(): Promise<boolean> {
		if (!(await super.Update()))
			return false
		const max_value_size = this.GetTextSizeDefault(
			this.max.toFixed(this.precision),
		).Max(this.GetTextSizeDefault(
			this.min.toFixed(this.precision),
		))
		this.OriginalSize.x =
			this.name_size.x
			+ this.text_offset.x * 2
			+ Slider.text_value_gap
			+ max_value_size.x
		this.OriginalSize.y =
			this.text_offset.y
			+ Math.max(max_value_size.y - max_value_size.z, this.name_size.y - this.name_size.z)
			+ Slider.text_slider_vertical_gap
			+ Slider.slider_background_offset.y
			+ Slider.slider_background_height
		return true
	}

	public async Render(): Promise<void> {
		await super.Render()
		if (this.is_dragging)
			await this.OnValueChanged()

		const rect = this.Rect,
			value_text = this.value.toFixed(this.precision)
		const value_text_size = this.GetTextSizeDefault(value_text)
		const name_height = this.name_size.y - this.name_size.z,
			value_height = value_text_size.y - value_text_size.z
		const max_text_size = Math.max(name_height, value_height)
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset).AddScalarY(max_text_size - name_height))
		this.RenderTextDefault(value_text, new Vector2(
			rect.pos2.x - this.text_offset.x + 2 - value_text_size.x, // +2 because text_offset includes bar size
			rect.pos1.y + this.text_offset.y + max_text_size - value_height,
		))

		const slider_rect = this.SliderRect,
			slider_progress = (this.value - this.min) / (this.max - this.min)
		RendererSDK.Image(Slider.slider_background_path, slider_rect.pos1, -1, slider_rect.Size)
		if (slider_progress > 0)
			RendererSDK.Image(Slider.slider_fill_path, slider_rect.pos1, -1, slider_rect.Size.MultiplyScalarX(slider_progress))
	}
	public async OnValueChanged(): Promise<void> {
		const slider_rect = this.SliderRect
		const off = Math.max(slider_rect.GetOffset(this.MousePosition).x, 0)
		const old_value = this.value
		this.value = Math.min(this.max, this.Round(this.min + (off / slider_rect.Size.x) * (this.max - this.min)))
		if (this.value !== old_value)
			await this.TriggerOnValueChangedCBs()
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		if (this.SliderRect.Contains(this.MousePosition)) {
			this.is_dragging = true
			return false
		}
		return true
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		this.is_dragging = false
		return false
	}
	private Round(num: number): number {
		const pow = 10 ** this.precision
		return Math.round(num * pow) / pow
	}
}

EventsSDK.on("WindowSizeChanged", () => Slider.OnWindowSizeChanged())
