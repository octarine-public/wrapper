
import { XMenu, Menu } from "../../Menu/Base"
import { lina_ability } from "./Data"

export const {
	State,
	BaseTree,
	ComboKey,
	NearMouse,
	ComboTree,
	OrbWalkerState
} = XMenu(Menu, "Lina")

const AutoStealTree = BaseTree.AddNode("Auto Steal")
export const AutoStealState = AutoStealTree.AddToggle("Enable", true)
export const AutoStealAbility = AutoStealTree.AddImageSelector("Ability", lina_ability, new Map(lina_ability.map(name => [name, true])))