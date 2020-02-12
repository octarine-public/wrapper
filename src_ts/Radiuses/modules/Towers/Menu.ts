import { Menu as MenuSDK, PARTICLE_RENDER_NAME } from "wrapper/Imports"
import { IMenuParticlePicker, IMenuColorPicker } from "wrapper/Menu/ITypes"

import { Menu } from "../../base/MenuBase"


export const Buildings = Menu.AddNode("Buildings")

const Towers = Buildings.AddNode("Towers")
export const TowersRange = BuildingPatternParticle("Range", Towers)
export const ShowAttackTarget = BuildingPatternColor("Show Tower Target", Towers)

export const Outposts = BuildingPatternParticle("Outposts")

export interface IBuildingPattern {
	Node: MenuSDK.Node
	State: MenuSDK.Toggle
	Team: MenuSDK.Switcher
}
export interface IBuildingParticlePattern extends IBuildingPattern {
	Style: IMenuParticlePicker
}
export interface IBuildingColorPattern extends IBuildingPattern {
	Style: IMenuColorPicker
}

function BuildingPatternBase(name: string, Node?: MenuSDK.Node) {
	Node = (Node ?? Buildings).AddNode(name)
	return {
		Node,
		State: Node.AddToggle("State"),
		Team: Node.AddSwitcher("Team", ["Allies and Enemy", "Only Enemy", "Only Allies"])
	}
}

function BuildingPatternParticle(name: string, Node?: MenuSDK.Node): IBuildingParticlePattern {
	const pattern = BuildingPatternBase(name, Node)
	return {
		...pattern,
		Style: pattern.Node.AddParticlePicker("Style", undefined, [
			PARTICLE_RENDER_NAME.NORMAL,
			PARTICLE_RENDER_NAME.ROPE,
			PARTICLE_RENDER_NAME.ANIMATION
		])
	}
}

function BuildingPatternColor(name: string, Node?: MenuSDK.Node): IBuildingColorPattern {
	const pattern = BuildingPatternBase(name, Node)
	return {
		...pattern,
		Style: pattern.Node.AddColorPicker("Style")
	}
}