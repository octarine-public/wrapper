import Toggle from "./Toggle";
import CheckBox from "./CheckBox";
import { Slider, SliderFloat } from "./Slider";
import Keybind from "./Keybind";
import ComboBox from "./ComboBox";
import ListBox from "./ListBox";


function CheckSameName(name: string, self: Tree) {
	
	var same = self.entries
		.filter(entry => entry.name.indexOf(name) !== -1).length;
		
	return same > 0 ? `${name} #${same++}` : name;
}

function getTopParent(node: Tree): Tree {
	let parent = node.parent;
	return parent !== undefined ? getTopParent(parent) : node as Tree;
}

export default class Tree extends Menu_Node {

	parent: Tree;
	
	constructor(parent: Tree, name: string, hint?: string, entries?: Menu_Base[]) {
		
		if (hint === undefined)
			super(name);
		else if (entries === undefined)
			super(name, hint);
		else
			super(name, hint, entries);
		
		this.parent = parent
	}

	SetToolTip(text: string) {
		this.hint = text;
		return this;
	}

	AddControl(ctrl: Menu_Base, index?: number) {
		
		index !== undefined
			? this.entries.splice(index, 0, ctrl)
			: this.entries.push(ctrl);

		getTopParent(this).Update();
		
		return this;
	}
	
	RemoveControl(ctrl: Menu_Base) {

		// loop-optimizer: KEEP  // because items reverse
		this.entries = this.entries.filter(ctrlNow => ctrlNow !== ctrl);

		/*
		var i = -1;
		while ((i = this.entries.indexOf(ctrl)) > -1)
			this.entries.splice(i, 1);
		*/
		
		getTopParent(this).Update();
		
		return this;
	}

	AddTree(name: string, hint?: string, entries?: Menu_Base[]): Tree {

		name = CheckSameName(name, this);
		
		var tree = new Tree(this, name, hint, entries);

		this.AddControl(tree);

		return tree;
	}

	AddToggle(name: string, defaultValue: boolean | number = false, hint?: string): Toggle {

		name = CheckSameName(name, this);
		
		var toggle = new Toggle(this, name, !!defaultValue, hint);

		this.AddControl(toggle);

		return toggle;
	}
	
	AddCheckBox(name: string, defaultValue: boolean | number = false, hint?: string): CheckBox {

		name = CheckSameName(name, this);
		
		var checkbox = new CheckBox(this, name, !!defaultValue, hint);

		this.AddControl(checkbox);

		return checkbox;
	}
	
	/**
	 * @param minValue if undefined then min = default
	 * @param maxValue if undefined then max = min + 1
	 */
	AddSlider(name: string, defaultValue: number = 0, minValue?: number, maxValue?: number, hint?: string) {
		
		name = CheckSameName(name, this);
		
		if (minValue === undefined)
			minValue = defaultValue;
		
		if (maxValue === undefined)
			maxValue = minValue + 1;
			
		var slider = new Slider(this, name, defaultValue, minValue, maxValue, hint)
		
		this.AddControl(slider);

		return slider;
	}
	
	/**
	 * @param minValue if undefined then min = default
	 * @param maxValue if undefined then max = min + 1
	 */
	AddSliderFloat(name: string, defaultValue: number = 0, minValue?: number, maxValue?: number, hint?: string) {

		name = CheckSameName(name, this);
		
		if (minValue === undefined)
			minValue = defaultValue;

		if (maxValue === undefined)
			maxValue = minValue + 1.0;

		var sliderFloat = new SliderFloat(this, name, defaultValue, minValue, maxValue, hint)

		this.AddControl(sliderFloat);

		return sliderFloat;
	}
	
	AddKeybind(name: string, defaultValue: string | number = 0, hint?: string): Keybind {

		name = CheckSameName(name, this);
		
		if (typeof defaultValue === "string") {
			defaultValue = defaultValue.charCodeAt(0);
			
			if (isNaN(defaultValue))
				defaultValue = 0;
		}
		
		var keybind = new Keybind(this, name, defaultValue, hint);

		this.AddControl(keybind);

		return keybind;
	}
	
	AddComboBox(name: string, values: string[], defaultValue: number = 0, hint?: string) {
		
		name = CheckSameName(name, this);
		
		var comboBox = new ComboBox(this, name, values, defaultValue, hint);

		this.AddControl(comboBox);

		return comboBox;
	}
	
	AddListBox(name: string, values: string[], defaultValue: boolean[] = [], hint?: string) {

		name = CheckSameName(name, this);
		
		var listBox = new ListBox(this, name, values, defaultValue, hint);

		this.AddControl(listBox);

		return listBox;
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