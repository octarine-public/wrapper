import { Menu, MenuBase } from "../../abstract/MenuBase"
const { BaseTree, State } = MenuBase(Menu, "Auto Deward")
const StateItems = BaseTree.AddListBox("Items", 
	[
		"Quelling Blade", 
		"Battle Fury", 
		"Tango", 
		"Shared Tango"
	], 
[true, true, true, true])
export { State, StateItems }