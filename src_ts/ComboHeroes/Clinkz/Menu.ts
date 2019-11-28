import { Menu as MenuSDK, Color } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

const Menu = MenuSDK.AddEntry(["Heroes", "Clinkz"])
export const State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.SearingArrows.toString(),
	Abilities.BurningArmy.toString(),
]
let arrayItems: string[] = [
	Items.DiffusalBlade.toString(),
	Items.BladeMail.toString(),
	Items.LotusOrb.toString(),
	Items.BlackKingBar.toString(),
	Items.Mjollnir.toString(),
	Items.Satanic.toString(),
	Items.Medallion.toString(),
	Items.SolarCrest.toString(),
	Items.UrnOfShadows.toString(),
	Items.RodofAtos.toString(),
	Items.SpiritVesel.toString(),
	Items.Sheeps.toString(),
	Items.Orchid.toString(),
	Items.Bloodthorn.toString(),
	Items.Shivas.toString(),
	Items.Nullifier.toString(),
	Items.Armlet.toString(),
	Items.Blink.toString(),
]

const array_AutoDeathPact: string[] = [
	Items.Soulring.toString(),
	Abilities.DeathPact.toString()
]
const AutoDeathPact = Menu.AddNode("Auto Death Pact")
export const AutoDeathPactState = AutoDeathPact.AddToggle("Enable", true)
export const AutoDeathPactCreepHP = AutoDeathPact.AddSlider("HP min for use (%)", 100, 1, 100)
export const AutoDeathPactAbility = AutoDeathPact.AddImageSelector("Select", array_AutoDeathPact, new Map(array_AutoDeathPact.map(name => [name, true])))

const Combo = Menu.AddNode("Combo")
export const ComboKeyItem = Combo.AddKeybind("Bind Key", "D")
const ComboHitAndRunTree = Combo.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])
export const StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
export const СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, new Map(arrayAbility.map(name => [name, true])))
export const СomboItems = Combo.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true])))
export const AeonDiscItem = Combo.AddToggle("Cancel Important Items and Abilities", true).SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities")

const Harras = Menu.AddNode("Harass arrow")
const HarrasHitAndRunTree = Harras.AddNode("HitAndRun")
export const HarrasHitAndRunAttack = HarrasHitAndRunTree.AddToggle("Auto orb arrow", true)
export const HarrasTypeHitAndRun = HarrasHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])
export const HarrasKey = Harras.AddKeybind("Bind key")
export const StyleHarras = Harras.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])


const arrayLinkenBreak: string[] = [
	Items.DiffusalBlade.toString(),
	Items.RodofAtos.toString(),
	Items.Sheeps.toString(),
	Items.Orchid.toString(),
	Items.Nullifier.toString(),
	Items.Bloodthorn.toString(),
	Items.HeavensHalberd.toString(),
	Items.ForceStaff.toString(),
	Items.Cyclone.toString(),
	Items.HurricanePike.toString(),
]

const SettingTarget = Menu.AddNode("Settings")
export const NearMouse = SettingTarget.AddSlider("Near Mouse (Range)", 800, 100, 1000)
export const BlinkRadius = SettingTarget.AddSlider("Blink distance from enemy", 400, 0, 1200)
export const LinkenBreakerToggler = SettingTarget.AddImageSelector("Linken break", arrayLinkenBreak, new Map(arrayLinkenBreak.map(name => [name, true])))
export const BladeMailItem = SettingTarget.AddToggle("Cancel Combo/Harras if there is enemy Blade Mail", false)

const DrawingMenu = Menu.AddNode("Drawing")
export const RadiusTree = DrawingMenu.AddNode("Radius")
export const Radius = RadiusTree.AddImageSelector("Select", [
	Abilities.BurningArmy.toString(),
	Items.Blink.toString()
])
export const AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range")
export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", new Color(255, 255, 0))
export const BurningArmyRadiusColor = RadiusTree.AddColorPicker("Burning Army", new Color(255, 255, 255))
export const BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", new Color(255, 255, 255))
export const DrawTargetItem = DrawingMenu.AddToggle("Draw Target", true)