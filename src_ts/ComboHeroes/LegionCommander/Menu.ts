//@ts-nocheck
import { Color, Menu as MenuSDK } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

const Menu = MenuSDK.AddEntry(["Heroes", "Legion Commander"])
export const State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.Overwhelming.toString(),
	Abilities.PressTheAttack.toString(),
	Abilities.Duel.toString(),
], activeAbility = new Map<string, boolean>()

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
]
const ComboMenu = Menu.AddNode("Combo")
export const ComboKeyItem = ComboMenu.AddKeybind("Combo Key", "D")
export const StyleCombo = ComboMenu.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
export const ComboMode = ComboMenu.AddSwitcher("Use combo with (Priority)", ["Invisible Sword", "Dagger"], 1)
export const ComboModeInvis = ComboMenu.AddToggle("Use Press of Attak before invisibility", true)
export const СomboAbility = ComboMenu.AddImageSelector("Abilities", arrayAbility, activeAbility)
export const СomboItems = ComboMenu.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true])))
const Settings = Menu.AddNode("Settings")
const ComboHitAndRunTree = Settings.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])
export const isRunToTarget = Settings.AddToggle("Run to mouse position (target has blade mail, etc)")
export const AeonDiscItem = Settings.AddToggle("Cancel Important Items and Abilities", true)
	.SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities")
export const NearMouse = Settings.AddSlider("Near Mouse (Range)", 800, 100, 1000)
const bladeMailMenu = Menu.AddNode("Blade Mail")
export const BladeMailItem = bladeMailMenu.AddToggle("Cancel Combo", false)
	.SetTooltip("Cancel Combo if there is enemy Blade Mail")
const arrayLinkenBreak: string[] = [
	arrayItems[9],
	arrayItems[12],
	arrayItems[13],
	arrayItems[15],
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.HurricanePike.toString(),
	Items.Cyclone.toString(),
]
export const LinkenBreakerToggler = Settings.AddImageSelector("Linken break", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true])))
// Drawing
const DrawingMenu = Menu.AddNode("Drawing")
export const DrawTargetItem = DrawingMenu.AddToggle("Draw Target", true)
const radiusMenu = DrawingMenu.AddNode("Radius")
export const Radius = radiusMenu.AddImageSelector("Select", [
	arrayAbility[0],
	arrayAbility[1],
	arrayAbility[2],
	arrayItems[11]
])
const AttackRangeRadiusTree = radiusMenu.AddNode("Attack Range")
export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", Color.White)
export const OverwhelmingOddsRadiusColor = radiusMenu.AddColorPicker("Overwhelming Odds", Color.White)
export const PressTheAttackRadiusItemColor = radiusMenu.AddColorPicker("Press The Attack", Color.White)
export const DuelRadiusItemColor = radiusMenu.AddColorPicker("Duel", Color.White)
export const BlinkRadiusItemColor = radiusMenu.AddColorPicker("Blink", Color.White)
