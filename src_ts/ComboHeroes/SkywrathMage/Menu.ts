//@ts-nocheck
import { Menu, Color } from "wrapper/Imports"
const MenuCombo = Menu.AddEntry(["Heroes", "SkyWrath Mage"])
export const State = MenuCombo.AddToggle("Enable")

const Combo = MenuCombo.AddNode("Combo")

let ability_array: string[] = [
	"skywrath_mage_arcane_bolt",
	"skywrath_mage_concussive_shot",
	"skywrath_mage_ancient_seal",
	"skywrath_mage_mystic_flare",
]

export const AbilityMenu = Combo.AddImageSelector(
	"Abilities", ability_array, new Map(ability_array.map(name => [name, true])))

let items_array: string[] = [
	"item_rod_of_atos",
	"item_clumsy_net",
	"item_sheepstick",
	"item_ethereal_blade",
	"item_veil_of_discord",
	"item_dagon_5",
	"item_orchid",
	"item_bloodthorn",
	"item_shivas_guard",
	"item_nullifier",
	"item_blink",
]

export const Items = Combo.AddImageSelector("Items", items_array,
	new Map(items_array.map(name => [name, name !== "item_blink"])))

export const ComboKey = Combo.AddKeybind("Combo Key")
export const StyleCombo = Combo.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])

const ComboHitAndRunTree = Combo.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])

export const NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000)
export const BlinkRadius = Combo.AddSlider("Blink distance from enemy", 400, 0, 1200)
export const DoubleUltimateState = Combo.AddToggle("Double ultimate scepter", true)
export const ConcussiveShotAwait = Combo.AddToggle("Await Concussive shot for MysticFlare", true)
export const ComboStartWith = Combo.AddToggle("Start Combo With Mute")
	.SetTooltip("Start Combo With Hex or Ancient Steal")
export const MinHealthToUltItem = Combo.AddSlider("Target Min Health % To Auto Combo", 0, 0, 70)
export const ComboBreak = Combo.AddToggle("Cancel Important Items and Abilities")
	.SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities")

export const BadUltNode = Combo.AddNode("Bad Ult")
export const BadUltItem = BadUltNode.AddToggle("Bad Ult")
export const BadUltMovementSpeedItem = BadUltNode.AddSlider("Bad Ult Movement Speed", 500, 240, 500)

const AutoCombo = MenuCombo.AddNode("Auto Combo")
export const AutoComboState = AutoCombo.AddToggle("Enable")
export const HitAndRunAutoCombo = AutoCombo.AddToggle("HitAndRun")
export const AutoComboDisableWhen = AutoCombo.AddToggle("Disable When Combo", true)
export const AutoComboMinHPpercent = AutoCombo.AddSlider("Min HP % To Auto Combo", 0, 0, 100)

let ability_acombo_array: string[] = [
	"skywrath_mage_arcane_bolt",
	"skywrath_mage_concussive_shot",
	"skywrath_mage_ancient_seal",
	"skywrath_mage_mystic_flare",
]

export const AutoComboAbility = AutoCombo.AddImageSelector("Abilities", ability_acombo_array,
	new Map(ability_acombo_array.map(name => [name, true])))

let items_acombo_array: string[] = [
	"item_rod_of_atos",
	"item_clumsy_net",
	"item_sheepstick",
	"item_ethereal_blade",
	"item_veil_of_discord",
	"item_dagon_5",
	"item_orchid",
	"item_bloodthorn",
	"item_shivas_guard",
	"item_nullifier",
]

export const AutoComboItems = AutoCombo.AddImageSelector("Items", items_acombo_array,
	new Map(items_acombo_array.map(name => [name, true])))

// TODO
// let AutoKillSteal = MenuCombo.AddNode("Auto Kill Steal"),
// 	AutoKillStealState = AutoKillSteal.AddToggle("Enable", true),
// 	AutoKillStealDisableWhen = AutoKillSteal.AddToggle("Disable When Combo"),
// 	AutoKillStealAbilityItems = AutoKillSteal.AddImageSelector(
// 		"Use", [
// 			"skywrath_mage_ancient_seal",
// 			"item_veil_of_discord",
// 			"item_ethereal_blade",
// 			"item_dagon_5",
// 			"item_shivas_guard",
// 			"skywrath_mage_concussive_shot",
// 			"skywrath_mage_arcane_bolt"
// 		], new Map<string, boolean>([
// 			["skywrath_mage_ancient_seal", true],
// 			["item_veil_of_discord", true],
// 			["item_ethereal_blade", true],
// 			["item_dagon_5", true],
// 			["item_shivas_guard", true],
// 			["skywrath_mage_concussive_shot", true],
// 			["skywrath_mage_arcane_bolt", true],
// 		])
// 	)

const AutoDisable = MenuCombo.AddNode("Auto Disable")
export const AutoDisableState = AutoDisable.AddToggle("Enable", true)

let array_auto_disable: string[] = [
	"item_sheepstick",
	"item_orchid",
	"item_bloodthorn",
	"skywrath_mage_ancient_seal",
]

export const AutoDisableAbilityItems = AutoDisable.AddImageSelector("Use", array_auto_disable, new Map(array_auto_disable.map(name => [name, true])))
const LinkenBreak = MenuCombo.AddNode("Linken Break")

let array_linken: string[] = [
	"item_force_staff",
	"item_cyclone",
	"item_orchid",
	"item_bloodthorn",
	"item_nullifier",
	"item_rod_of_atos",
	"item_sheepstick",
	"skywrath_mage_arcane_bolt",
	"skywrath_mage_ancient_seal",
]

export const LinkenBreakAbilityItems = LinkenBreak.AddImageSelector("Use", array_linken, new Map(array_linken.map(name => [name, true])))
export const LinkenBreakOnlyFromRange = LinkenBreak.AddToggle("Use Only From Range")
const SmartArcaneBolt = MenuCombo.AddNode("Smart Arcane Bolt")
export const SmartArcaneBoltKey = SmartArcaneBolt.AddKeybind("Spam Arcane Bolt")
const SmartArcaneAutoBolt = SmartArcaneBolt.AddNode("Auto Spam Arcane Bolt")
export const SmartArcaneAutoBoltState = SmartArcaneAutoBolt.AddToggle("Enable", true)
export const SmartArcaneOwnerHP = SmartArcaneAutoBolt.AddSlider("Min HP % To Auto Bolt", 20, 0, 100)

const SmartConShot = MenuCombo.AddNode("Smart Concussive Shot")
export const SmartConShotFail = SmartConShot.AddToggle("Without Fail", true)
export const SmartConShotOnlyTarget = SmartConShot.AddToggle("Without Fail Target", true)
export const SmartConShotRadius = SmartConShot.AddSlider("Use in Radius", 1600, 800, 10000)

const BladeMail = MenuCombo.AddNode("Blade Mail")
export const BladeMailCancelCombo = BladeMail.AddToggle("Cancel Combo", true)
export const BladeMailUseCyclone = BladeMail.AddToggle("Use Eul", true)

let array_radius: string[] = [
	"skywrath_mage_arcane_bolt",
	"skywrath_mage_concussive_shot",
	"skywrath_mage_ancient_seal",
	"skywrath_mage_mystic_flare",
	"item_blink",
]

const Drawing = MenuCombo.AddNode("Drawing")
const RadiusTree = Drawing.AddNode("Radius")
export const Radius = RadiusTree.AddImageSelector("Select", array_radius)
const AttackRangeRadiusTree = RadiusTree.AddNode("Attack Range")
export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", Color.Yellow)
export const BlinkRadiusItemColor = RadiusTree.AddColorPicker("Blink", Color.White)
export const ArcaneBoltRadiusColor = RadiusTree.AddColorPicker("Arcane Bolt", Color.White)
export const ConcussiveShotRadiusColor = RadiusTree.AddColorPicker("Concussive Shot", Color.White)
export const AncientSealRadiusColor = RadiusTree.AddColorPicker("Ancient Seal", Color.White)
export const MysticFlareRadiusColor = RadiusTree.AddColorPicker("Mystic Flare", Color.White)
const DrawingtargetMenu = Drawing.AddNode("Target")
export const DrawingtargetState = DrawingtargetMenu.AddToggle("Draw line to target")
export const DrawingtargetStateShot = DrawingtargetMenu.AddToggle("Draw Concusive Shot Indicator")
export const ConShotPoaitionPosShot = DrawingtargetMenu.AddSlider("Concusive Shot: Z", 310, 310, 1000)
export const DrawingtextMenu = Drawing.AddNode("Text")
export const TextItem = DrawingtextMenu.AddToggle("Enable", true)
export const TextSize = DrawingtextMenu.AddSlider("Size", 18, 8, 100)
export const TextXItem = DrawingtextMenu.AddSlider("X", 18, 1, 100)
export const TextYItem = DrawingtextMenu.AddSlider("Y", 87, 1, 100)
