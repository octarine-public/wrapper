import { arrayRemove } from "../Utils/ArrayExtensions"

import CheckBox from "./CheckBox"
import ComboBox from "./ComboBox"
import Keybind from "./Keybind"
import ListBox from "./ListBox"
import { Slider, SliderFloat } from "./Slider"
import Toggle from "./Toggle"

export { CheckBox, ComboBox, Keybind, ListBox, Slider, SliderFloat, Toggle }

function CheckSameName(name: string, self: Tree) {

	var same = self.entries
		.filter(entry => entry.name.indexOf(name) !== -1).length

	return same > 0 ? `${name} #${same++}` : name
}

function getTopParent(node: Tree): Tree {
	let parent = node.parent
	return parent !== undefined ? getTopParent(parent) : node as Tree
}

export class Tree extends Menu_Node {

	parent: Tree

	constructor(parent: Tree, name: string, hint?: string, entries?: Menu_Base[]) {

		if (hint === undefined)
			super(name)
		else if (entries === undefined)
			super(name, hint)
		else
			super(name, hint, entries)

		var selfParent = parent
		Object.defineProperty(this, "parent", {
			set: (new_value: Tree) => {

				if (this.parent !== undefined)
					this.parent.RemoveControl(this)

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
		if (this.parent === undefined)
			return -1

		return this.parent.entries.indexOf(this)
	}

	SetToolTip(text: string) {
		this.hint = text
		return this
	}

	AddControl(ctrl: Menu_Base, index?: number): Tree {

		index !== undefined
			? this.entries.splice(index, 0, ctrl)
			: this.entries.push(ctrl)

		getTopParent(this).Update()

		return this
	}

	HasControl(ctrl: Menu_Base): boolean {
		return this.entries.includes(ctrl)
	}

	RemoveControl(ctrl: Menu_Base): Tree {

		arrayRemove(this.entries, ctrl)

		/*
		var i = -1;
		while ((i = this.entries.indexOf(ctrl)) > -1)
			this.entries.splice(i, 1);
		*/

		getTopParent(this).Update()

		return this
	}

	AddTree(name: string, hint?: string, entries?: Menu_Base[]): Tree {

		name = CheckSameName(name, this)

		var tree = new Tree(this, name, hint, entries)

		this.AddControl(tree)

		return tree
	}

	AddToggle(name: string, defaultValue: boolean | number = false, hint?: string): Toggle {

		name = CheckSameName(name, this)

		var toggle = new Toggle(this, name, !!defaultValue, hint)

		this.AddControl(toggle)

		return toggle
	}

	AddCheckBox(name: string, defaultValue: boolean | number = false, hint?: string): CheckBox {

		name = CheckSameName(name, this)

		var checkbox = new CheckBox(this, name, !!defaultValue, hint)

		this.AddControl(checkbox)

		return checkbox
	}

	/**
	 * @param minValue if undefined then min = default
	 * @param maxValue if undefined then max = min + 1
	 */
	AddSlider(name: string, defaultValue: number = 0, minValue?: number, maxValue?: number, hint?: string) {

		name = CheckSameName(name, this)

		if (minValue === undefined)
			minValue = defaultValue

		if (maxValue === undefined)
			maxValue = minValue + 1

		var slider = new Slider(this, name, defaultValue, minValue, maxValue, hint)

		this.AddControl(slider)

		return slider
	}

	/**
	 * @param minValue if undefined then min = default
	 * @param maxValue if undefined then max = min + 1
	 */
	AddSliderFloat(name: string, defaultValue: number = 0, minValue?: number, maxValue?: number, hint?: string) {

		name = CheckSameName(name, this)

		if (minValue === undefined)
			minValue = defaultValue

		if (maxValue === undefined)
			maxValue = minValue + 1.0

		var sliderFloat = new SliderFloat(this, name, defaultValue, minValue, maxValue, hint)

		this.AddControl(sliderFloat)

		return sliderFloat
	}

	AddKeybind(name: string, defaultValue: string | number = 0, hint?: string): Keybind {

		name = CheckSameName(name, this)

		if (typeof defaultValue === "string") {
			defaultValue = defaultValue.charCodeAt(0)

			if (isNaN(defaultValue))
				defaultValue = 0
		}

		var keybind = new Keybind(this, name, defaultValue, hint)

		this.AddControl(keybind)

		return keybind
	}

	AddComboBox(name: string, values: string[], defaultValue: number = 0, hint?: string) {

		name = CheckSameName(name, this)

		var comboBox = new ComboBox(this, name, values, defaultValue, hint)

		this.AddControl(comboBox)

		return comboBox
	}

	AddListBox(name: string, values: string[], defaultValue: boolean[] = [], hint?: string) {

		name = CheckSameName(name, this)

		var listBox = new ListBox(this, name, values, defaultValue, hint)

		this.AddControl(listBox)

		return listBox
	}
}/*

class TreeExtended extends Tree {

	parent: Tree;

	constructor(parent: Tree, name: string, hint?: string, entries?: Menu_Base[]) {

		if (hint === undefined)
			super(name);
		else if (entries === undefined)
			super(name, hint);
		else
			super(name, hint, entries);

		this.parent = parent;
	}

	Remove() {
		this.parent.RemoveControl(this);
	}
} */
