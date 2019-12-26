//@ts-nocheck
import { Menu as MenuSDK, Color } from "wrapper/Imports"

import InitAbility from "./Extends/Abilities"
import InitItems from "./Extends/Items"

let Items = new InitItems(),
	Abilities = new InitAbility()

const Menu = MenuSDK.AddEntry(["Heroes", "Void Spirit"])
export const State = Menu.AddToggle("Enable")

let arrayAbility: string[] = [
	Abilities.AetherRemnan.toString(),
	Abilities.Dissimilate.toString(),
	Abilities.ResonantPulse.toString(),
	Abilities.AstralStep.toString(),
]
let arrayItems: string[] = [
	Items.DiffusalBlade.toString(),
	Items.BladeMail.toString(),
	//Items.Cyclone.toString(),
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
]
const Combo = Menu.AddNode("Combo")
export const ComboKeyItem = Combo.AddKeybind("Bind Key", "D")
//export const ComboMode = Combo.AddSwitcher("Combo mode", ["Fast", "Cyclone (is tested)"])
export const NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)
const ComboHitAndRunTree = Combo.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])
export const StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
export const СomboAbility = Combo.AddImageSelector("Abilities", arrayAbility, new Map(arrayAbility.map(name => [name, true])))
export const СomboItems = Combo.AddImageSelector("Items", arrayItems, new Map(arrayItems.map(name => [name, true])))

const DrawingMenu = Menu.AddNode("Drawing")
export const RadiusTree = DrawingMenu.AddNode("Radius")
export const Radius = RadiusTree.AddImageSelector("Select", [
	Abilities.AetherRemnan.toString(),
	Abilities.Dissimilate.toString(),
	Abilities.ResonantPulse.toString(),
	Abilities.AstralStep.toString(),
	Items.Blink.toString()
])
export const AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range")
export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", new Color(255, 255, 0))

export const AetherRemnanRadiusColor = RadiusTree.AddColorPicker("Aether Remnan", Color.White)
export const DissimilateRadiusColor = RadiusTree.AddColorPicker("Dissimilate", Color.White)
export const ResonantPulseRadiusColor = RadiusTree.AddColorPicker("Resonant Pulse", Color.White)
export const AstralStepArmyRadiusColor = RadiusTree.AddColorPicker("Astral Step", Color.White)

export const BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", new Color(255, 255, 255))
export const DrawTargetItem = DrawingMenu.AddToggle("Draw Target", true)
