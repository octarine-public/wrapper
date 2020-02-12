import { Menu as MenuSDK, Unit } from "wrapper/Imports"

import { Menu } from "../../base/MenuBase"
import {
	IMenuPattern,
	IParticlePattern,
	IColorPattern,
	MenuPattternBase,
	MenuPatternParticle,
	MenuPatternColor
} from "../../base/MenuParticle"


// -------

export const BuildingsMenu = Menu.AddNode("Buildings")

// ---
const TowersMenu = BuildingsMenu.AddNode("Towers")

export const TowersRangeMenu = BuildingPatternParticle("Towers Range", TowersMenu)
export const ShowAttackTargetMenu = BuildingPatternColor("Show Tower Target", TowersMenu)
// ---
export const OutpostsMenu = BuildingPatternParticle("Outposts")


// ---

export const MenuCheckTeam = (pattern: IBuildingPattern, ent: Unit) => (
	!pattern.State.value
	|| (pattern.Team.selected_id === 1 && !ent.IsEnemy())
	|| (pattern.Team.selected_id === 2 && ent.IsEnemy())
)

// -------

function BuildingPatternBase(name: string, Node?: MenuSDK.Node): IBuildingPattern {
	const menu = MenuPattternBase(name, (Node ?? BuildingsMenu))
	return {
		...menu,
		Team: menu.Node.AddSwitcher("Team", ["Allies and Enemy", "Only Enemy", "Only Allies"])
	}
}

function BuildingPatternParticle(name: string, Node?: MenuSDK.Node): IBuildingParticlePattern {
	const pattern = BuildingPatternBase(name, Node)
	return {
		...pattern,
		...MenuPatternParticle(pattern.Node),
	}
}

function BuildingPatternColor(name: string, Node?: MenuSDK.Node): IBuildingColorPattern {
	const pattern = BuildingPatternBase(name, Node)
	return {
		...pattern,
		...MenuPatternColor(pattern.Node),
	}
}

// -------

export interface IBuildingPattern extends IMenuPattern {
	Team: MenuSDK.Switcher
}
export interface IBuildingParticlePattern extends IBuildingPattern, IParticlePattern { }
export interface IBuildingColorPattern extends IBuildingPattern, IColorPattern { }

// -------