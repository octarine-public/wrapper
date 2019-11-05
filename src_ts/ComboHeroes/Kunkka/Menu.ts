import { Menu as MenuSDK, Color } from "wrapper/Imports"

import InitItems from "./Extends/Items"
import InitAbility from "./Extends/Abilities"

let Items = new InitItems(undefined),
	Abilities = new InitAbility(undefined)

let Menu = MenuSDK.AddEntry(["Heroes", "Kunkka (Beta)"]),
	State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Torrent.toString(),
	Abilities.MarksSpot.toString(),
	Abilities.Ghostship.toString()
],
activeAbility: Map <string, boolean> = new Map<string, boolean>([
	[arrayAbility[0], true],
	[arrayAbility[1], true],
	[arrayAbility[2], true]
])

let arrayItems: string[] = [
	Items.Shivas.toString(),
	Items.Refresher.toString(),
	Items.RefresherShard.toString(),
	Items.Sheeps.toString(),
	Items.Blink.toString(),
], activeItems: Map <string, boolean> = new Map<string, boolean>([
	[arrayItems[0], true], 
	[arrayItems[1], true],
	[arrayItems[2], true],
	[arrayItems[3], true],
	[arrayItems[4], true],
])

let Combo = Menu.AddNode("Combo"),
	AutoComboMenu = Combo.AddToggle("Auto Combo"),
	ComboKeyItem = Combo.AddKeybind("Combo Key"),
	//HarassModeCombo = Combo.AddSwitcher("Orb Walker", ["Off", "Move to cursor", "Move to target"]),
	СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, activeAbility),
	СomboItems = Combo.AddImageSelector("Items", arrayItems, activeItems),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	BlinkRadius = Combo.AddSlider("Blink distance from enemy", 400, 0, 1200)
	

let TorrentTree = Menu.AddNode("Torrent"),
	AutoStakerTree = TorrentTree.AddNode("Auto Staker"),
	AutoStakerState = AutoStakerTree.AddToggle("Enable", true),
	AutoStakerVisuals = AutoStakerTree.AddToggle("Draw visuals over stackable spots", false),
	ComboKeyTorrent = TorrentTree.AddKeybind("X Marks + Torrent (Key)")

let bladeMailMenu = Menu.AddNode("Blade Mail"),
	BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false).SetTooltip("Cancel Combo if there is enemy Blade Mail")

let ArrayAbilityRadius: string[] = [
	Abilities.Torrent.toString(),
	Abilities.Tidebringer.toString(),
	Abilities.MarksSpot.toString(),
	Abilities.Ghostship.toString()
],
ArrayItemsRadius: string[] = [
	Items.Blink.toString()
]
let DrawRadiusMenu = Menu.AddNode("Drawing"),
	DrawRadiusMouseTree = DrawRadiusMenu.AddNode("Draw Status Mouse"),
	DrawRadiusMouse = DrawRadiusMouseTree.AddToggle("Draw status mouse"),
	DrawRadiusMouseColor = DrawRadiusMouseTree.AddColorPicker("Color", new Color(255, 255, 0, 255)),
	
	DrawingAbility = DrawRadiusMenu.AddImageSelector("Ability range", ArrayAbilityRadius),
	DrawingItems = DrawRadiusMenu.AddImageSelector("Items range", ArrayItemsRadius),
	DrawingTreeColor = DrawRadiusMenu.AddNode("Color Range"),
	DrawingColorAbilityTorrent = DrawingTreeColor.AddColorPicker("Torrent", new Color(255,255,255)),
	DrawingColorAbilityBringer = DrawingTreeColor.AddColorPicker("Tidebringer", new Color(255,255,255)),
	DrawingColorAbilityXMarks = DrawingTreeColor.AddColorPicker("X-Marks", new Color(255, 255, 255)),
	DrawingColorAbilityGhostship = DrawingTreeColor.AddColorPicker("Ghostship", new Color(255, 255, 255))

	
export {
	DrawingItems,
	DrawingAbility,
	DrawRadiusMouse,
	DrawRadiusMouseColor,
	
	DrawingColorAbilityTorrent,
	DrawingColorAbilityBringer,
	DrawingColorAbilityXMarks,
	DrawingColorAbilityGhostship
}
export {
	State,
	NearMouse,
	ComboKeyItem,
	ComboKeyTorrent,
	СomboAbility,
	//HarassModeCombo,
	BlinkRadius,
	BladeMailItem,
	СomboItems,
	AutoComboMenu,
	AutoStakerState,
	AutoStakerVisuals
}
