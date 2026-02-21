import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, VKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class TextInput extends Base {
	public static focusedInput?: TextInput
	public static OnWindowSizeChanged(): void {
		TextInput.inputPadding.x = ScaleWidth(14)
		TextInput.inputPadding.y = ScaleHeight(14)
		TextInput.cursorWidth = ScaleWidth(1)
	}

	private static readonly inputInactivePath =
		"menu/background_inactive.svg"
	private static readonly inputActivePath =
		"menu/background_active.svg"
	private static readonly inputPadding = new Vector2()
	private static cursorWidth = 0
	private static readonly placeholderColor = new Color(150, 150, 150)

	public text = ""
	public cursorPos = 0
	public override SaveConfig = false
	public placeholder = "Search..."

	public cursorBlinkStart = 0

	constructor(parent: IMenu) {
		super(parent, "", "")
	}

	public override Update(): boolean {
		if (!RendererSDK.IsInDraw) {
			this.QueuedUpdate = true
			return false
		}
		this.Size.CopyFrom(Base.DefaultSize)
		return true
	}

	public override Render(): void {
		const isFocused = TextInput.focusedInput === this
		RendererSDK.Image(
			isFocused
				? TextInput.inputActivePath
				: TextInput.inputInactivePath,
			this.Position,
			-1,
			this.RenderSize
		)

		const hasText = this.text.length > 0
		if (!hasText && !isFocused) {
			this.RenderTextDefault(
				this.placeholder,
				this.Position.Add(TextInput.inputPadding),
				TextInput.placeholderColor
			)
		} else {
			this.RenderTextDefault(
				this.text,
				this.Position.Add(TextInput.inputPadding)
			)
		}

		if (isFocused) {
			const blinkOn =
				((hrtime() - this.cursorBlinkStart) % 1000) < 500
			if (blinkOn) {
				const beforeCursor = this.text.substring(
					0,
					this.cursorPos
				)
				const textSize = this.GetTextSizeDefault(beforeCursor)
				const cursorX =
					this.Position.x +
					TextInput.inputPadding.x +
					textSize.x
				const cursorY =
					this.Position.y + TextInput.inputPadding.y
				const cursorH =
					this.Size.y - TextInput.inputPadding.y * 2
				RendererSDK.FilledRect(
					new Vector2(cursorX, cursorY),
					new Vector2(TextInput.cursorWidth, cursorH),
					Color.White
				)
			}
		}
	}

	public override OnPreMouseLeftDown(): boolean {
		if (TextInput.focusedInput === this) {
			if (this.Rect.Contains(this.MousePosition)) {
				return false
			}
		}
		return true
	}

	public override OnMouseLeftDown(): boolean {
		if (!this.IsHovered) {
			return true
		}
		TextInput.focusedInput = this
		this.cursorBlinkStart = hrtime()
		return false
	}

	public override OnMouseLeftUp(): boolean {
		return false
	}
}

InputEventSDK.on("CharInput", char => {
	const focused = TextInput.focusedInput
	if (focused === undefined) {
		return true
	}
	if (char.charCodeAt(0) < 0x20) {
		return false
	}
	focused.text =
		focused.text.substring(0, focused.cursorPos) +
		char +
		focused.text.substring(focused.cursorPos)
	focused.cursorPos++
	focused.cursorBlinkStart = hrtime()
	focused.TriggerOnValueChangedCBs()
	return false
})

InputEventSDK.on("KeyDown", key => {
	const focused = TextInput.focusedInput
	if (focused === undefined) {
		return true
	}
	switch (key) {
		case VKeys.BACK:
			if (focused.cursorPos > 0) {
				focused.text =
					focused.text.substring(0, focused.cursorPos - 1) +
					focused.text.substring(focused.cursorPos)
				focused.cursorPos--
				focused.TriggerOnValueChangedCBs()
			}
			break
		case VKeys.DELETE:
			if (focused.cursorPos < focused.text.length) {
				focused.text =
					focused.text.substring(0, focused.cursorPos) +
					focused.text.substring(focused.cursorPos + 1)
				focused.TriggerOnValueChangedCBs()
			}
			break
		case VKeys.LEFT:
			if (focused.cursorPos > 0) {
				focused.cursorPos--
			}
			break
		case VKeys.RIGHT:
			if (focused.cursorPos < focused.text.length) {
				focused.cursorPos++
			}
			break
		case VKeys.HOME:
			focused.cursorPos = 0
			break
		case VKeys.END:
			focused.cursorPos = focused.text.length
			break
		case VKeys.ESCAPE:
			TextInput.focusedInput = undefined
			return true
		default:
			break
	}
	focused.cursorBlinkStart = hrtime()
	return false
})

EventsSDK.on(
	"WindowSizeChanged",
	() => TextInput.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
