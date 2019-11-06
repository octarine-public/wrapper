import { Menu as MenuSDK } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

let Menu = MenuSDK.AddEntry(["Heroes", "Clinkz"]),
	State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Strafe.toString(),
	Abilities.SearingArrows.toString(),
	Abilities.BurningArmy.toString(),
]
let arrayItems: string[] = [
	Items.BladeMail.toString(), Items.LotusOrb.toString(),
	Items.BlackKingBar.toString(), Items.Mjollnir.toString(),
	Items.Satanic.toString(), Items.Medallion.toString(),
	Items.SolarCrest.toString(), Items.UrnOfShadows.toString(),
	Items.RodofAtos.toString(), Items.SpiritVesel.toString(),
	Items.Sheeps.toString(), Items.Orchid.toString(),
	Items.Bloodthorn.toString(), Items.Shivas.toString(),
	Items.Nullifier.toString(), Items.Armlet.toString(),
	Items.Blink.toString(),
]

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	HarassModeCombo = Combo.AddSwitcher("Orb Walker", ["Off", "Move to cursor", "Move to target"]),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, new Map(arrayAbility.map(name => [name, true]))),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true]))),
	AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true).SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	BlinkRadius = Combo.AddSlider("Blink distance from enemy", 400, 0, 1200)

let Harass = Menu.AddNode("Harass"),
	HarassKey = Harass.AddKeybind("Harass key"),
	HarassMode = Harass.AddSwitcher("Orb Walker", ["Off", "Move to cursor", "Move to target"])

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let arrayLinkenBreak: string[] = [
	arrayItems[8], arrayItems[10],
	arrayItems[11], arrayItems[13],
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.Cyclone.toString(),
	Items.HurricanePike.toString(),
]

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector("Items", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true]))),
	UseOnlyFromRangeItem = linkenBreakerMenu.AddToggle("Use Only From Range", true)

let DrawingMenu = Menu.AddNode("Drawing"),
	targetMenu = DrawingMenu.AddNode("Target"),
	DrawTargetItem = targetMenu.AddToggle("Enable", true)//,
//radiusMenu = DrawingMenu.AddNode("Radius")

export {
	HarassKey,
	HarassMode
}

export {
	State,
	NearMouse,
	СomboItems,
	BlinkRadius,
	ComboKeyItem,
	AeonDiscItem,
	СomboAbility,
	BladeMailItem,
	DrawTargetItem,
	LinkenBreakerToggler,
	UseOnlyFromRangeItem,
	HarassModeCombo,
}