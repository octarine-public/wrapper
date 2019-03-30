import Tree from "./Tree";

function ComboBoxCallback(comboBox: ComboBox): void {

	var onValueCall = comboBox.OnValueCallback;

	if (onValueCall)
		onValueCall(comboBox.selected_id, comboBox);
}

function getTopParent(node: Tree | ComboBox): Tree {
	let parent = node.parent;
	return parent !== undefined ? getTopParent(parent) : node as Tree;
}


export default class ComboBox extends Menu_Combo {

	parent: Tree;

	defaultValue: number;

	OnValueCallback: (value: number, self: ComboBox) => void;
	OnActivateCallback: (self: ComboBox) => void;
	OnDeactivateCallback: (self: ComboBox) => void;

	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: ComboBox) => void;

	constructor(parent: Tree, name: string, values: string[], selected_id: number, hint: string) {

		if (hint === undefined)
			super(name, values, selected_id);
		else
			super(name, values, selected_id, hint);

		this.defaultValue = selected_id;

		Object.defineProperty(this, 'callback', {
			value: () => ComboBoxCallback(this),
			writable: false
		});

		var selfParent = parent;
		Object.defineProperty(this, 'parent', {
			set: (value: Tree) => {

				this.Remove();

				value.entries.push(this);
				
				var parnt = getTopParent(value);

				console.log("ComboBox: ", parnt);
				parnt.Update();

				selfParent = value;
			},
			get: () => selfParent,
			configurable: false
		});
	}

	Remove(): void {
		this.parent.RemoveControl(this);
	}
	ChangeParentTo(parent: Tree) {
		this.parent = parent;
	}

	SetToolTip(text: string): this {
		this.hint = text;
		return this;
	}

	ChangeValue(value: number) {
		this.selected_id = value;
		this.Update();
	}
	ChangeToDefault(): this {
		this.selected_id = this.defaultValue;
		this.Update();
		return this;
	}

	OnValue(callback: (value: number, self: ComboBox) => void): this {
		this.OnValueCallback = callback;
		return this;
	}
}