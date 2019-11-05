import { Menu as MenuSDK, Color, Ability } from "wrapper/Imports"

import InitItems from "./Extends/Items"
import InitAbility from "./Extends/Abilities"

let Items = new InitItems(undefined),
	Abilities = new InitAbility(undefined)

let Menu = MenuSDK.AddEntry(["Heroes", "Lina"]),
	State = Menu.AddToggle("Enable")

let array_ability: string[] = [
	Abilities.DragonSlave.toString(),
	Abilities.LightStrikeArray.toString(),
	Abilities.LagunaBlade.toString(),
], activeAbility: Map<string, boolean> = new Map<string, boolean>([
	[array_ability[0], true],
	[array_ability[1], true],
	[array_ability[2], true]
])

let array_items: string[] = [
	Items.Cyclone.toString(),
	Items.Sheeps.toString(),
	Items.Blink.toString(),
	Items.Orchid.toString(),
	Items.Discord.toString(),
	Items.Ethereal.toString(),
	Items.Dagon.toString(),
	Items.Shivas.toString(),
	Items.BlackKingBar.toString(),
	Items.Bloodthorn.toString(),
], activeItems: Map<string, boolean> = new Map<string, boolean>([
	[array_ability[0], true],
	[array_ability[1], true],
	[array_ability[2], true],
	[array_ability[3], true],
	[array_ability[4], true],
	[array_ability[5], true],
	[array_ability[6], true],
	[array_ability[7], true],
	[array_ability[8], true],
	[array_ability[9], true]
])
let array_ability_steal: string[] = [
	Abilities.DragonSlave.toString(),
	Abilities.LagunaBlade.toString(),
], activeAbilitySteal: Map<string, boolean> = new Map<string, boolean>([
	[array_ability[0], true],
	[array_ability[1], true],
	[array_ability[2], true]
])

let AutoStealTree = Menu.AddNode("Auto Steal"),
	AutoStealState = AutoStealTree.AddToggle("Enable", true),
	AutoStealAbility = AutoStealTree.AddImageSelector("Ability", array_ability_steal, activeAbilitySteal),
	Combo = Menu.AddNode("Combo"),
	ModeInvisCombo = Combo.AddSwitcher("Invis Mode", ["Stuned and Combo", "Attack + Combo"], 0),
	ComboKeyItem = Combo.AddKeybind("Combo Key"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	СomboItems = Combo.AddImageSelector("Items", array_items, activeItems),
	СomboAbility = Combo.AddImageSelector("Ability", array_ability, activeAbility),
	Drawing = Menu.AddNode("Drawing"),
	DrawingStatus = Drawing.AddToggle("Draw target", true),
	DrawingStatusKillSteal = Drawing.AddToggle("Draw Kill Steal", true)
	
let BladeMail = Menu.AddNode("Blade Mail"),
	BladeMailCancel = BladeMail.AddToggle("Cancel Combo and Auto Steal", true)
	
export {
	DrawingStatus,
	AutoStealState,
	AutoStealAbility,
	DrawingStatusKillSteal
}
	
export {
	State,
	NearMouse,
	СomboItems,
	ComboKeyItem,
	СomboAbility,
	BladeMailCancel,
	ModeInvisCombo
}
