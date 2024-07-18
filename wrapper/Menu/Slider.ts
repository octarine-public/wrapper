import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class Slider extends Base {
	public static OnWindowSizeChanged(): void {
		Slider.sliderBackgroundHeight = GUIInfo.ScaleHeight(
			Slider.origSliderBackgroundHeight
		)
		Slider.sliderBackgroundOffset.x = GUIInfo.ScaleWidth(13)
		Slider.sliderBackgroundOffset.y = GUIInfo.ScaleHeight(12)
		Slider.textValueGap = GUIInfo.ScaleWidth(20)
		Slider.textSliderVerticalGap = GUIInfo.ScaleHeight(10)
	}

	private static readonly sliderBackgroundPath = "menu/slider_background.svg"
	private static readonly sliderFillPath = "menu/slider_fill.svg"
	private static readonly origSliderBackgroundHeight = RendererSDK.GetImageSize(
		Slider.sliderBackgroundPath
	).y
	private static sliderBackgroundHeight = 0
	private static readonly sliderBackgroundOffset = new Vector2()
	private static textValueGap = 0
	private static textSliderVerticalGap = 0

	public static DraggingNow?: Slider

	public isDragging = false
	public value_ = 0

	public get value(): number {
		return this.value_
	}
	public set value(v: number) {
		const newv = v < this.min ? this.min : v > this.max ? this.max : v
		if (this.value_ !== newv) {
			this.value_ = newv
			this.TriggerOnValueChangedCBs()
			this.UpdateIsDefault()
		}
	}

	constructor(
		parent: IMenu,
		name: string,
		public readonly defaultValue = 0,
		public min = 0,
		public max = 100,
		public precision = 0,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.ResetToDefault()
	}
	public ResetToDefault(): void {
		this.value_ = this.defaultValue
		super.ResetToDefault()
	}
	public IsDefault(): boolean {
		return this.value === this.defaultValue
	}
	public get ConfigValue() {
		return this.value
	}
	public set ConfigValue(value) {
		if (typeof value !== "number" || this.ShouldIgnoreNewConfigValue) {
			return
		}
		this.value = value
	}

	public get ClassPriority(): number {
		return 3
	}

	private get SliderRect() {
		const rect = this.Rect
		return new Rectangle(
			new Vector2(
				rect.pos1.x + Slider.sliderBackgroundOffset.x,
				rect.pos2.y -
					Slider.sliderBackgroundOffset.y -
					Slider.sliderBackgroundHeight
			),
			rect.pos2.Clone().SubtractForThis(Slider.sliderBackgroundOffset).AddScalarX(1) // because sliderBackgroundOffset includes bar size (?)
		)
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		const maxValueSize = this.GetTextSizeDefault(
			this.max.toFixed(this.precision)
		).Max(this.GetTextSizeDefault(this.min.toFixed(this.precision)))
		this.Size.x =
			this.nameSize.x + this.textOffset.x * 2 + Slider.textValueGap + maxValueSize.x

		this.Size.y =
			this.textOffset.y +
			Math.max(maxValueSize.y - maxValueSize.z, this.nameSize.y - this.nameSize.z) +
			Slider.textSliderVerticalGap +
			Slider.sliderBackgroundOffset.y +
			Slider.sliderBackgroundHeight
		return true
	}

	public Render(): void {
		super.Render()
		if (this.isDragging) {
			this.OnValueChanged()
		}

		const rect = this.Rect,
			valueText = this.value.toFixed(this.precision),
			valueTextSize = this.GetTextSizeDefault(valueText),
			valueTextPos = new Vector2(
				rect.pos2.x - this.textOffset.x - valueTextSize.x,
				// eslint-disable-next-line prettier/prettier
				rect.pos1.y + this.textOffset.y - valueTextSize.y + valueTextSize.z + this.nameSize.y
			)

		this.RenderTextDefault(this.Name, rect.pos1.Add(this.textOffset))
		this.RenderTextDefault(valueText, valueTextPos)

		const sliderRect = this.SliderRect,
			sliderProgress = (this.value - this.min) / (this.max - this.min)
		RendererSDK.Image(
			Slider.sliderBackgroundPath,
			sliderRect.pos1,
			-1,
			sliderRect.Size
		)
		if (sliderProgress > 0) {
			RendererSDK.Image(
				Slider.sliderFillPath,
				sliderRect.pos1,
				-1,
				sliderRect.Size.MultiplyScalarX(sliderProgress)
			)
		}
	}
	public OnValueChanged(): void {
		const sliderRect = this.SliderRect
		const off = sliderRect.GetOffset(this.MousePosition).x
		this.value = this.Round(
			this.min + (off / sliderRect.Size.x) * (this.max - this.min)
		)
	}

	public OnMouseLeftDown(): boolean {
		if (this.Rect.Contains(this.MousePosition)) {
			this.isDragging = true
			Slider.DraggingNow = this
			return false
		}
		return true
	}
	public OnMouseLeftUp(): boolean {
		this.isDragging = false
		Slider.DraggingNow = undefined
		return false
	}
	private Round(num: number): number {
		const pow = 10 ** this.precision
		return Math.round(num * pow) / pow
	}
}

EventsSDK.on("WindowSizeChanged", () => Slider.OnWindowSizeChanged())
