import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, VKeys, VMouseKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { GameState } from "../Utils/GameState"
import { Base, IMenu } from "./Base"
import { KeyNames } from "./KeyNames"

export class KeyBind extends Base {
	public static readonly callbacks = new Map<number, KeyBind[]>()
	public static changingNow?: KeyBind
	public static OnWindowSizeChanged(): void {
		KeyBind.keybindOffset.x = ScaleWidth(12)
		KeyBind.keybindOffset.y = ScaleHeight(7)
		KeyBind.keybindTextOffset.x = ScaleWidth(7)
		KeyBind.keybindTextOffset.y = ScaleHeight(7)
		KeyBind.textKeybindGap = ScaleWidth(15)
	}

	private static readonly keybindActivePath = "menu/keybind_active.svg"
	private static readonly keybindInactivePath = "menu/keybind_inactive.svg"
	private static readonly keybindOffset = new Vector2()
	private static readonly keybindTextOffset = new Vector2()
	private static textKeybindGap = 15

	public ActivatesInMenu = false
	public assignedKey = 0
	public assignedKeyStr = "None"
	public TriggerOnChat = false
	protected IsPressed_ = false
	protected readonly keybindSize = RendererSDK.GetImageSize(
		KeyBind.keybindInactivePath
	).Clone()
	protected readonly keybindTextSize = new Vector2()
	public executeOnAdd = false

	constructor(
		parent: IMenu,
		name: string,
		public defaultKey = "None",
		tooltip = "",
		public defaultKeyIdx = KeyNames.indexOf(defaultKey)
	) {
		super(parent, name, tooltip)
		this.ResetToDefault()
	}
	public ResetToDefault(): void {
		this.assignedKey = this.defaultKeyIdx
		super.ResetToDefault()
	}
	public IsDefault(): boolean {
		return this.assignedKey === this.defaultKeyIdx
	}
	public get ConfigValue() {
		return this.assignedKey
	}
	public set ConfigValue(value) {
		if (typeof value !== "number" || this.ShouldIgnoreNewConfigValue) {
			return
		}
		this.assignedKey = value
		this.UpdateIsDefault()
	}
	public get isPressed(): boolean {
		return this.IsPressed_
	}
	public set isPressed(newVal: boolean) {
		this.IsPressed_ = newVal
		this.TriggerOnValueChangedCBs()
	}
	public get ClassPriority(): number {
		return 2
	}
	private get KeybindRect() {
		const basePos = this.Position.Clone()
			.AddScalarX(this.parent.EntriesSizeX)
			.AddScalarY(this.Size.y)
			.SubtractForThis(KeyBind.keybindOffset)
		return new Rectangle(basePos.Subtract(this.keybindSize), basePos)
	}

	public OnPressed(func: (caller: this) => any) {
		return this.OnValue(caller => {
			if (caller.isPressed) {
				func(caller)
			}
		})
	}
	public OnRelease(func: (caller: this) => any) {
		return this.OnValue(caller => {
			if (!caller.isPressed) {
				func(caller)
			}
		})
	}

	public Update(_recursive = false, assignKeyStr = true): boolean {
		if (!super.Update()) {
			return false
		}
		KeyBind.callbacks.forEach((keybinds, key) => {
			if (keybinds.remove(this) && keybinds.length === 0) {
				KeyBind.callbacks.delete(key)
			}
		})
		if (this.assignedKey > 0) {
			let ar = KeyBind.callbacks.get(this.assignedKey)
			if (ar === undefined) {
				ar = []
				KeyBind.callbacks.set(this.assignedKey, ar)
			}
			ar.push(this)
		}
		if (assignKeyStr) {
			this.assignedKeyStr =
				this.assignedKey >= KeyNames.length
					? "Unknown"
					: KeyNames[Math.max(this.assignedKey, 0)]
		}
		Vector2.FromVector3(this.GetTextSizeDefault(this.assignedKeyStr)).CopyTo(
			this.keybindTextSize
		)
		this.keybindTextSize
			.Add(KeyBind.keybindTextOffset.MultiplyScalar(2))
			.SetY(this.Size.y - KeyBind.keybindOffset.y * 2)
			.CopyTo(this.keybindSize)

		this.Size.x =
			this.nameSize.x +
			this.textOffset.x +
			KeyBind.textKeybindGap +
			KeyBind.keybindOffset.x +
			this.keybindSize.x
		return true
	}
	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))
		const keybindRect = this.KeybindRect
		if (KeyBind.changingNow === this) {
			RendererSDK.Image(
				KeyBind.keybindActivePath,
				keybindRect.pos1,
				-1,
				keybindRect.Size
			)
		} else {
			RendererSDK.Image(
				KeyBind.keybindInactivePath,
				keybindRect.pos1,
				-1,
				keybindRect.Size
			)
		}
		this.RenderTextDefault(
			this.assignedKeyStr,
			new Vector2(
				keybindRect.pos1.x + KeyBind.keybindTextOffset.x,
				keybindRect.pos2.y - KeyBind.keybindTextOffset.y - this.keybindTextSize.y
			)
		)
	}
	public OnPreMouseLeftDown(): boolean {
		if (KeyBind.changingNow === this) {
			if (this.Rect.Contains(this.MousePosition)) {
				return false
			}
			this.assignedKey = -1
			this.Update()
		}
		return true
	}
	public OnMouseLeftDown(): boolean {
		return !this.IsHovered
	}
	public OnMouseLeftUp(): boolean {
		if (this.IsHovered) {
			if (KeyBind.changingNow === this) {
				KeyBind.changingNow = undefined
			} else {
				const old = KeyBind.changingNow
				KeyBind.changingNow = this
				this.assignedKeyStr = "..."
				this.Update(false, false)
				if (old !== undefined) {
					old.Update()
				}
			}
		}
		return false
	}
}

const isPressing = new Map<VKeys, boolean>()
function KeyHandler(key: VKeys, pressed: boolean): boolean {
	const changingNow = KeyBind.changingNow
	if (changingNow !== undefined) {
		changingNow.assignedKey = key !== 0x1b ? key : -1 // VK_ESCAPE === 0x1B
		changingNow.Update()
		changingNow.isPressed = false
		Base.SaveConfigASAP = true
		KeyBind.changingNow = undefined
		return true
	}

	if (isPressing.get(key) === pressed) {
		return true
	}
	isPressing.set(key, pressed)

	const onExecute = KeyBind.callbacks.get(key)
	if (onExecute === undefined) {
		return true
	}

	const uniqueOnExecute = [...new Set(onExecute)]
	uniqueOnExecute.forEach(keybind => {
		if (!Base.triggerOnChat && GameState.IsInputCaptured && !keybind.TriggerOnChat) {
			return
		}
		if (!GameState.IsConnected && !keybind.ActivatesInMenu && pressed) {
			// pass un-press even in menu
			return
		}
		keybind.isPressed = pressed
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

EventsSDK.on(
	"WindowSizeChanged",
	() => KeyBind.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
