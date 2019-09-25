import { Menu } from "wrapper/Imports"
import { DrawDestroyAll } from "./Renderer"
let MenuCombo = Menu.AddEntry(["Heroes", "Intelligence", "SkyWrath Mage"]),
	State = MenuCombo.AddToggle("Enable").OnValue(DrawDestroyAll)

let Combo = MenuCombo.AddNode("Combo"),
	Ability = Combo.AddImageSelector(
		"Abilities", [
			"skywrath_mage_arcane_bolt",
			"skywrath_mage_concussive_shot",
			"skywrath_mage_ancient_seal",
			"skywrath_mage_mystic_flare",
		], new Map<string, boolean>([
			["skywrath_mage_arcane_bolt", true],
			["skywrath_mage_concussive_shot", true],
			["skywrath_mage_ancient_seal", true],
			["skywrath_mage_mystic_flare", true],
		]),
	),
	Items = Combo.AddImageSelector(
		"Items", [
			"item_rod_of_atos",
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
			["item_rod_of_atos", true],
			["item_sheepstick", true],
			["item_ethereal_blade", true],
			["item_veil_of_discord", true],
			["item_dagon_5", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["item_shivas_guard", true],
			["item_nullifier", true],
		]),
	),
	ComboKey = Combo.AddKeybind("Combo Key"),
	NearMouse = Combo.AddSlider("Near Mouse (Range)", 800, 100, 1000),
	BlinkRadius = Combo.AddSlider("Blink distance from enemy", 400, 0, 1200),
	AutoAttackTarget = Combo.AddToggle("Auto Attack Target", true),
	//ComboTarget = Combo.AddSwitcher("Target", ["Defualt", "Lock"]),
	ComboStartWith = Combo.AddToggle("Start Combo With Mute").SetTooltip("Start Combo With Hex or Ancient Steal"),
	MinHealthToUltItem = Combo.AddSlider("Target Min Health % To Auto Combo", 0, 0, 70),
	ComboBreak = Combo.AddToggle("Cancel Important Items and Abilities").SetTooltip("If Combo Breaker is ready then it will not use Important Items and Abilities")

let BadUltNode = Combo.AddNode("Bad Ult"),
	BadUltItem = BadUltNode.AddToggle("Bad Ult"),
	BadUltMovementSpeedItem = BadUltNode.AddSlider("Bad Ult Movement Speed", 500, 240, 500)

let AutoCombo = MenuCombo.AddNode("Auto Combo"),
	AutoComboState = AutoCombo.AddToggle("Enable"),
	AutoComboDisableWhen = AutoCombo.AddToggle("Disable When Combo", true),
	AutoComboMinHPpercent = AutoCombo.AddSlider("Min HP % To Auto Combo", 0, 0, 100),
	AutoComboAbility = AutoCombo.AddImageSelector(
		"Abilities", [
			"skywrath_mage_arcane_bolt",
			"skywrath_mage_concussive_shot",
			"skywrath_mage_ancient_seal",
			"skywrath_mage_mystic_flare",
		], new Map<string, boolean>([
			["skywrath_mage_arcane_bolt", true],
			["skywrath_mage_concussive_shot", true],
			["skywrath_mage_ancient_seal", true],
			["skywrath_mage_mystic_flare", true],
		]),
	),
	AutoComboItems = AutoCombo.AddImageSelector(
		"Items", [
			"item_rod_of_atos",
			"item_sheepstick",
			"item_ethereal_blade",
			"item_veil_of_discord",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"item_shivas_guard",
			"item_nullifier",
		], new Map<string, boolean>([
			["item_rod_of_atos", true],
			["item_sheepstick", true],
			["item_ethereal_blade", true],
			["item_veil_of_discord", true],
			["item_dagon_5", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["item_shivas_guard", true],
			["item_nullifier", true],
		]),
	)

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

let AutoDisable = MenuCombo.AddNode("Auto Disable"),
	AutoDisableState = AutoDisable.AddToggle("Enable", true),
	AutoDisableAbilityItems = AutoDisable.AddImageSelector(
		"Use", [
			"item_sheepstick",
			"item_orchid",
			"item_bloodthorn",
			"skywrath_mage_ancient_seal",
		], new Map<string, boolean>([
			["item_sheepstick", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["skywrath_mage_ancient_seal", true],
		]),
	)
let LinkenBreak = MenuCombo.AddNode("Linken Break"),
	LinkenBreakAbilityItems = LinkenBreak.AddImageSelector(
		"Use",
		[
			"item_force_staff",
			"item_cyclone",
			"item_orchid",
			"item_bloodthorn",
			"item_nullifier",
			"item_rod_of_atos",
			"item_sheepstick",
			"skywrath_mage_arcane_bolt",
			"skywrath_mage_ancient_seal",
		], new Map<string, boolean>([
			["item_force_staff", true],
			["item_cyclone", true],
			["item_orchid", true],
			["item_bloodthorn", true],
			["item_nullifier", true],
			["item_rod_of_atos", true],
			["item_sheepstick", true],
			["skywrath_mage_arcane_bolt", true],
			["skywrath_mage_ancient_seal", true],
		]),
	),
	LinkenBreakOnlyFromRange = LinkenBreak.AddToggle("Use Only From Range")

let SmartArcaneBolt = MenuCombo.AddNode("Smart Arcane Bolt"),
	SmartArcaneBoltKey = SmartArcaneBolt.AddKeybind("Spam Arcane Bolt"),
	SmartArcaneAutoBolt = SmartArcaneBolt.AddNode("Auto Spam Arcane Bolt"),
	SmartArcaneAutoBoltState = SmartArcaneAutoBolt.AddToggle("Enable", true),
	SmartArcaneOwnerHP = SmartArcaneAutoBolt.AddSlider("Min HP % To Auto Bolt", 20, 0, 100)

let SmartConShot = MenuCombo.AddNode("Smart Concussive Shot"),
	SmartConShotFail = SmartConShot.AddToggle("Without Fail", true),
	SmartConShotOnlyTarget = SmartConShot.AddToggle("Without Fail Target", true),
	SmartConShotRadius = SmartConShot.AddSlider("Use in Radius", 1600, 800, 10000)

let BladeMail = MenuCombo.AddNode("Blade Mail"),
	BladeMailCancelCombo = BladeMail.AddToggle("Cancel Combo", true),
	BladeMailUseCyclone = BladeMail.AddToggle("Use Eul", true)

let Drawing = MenuCombo.AddNode("Drawing"),
	DrawingtargetMenu = Drawing.AddNode("Target"),
	DrawingtargetState = DrawingtargetMenu.AddToggle("Draw line to target"),
	DrawingtargetStateShot = DrawingtargetMenu.AddToggle("Draw Concusive Shot Indicator").OnValue(DrawDestroyAll),
	ConShotPoaitionPosShot = DrawingtargetMenu.AddSlider("Concusive Shot: Z", 310, 310, 1000),
	DrawingtextMenu = Drawing.AddNode("Text"),
	TextItem = DrawingtextMenu.AddToggle("Enable", true),
	TextSize = DrawingtextMenu.AddSlider("Size", 18, 8, 100),
	TextXItem = DrawingtextMenu.AddSlider("X", 18, 1, 100),
	TextYItem = DrawingtextMenu.AddSlider("Y", 87, 1, 100)

export {
	State,
	Items,
	Ability,
	ComboKey,
	NearMouse,
	//ComboTarget,
	ComboStartWith,
	ComboBreak,
	BadUltItem,
	TextSize,
	TextItem,
	TextXItem,
	TextYItem,
	BadUltMovementSpeedItem,
	BlinkRadius,
	MinHealthToUltItem,
	AutoComboState,
	AutoComboDisableWhen,
	AutoComboMinHPpercent,
	//AutoKillStealState,
	//AutoKillStealDisableWhen,
	//AutoKillStealAbilityItems,
	AutoDisableState,
	AutoDisableAbilityItems,
	LinkenBreakAbilityItems,
	LinkenBreakOnlyFromRange,
	SmartArcaneBoltKey,
	SmartConShotFail,
	SmartConShotOnlyTarget,
	SmartConShotRadius,
	BladeMailCancelCombo,
	BladeMailUseCyclone,
	AutoComboItems,
	DrawingtargetState,
	AutoComboAbility,
	DrawingtargetStateShot,
	SmartArcaneOwnerHP,
	SmartArcaneAutoBoltState,
	ConShotPoaitionPosShot,
	AutoAttackTarget,
}