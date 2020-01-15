import { Menu as MenuSDK } from "wrapper/Imports"

import { Menu } from "../../base/MenuBase"
import { AddRangeParticle, MenuRangeParticle } from "../../base/MenuRangeParticle"

export const Buildings = Menu.AddNode("Buildings")

export const Towers = BuildingPattern("Towers")
export const ShowAttackTarget = Towers.Node.AddToggle("Show Tower Target")

export const Shrines = BuildingPattern("Shrines")

export const Outposts = BuildingPattern("Outposts")

export interface IBuildingPattern {
	Node: MenuSDK.Node
	State: MenuSDK.Toggle
	Team: MenuSDK.Switcher
	Style: MenuRangeParticle
}

function BuildingPattern(name: string): IBuildingPattern {

	const Node = Buildings.AddNode(name)

	return {
		Node,
		State: Node.AddToggle("State"),
		Team: Node.AddSwitcher("Team", ["Allies and Enemy", "Only Enemy", "Only Allies"]),
		Style: AddRangeParticle(Node, "Style")
	}
}