import { Menu as MenuSDK, Color } from "wrapper/Imports"

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

let array_radius: string[] = [
	array_ability[0],
	array_ability[1],
	array_ability[2],
	array_items[2]
]

let AutoStealTree = Menu.AddNode("Auto Steal"),
	AutoStealState = AutoStealTree.AddToggle("Enable", true),
	AutoStealAbility = AutoStealTree.AddImageSelector("Ability", array_ability_steal, new Map(array_ability_steal.map(name => [name, true]))),
	Combo = Menu.AddNode("Combo")
const ComboHitAndRunTree = Combo.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])

let ModeInvisCombo = Combo.AddSwitcher("Invis Mode", ["Stuned and Combo", "Attack + Combo"], 0),
	ComboKeyItem = Combo.AddKeybind("Combo Key"),
	StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"]),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	СomboItems = Combo.AddImageSelector("Items", array_items, new Map(array_items.map(name => [name, true]))),
	СomboAbility = Combo.AddImageSelector("Ability", array_ability, new Map(array_ability.map(name => [name, true]))),
	Drawing = Menu.AddNode("Drawing"),
	RadiusTree = Drawing.AddNode("Radius"),
	Radius = RadiusTree.AddImageSelector("Select", array_radius),
	AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range"),
	AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable"),
	RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", new Color(255, 255, 0)),
	BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", new Color(255, 255, 255)),
	DragonSlaveRadiusColor = RadiusTree.AddColorPicker("Dragon Slave", new Color(255, 255, 255)),
	LightStrikeArrayColor = RadiusTree.AddColorPicker("Light Strike", new Color(255, 255, 255)),
	LagunaBladeColor = RadiusTree.AddColorPicker("Laguna Blade", new Color(255, 255, 255)),

	DrawingStatus = Drawing.AddToggle("Draw Target", true),
	DrawingStatusKillSteal = Drawing.AddToggle("Draw Kill Steal", true)

let BladeMail = Menu.AddNode("Blade Mail"),
	BladeMailCancel = BladeMail.AddToggle("Cancel Combo and Auto Steal", true)

export {
	Radius,
	DrawingStatus,
	AutoStealState,
	AutoStealAbility,
	DrawingStatusKillSteal,
	BlinkRadiusItemColor,
	DragonSlaveRadiusColor, LightStrikeArrayColor,
	LagunaBladeColor,
	AttackRangeRadius,
	RadiusColorAttackRange
}

export {
	State,
	NearMouse,
	StyleCombo,
	СomboItems,
	ComboKeyItem,
	СomboAbility,
	BladeMailCancel,
	ModeInvisCombo
}
