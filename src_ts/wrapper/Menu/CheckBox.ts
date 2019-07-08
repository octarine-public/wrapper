import { Tree } from "./Tree"

function CheckBoxCallback(checkbox: CheckBox): void {

	var onValue = checkbox.OnValueCallback,
		onActivate = checkbox.OnActivateCallback,
		onDeactivate = checkbox.OnDeactivateCallback,
		value = checkbox.value

	if (onValue)
		onValue(value, checkbox)

	if (value) {

		if (onActivate)
			onActivate(checkbox)
	} else {

		if (onDeactivate)
			onDeactivate(checkbox)
	}
}

function getTopParent(node: Tree | CheckBox): Tree {
	let parent = node.parent
	return parent !== undefined ? getTopParent(parent) : node as Tree
}

export default class CheckBox extends Menu_Boolean {

	parent: Tree

	defaultValue: boolean

	OnValueCallback: (value: boolean, self: CheckBox) => void
	OnActivateCallback: (self: CheckBox) => void
	OnDeactivateCallback: (self: CheckBox) => void

	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: CheckBox) => void

	constructor(parent: Tree, name: string, value: boolean, hint: string) {

		if (hint === undefined)
			super(name, value)
		else
			super(name, value, hint)

		this.defaultValue = value

		Object.defineProperty(this, "callback", {
			value: () => CheckBoxCallback(this),
			writable: false,
		})

		var selfParent = parent
		Object.defineProperty(this, "parent", {
			set: (new_value: Tree) => {

				this.Remove()

				new_value.entries.push(this)

				var parnt = getTopParent(new_value)

				parnt.Update()

				selfParent = new_value
			},
			get: () => selfParent,
			configurable: false,
		})
	}

	get IndexInMenu(): number {
		return this.parent.entries.indexOf(this)
	}

	Remove(): void {
		this.parent.RemoveControl(this)
	}
	ChangeParentTo(parent: Tree) {
		this.parent = parent
	}

	SetToolTip(text: string): this {
		this.hint = text
		return this
	}

	ChangeValue(value: boolean | number): this {
		this.value = !!value
		return this
	}
	ChangeReverse(): this {
		this.value = !this.value
		return this
	}
	ChangeToDefault(): this {
		this.value = this.defaultValue
		return this
	}

	OnValue(callback: (value: boolean, self: CheckBox) => void): this {
		this.OnValueCallback = callback
		return this
	}
	OnActivate(callback: (self: CheckBox) => void): this {
		this.OnActivateCallback = callback
		return this
	}
	OnDeactivate(callback: (self: CheckBox) => void): this {
		this.OnDeactivateCallback = callback
		return this
	}
}
