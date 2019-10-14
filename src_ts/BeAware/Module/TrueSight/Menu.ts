import { Menu, MenuBase } from "../../abstract/Menu.Base"
let Special = Menu.AddNode("Special")
const { BaseTree, State } = MenuBase(Special, "TrueSight Detector"),
	switcher = BaseTree.AddSwitcher("Select Effect", ["Shiva", "Radial", "Beam", "Beam light", "Dark", "Purge", "Timer", "Eye Wards"], 6),
	showOnAll = BaseTree.AddToggle("Show on all units", true),
	showOnSelf = BaseTree.AddToggle("Show on self", false),
	showOnAllies = BaseTree.AddToggle("Show on ally heroes", false),
	showOnWards = BaseTree.AddToggle("Show on wards", false),
	showOnCreeps = BaseTree.AddToggle("Show on creeps", false)

export { State, showOnAll, showOnSelf, showOnAllies, showOnWards, showOnCreeps, switcher };
