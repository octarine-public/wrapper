import { Tree } from "./Tree"
function ButtonCallback(button: Button): void {
	var onPress = button.OnPressCallback
	if (onPress)
        onPress(button)
}
function getTopParent(node: Tree | Button): Tree {
	let parent = node.parent
	return parent !== undefined ? getTopParent(parent) : node as Tree
}
export default class Button extends Menu_Button {
	parent: Tree
	OnPressCallback: (self: Button) => void
	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
    readonly callback: (self: Button) => void
    constructor(parent: Tree, name: string, desc: string, hint: string) {

		if (desc === undefined && hint === undefined)
            super(name)
        else if(hint === undefined)
            super(name,desc)
		else
			super(name, desc, hint)

		Object.defineProperty(this, "callback", {
			value: () => ButtonCallback(this),
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
	OnPress(callback: (self: Button) => void): this {
		this.OnPressCallback = callback
		return this
	}
}