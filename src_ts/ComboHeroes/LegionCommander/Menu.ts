import { Color, Menu as MenuSDK } from "wrapper/Imports"

import InitItems from "./Extends/Items"
import InitAbility from "./Extends/Abilities"

let Items = new InitItems(undefined),
	Abilities = new InitAbility(undefined)

let Menu = MenuSDK.AddEntry(["Heroes", "Strength", "Legion Commander"]),
	State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Overwhelming.toString(),
	Abilities.PressTheAttack.toString(),
	Abilities.Duel.toString(),
],
activeAbility: Map<string, boolean> = new Map<string, boolean>([
	[arrayAbility[1], true],
	[arrayAbility[2], true],
])

let arrayItems: string[] = [
	// 0							// 1
	Items.BladMail.toString(), 		Items.LotusOrb.toString(),
	// 2							// 3
	Items.BlackKingBar.toString(),	Items.Abyssal.toString(),
	// 4							// 5
	Items.Mjollnir.toString(),		Items.Armlet.toString(),
	// 6							// 7
	Items.Satanic.toString(),		Items.Medallion.toString(),
	// 8							// 9
	Items.SolarCrest.toString(),	Items.UrnOfShadows.toString(),
	// 10							// 11
	Items.RodofAtos.toString(),		Items.SpiritVesel.toString(),
	// 12							// 13
	Items.Sheeps.toString(),		Items.Ethereal.toString(),
	// 14							// 15
	Items.Discord.toString(),		Items.Dagon.toString(),
	// 16							// 17
	Items.Orchid.toString(),		Items.Bloodthorn.toString(),
	// 18							// 19
	Items.Shivas.toString(),		Items.Nullifier.toString(),
	// 20
	Items.Blink.toString(),
],
activeItems: Map<string, boolean> = new Map<string, boolean>([
	[arrayItems[0], true], 	[arrayItems[1], true],
	[arrayItems[2], true], 	[arrayItems[3], true],
	[arrayItems[4], true], 	[arrayItems[5], true],
	[arrayItems[6], true], 	[arrayItems[7], true],
	[arrayItems[8], true], 	[arrayItems[9], true],
	[arrayItems[10], true],	[arrayItems[11], true],
	[arrayItems[12], true],	[arrayItems[13], true],
	[arrayItems[14], true],	[arrayItems[15], true],
	[arrayItems[16], true],	[arrayItems[17], true],
	[arrayItems[18], true],	[arrayItems[19], true],
	[arrayItems[20], true],
])

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, activeAbility),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, activeItems),
	AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true).SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let arrayLinkenBreak: string[] = [
	arrayItems[3],	arrayItems[12],
	arrayItems[10], arrayItems[13],	
	arrayItems[15], arrayItems[16], 
	arrayItems[17], arrayItems[19],
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.Cyclone.toString(),
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
	[arrayLinkenBreak[8], true],
	[arrayLinkenBreak[9], true],
	[arrayLinkenBreak[10], true],
])

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector("Items", arrayLinkenBreak, activeLinkenBreak),
	UseOnlyFromRangeItem = linkenBreakerMenu.AddToggle("Use Only From Range")

let DrawingMenu = Menu.AddNode("Drawing"),
	targetMenu = DrawingMenu.AddNode("Target"),
	DrawTargetItem = targetMenu.AddToggle("Enable", true),
	radiusMenu = DrawingMenu.AddNode("Radius"),

	OverwhelmingOddsRadiusTree = radiusMenu.AddNode("Overwhelming Odds"),
	OverwhelmingOddsRadiusItem = OverwhelmingOddsRadiusTree.AddToggle("Enable", true),
	OverwhelmingOddsRadiusColor = radiusMenu.AddColorPicker("Overwhelming Odds", new Color(255, 255, 255)),

	PressTheAttackRadiusItemTree = radiusMenu.AddNode("Press The Attack"),
	PressTheAttackRadiusItem = PressTheAttackRadiusItemTree.AddToggle("Enable", true),
	PressTheAttackRadiusItemColor = radiusMenu.AddColorPicker("Press The Attack", new Color(255, 255, 255)),

	DuelRadiusItemTree = radiusMenu.AddNode("Duel"),
	DuelRadiusItem = DuelRadiusItemTree.AddToggle("Duel", false),
	DuelRadiusItemColor = radiusMenu.AddColorPicker("Duel", new Color(255, 255, 255)),

	BlinkRadiusItemTree = radiusMenu.AddNode("Blink"),
	BlinkRadiusItem = BlinkRadiusItemTree.AddToggle("Blink", true),
	BlinkRadiusItemColor = radiusMenu.AddColorPicker("Blink", new Color(255, 255, 255))

export {
	// Combo
	State,
	ComboKeyItem,
	СomboAbility,
	СomboItems,
	AeonDiscItem,
	NearMouse,
	LinkenBreakerToggler,
	DrawTargetItem,
	UseOnlyFromRangeItem,
	BladeMailItem,
	// Drawing
	OverwhelmingOddsRadiusItem,
	PressTheAttackRadiusItem,
	DuelRadiusItem,
	BlinkRadiusItem,
	BlinkRadiusItemColor,
	DuelRadiusItemColor,
	PressTheAttackRadiusItemColor,
	OverwhelmingOddsRadiusColor,
}