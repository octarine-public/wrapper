import { Menu as MenuSDK } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

let Menu = MenuSDK.AddEntry(["Heroes", "Lina"]),
	State = Menu.AddToggle("Enable")

let array_ability: string[] = [
	Abilities.DragonSlave.toString(),
	Abilities.LightStrikeArray.toString(),
	Abilities.LagunaBlade.toString(),
]

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
]
let array_ability_steal: string[] = [
	Abilities.DragonSlave.toString(),
	Abilities.LagunaBlade.toString(),
]

let AutoStealTree = Menu.AddNode("Auto Steal"),
	AutoStealState = AutoStealTree.AddToggle("Enable", true),
	AutoStealAbility = AutoStealTree.AddImageSelector("Ability", array_ability_steal, new Map(array_ability_steal.map(name => [name, true]))),
	Combo = Menu.AddNode("Combo"),
	ModeInvisCombo = Combo.AddSwitcher("Invis Mode", ["Stuned and Combo", "Attack + Combo"], 0),
	ComboKeyItem = Combo.AddKeybind("Combo Key"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	СomboItems = Combo.AddImageSelector("Items", array_items, new Map(array_items.map(name => [name, true]))),
	СomboAbility = Combo.AddImageSelector("Ability", array_ability, new Map(array_ability.map(name => [name, true]))),
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
