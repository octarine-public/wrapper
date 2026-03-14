import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class RangeSlider extends Base {
	public static DraggingNow?: RangeSlider

	public static OnWindowSizeChanged(): void {
		RangeSlider.sliderBackgroundHeight = ScaleHeight(
			RangeSlider.origSliderBackgroundHeight
		)
		RangeSlider.sliderBackgroundOffset.x = ScaleWidth(13)
		RangeSlider.sliderBackgroundOffset.y = ScaleHeight(12)
		RangeSlider.textValueGap = ScaleWidth(20)
		RangeSlider.textSliderVerticalGap = ScaleHeight(10)
		RangeSlider.handleRadius = ScaleHeight(RangeSlider.origHandleRadius)
		RangeSlider.trackHeight = ScaleHeight(RangeSlider.origTrackHeight)
	}

	private static readonly sliderBackgroundPath = "menu/slider_background.svg"
	private static readonly origSliderBackgroundHeight = RendererSDK.GetImageSize(
		RangeSlider.sliderBackgroundPath
	).y
	private static sliderBackgroundHeight = 0
	private static readonly sliderBackgroundOffset = new Vector2()
	private static textValueGap = 0
	private static textSliderVerticalGap = 0

	private static readonly origHandleRadius = 9
	private static handleRadius = 0
	private static readonly origTrackHeight = 6
	private static trackHeight = 0
	private static readonly trackActiveColor = new Color(104, 4, 255)
	private static readonly trackInactiveColor = new Color(50, 50, 70)

	public isDraggingMin = false
	public isDraggingMax = false
	public minValue_ = 0
	public maxValue_ = 0

	public get minValue(): number {
		return this.minValue_
	}
	public set minValue(v: number) {
		let newv = v < this.min ? this.min : v > this.max ? this.max : v
		if (newv > this.maxValue_) {
			newv = this.maxValue_
		}
		if (this.minValue_ !== newv) {
			this.minValue_ = newv
			this.TriggerOnValueChangedCBs()
			this.UpdateIsDefault()
		}
	}

	public get maxValue(): number {
		return this.maxValue_
	}
	public set maxValue(v: number) {
		let newv = v < this.min ? this.min : v > this.max ? this.max : v
		if (newv < this.minValue_) {
			newv = this.minValue_
		}
		if (this.maxValue_ !== newv) {
			this.maxValue_ = newv
			this.TriggerOnValueChangedCBs()
			this.UpdateIsDefault()
		}
	}

	constructor(
		parent: IMenu,
		name: string,
		public readonly defaultMinValue = 0,
		public readonly defaultMaxValue = 100,
		public min = 0,
		public max = 100,
		public precision = 0,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.ResetToDefault()
	}
	public ResetToDefault(): void {
		this.minValue_ = this.defaultMinValue
		this.maxValue_ = this.defaultMaxValue
		super.ResetToDefault()
	}
	public IsDefault(): boolean {
		return (
			this.minValue === this.defaultMinValue &&
			this.maxValue === this.defaultMaxValue
		)
	}
	public get ConfigValue() {
		return [this.minValue, this.maxValue]
	}
	public set ConfigValue(value) {
		if (
			!Array.isArray(value) ||
			value.length < 2 ||
			this.ShouldIgnoreNewConfigValue
		) {
			return
		}
		this.minValue = value[0]
		this.maxValue = value[1]
	}

	public get ClassPriority(): number {
		return 3
	}

	private get SliderRect() {
		const rect = this.Rect
		return new Rectangle(
			new Vector2(
				rect.pos1.x + RangeSlider.sliderBackgroundOffset.x,
				rect.pos2.y -
					RangeSlider.sliderBackgroundOffset.y -
					RangeSlider.sliderBackgroundHeight
			),
			rect.pos2
				.Clone()
				.SubtractForThis(RangeSlider.sliderBackgroundOffset)
				.AddScalarX(Base.barWidth)
		)
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		const maxValueSize = this.GetTextSizeDefault(
			this.max.toFixed(this.precision)
		).Max(this.GetTextSizeDefault(this.min.toFixed(this.precision)))
		// account for "value - value" text width (both max values + separator)
		const separatorSize = this.GetTextSizeDefault(" - ")
		this.Size.x =
			this.nameSize.x +
			this.textOffset.x * 2 +
			RangeSlider.textValueGap +
			maxValueSize.x * 2 +
			separatorSize.x

		this.Size.y =
			this.textOffset.y +
			Math.max(maxValueSize.y - maxValueSize.z, this.nameSize.y - this.nameSize.z) +
			RangeSlider.textSliderVerticalGap +
			RangeSlider.sliderBackgroundOffset.y +
			RangeSlider.sliderBackgroundHeight
		return true
	}

	public Render(): void {
		super.Render()
		if (this.isDraggingMin) {
			this.OnValueChangedMin()
		}
		if (this.isDraggingMax) {
			this.OnValueChangedMax()
		}

		const rect = this.Rect,
			valueText = `${this.minValue.toFixed(this.precision)} - ${this.maxValue.toFixed(this.precision)}`,
			valueTextSize = this.GetTextSizeDefault(valueText),
			valueTextPos = new Vector2(
				rect.pos2.x - this.textOffset.x - valueTextSize.x,
				// eslint-disable-next-line prettier/prettier
				rect.pos1.y + this.textOffset.y - valueTextSize.y + valueTextSize.z + this.nameSize.y
			)

		this.RenderTextDefault(this.Name, rect.pos1.Add(this.textOffset))
		this.RenderTextDefault(valueText, valueTextPos)

		const sliderRect = this.SliderRect
		const trackH = RangeSlider.trackHeight
		const hr = RangeSlider.handleRadius
		const range = this.max - this.min
		const minProgress = (this.minValue - this.min) / range
		const maxProgress = (this.maxValue - this.min) / range
		const trackWidth = sliderRect.Size.x
		const trackCenterY = sliderRect.pos1.y + sliderRect.Size.y / 2

		const fillStartX = trackWidth * minProgress
		const fillEndX = trackWidth * maxProgress
		const fillSize = fillEndX - fillStartX

		if (fillStartX > 0) {
			RendererSDK.FilledRect(
				new Vector2(sliderRect.pos1.x, trackCenterY - trackH / 2),
				new Vector2(fillStartX, trackH),
				RangeSlider.trackInactiveColor
			)
		}

		if (fillSize > 0) {
			RendererSDK.FilledRect(
				new Vector2(sliderRect.pos1.x + fillStartX, trackCenterY - trackH / 2),
				new Vector2(fillSize, trackH),
				RangeSlider.trackActiveColor
			)
		}

		const rightInactiveSize = trackWidth - fillEndX
		if (rightInactiveSize > 0) {
			RendererSDK.FilledRect(
				new Vector2(sliderRect.pos1.x + fillEndX, trackCenterY - trackH / 2),
				new Vector2(rightInactiveSize, trackH),
				RangeSlider.trackInactiveColor
			)
		}

		const diameter = hr * 2
		const handleSize = new Vector2(diameter, diameter)

		RendererSDK.FilledCircle(
			new Vector2(sliderRect.pos1.x + fillStartX - hr, trackCenterY - hr),
			handleSize,
			RangeSlider.trackActiveColor
		)
		RendererSDK.FilledCircle(
			new Vector2(sliderRect.pos1.x + fillEndX - hr, trackCenterY - hr),
			handleSize,
			RangeSlider.trackActiveColor
		)
	}

	public OnValueChangedMin(): void {
		const sliderRect = this.SliderRect
		const off = sliderRect.GetOffset(this.MousePosition).x
		this.minValue = this.Round(
			this.min + (off / sliderRect.Size.x) * (this.max - this.min)
		)
	}

	public OnValueChangedMax(): void {
		const sliderRect = this.SliderRect
		const off = sliderRect.GetOffset(this.MousePosition).x
		this.maxValue = this.Round(
			this.min + (off / sliderRect.Size.x) * (this.max - this.min)
		)
	}

	public OnMouseLeftDown(): boolean {
		if (this.Rect.Contains(this.MousePosition)) {
			const sliderRect = this.SliderRect
			const off = sliderRect.GetOffset(this.MousePosition).x
			const mouseVal = this.min + (off / sliderRect.Size.x) * (this.max - this.min)

			const distToMin = Math.abs(mouseVal - this.minValue)
			const distToMax = Math.abs(mouseVal - this.maxValue)

			if (distToMin <= distToMax) {
				this.isDraggingMin = true
			} else {
				this.isDraggingMax = true
			}
			RangeSlider.DraggingNow = this
			return false
		}
		return true
	}
	public OnMouseLeftUp(): boolean {
		this.isDraggingMin = false
		this.isDraggingMax = false
		RangeSlider.DraggingNow = undefined
		return false
	}
	private Round(num: number): number {
		const pow = 10 ** this.precision
		return Math.round(num * pow) / pow
	}
}

EventsSDK.on(
	"WindowSizeChanged",
	() => RangeSlider.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
