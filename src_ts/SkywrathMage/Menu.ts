import { Menu } from "wrapper/Imports"
let MenuCombo = Menu.AddEntry(["Heroes", "SkyWrath Mage"]),
	State = MenuCombo.AddToggle("Active");
	
let Combo = MenuCombo.AddNode("Combo"),
	Ability = Combo.AddImageSelector(
		"Abilities",
		[
			"skywrath_mage_arcane_bolt",
			"skywrath_mage_concussive_shot",
			"skywrath_mage_ancient_seal",
			"skywrath_mage_mystic_flare",
		],
	),
	Items = Combo.AddImageSelector(
		"Items",
		[
			"item_rod_of_atos",
			"item_sheepstick",
			"item_ethereal_blade",
			"item_veil_of_discord",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"item_shivas_guard",
			"item_nullifier",
		],
	),
	ComboKey = Combo.AddKeybind("Combo Key"),
	ComboTarget = Combo.AddSwitcher("Target", ["Lock", "Default"]),
	ComboStartWith = Combo.AddToggle("Start Combo With Mute").SetTooltip("Start Combo With Hex or Ancient Steal"),
	ComboBreak = Combo.AddToggle("Cansel Important Items and Abilities");


	
let AutoCombo = MenuCombo.AddNode("Auto Combo"),
	AutoComboState = AutoCombo.AddToggle("Enable"),
	AutoComboDisableWhen = AutoCombo.AddToggle("Disable When Combo", true),
	AutoComboMinHPpercent = AutoCombo.AddSlider("Owner Min Health % To Auto Combo", 0, 1, 100)
	
	
let AutoKillSteal = MenuCombo.AddNode("Auto Kill Steal"),
	AutoKillStealState = AutoKillSteal.AddToggle("Enable", true),
	AutoKillStealDisableWhen = AutoKillSteal.AddToggle("Disable When Combo", true),
	AutoKillStealAbilityItems = AutoKillSteal.AddImageSelector(
		"Use",
		[
			"skywrath_mage_ancient_seal",
			"item_veil_of_discord",
			"item_ethereal_blade",
			"item_dagon_5",
			"item_shivas_guard",
			"skywrath_mage_concussive_shot",
			"skywrath_mage_arcane_bolt"
		],
	)
	
let AutoDisable = MenuCombo.AddNode("Auto Disable"),
	AutoDisableState = AutoDisable.AddToggle("Enable", true),
	AutoDisableAbilityItems = AutoDisable.AddImageSelector(
		"Use",
		[
			"item_sheepstick",
			"item_orchid",
			"item_bloodthorn",
			"skywrath_mage_ancient_seal",
		],
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
			"skywrath_mage_ancient_seal"
		],
	),
	LinkenBreakOnlyFromRange = LinkenBreak.AddToggle("Use Only From Range")

let SmartArcaneBolt = MenuCombo.AddNode("Smart Arcane Bolt"),
	SmartArcaneBoltKey = SmartArcaneBolt.AddKeybind("Spam Arcane Bolt")

let SmartConShot = MenuCombo.AddNode("Smart Concussive Shot"),
	SmartConShotFail = SmartConShot.AddToggle("Without Fail", true),
	SmartConShotOnlyTarget = SmartConShot.AddToggle("Without Fail", true),
	SmartConShotRadius = SmartConShot.AddSlider("Use in Radius", 1600, 800, 10000)
	
let BladeMail = MenuCombo.AddNode("Blade Mail"),
	BladeMailCancelCombo = BladeMail.AddToggle("Cancel Combo", true),
	BladeMailUseCyclone = BladeMail.AddToggle("Use Eul", true)

// TODO
let Drawing = MenuCombo.AddNode("Drawing");

export {
	State,
	Items,
	Ability,
	ComboKey,
	ComboTarget,
	ComboStartWith,
	ComboBreak,
	AutoComboState,
	AutoComboDisableWhen,
	AutoComboMinHPpercent,
	AutoKillStealState,
	AutoKillStealDisableWhen,
	AutoKillStealAbilityItems,
	AutoDisableState,
	AutoDisableAbilityItems,
	LinkenBreakAbilityItems,
	LinkenBreakOnlyFromRange,
	SmartArcaneBoltKey,
	SmartConShotFail,
	SmartConShotOnlyTarget,
	SmartConShotRadius,
	BladeMailCancelCombo,
	BladeMailUseCyclone
}