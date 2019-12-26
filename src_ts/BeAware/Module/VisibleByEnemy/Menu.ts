import { Menu, MenuBase } from "../../abstract/Menu.Base"
const { BaseTree, State } = MenuBase(Menu, "VisibleByEnemy"),
	switcher = BaseTree.AddSwitcher("Select Effect", ["Shiva", "Radial", "Beam", "Beam light", "Dark", "Purge", "Timer"], 0),
	showOnAll = BaseTree.AddToggle("Show on all units", true),
	showOnSelf = BaseTree.AddToggle("Show on self", false),
	showOnAllies = BaseTree.AddToggle("Show on ally heroes", false),
	showOnWards = BaseTree.AddToggle("Show on wards", false),
	showOnCreeps = BaseTree.AddToggle("Show on creeps", false)

export { State, switcher, showOnAll, showOnSelf, showOnAllies, showOnWards, showOnCreeps };
