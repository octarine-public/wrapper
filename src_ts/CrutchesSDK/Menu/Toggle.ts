import Tree from "./Tree";

function ToggleCallback(toggle: Toggle): void {
	
	var onValue = toggle.OnValueCallback,
		onActivate = toggle.OnActivateCallback,
		onDeactivate = toggle.OnDeactivateCallback,
		value = toggle.value;
	
	if (onValue)
		onValue(value, toggle);
	
	if (value) {
		
		if (onActivate)
			onActivate(toggle);
	} else {
		
		if (onDeactivate)
			onDeactivate(toggle);
	}
}

function getTopParent(node: Tree | Toggle): Tree {
	let parent = node.parent;
	return parent !== undefined ? getTopParent(parent) : node as Tree;
}

export default class Toggle extends Menu_Toggle {

	parent: Tree;

	defaultValue: boolean;
	
	OnValueCallback: (value: boolean, self: Toggle) => void;
	OnActivateCallback: (self: Toggle) => void;
	OnDeactivateCallback: (self: Toggle) => void;
	
	/**
	 * You can't change 'callback'. For this use 'OnValue' or 'OnValueCallback'
	 */
	readonly callback: (self: Toggle) => void;
	
	constructor(parent: Tree, name: string, value: boolean, hint: string) {
		
		if (hint === undefined)
			super(name, value);
		else
			super(name, value, hint);

		this.defaultValue = value;
		
		Object.defineProperty(this, 'callback', {
			value: () => ToggleCallback(this),
			writable: false
		});
		
		var selfParent = parent;
		Object.defineProperty(this, 'parent', {
			set: (value: Tree) => {

				this.Remove();

				value.entries.push(this);
				
				var parnt = getTopParent(value);

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
	
	ChangeValue(value: boolean) {
		this.value = value;
	}
	ChangeReverse(): this {
		this.value = !this.value;
		return this;
	}
	ChangeToDefault(): this {
		this.value = this.defaultValue;
		return this;
	}

	OnValue(callback: (value: boolean, self: Toggle) => void): this {
		this.OnValueCallback = callback;
		return this;
	}
	OnActivate(callback: (self: Toggle) => void): this {
		this.OnActivateCallback = callback;
		return this;
	}
	OnDeactivate(callback: (self: Toggle) => void): this {
		this.OnDeactivateCallback = callback;
		return this;
	}
}