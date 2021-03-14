import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import { InputEventSDK, VKeys, VMouseKeys } from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import { arrayRemove } from "../Utils/ArrayExtensions"
import GameState from "../Utils/GameState"
import Base, { IMenu } from "./Base"
import KeyNames from "./KeyNames"

export default class KeyBind extends Base {
	public static readonly callbacks = new Map<number, KeyBind[]>()
	public static changing_now?: KeyBind

	private static readonly keybind_active_path = "menu/keybind_active.svg"
	private static readonly keybind_inactive_path = "menu/keybind_inactive.svg"
	private static readonly keybind_offset = new Vector2(12, 7)
	private static readonly keybind_text_offset = new Vector2(7, 7)
	private static readonly text_keybind_gap = 15

	public is_pressed = false
	public activates_in_menu = false
	public assigned_key = 0
	public assigned_key_str = "None"
	public trigger_on_chat = false
	protected readonly keybind_size = RendererSDK.GetImageSize(KeyBind.keybind_inactive_path).Clone()
	protected readonly keybind_text_size = new Vector2()
	protected readonly execute_on_add = false

	constructor(parent: IMenu, name: string, default_key = "None", tooltip = "") {
		super(parent, name, tooltip)
		this.assigned_key = KeyNames.indexOf(default_key)
	}
	public get ConfigValue() {
		return this.assigned_key
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue)
			return
		this.assigned_key = value !== undefined ? value : this.assigned_key
		this.Update()
	}
	private get KeybindRect() {
		const base_pos = this.Position
			.Add(this.TotalSize)
			.SubtractForThis(KeyBind.keybind_offset)
		return new Rectangle(
			base_pos.Subtract(this.keybind_size),
			base_pos,
		)
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
		super.Update()
		KeyBind.callbacks.forEach((keybinds, key) => {
			if (arrayRemove(keybinds, this) && keybinds.length === 0)
				KeyBind.callbacks.delete(key)
		})
		if (this.assigned_key > 0) {
			let ar = KeyBind.callbacks.get(this.assigned_key)
			if (ar === undefined) {
				KeyBind.callbacks.set(this.assigned_key, [])
				ar = KeyBind.callbacks.get(this.assigned_key)
			}
			ar!.push(this)
		}
		if (assign_key_str)
			this.assigned_key_str = this.assigned_key >= KeyNames.length ? "Unknown" : KeyNames[Math.max(this.assigned_key, 0)]
		Vector2.FromVector3(this.GetTextSizeDefault(this.assigned_key_str)).CopyTo(this.keybind_text_size)
		this.keybind_text_size
			.Add(KeyBind.keybind_text_offset.MultiplyScalar(2))
			.SetY(this.TotalSize.y - KeyBind.keybind_offset.y * 2)
			.CopyTo(this.keybind_size)

		this.OriginalSize.x =
			this.name_size.x
			+ this.text_offset.x
			+ KeyBind.text_keybind_gap
			+ KeyBind.keybind_offset.x
			+ this.keybind_size.x
	}
	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.text_offset))
		const keybind_rect = this.KeybindRect
		if (KeyBind.changing_now === this)
			RendererSDK.Image(KeyBind.keybind_active_path, keybind_rect.pos1, -1, keybind_rect.Size)
		else
			RendererSDK.Image(KeyBind.keybind_inactive_path, keybind_rect.pos1, -1, keybind_rect.Size)
		this.RenderTextDefault(
			this.assigned_key_str,
			new Vector2(
				keybind_rect.pos1.x + KeyBind.keybind_text_offset.x,
				keybind_rect.pos2.y - KeyBind.keybind_text_offset.y - this.keybind_text_size.y,
			),
		)
	}

	public OnMouseLeftDown(): boolean {
		return !this.IsHovered
	}
	public OnMouseLeftUp(): boolean {
		if (this.KeybindRect.Contains(this.MousePosition) && KeyBind.changing_now !== this) {
			const old = KeyBind.changing_now
			KeyBind.changing_now = this
			this.assigned_key_str = "..."
			this.Update(false)
			if (old !== undefined)
				old.Update()
		}
		return false
	}
}

const IsPressing = new Map<VKeys, boolean>()
function KeyHandler(key: VKeys, pressed: boolean): boolean {
	const changing_now = KeyBind.changing_now
	if (changing_now !== undefined) {
		changing_now.assigned_key = key !== 0x1B ? key : -1 // VK_ESCAPE === 0x1B
		changing_now.Update()
		Base.SaveConfigASAP = true
		KeyBind.changing_now = undefined
		return true
	}

	const onExecute = KeyBind.callbacks.get(key)
	if (onExecute === undefined || IsPressing.get(key) === pressed)
		return true

	IsPressing.set(key, pressed)

	onExecute.forEach(keybind => {
		if (!Base.trigger_on_chat && GameState.IsInputCaptured && !keybind.trigger_on_chat)
			return
		if (!GameState.IsConnected && !keybind.activates_in_menu && pressed) // pass un-press even in menu
			return
		keybind.is_pressed = pressed
		keybind.OnValueChangedCBs.forEach(cb => cb(keybind))
	})

	return true
}

function MouseKeyHandler(key: VMouseKeys, pressed: boolean): boolean {
	switch (key) {
		case VMouseKeys.MK_XBUTTON1:
			return KeyHandler(VKeys.XBUTTON1, pressed)
		case VMouseKeys.MK_XBUTTON2:
			return KeyHandler(VKeys.XBUTTON2, pressed)
		default:
			return true
	}
}

InputEventSDK.on("KeyDown", key => KeyHandler(key, true))
InputEventSDK.on("KeyUp", key => KeyHandler(key, false))
InputEventSDK.on("MouseKeyDown", key => MouseKeyHandler(key, true))
InputEventSDK.on("MouseKeyUp", key => MouseKeyHandler(key, false))
