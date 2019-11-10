import { Menu as MenuSDK, Color } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

let Menu = MenuSDK.AddEntry(["Heroes", "Shadow Fiend"]),
	State = Menu.AddToggle("Enable")

let array_ability: string[] = [
	// Abilities.Shadowraze1.toString(),
	// Abilities.Shadowraze2.toString(),
	// Abilities.Shadowraze3.toString(),
	Abilities.Requiem.toString(),
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
let array_radius: string[] = [
	Abilities.Shadowraze1.toString(),
	Abilities.Shadowraze2.toString(),
	Abilities.Shadowraze3.toString(),
	Items.Blink.toString(),
	Items.Cyclone.toString(),
]

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key"),
	StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"]),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	СomboItems = Combo.AddImageSelector("Items", array_items, new Map(array_items.map(name => [name, true]))),
	СomboAbility = Combo.AddImageSelector("Ability", array_ability, new Map(array_ability.map(name => [name, true]))),
	Drawing = Menu.AddNode("Drawing"),
	DrawingStatus = Drawing.AddToggle("Draw Target", true),
	RadiusTree = Drawing.AddNode("Radius"),
	Radius = RadiusTree.AddImageSelector("Select", array_radius),
	AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range"),
	AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable"),
	RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", new Color(255, 255, 0)),
	BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", new Color(255, 255, 255)),
	CycloneRadiusItemColor = RadiusTree.AddColorPicker("Cyclone", new Color(255, 255, 255)),
	ShadowRaze1RadiusColor = RadiusTree.AddColorPicker("Shadow Raze 1", new Color(255, 255, 255)),
	ShadowRaze2RadiusColor = RadiusTree.AddColorPicker("Shadow Raze 2", new Color(255, 255, 255)),
	ShadowRaze3RadiusColor = RadiusTree.AddColorPicker("Shadow Raze 3", new Color(255, 255, 255))

let BladeMail = Menu.AddNode("Blade Mail"),
	BladeMailCancel = BladeMail.AddToggle("Cancel Combo and Auto Steal", true)

export {
	Radius,
	DrawingStatus,
	AttackRangeRadius,
	RadiusColorAttackRange,
	BlinkRadiusItemColor,
	ShadowRaze1RadiusColor,
	ShadowRaze2RadiusColor,
	ShadowRaze3RadiusColor,
	CycloneRadiusItemColor
}

export {
	State,
	NearMouse,
	StyleCombo,
	СomboItems,
	ComboKeyItem,
	СomboAbility,
	BladeMailCancel,
	// HarassModeCombo
}
