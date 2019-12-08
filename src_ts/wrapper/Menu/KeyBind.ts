import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import { ArrayExtensions } from "../Imports"
import RendererSDK from "../Native/RendererSDK"
import Base, { IMenu } from "./Base"
import Menu from "./Menu"
import { FontFlags_t } from "../Enums/FontFlags_t"
import Game from "../Objects/GameResources/GameRules"
import { InputEventSDK } from "../Managers/InputManager"

export default class KeyBind extends Base {
	public static readonly KeyNames = [
		"None",
		"Left mouse", // VK_LBUTTON
		"Right mouse", // VK_RBUTTON
		"Control-break processing", // VK_CANCEL
		"Middle mouse", // VK_MBUTTON
		"Mouse5", // VK_XBUTTON1
		"Mouse6", // VK_XBUTTON2
		"Unknown",
		"Backspace", // VK_BACK
		"Tab", // VK_TAB
		"Unknown",
		"Unknown",
		"Clear", // VK_CLEAR
		"Enter", // VK_RETURN
		"Unknown",
		"Unknown",
		"Shift", // VK_SHIFT
		"Ctrl", // VK_CONTROL
		"Alt", // VK_MENU
		"Pause", // VK_PAUSE
		"Caps Lock", // VK_CAPITAL
		"IME Kana mode", // VK_KANA
		"Unknown",
		"IME Junja mode", // VK_JUNJA
		"IME Final mode", // VK_FINAL
		"IME Kanji mode", // VK_KANJI
		"Unknown",
		"Esc", // VK_ESCAPE
		"IME convert", // VK_CONVERT
		"IME nonconvert", // VK_NONCONVERT
		"IME accept", // VK_ACCEPT
		"IME mode change request", // VK_MODECHANGE
		"Space", // VK_SPACE
		"Page Up", // VK_PRIOR
		"Page Down", // VK_NEXT
		"End", // VK_END
		"Home", // VK_HOME
		"Left", // VK_LEFT
		"Up", // VK_UP
		"Right", // VK_RIGHT
		"Down", // VK_DOWN
		"Select", // VK_SELECT
		"Print", // VK_PRINT
		"Execute", // VK_EXECUTE
		"Print Screen", // VK_SNAPSHOT
		"Insert", // VK_INSERT
		"Delete", // VK_DELETE
		"Help", // VK_HELP
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"Left Windows", // VK_LWIN
		"Right Windows", // VK_RWIN
		"Applications", // VK_APPS
		"Unknown",
		"Computer Sleep", // VK_SLEEP
		"Numpad 0", // VK_NUMPAD0
		"Numpad 1", // VK_NUMPAD1
		"Numpad 2", // VK_NUMPAD2
		"Numpad 3", // VK_NUMPAD3
		"Numpad 4", // VK_NUMPAD4
		"Numpad 5", // VK_NUMPAD5
		"Numpad 6", // VK_NUMPAD6
		"Numpad 7", // VK_NUMPAD7
		"Numpad 8", // VK_NUMPAD8
		"Numpad 9", // VK_NUMPAD9
		"Numpad *", // VK_MULTIPLY
		"Numpad +", // VK_ADD
		"Separator", // VK_SEPARATOR
		"Numpad -", // VK_SUBTRACT
		"Numpad .", // VK_DECIMAL
		"Numpad /", // VK_DIVIDE
		"F1", // VK_F1
		"F2", // VK_F2
		"F3", // VK_F3
		"F4", // VK_F4
		"F5", // VK_F5
		"F6", // VK_F6
		"F7", // VK_F7
		"F8", // VK_F8
		"F9", // VK_F9
		"F10", // VK_F10
		"F11", // VK_F11
		"F12", // VK_F12
		"F13", // VK_F13
		"F14", // VK_F14
		"F15", // VK_F15
		"F16", // VK_F16
		"F17", // VK_F17
		"F18", // VK_F18
		"F19", // VK_F19
		"F20", // VK_F20
		"F21", // VK_F21
		"F22", // VK_F22
		"F23", // VK_F23
		"F24", // VK_F24
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Num Lock", // VK_NUMLOCK
		"Scroll Lock", // VK_SCROLL
		"Unknown", // VK_OEM_NEC_EQUAL
		"Unknown", // VK_OEM_FJ_MASSHOU
		"Unknown", // VK_OEM_FJ_TOUROKU
		"Unknown", // VK_OEM_FJ_LOYA
		"Unknown", // VK_OEM_FJ_ROYA
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Unknown",
		"Left Shift", // VK_LSHIFT
		"Right Shift", // VK_RSHIFT
		"Left Ctrl", // VK_LCONTROL
		"Right Ctrl", // VK_RCONTROL
		"Left Menu key", // VK_LMENU
		"Right Menu key", // VK_RMENU
	]
	public static readonly callbacks = new Map<number, KeyBind[]>()
	public static changing_now: KeyBind

	public is_pressed = false
	public activates_in_menu = false
	public assigned_key = 0
	public assigned_key_str = "None"
	public trigger_on_chat = false
	protected readonly text_offset = new Vector2(8, 8)
	protected readonly keybind_text_offset = new Vector2(5, 5)
	protected readonly keybind_size = new Vector2(40, 20)
	protected readonly keybind_offset = new Vector2(3, 8)
	protected readonly keybind_color = new Color(14, 99, 152)
	protected readonly MousePosition = new Vector2()
	protected readonly execute_on_add = false

	constructor(parent: IMenu, name: string, default_key = "None", tooltip?: string) {
		super(parent, name)
		this.assigned_key = KeyBind.KeyNames.indexOf(default_key)
		this.tooltip = tooltip
		this.Update()
	}

	public get ConfigValue() { return this.assigned_key }
	public set ConfigValue(value) {
		this.assigned_key = value !== undefined ? value : this.assigned_key
		this.Update()
	}
	private get KeybindRect() {
		let base_pos = this.Position.Add(this.TotalSize).SubtractForThis(this.keybind_offset).SubtractForThis(this.keybind_size).SubtractForThis(this.border_size.MultiplyScalar(2)).SubtractForThis(this.keybind_text_offset.MultiplyScalar(2)).AddScalarY(this.keybind_text_offset.y)
		return new Rectangle(base_pos, base_pos.Add(this.keybind_size).AddForThis(this.keybind_text_offset.MultiplyScalar(2)))
	}

	public OnPressed(func: (caller: this) => void) {
		return this.OnValue(caller => {
			if (caller.is_pressed)
				func(caller)
		})
	}
	public OnRelease(func: (caller: this) => void) {
		return this.OnValue(caller => {
			if (!caller.is_pressed)
				func(caller)
		})
	}

	public Update(assign_key_str = true): void {
		// loop-optimizer: KEEP
		KeyBind.callbacks.forEach((keybinds, key) => {
			if (ArrayExtensions.arrayRemove(keybinds, this) && keybinds.length === 0)
				KeyBind.callbacks.delete(key)
		})
		if (this.assigned_key > 0) {
			let ar = KeyBind.callbacks.get(this.assigned_key)
			if (ar === undefined) {
				KeyBind.callbacks.set(this.assigned_key, [])
				ar = KeyBind.callbacks.get(this.assigned_key)
			}
			ar.push(this)
		}
		if (assign_key_str)
			this.assigned_key_str = this.assigned_key >= KeyBind.KeyNames.length ? "Unknown" : KeyBind.KeyNames[Math.max(this.assigned_key, 0)]
		RendererSDK.GetTextSize(this.assigned_key_str, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).CopyTo(this.keybind_size)
		this.TotalSize_.x =
			RendererSDK.GetTextSize(this.name, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS).x
			+ 20
			+ this.keybind_size.x
			+ this.border_size.x * 2
			+ this.text_offset.x * 2
		Menu.PositionDirty = true
		super.Update()
	}
	public Render(): void {
		super.Render()
		RendererSDK.FilledRect(this.Position.Add(this.border_size), this.TotalSize.Subtract(this.border_size.MultiplyScalar(2)), this.background_color)
		RendererSDK.Text(this.name, this.Position.Add(this.text_offset), this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		let keybind_rect = this.KeybindRect
		RendererSDK.FilledRect(keybind_rect.pos1, keybind_rect.pos2.Subtract(keybind_rect.pos1), this.keybind_color)
		RendererSDK.Text(this.assigned_key_str, keybind_rect.pos1.Add(this.keybind_text_offset), this.FontColor, this.FontName, this.FontSize, FontFlags_t.ANTIALIAS)
		if (!this.KeybindRect.Contains(this.MousePosition))
			super.RenderTooltip()
	}

	public OnMouseLeftDown(): boolean {
		return !this.Rect.Contains(this.MousePosition)
	}
	public OnMouseLeftUp(): boolean {
		if (this.KeybindRect.Contains(this.MousePosition) && KeyBind.changing_now !== this) {
			let old = KeyBind.changing_now
			KeyBind.changing_now = this
			this.assigned_key_str = "???"
			this.Update(false)
			if (old !== undefined)
				old.Update()
		}
		return false
	}
}

let IsPressing = new Map<number, boolean>()
function KeyHandler(key: number, pressed: boolean): boolean {
	let changing_now = KeyBind.changing_now,
		ret = true
	if (changing_now !== undefined) {
		changing_now.assigned_key = key !== 0x1B ? key : -1 // VK_ESCAPE === 0x1B
		changing_now.Update()
		Menu.UpdateConfig()
		KeyBind.changing_now = undefined
		return ret
	}

	let onExecute = KeyBind.callbacks.get(key)
	if (onExecute === undefined)
		return true

	if (IsPressing.get(key) === pressed)
		return true

	IsPressing.set(key, pressed)

	onExecute.forEach(keybind => {
		if (!Game.IsInGame && !keybind.activates_in_menu)
			return
		if (!Menu.trigger_on_chat && Game.IsInputCaptured && !keybind.trigger_on_chat)
			return
		keybind.is_pressed = pressed
		keybind.OnValueChangedCBs.forEach(cb => cb(keybind))
	})

	return ret
}
InputEventSDK.on("KeyDown", key => KeyHandler(key, true))
InputEventSDK.on("KeyUp", key => KeyHandler(key, false))
