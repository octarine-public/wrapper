import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"
import { Localization } from "./Localization"

export class TextInput extends Base {
	public static focusedInput?: TextInput
	public static OnWindowSizeChanged(): void {
		TextInput.inputPadding.x = ScaleWidth(2)
		TextInput.inputPadding.y = ScaleHeight(10)
		TextInput.cursorWidth = ScaleWidth(1)
		TextInput.iconSize.x = ScaleWidth(TextInput.origIconSize.x * 0.7)
		TextInput.iconSize.y = ScaleHeight(TextInput.origIconSize.y * 0.7)
		TextInput.iconOffset.x = ScaleWidth(6)
		TextInput.iconOffset.y = ScaleHeight(6)
		TextInput.closeOffset.x = ScaleWidth(8)
		TextInput.closeOffset.y = ScaleHeight(8)
		TextInput.underlineHeight = ScaleHeight(1)
	}

	private static readonly inputInactivePath = "menu/background_inactive.svg"
	private static readonly inputActivePath = "menu/background_active.svg"
	private static readonly searchIconPath = "menu/icons/search.svg"
	private static readonly closeIconPath = "menu/close.svg"
	private static readonly inputPadding = new Vector2()
	private static cursorWidth = 0
	private static readonly placeholderColor = new Color(150, 150, 150)
	private static readonly selectionColor = new Color(104, 4, 255, 100)
	private static readonly origIconSize = RendererSDK.GetImageSize(
		TextInput.searchIconPath
	)
	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly closeOffset = new Vector2()
	private static underlineHeight = 0

	public text = ""
	public cursorPos = 0
	public selectionStart = -1
	public selectionEnd = -1
	public override SaveConfig = false
	public placeholder = "Search..."

	public cursorBlinkStart = 0

	constructor(parent: IMenu) {
		super(parent, "", "")
	}

	public get hasSelection(): boolean {
		return (
			this.selectionStart !== -1 &&
			this.selectionEnd !== -1 &&
			this.selectionStart !== this.selectionEnd
		)
	}

	public get selectionMin(): number {
		return Math.min(this.selectionStart, this.selectionEnd)
	}

	public get selectionMax(): number {
		return Math.max(this.selectionStart, this.selectionEnd)
	}

	public get selectedText(): string {
		if (!this.hasSelection) return ""
		return this.text.substring(this.selectionMin, this.selectionMax)
	}

	public deleteSelection(): void {
		if (!this.hasSelection) return
		const min = this.selectionMin
		const max = this.selectionMax
		this.text = this.text.substring(0, min) + this.text.substring(max)
		this.cursorPos = min
		this.clearSelection()
		this.TriggerOnValueChangedCBs()
	}

	public selectAll(): void {
		this.selectionStart = 0
		this.selectionEnd = this.text.length
		this.cursorPos = this.text.length
	}

	public clearSelection(): void {
		this.selectionStart = -1
		this.selectionEnd = -1
	}

	public get textLeftOffset(): number {
		return ScaleWidth(10 + TextInput.origIconSize.x + 14)
	}

	public get closeIconRect(): { x: number; y: number; w: number; h: number } {
		const x =
			this.Position.x +
			this.parent.EntriesSizeX -
			TextInput.closeOffset.x -
			TextInput.iconSize.x
		const y = this.Position.y + TextInput.closeOffset.y
		return {
			x,
			y,
			w: TextInput.iconSize.x,
			h: TextInput.iconSize.y
		}
	}

	public override Update(): boolean {
		if (!RendererSDK.IsInDraw) {
			this.QueuedUpdate = true
			return false
		}
		this.Size.CopyFrom(Base.DefaultSize)
		this.Size.y = Math.round(this.Size.y * (2 / 3))
		return true
	}

	public override Render(): void {
		const isFocused = TextInput.focusedInput === this
		RendererSDK.Image(
			isFocused ? TextInput.inputActivePath : TextInput.inputInactivePath,
			this.Position,
			-1,
			this.RenderSize
		)

		const col = isFocused ? undefined : TextInput.placeholderColor
		const iconPos = this.Position.Add(
			new Vector2(
				Math.round((this.textLeftOffset - TextInput.iconSize.x) / 2),
				TextInput.iconOffset.y
			)
		)
		RendererSDK.Image(TextInput.searchIconPath, iconPos, -1, TextInput.iconSize, col)

		const hasText = this.text.length > 0
		const placeholderSize = this.GetTextSizeDefault(this.placeholder)
		const textPos = this.Position.Clone()
		textPos.x += this.textLeftOffset
		textPos.y += TextInput.inputPadding.y

		RendererSDK.FilledRect(
			new Vector2(
				this.Position.x,
				textPos.y + placeholderSize.y + TextInput.underlineHeight * 2
			),
			new Vector2(this.Size.x, TextInput.underlineHeight),
			col
		)

		let text

		if (!hasText && !isFocused) {
			text = Localization.SelectedUnitName === "russian" ? "Поиск" : "Search"
			this.RenderTextDefault(text, textPos, TextInput.placeholderColor)
		} else {
			if (this.hasSelection) {
				const selMin = this.selectionMin
				const selMax = this.selectionMax
				const beforeSel = this.text.substring(0, selMin)
				const selText = this.text.substring(selMin, selMax)
				const beforeSize = this.GetTextSizeDefault(beforeSel)
				const selSize = this.GetTextSizeDefault(selText)
				const selX = textPos.x + beforeSize.x
				const selY = this.Position.y + TextInput.inputPadding.y / 2
				const selH = this.Size.y - TextInput.inputPadding.y
				RendererSDK.FilledRect(
					new Vector2(selX, selY),
					new Vector2(selSize.x, selH),
					TextInput.selectionColor
				)
			}

			text = this.text
			const size = ScaleHeight(this.FontSize)
			const size3 = RendererSDK.GetTextSize(
				this.text,
				this.FontName,
				size,
				this.FontWeight
			)

			RendererSDK.Text(
				this.text,
				textPos.Subtract(
					new Vector2(0, Math.round(size3.y - size / 1.5 + size3.z / 2))
				),
				undefined,
				this.FontName,
				size,
				this.FontWeight,
				false,
				false
			)
		}

		if (isFocused) {
			const blinkOn = (hrtime() - this.cursorBlinkStart) % 1000 < 500
			if (blinkOn) {
				const beforeCursor = this.text.substring(0, this.cursorPos)
				const textSize = this.GetTextSizeDefault(beforeCursor)
				const cursorX = textPos.x + textSize.x
				const cursorY = this.Position.y + this.Size.y / 2
				const cursorH = this.Size.y - TextInput.inputPadding.y

				RendererSDK.FilledRect(
					new Vector2(cursorX, cursorY - cursorH / 2),
					new Vector2(TextInput.cursorWidth, cursorH),
					Color.White
				)
			}
		}

		if (hasText) {
			const closeRect = this.closeIconRect
			RendererSDK.Image(
				TextInput.closeIconPath,
				new Vector2(closeRect.x, closeRect.y),
				-1,
				TextInput.iconSize
			)
		}
	}

	public isCloseIconHovered(): boolean {
		if (this.text.length === 0) return false
		const mouse = this.MousePosition
		const r = this.closeIconRect
		return (
			mouse.x >= r.x &&
			mouse.x <= r.x + r.w &&
			mouse.y >= r.y &&
			mouse.y <= r.y + r.h
		)
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
		if (this.isCloseIconHovered()) {
			this.text = ""
			this.cursorPos = 0
			this.clearSelection()
			TextInput.focusedInput = undefined
			this.TriggerOnValueChangedCBs()
			return false
		}
		TextInput.focusedInput = this
		this.clearSelection()
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
	if (focused.hasSelection) {
		const min = focused.selectionMin
		focused.text =
			focused.text.substring(0, min) +
			char +
			focused.text.substring(focused.selectionMax)
		focused.cursorPos = min + 1
		focused.clearSelection()
	} else {
		focused.text =
			focused.text.substring(0, focused.cursorPos) +
			char +
			focused.text.substring(focused.cursorPos)
		focused.cursorPos++
	}
	focused.cursorBlinkStart = hrtime()
	focused.TriggerOnValueChangedCBs()
	return false
})

InputEventSDK.on("KeyDown", key => {
	const focused = TextInput.focusedInput
	if (focused === undefined) {
		return true
	}
	const ctrl = InputManager.IsKeyDown(VKeys.CONTROL)
	const shift = InputManager.IsKeyDown(VKeys.SHIFT)

	if (ctrl) {
		switch (key) {
			case VKeys.KEY_A:
				focused.selectAll()
				focused.cursorBlinkStart = hrtime()
				return false
			case VKeys.KEY_C:
				return false
			case VKeys.KEY_X:
				if (focused.hasSelection) {
					focused.deleteSelection()
				}
				focused.cursorBlinkStart = hrtime()
				return false
		}
	}

	switch (key) {
		case VKeys.BACK:
			if (focused.hasSelection) {
				focused.deleteSelection()
			} else if (focused.cursorPos > 0) {
				focused.text =
					focused.text.substring(0, focused.cursorPos - 1) +
					focused.text.substring(focused.cursorPos)
				focused.cursorPos--
				focused.TriggerOnValueChangedCBs()
			}
			break
		case VKeys.DELETE:
			if (focused.hasSelection) {
				focused.deleteSelection()
			} else if (focused.cursorPos < focused.text.length) {
				focused.text =
					focused.text.substring(0, focused.cursorPos) +
					focused.text.substring(focused.cursorPos + 1)
				focused.TriggerOnValueChangedCBs()
			}
			break
		case VKeys.LEFT:
			if (shift) {
				if (focused.selectionStart === -1) {
					focused.selectionStart = focused.cursorPos
					focused.selectionEnd = focused.cursorPos
				}
				if (focused.cursorPos > 0) {
					focused.cursorPos--
					focused.selectionEnd = focused.cursorPos
				}
			} else if (focused.hasSelection) {
				focused.cursorPos = focused.selectionMin
				focused.clearSelection()
			} else if (focused.cursorPos > 0) {
				focused.cursorPos--
			}
			break
		case VKeys.RIGHT:
			if (shift) {
				if (focused.selectionStart === -1) {
					focused.selectionStart = focused.cursorPos
					focused.selectionEnd = focused.cursorPos
				}
				if (focused.cursorPos < focused.text.length) {
					focused.cursorPos++
					focused.selectionEnd = focused.cursorPos
				}
			} else if (focused.hasSelection) {
				focused.cursorPos = focused.selectionMax
				focused.clearSelection()
			} else if (focused.cursorPos < focused.text.length) {
				focused.cursorPos++
			}
			break
		case VKeys.HOME:
			if (shift) {
				if (focused.selectionStart === -1) {
					focused.selectionStart = focused.cursorPos
					focused.selectionEnd = focused.cursorPos
				}
				focused.cursorPos = 0
				focused.selectionEnd = 0
			} else {
				focused.cursorPos = 0
				focused.clearSelection()
			}
			break
		case VKeys.END:
			if (shift) {
				if (focused.selectionStart === -1) {
					focused.selectionStart = focused.cursorPos
					focused.selectionEnd = focused.cursorPos
				}
				focused.cursorPos = focused.text.length
				focused.selectionEnd = focused.text.length
			} else {
				focused.cursorPos = focused.text.length
				focused.clearSelection()
			}
			break
		case VKeys.ESCAPE:
			TextInput.focusedInput = undefined
			return true
	}
	focused.cursorBlinkStart = hrtime()
	return false
})

EventsSDK.on(
	"WindowSizeChanged",
	() => TextInput.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
