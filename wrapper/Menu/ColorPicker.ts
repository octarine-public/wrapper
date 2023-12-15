import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { HSVToRGB, RGBToHSV } from "../Utils/Math"
import { Base, IMenu } from "./Base"

export class ColorPicker extends Base {
	public static activeColorpicker: Nullable<ColorPicker>
	public static OnWindowSizeChanged(): void {
		ColorPicker.iconSize.x = GUIInfo.ScaleWidth(24)
		ColorPicker.iconSize.y = GUIInfo.ScaleHeight(24)
		ColorPicker.iconOffset.x = GUIInfo.ScaleWidth(12)
		ColorPicker.iconOffset.y = GUIInfo.ScaleHeight(8)

		ColorPicker.selectedColorSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origSelectedColorSize.x
		)
		ColorPicker.selectedColorSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origSelectedColorSize.y
		)
		ColorPicker.colorOffset.x = GUIInfo.ScaleWidth(12)
		ColorPicker.colorOffset.y = GUIInfo.ScaleHeight(12)
		ColorPicker.textColorGap = GUIInfo.ScaleWidth(10)
		ColorPicker.colorpickerBackgroundSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origColorpickerBackgroundSize.x
		)
		ColorPicker.colorpickerBackgroundSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origColorpickerBackgroundSize.y
		)
		ColorPicker.textColorpickerGap = GUIInfo.ScaleHeight(4)
		ColorPicker.colorpickerColorOffset.x = GUIInfo.ScaleWidth(4)
		ColorPicker.colorpickerColorOffset.y = GUIInfo.ScaleHeight(4)
		ColorPicker.colorpickerColorSize =
			ColorPicker.colorpickerBackgroundSize.x -
			ColorPicker.colorpickerColorOffset.x * 2
		ColorPicker.colorpickerHueSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origColorpickerHueSize.x
		)
		ColorPicker.colorpickerHueSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origColorpickerHueSize.y
		)
		ColorPicker.colorpickerColorHueGap = GUIInfo.ScaleHeight(6)
		ColorPicker.colorpickerAlphaSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origColorpickerAlphaSize.x
		)
		ColorPicker.colorpickerAlphaSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origColorpickerAlphaSize.y
		)
		ColorPicker.colorpickerColorAlphaGap = GUIInfo.ScaleHeight(6)
		ColorPicker.colorpickerPickerCircleSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origColorpickerPickerCircleSize.x
		)
		ColorPicker.colorpickerPickerCircleSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origColorpickerPickerCircleSize.y
		)
		ColorPicker.colorpickerPickerRectSize.x = GUIInfo.ScaleWidth(
			ColorPicker.origColorpickerPickerRectSize.x
		)
		ColorPicker.colorpickerPickerRectSize.y = GUIInfo.ScaleHeight(
			ColorPicker.origColorpickerPickerRectSize.y
		)
		ColorPicker.colorpickerTextYOffset = GUIInfo.ScaleHeight(10)
		ColorPicker.colorpickerTextXSize = GUIInfo.ScaleWidth(43)
		ColorPicker.colorpickerTextXGap = GUIInfo.ScaleWidth(3)

		ColorPicker.textOffsetNode.x = GUIInfo.ScaleWidth(15)
		ColorPicker.textOffsetNode.y = GUIInfo.ScaleHeight(13)

		ColorPicker.textOffsetWithIcon.x = GUIInfo.ScaleWidth(48)
		ColorPicker.textOffsetWithIcon.y = ColorPicker.textOffsetNode.y
	}

	private static readonly selectedColorPath = "menu/colorpicker_selected_color.svg"
	private static readonly selectedColorTransparencyPath =
		"menu/colorpicker_selected_color_transparency.svg"
	private static readonly origSelectedColorSize = RendererSDK.GetImageSize(
		ColorPicker.selectedColorPath
	)
	private static readonly selectedColorSize = new Vector2()
	private static readonly colorOffset = new Vector2()
	private static textColorGap = 0
	private static readonly colorpickerBackgroundPath = "menu/colorpicker_background.svg"
	private static readonly origColorpickerBackgroundSize = RendererSDK.GetImageSize(
		ColorPicker.colorpickerBackgroundPath
	)
	private static readonly colorpickerBackgroundSize = new Vector2()
	private static textColorpickerGap = 4
	private static readonly colorpickerColorOffset = new Vector2()
	private static colorpickerColorSize = 0
	private static readonly colorpickerColorPath = "menu/colorpicker_color.svg"
	private static readonly colorpickerOverlayPath = "menu/colorpicker_overlay.svg"
	private static readonly colorpickerHuePath = "menu/colorpicker_hue.svg"
	private static readonly origColorpickerHueSize = RendererSDK.GetImageSize(
		ColorPicker.colorpickerHuePath
	)
	private static readonly colorpickerHueSize = new Vector2()
	private static colorpickerColorHueGap = 0
	private static readonly colorpickerAlphaPath = "menu/colorpicker_alpha.svg"
	private static readonly origColorpickerAlphaSize = RendererSDK.GetImageSize(
		ColorPicker.colorpickerAlphaPath
	)
	private static readonly colorpickerAlphaSize = new Vector2()
	private static colorpickerColorAlphaGap = 0
	private static readonly colorpickerPickerCirclePath =
		"menu/colorpicker_picker_circle.svg"
	private static readonly origColorpickerPickerCircleSize = RendererSDK.GetImageSize(
		ColorPicker.colorpickerPickerCirclePath
	)
	private static readonly colorpickerPickerCircleSize = new Vector2()
	private static readonly colorpickerPickerRectPath = "menu/colorpicker_picker_rect.svg"
	private static readonly origColorpickerPickerRectSize = RendererSDK.GetImageSize(
		ColorPicker.colorpickerPickerRectPath
	)

	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly textOffsetWithIcon = new Vector2()
	private static readonly textOffsetNode = new Vector2(15, 14)
	private static readonly colorpickerPickerRectSize = new Vector2()

	private static colorpickerTextYOffset = 0
	private static colorpickerTextXSize = 0
	private static colorpickerTextXGap = 0

	public readonly SelectedColor = new Color()
	protected draggingColor = false
	protected draggingHue = false
	protected draggingAlpha = false
	protected readonly draggingOffset = new Vector2()

	constructor(
		parent: IMenu,
		name: string,
		public readonly defaultColor = Color.White,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		defaultColor.CopyTo(this.SelectedColor)
	}

	public get ConfigValue() {
		return this.SelectedColor.toArray()
	}
	public set ConfigValue(value) {
		if (
			this.ShouldIgnoreNewConfigValue ||
			value === undefined ||
			!Array.isArray(value)
		) {
			return
		}
		this.SelectedColor.r = Math.max(
			0,
			Math.min(255, value[0] ?? this.SelectedColor.r)
		)
		this.SelectedColor.g = Math.max(
			0,
			Math.min(255, value[1] ?? this.SelectedColor.g)
		)
		this.SelectedColor.b = Math.max(
			0,
			Math.min(255, value[2] ?? this.SelectedColor.b)
		)
		this.SelectedColor.a = Math.max(
			0,
			Math.min(255, value[3] ?? this.SelectedColor.a)
		)
	}

	public get ClassPriority(): number {
		return 5
	}

	private get SelectedColorRect() {
		const basePos = this.Position.Clone()
			.AddScalarX(this.parent.EntriesSizeX)
			.AddScalarY(this.Size.y)
			.SubtractForThis(ColorPicker.colorOffset)
		return new Rectangle(basePos.Subtract(ColorPicker.selectedColorSize), basePos)
	}
	private get ColorPickerRect(): Rectangle {
		const basePos = this.Position.Add(this.textOffset).AddScalarY(
			this.nameSize.y + ColorPicker.textColorpickerGap
		)
		const colorpickerRect = new Rectangle(
			basePos,
			basePos.Add(ColorPicker.colorpickerBackgroundSize)
		)
		if (colorpickerRect.pos2.y > this.WindowSize.y) {
			const moveY =
				this.nameSize.y +
				ColorPicker.colorpickerBackgroundSize.y +
				ColorPicker.textColorpickerGap * 2
			colorpickerRect.pos1.SubtractScalarY(moveY)
			colorpickerRect.pos2.SubtractScalarY(moveY)
		}
		return colorpickerRect
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		this.Size.x =
			this.textOffset.x +
			this.nameSize.x +
			ColorPicker.textColorGap +
			ColorPicker.selectedColorSize.x +
			ColorPicker.colorOffset.x
		return true
	}

	public Render(): void {
		this.isActive = ColorPicker.activeColorpicker === this
		super.Render()
		const textPos = this.Position.Clone()
		textPos.AddForThis(ColorPicker.textOffsetWithIcon)
		RendererSDK.Image(
			"menu/icons/color_picker_paint_palette.svg",
			this.Position.Add(ColorPicker.iconOffset),
			-1,
			ColorPicker.iconSize,
			Color.White
		)
		this.RenderTextDefault(this.Name, textPos)
		const selectedColorRect = this.SelectedColorRect
		RendererSDK.Image(
			ColorPicker.selectedColorTransparencyPath,
			selectedColorRect.pos1,
			-1,
			selectedColorRect.Size
		)
		RendererSDK.Image(
			ColorPicker.selectedColorPath,
			selectedColorRect.pos1,
			-1,
			selectedColorRect.Size,
			this.SelectedColor
		)
	}
	public PostRender(): void {
		if (!this.isActive) {
			return
		}
		const colorpickerRect = this.ColorPickerRect,
			selectedColorNoAlpha = this.SelectedColor.Clone().SetA(255)
		RendererSDK.Image(
			ColorPicker.colorpickerBackgroundPath,
			colorpickerRect.pos1,
			-1,
			colorpickerRect.Size
		)
		const [h] = RGBToHSV(
			this.SelectedColor.r,
			this.SelectedColor.g,
			this.SelectedColor.b
		)
		const hueColor = new Color(...HSVToRGB(h, 1, 1))
		const colorpickerColorRect = this.GetColorPickerColorRect(colorpickerRect)
		RendererSDK.Image(
			ColorPicker.colorpickerColorPath,
			colorpickerColorRect.pos1,
			-1,
			colorpickerColorRect.Size,
			hueColor
		)
		RendererSDK.Image(
			ColorPicker.colorpickerOverlayPath,
			colorpickerColorRect.pos1,
			-1,
			colorpickerColorRect.Size
		)

		const colorpickerCircleRect = this.GetColorPickerCircleRect(colorpickerColorRect)
		RendererSDK.FilledRect(
			colorpickerCircleRect.pos1.AddScalar(4),
			colorpickerCircleRect.Size.SubtractScalarForThis(8),
			selectedColorNoAlpha
		)
		RendererSDK.Image(
			ColorPicker.colorpickerPickerCirclePath,
			colorpickerCircleRect.pos1,
			-1,
			colorpickerCircleRect.Size
		)

		const colorpickerHueRect = this.GetColorPickerHueRect(colorpickerColorRect)
		RendererSDK.Image(
			ColorPicker.colorpickerHuePath,
			colorpickerHueRect.pos1,
			-1,
			colorpickerHueRect.Size
		)

		const colorpickerHuePickerRect =
			this.GetColorPickerHuePickerRect(colorpickerHueRect)
		RendererSDK.FilledRect(
			colorpickerHuePickerRect.pos1.AddScalar(1),
			colorpickerHuePickerRect.Size.SubtractScalarForThis(2),
			hueColor
		)
		RendererSDK.Image(
			ColorPicker.colorpickerPickerRectPath,
			colorpickerHuePickerRect.pos1,
			-1,
			colorpickerHuePickerRect.Size
		)

		const colorpickerAlphaRect = this.GetColorPickerAlphaRect(colorpickerHueRect)
		RendererSDK.Image(
			ColorPicker.colorpickerAlphaPath,
			colorpickerAlphaRect.pos1,
			-1,
			colorpickerAlphaRect.Size,
			selectedColorNoAlpha
		)

		const colorpickerAlphaPickerRect =
			this.GetColorPickerAlphaPickerRect(colorpickerAlphaRect)
		RendererSDK.FilledRect(
			colorpickerAlphaPickerRect.pos1.AddScalar(1),
			colorpickerAlphaPickerRect.Size.SubtractScalarForThis(2),
			this.SelectedColor
		)
		RendererSDK.Image(
			ColorPicker.colorpickerPickerRectPath,
			colorpickerAlphaPickerRect.pos1,
			-1,
			colorpickerAlphaPickerRect.Size
		)

		const textBasePos = colorpickerRect.pos1
			.Clone()
			.AddScalarX(ColorPicker.colorpickerColorOffset.x)
			.AddScalarY(colorpickerRect.Height - ColorPicker.colorpickerTextYOffset)
		const rText = Math.round(this.SelectedColor.r).toString(),
			gText = Math.round(this.SelectedColor.g).toString(),
			bText = Math.round(this.SelectedColor.b).toString()
		const rTextSize = this.GetTextSizeDefault(rText),
			gTextSize = this.GetTextSizeDefault(gText),
			bTextSize = this.GetTextSizeDefault(bText)
		this.RenderTextDefault(
			rText,
			textBasePos
				.Clone()
				.AddScalarX((ColorPicker.colorpickerTextXSize - rTextSize.x) / 2)
				.SubtractScalarY(rTextSize.y + rTextSize.z)
		)
		textBasePos.AddScalarX(
			ColorPicker.colorpickerTextXSize + ColorPicker.colorpickerTextXGap
		)
		this.RenderTextDefault(
			gText,
			textBasePos
				.Clone()
				.AddScalarX((ColorPicker.colorpickerTextXSize - gTextSize.x) / 2)
				.SubtractScalarY(gTextSize.y + gTextSize.z)
		)
		textBasePos.AddScalarX(
			ColorPicker.colorpickerTextXSize + ColorPicker.colorpickerTextXGap
		)
		this.RenderTextDefault(
			bText,
			textBasePos
				.Clone()
				.AddScalarX((ColorPicker.colorpickerTextXSize - bTextSize.x) / 2)
				.SubtractScalarY(bTextSize.y + bTextSize.z)
		)

		const mousePos = this.MousePosition.SubtractForThis(this.draggingOffset)
		if (this.draggingColor) {
			const sv = mousePos
				.SubtractForThis(colorpickerColorRect.pos1)
				.DivideForThis(colorpickerColorRect.Size)
			const s = Math.min(Math.max(sv.x, 0), 1),
				v = 1 - Math.min(Math.max(sv.y, 0), 1)
			const [r, g, b] = HSVToRGB(h, s, v)
			this.SelectedColor.SetColor(r, g, b, this.SelectedColor.a)
		} else if (this.draggingHue) {
			const hue = Math.min(
				Math.max(
					(mousePos.x - colorpickerHueRect.pos1.x) / colorpickerHueRect.Width,
					0
				),
				0.99
			)
			const [, s, v] = RGBToHSV(
				this.SelectedColor.r,
				this.SelectedColor.g,
				this.SelectedColor.b
			)
			const [r, g, b] = HSVToRGB(hue, s, v)
			this.SelectedColor.SetColor(r, g, b, this.SelectedColor.a)
		} else if (this.draggingAlpha) {
			const alpha = Math.min(
				Math.max(
					(mousePos.x - colorpickerHueRect.pos1.x) / colorpickerHueRect.Width,
					0
				),
				1
			)
			this.SelectedColor.SetA(Math.round(alpha * 255))
		}
		if (this.draggingColor || this.draggingHue || this.draggingAlpha) {
			this.TriggerOnValueChangedCBs()
		}
	}
	public OnParentNotVisible(): void {
		if (ColorPicker.activeColorpicker === this) {
			ColorPicker.activeColorpicker = undefined
		}
		this.isActive = false
	}
	public OnPreMouseLeftDown(): boolean {
		const colorpickerRect = this.ColorPickerRect,
			mousePos = this.MousePosition
		if (!(this.isActive && colorpickerRect.Contains(mousePos))) {
			return true
		}
		const colorpickerColorRect = this.GetColorPickerColorRect(colorpickerRect)
		const colorpickerColorPickerRect =
			this.GetColorPickerCircleRect(colorpickerColorRect)
		const colorpickerHueRect = this.GetColorPickerHueRect(colorpickerColorRect)
		const colorpickerHuePickerRect =
			this.GetColorPickerHuePickerRect(colorpickerHueRect)
		const colorpickerAlphaRect = this.GetColorPickerAlphaRect(colorpickerHueRect)
		const colorpickerAlphaPickerRect =
			this.GetColorPickerAlphaPickerRect(colorpickerAlphaRect)
		if (colorpickerColorPickerRect.Contains(mousePos)) {
			this.draggingColor = true
			this.draggingHue = this.draggingAlpha = false
			mousePos
				.SubtractForThis(colorpickerColorPickerRect.Center)
				.CopyTo(this.draggingOffset)
		} else if (colorpickerColorRect.Contains(mousePos)) {
			this.draggingColor = true
			this.draggingHue = this.draggingAlpha = false
			this.draggingOffset.SetX(0).SetY(0)
		} else if (colorpickerHuePickerRect.Contains(mousePos)) {
			this.draggingHue = true
			this.draggingColor = this.draggingAlpha = false
			mousePos
				.SubtractForThis(colorpickerHuePickerRect.Center)
				.CopyTo(this.draggingOffset)
		} else if (colorpickerHueRect.Contains(mousePos)) {
			this.draggingHue = true
			this.draggingColor = this.draggingAlpha = false
			this.draggingOffset.SetX(0).SetY(0)
		} else if (colorpickerAlphaPickerRect.Contains(mousePos)) {
			this.draggingAlpha = true
			this.draggingColor = this.draggingHue = false
			mousePos
				.SubtractForThis(colorpickerAlphaPickerRect.Center)
				.CopyTo(this.draggingOffset)
		} else if (colorpickerAlphaRect.Contains(mousePos)) {
			this.draggingAlpha = true
			this.draggingColor = this.draggingHue = false
			this.draggingOffset.SetX(0).SetY(0)
		}
		return false
	}
	public OnMouseLeftDown(): boolean {
		if (!this.IsHovered) {
			return true
		}
		if (ColorPicker.activeColorpicker !== this) {
			ColorPicker.activeColorpicker = this
			this.isActive = true
		} else {
			ColorPicker.activeColorpicker = undefined
			this.isActive = false
		}
		return false
	}
	public OnMouseLeftUp(): boolean {
		this.draggingColor = this.draggingHue = this.draggingAlpha = false
		return false
	}
	private GetColorPickerColorRect(colorpickerRect: Rectangle): Rectangle {
		const basePos = colorpickerRect.pos1.Add(ColorPicker.colorpickerColorOffset)
		return new Rectangle(basePos, basePos.AddScalar(ColorPicker.colorpickerColorSize))
	}
	private GetColorPickerCircleRect(colorpickerColorRect: Rectangle): Rectangle {
		const [, s, v] = RGBToHSV(
			this.SelectedColor.r,
			this.SelectedColor.g,
			this.SelectedColor.b
		)
		const basePos = colorpickerColorRect.pos1
			.Add(colorpickerColorRect.Size.MultiplyScalarX(s).MultiplyScalarY(1 - v))
			.SubtractForThis(ColorPicker.colorpickerPickerCircleSize.DivideScalar(2))
		return new Rectangle(
			basePos,
			basePos.Add(ColorPicker.colorpickerPickerCircleSize)
		)
	}
	private GetColorPickerHueRect(colorpickerColorRect: Rectangle): Rectangle {
		const basePos = colorpickerColorRect.pos1
			.Clone()
			.AddScalarY(colorpickerColorRect.Height + ColorPicker.colorpickerColorHueGap)
		return new Rectangle(basePos, basePos.Add(ColorPicker.colorpickerHueSize))
	}
	private GetColorPickerHuePickerRect(colorpickerHueRect: Rectangle): Rectangle {
		const [h] = RGBToHSV(
			this.SelectedColor.r,
			this.SelectedColor.g,
			this.SelectedColor.b
		)
		const basePos = colorpickerHueRect.pos1
			.Clone()
			.AddScalarX(colorpickerHueRect.Size.x * h)
			.SubtractScalarX(ColorPicker.colorpickerPickerRectSize.x / 2)
			.AddScalarY(
				(colorpickerHueRect.Height - ColorPicker.colorpickerPickerRectSize.y) / 2
			)
		return new Rectangle(basePos, basePos.Add(ColorPicker.colorpickerPickerRectSize))
	}
	private GetColorPickerAlphaRect(colorpickerHueRect: Rectangle): Rectangle {
		const basePos = colorpickerHueRect.pos1
			.Clone()
			.AddScalarY(colorpickerHueRect.Height + ColorPicker.colorpickerColorAlphaGap)
		return new Rectangle(basePos, basePos.Add(ColorPicker.colorpickerAlphaSize))
	}
	private GetColorPickerAlphaPickerRect(colorpickerAlphaRect: Rectangle): Rectangle {
		const basePos = colorpickerAlphaRect.pos1
			.Clone()
			.AddScalarX((colorpickerAlphaRect.Size.x * this.SelectedColor.a) / 255)
			.SubtractScalarX(ColorPicker.colorpickerPickerRectSize.x / 2)
			.AddScalarY(
				(colorpickerAlphaRect.Height - ColorPicker.colorpickerPickerRectSize.y) /
					2
			)
		return new Rectangle(basePos, basePos.Add(ColorPicker.colorpickerPickerRectSize))
	}
}

EventsSDK.on("WindowSizeChanged", () => ColorPicker.OnWindowSizeChanged())
