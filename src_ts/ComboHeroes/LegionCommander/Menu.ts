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
],
activeAbility = new Map<string, boolean>()

arrayAbility.forEach(abilName => {
	activeAbility.set(abilName, abilName !== Abilities.Overwhelming.toString())
})

let arrayItems: string[] = [
	Items.BladeMail.toString(), 		// 0
	Items.LotusOrb.toString(), 			// 1
	Items.BlackKingBar.toString(), 		// 2	
	Items.Mjollnir.toString(),			// 3	
	Items.Armlet.toString(), 			// 4
	Items.Satanic.toString(),			// 5	
	Items.Medallion.toString(), 		// 6
	Items.SolarCrest.toString(),		// 7
	Items.UrnOfShadows.toString(), 		// 8
	Items.RodofAtos.toString(), 		// 9
	Items.SpiritVesel.toString(), 		// 10
	Items.Blink.toString(), 			// 11
	Items.Orchid.toString(), 			// 12	
	Items.Bloodthorn.toString(), 		// 13
	Items.Shivas.toString(), 			// 14
	Items.Nullifier.toString(), 		// 15
	Items.InvisSword.toString(), 		// 16
	Items.SilverEdge.toString(), 		// 17
],
activeItems = new Map<string, boolean>();

arrayItems.forEach(itemName => {
	activeItems.set(itemName, true);
});

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	ComboMode = Combo.AddSwitcher("Use combo with (Priority)", ["Invisible Sword", "Dagger"], 1),
	ComboModeInvis = Combo.AddToggle("Use Press of Attak before invisibility", true),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, activeAbility),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, activeItems),
	isRunToTarget = Combo.AddToggle("Run to mouse position (target has blade mail, etc)"),
	AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true).SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let arrayLinkenBreak: string[] = [
	arrayItems[9],	
	arrayItems[12], 
	arrayItems[13],
	arrayItems[15],
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.HurricanePike.toString(),
	Items.Cyclone.toString(),
],
activeLinkenBreak = new Map<string, boolean>();

arrayLinkenBreak.forEach(itemName => {
	activeLinkenBreak.set(itemName, true);
});

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector("Items", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true]))),
	UseOnlyFromRangeItem = linkenBreakerMenu.AddToggle("Use Only From Range")

// Drawing

let DrawingMenu = Menu.AddNode("Drawing"),
	targetMenu = DrawingMenu.AddNode("Target"),
	DrawTargetItem = targetMenu.AddToggle("Enable", true),
	radiusMenu = DrawingMenu.AddNode("Radius"),
	Radius = radiusMenu.AddImageSelector("Select", [
		arrayAbility[0],
		arrayAbility[1],
		arrayAbility[2],
		arrayItems[11]
	]),
	OverwhelmingOddsRadiusColor = radiusMenu.AddColorPicker("Overwhelming Odds", new Color(255, 255, 255)),
	PressTheAttackRadiusItemColor = radiusMenu.AddColorPicker("Press The Attack", new Color(255, 255, 255)),
	DuelRadiusItemColor = radiusMenu.AddColorPicker("Duel", new Color(255, 255, 255)),
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
	isRunToTarget,
	LinkenBreakerToggler,
	DrawTargetItem,
	UseOnlyFromRangeItem,
	BladeMailItem,
	// Drawing
	Radius,
	OverwhelmingOddsRadiusColor,
	PressTheAttackRadiusItemColor,
	DuelRadiusItemColor,
	BlinkRadiusItemColor
}