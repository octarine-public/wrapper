import { arrayRemove } from "../Utils/ArrayExtensions";

import Game from "../Objects/GameResources/GameRules";

import { Tree } from "./Tree";

let IsPressing: boolean[] = [],
	OnExecute: [Keybind[]] = [[]]

function KeyBindCallback(keybind: Keybind): void {

	var onValueCall = keybind.OnValueCallback

	AddOrChangeKeyEvent(keybind)
	
	if (onValueCall)
		onValueCall(keybind.value, keybind)
}

function AddOrChangeKeyEvent(keybind: Keybind) {

	let key = keybind.value

	if (IsPressing[key] === undefined)
		IsPressing[key] = false

	if (OnExecute[key] === undefined)
		OnExecute[key] = []

	OnExecute[key].push(keybind)
}

function RemoveKeyEvent(keybind: Keybind) {
	let key = keybind.value

	IsPressing[key] = undefined

	if (OnExecute[key] === undefined)
		return

	arrayRemove(OnExecute[key], keybind)

	if (OnExecute[key].length === 0)
		OnExecute[key] = undefined
}

function getTopParent(node: Tree | Keybind): Tree {
	let parent = node.parent
	return parent !== undefined ? getTopParent(parent) : node as Tree
}

Events.on("onWndProc", (msg, wParam) => {

	if (!Game.IsInGame || wParam === undefined)
		return true

	if (msg !== 0x100 && msg !== 0x101)
		return true;

	let key = parseInt(wParam as any),
		onExecute = OnExecute[key]

	if (onExecute === undefined)
		return true;

	let isPressed = (msg === 0x100); // WM_KEYDOWN
		
	if (IsPressing[key] === isPressed)
		return true

	IsPressing[key] = isPressed

	let ret = true

	onExecute.forEach(keybind => {

		if (keybind.value !== key) {
			RemoveKeyEvent(keybind)
			return
		}

		const onExecuteCall = keybind.OnExecuteCallback;

		if (onExecuteCall)
			ret = !!onExecuteCall(isPressed, keybind)

		if (isPressed) {
			const onPressedCall = keybind.OnPressedCallback	
			ret = !(onPressedCall && onPressedCall(keybind) === false)
		} else {
			const onReleaseCall = keybind.OnReleaseCallback;
			ret = !(onReleaseCall && onReleaseCall(keybind) === false)
		}
	})

	return ret
})

export default class Keybind extends Menu_Keybind {

	parent: Tree
	defaultValue: number

	OnValueCallback: (value: number, self: Keybind) => void
	OnPressedCallback: (self: Keybind) => false | void
	OnReleaseCallback: (self: Keybind) => false | void
	OnExecuteCallback: (isPressed: boolean, self: Keybind) => false | void
	OnPressingCallback: (self: Keybind) => false | void

	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: Keybind) => void

	constructor(parent: Tree, name: string, defaultValue: number, hint: string) {
		if (hint === undefined)
			super(name, defaultValue)
		else
			super(name, defaultValue, hint)

		this.defaultValue = defaultValue

		AddOrChangeKeyEvent(this)

		Object.defineProperty(this, "callback", {
			value: () => KeyBindCallback(this),
			writable: false,
		})

		var selfParent = parent
		Object.defineProperty(this, "parent", {
			set: (value: Tree) => {

				this.Remove()

				value.entries.push(this)

				var parnt = getTopParent(value)

				parnt.Update()

				selfParent = value
			},
			get: () => selfParent,
			configurable: false,
		})
	}

	Remove(): void {
		RemoveKeyEvent(this)
		this.parent.RemoveControl(this)
	}
	ChangeParentTo(parent: Tree) {
		this.parent = parent
	}

	SetToolTip(text: string): this {
		this.hint = text
		return this
	}

	ChangeToDefaultKey(): this {
		this.value = this.defaultValue
		return this
	}
	ChangeValue(value: number): this {
		this.value = value
		return this
	}

	OnValue(callback: (value: number, self: Keybind) => void): this {
		this.OnValueCallback = callback
		return this
	}
	
	get IsPressed() {
		return IsPressing[this.value]
	}
	/**
	 * Emitted when key is up or down
	 */
	OnExecute(callback: (isPressed: boolean, self: Keybind) => any): this {
		this.OnExecuteCallback = callback
		return this
	}
	/**
	 * Emitted when key is down
	 */
	OnPressed(callback: (self: Keybind) => any): this {
		this.OnPressedCallback = callback
		return this
	}
	/**
	 * Emitted when key is up
	 */
	OnRelease(callback: (self: Keybind) => any): this {
		this.OnReleaseCallback = callback
		return this
	}
}
