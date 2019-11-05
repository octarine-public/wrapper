import { Menu as MenuSDK } from "wrapper/Imports"

import InitItems from "./Extends/Items"
import InitAbility from "./Extends/Abilities"

let Items = new InitItems,
	Abilities = new InitAbility

let Menu = MenuSDK.AddEntry(["Heroes", "Clinkz"]),
	State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Strafe.toString(),
	Abilities.SearingArrows.toString(),
	Abilities.BurningArmy.toString()
],
activeAbility: Map<string, boolean> = new Map<string, boolean>([
	[arrayAbility[0], true], 
	[arrayAbility[1], true], 
	[arrayAbility[2], true]
])
let arrayItems: string[] = [
	Items.BladMail.toString(), 		Items.LotusOrb.toString(),
	Items.BlackKingBar.toString(),	Items.Mjollnir.toString(), 		
	Items.Satanic.toString(), 		Items.Medallion.toString(),
	Items.SolarCrest.toString(), 	Items.UrnOfShadows.toString(),
	Items.RodofAtos.toString(), 	Items.SpiritVesel.toString(),
	Items.Sheeps.toString(),		Items.Orchid.toString(),
	Items.Bloodthorn.toString(),	Items.Shivas.toString(),
	Items.Nullifier.toString(), 	Items.Armlet.toString(),
	Items.Blink.toString(),
],
activeItems: Map<string, boolean> = new Map<string, boolean>([
	[arrayItems[0], true], 	[arrayItems[1], true],
	[arrayItems[2], true], 	[arrayItems[3], true],
	[arrayItems[4], true], 	[arrayItems[5], true],
	[arrayItems[6], true], 	[arrayItems[7], true],
	[arrayItems[8], true], 	[arrayItems[9], true],
	[arrayItems[10], true], [arrayItems[11], true],
	[arrayItems[12], true],	[arrayItems[13], true],
	[arrayItems[14], true],	[arrayItems[15], true],
	[arrayItems[16], true],
])

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	HarassModeCombo = Combo.AddSwitcher("Orb Walker", ["Off", "Move to cursor", "Move to target"]),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, activeAbility),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, activeItems),
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
	Items.HurricanePike.toString()
],
activeLinkenBreak: Map<string, boolean> = new Map<string, boolean>([
	[arrayLinkenBreak[0], true],
	[arrayLinkenBreak[1], true],
	[arrayLinkenBreak[2], true],
	[arrayLinkenBreak[3], true],
	[arrayLinkenBreak[4], true],
	[arrayLinkenBreak[5], true],
	[arrayLinkenBreak[6], true],
	[arrayLinkenBreak[7], true],
])

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector("Items", arrayLinkenBreak, activeLinkenBreak),
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