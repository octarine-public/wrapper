import { Color, Menu as MenuSDK } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

let Menu = MenuSDK.AddEntry(["Heroes", "Legion Commander"]),
	State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Overwhelming.toString(),
	Abilities.PressTheAttack.toString(),
	Abilities.Duel.toString(),
]

let arrayItems: string[] = [
	Items.BladeMail.toString(), 		// 0
	Items.LotusOrb.toString(), 			// 1
	Items.BlackKingBar.toString(), 		// 2
	Items.Abyssal.toString(), 			// 3
	Items.Mjollnir.toString(),			// 4
	Items.Armlet.toString(), 			// 5
	Items.Satanic.toString(),			// 6
	Items.Medallion.toString(), 		// 7
	Items.SolarCrest.toString(),		// 8
	Items.UrnOfShadows.toString(), 		// 9
	Items.RodofAtos.toString(), 		// 10
	Items.SpiritVesel.toString(), 		// 11
	Items.Sheeps.toString(), 			// 12
	Items.Blink.toString(), 			// 13
	Items.Orchid.toString(), 			// 14
	Items.Bloodthorn.toString(), 		// 15
	Items.Shivas.toString(), 			// 16
	Items.Nullifier.toString(), 		// 17
	Items.InvisSword.toString(), 		// 18
	Items.SilverEdge.toString(), 		// 19
]

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	ComboMode = Combo.AddSwitcher("Use combo with (Priority)", ["Invisible Sword", "Dagger"], 1),
	ComboModeInvis = Combo.AddToggle("Use Press of Attak before invisibility", true),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, new Map(arrayAbility.map(name => [name, true]))),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true]))),
	AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true).SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let arrayLinkenBreak: string[] = [
	arrayItems[3],
	arrayItems[10],
	arrayItems[12],
	arrayItems[14],
	arrayItems[15],
	arrayItems[17],
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.Cyclone.toString(),
]

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector("Items", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true]))),
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
	ComboModeInvis,
	AeonDiscItem,
	NearMouse,
	ComboMode,
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