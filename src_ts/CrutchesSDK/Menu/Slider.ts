import Tree from "./Tree"

function SliderCallBack(slider: Slider | SliderFloat): void {

	var onValueCall = slider.OnValueCallback

	if (onValueCall)
		onValueCall(slider.value, slider)
}

function getTopParent(node: Tree | Slider): Tree {
	let parent = node.parent
	return parent !== undefined ? getTopParent(parent) : node as Tree
}

export class Slider extends Menu_SliderInt {

	parent: Tree

	defaultValue: number

	OnValueCallback: (value: number, self: Slider) => void

	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: Slider) => void

	constructor(parent: Tree, name: string, value: number, min: number, max: number, hint?: string) {

		if (hint === undefined)
			super(name, value, min, max)
		else
			super(name, value, min, max, hint)

		this.defaultValue = value

		Object.defineProperty(this, "callback", {
			value: () => SliderCallBack(this),
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
		this.parent.RemoveControl(this)
	}
	ChangeParentTo(parent: Tree) {
		this.parent = parent
	}

	SetToolTip(text: string): this {
		this.hint = text
		return this
	}

	ChangeValue(value: number): this {
		this.value = value
		return this
	}
	ChangeToDefault(): this {
		this.value = this.defaultValue
		return this
	}

	OnValue(callback: (value: number, self: Slider) => void): this {
		this.OnValueCallback = callback
		return this
	}
}

export class SliderFloat extends Menu_SliderFloat {
	parent: Tree

	defaultValue: number

	OnValueCallback: (value: number, self: SliderFloat) => void

	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: SliderFloat) => void

	constructor(parent: Tree, name: string, value: number, min: number, max: number, hint?: string) {

		if (hint === undefined)
			super(name, value, min, max)
		else
			super(name, value, min, max, hint)

		this.parent = parent

		this.defaultValue = value

		Object.defineProperty(this, "callback", {
			value: () => SliderCallBack(this),
			writable: false,
		})
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

	ChangeValue(value: number): this {
		this.value = value
		return this
	}
	ChangeToDefault(): this {
		this.value = this.defaultValue
		return this
	}

	OnValue(callback: (value: number, self: SliderFloat) => void): this {
		this.OnValueCallback = callback
		return this
	}
}
