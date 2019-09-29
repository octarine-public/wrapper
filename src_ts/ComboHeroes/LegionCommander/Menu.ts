import { Color, Menu as MenuSDK } from "wrapper/Imports"

let Menu = MenuSDK.AddEntry(["Heroes", "Strength", "Legion Commander"]),
	State = Menu.AddToggle("Enable")

let Combo = Menu.AddNode("Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key", "D"),
	СomboAbility = Combo.AddImageSelector(
		"Abilities", [
			"legion_commander_overwhelming_odds",
			"legion_commander_press_the_attack",
			"legion_commander_duel",
		], new Map<string, boolean>([
			["legion_commander_press_the_attack", true],
			["legion_commander_duel", true],
		]),
	),
	СomboItems = Combo.AddImageSelector(
		"Items", [
			"item_blade_mail",
			"item_lotus_orb",
			"item_black_king_bar",
			"item_abyssal_blade",
			"item_mjollnir",
			"item_armlet",
			"item_satanic",
			"item_medallion_of_courage",
			"item_solar_crest",
			"item_urn_of_shadows",
			"item_rod_of_atos",
			"item_spirit_vessel",
			"item_sheepstick",
			"item_ethereal_blade",
			"item_veil_of_discord",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"item_shivas_guard",
			"item_nullifier",
			"item_blink",
		], new Map<string, boolean>([
			["item_blade_mail", true],
			["item_lotus_orb", true],
			["item_black_king_bar", true],
			["item_armlet", true],
			["item_satanic", true],
			["item_medallion_of_courage", true],
			["item_solar_crest", true],
			["item_urn_of_shadows", true],
			["item_spirit_vessel", true],
			["item_rod_of_atos", true],
			["item_sheepstick", true],
			["item_veil_of_discord", true],
			["item_ethereal_blade", true],
			["item_dagon_5", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["item_shivas_guard", true],
			["item_nullifier", true],
			["item_blink", true],
		]),
	),
	AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true)
		.SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let linkenBreakerMenu = Menu.AddNode("Linken Breaker"),
	LinkenBreakerToggler = linkenBreakerMenu.AddImageSelector(
		"Items", [
			"item_abyssal_blade",
			"item_sheepstick",
			"item_ethereal_blade",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"item_nullifier",
			"item_rod_of_atos",
			"item_heavens_halberd",
			"item_force_staff",
			"item_cyclone",
		], new Map<string, boolean>([
			["item_abyssal_blade", true],
			["item_sheepstick", true],
			["item_ethereal_blade", true],
			["item_dagon_5", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["item_nullifier", true],
			["item_rod_of_atos", true],
			["item_heavens_halberd", true],
			["item_force_staff", true],
			["item_cyclone", true],

		]),
	),
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