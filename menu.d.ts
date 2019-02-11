// You have ability to modify any value/array described in this .d.ts (except global Menu object)

declare class Menu_Base {
	name: string
	hint?: string // doesn't work on root Menu_Node (that've added by Menu.AddEntry)
	callback?: (self: this) => void // doesn't work on Menu_Node
}

declare class Menu_Node extends Menu_Base {
	readonly entries: Menu_Base[]
	
	// You must call this method after you're done with editing entries, otherwise no changes will be shown
	// This method will trigger all available callbacks if there's any settings saved for them
	// Also, you must call this method only on root Menu_Node, otherwise there'll be settings saving bug
	Update(): void

	constructor(name: string, hint?: string, entries?: Menu_Base[])
	constructor(name: string, entries?: Menu_Base[])
}

declare class Menu_Toggle extends Menu_Base {
	value: boolean

	constructor(name: string, value: boolean, hint?: string, callback?: (self: Menu_Toggle) => void)
	constructor(name: string, value: boolean, callback?: (self: Menu_Toggle) => void)
}

declare class Menu_Boolean extends Menu_Base {
	value: boolean

	constructor(name: string, value: boolean, hint?: string, callback?: (self: Menu_Boolean) => void)
	constructor(name: string, value: boolean, callback?: (self: Menu_Boolean) => void)
}

declare class Menu_Keybind extends Menu_Base {
	value: number
	
	constructor(name: string, value: number, hint?: string, callback?: (self: Menu_Keybind) => void)
	constructor(name: string, value: number, callback?: (self: Menu_Keybind) => void)
}

declare class Menu_List extends Menu_Base {
	readonly values: string[]
	selected_id: number
	
	// you must call this method after you're done with editing entries,
	// otherwise no changes will be shown
	// P.S.: this method will trigger callback if there's settings saved for it
	// P.P.S.: this method also being triggered by constructor
	Update(): void
	
	constructor(name: string, values: string[], selected_id: number, hint?: string, callback?: (self: Menu_List) => void)
	constructor(name: string, values: string[], selected_id: number, callback?: (self: Menu_List) => void)
}

declare class Menu_SliderInt extends Menu_Base {
	value: number
	min: number
	max: number
	
	constructor(name: string, value: number, min: number, max: number, hint?: string, callback?: (self: Menu_SliderInt) => void)
	constructor(name: string, value: number, min: number, max: number, callback?: (self: Menu_SliderInt) => void)
}

declare class Menu_SliderFloat extends Menu_Base {
	value: number
	min: number
	max: number
	
	constructor(name: string, value: number, min: number, max: number, hint?: string, callback?: (self: Menu_SliderFloat) => void)
	constructor(name: string, value: number, min: number, max: number, callback?: (self: Menu_SliderFloat) => void)
}

declare interface Menu {
	AddEntry(entry: Menu_Node): void
}
declare var Menu: Menu
