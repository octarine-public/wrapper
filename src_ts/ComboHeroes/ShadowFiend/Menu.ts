import { Menu as MenuSDK, Color } from "wrapper/Imports"

import InitItems from "./Extends/Items"
import InitAbility from "./Extends/Abilities"
import { parseKVFile } from "../../wrapper/Utils/Utils"
let parseSpells = parseKVFile("scripts/npc/npc_abilities.txt");

let Items = new InitItems()
let Abilities = new InitAbility()

let Menu = MenuSDK.AddEntry(["Heroes", "Shadow Fiend"])
export const State = Menu.AddToggle("Enable")

export let array_ability: string[] = [
	Abilities.Shadowraze1.toString(),
	Abilities.Shadowraze2.toString(),
	Abilities.Shadowraze3.toString(),
	Abilities.Requiem.toString(),
]
export let array_ability_harras: string[] = [
	array_ability[0],
	array_ability[1],
	array_ability[2],
]
export let array_items: string[] = [
	Items.Cyclone.toString(),
	Items.Sheeps.toString(),
	Items.Blink.toString(),
	Items.Orchid.toString(),
	Items.Discord.toString(),
	Items.Ethereal.toString(),
	Items.Dagon.toString(),
	Items.Shivas.toString(),
	Items.BlackKingBar.toString(),
	Items.Bloodthorn.toString(),
]

export let array_radius: string[] = [
	Abilities.Shadowraze1.toString(),
	Abilities.Shadowraze2.toString(),
	Abilities.Shadowraze3.toString(),
	Items.Blink.toString(),
	Items.Cyclone.toString(),
]

export let arrayBreakLinkItems = [
	Items.HurricanePike.toString(),
	Items.ForceStaff.toString(),
	Items.DiffusalBlade.toString(),
	Items.HeavensHalberd.toString(),
	Items.Orchid.toString(),
	Items.Bloodthorn.toString(),
	Items.Nullifier.toString(),
	Items.Sheeps.toString(),
	Items.Cyclone.toString(),
];

// const ComboMenu = Menu.AddNode("Combo")
// export const ComboKeyItem = ComboMenu.AddKeybind("Key bind")
// export const StyleCombo = ComboMenu.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
// export const СomboItems = ComboMenu.AddImageSelector("Items", array_items, new Map(array_items.map(name => [name, true])))
// export const СomboAbility = ComboMenu.AddImageSelector("Ability", array_ability, new Map(array_ability.map(name => [name, true])))

const HarrasMenu = Menu.AddNode("Harras")
export const HarrasKeyItem = HarrasMenu.AddKeybind("Key bind")
export const StyleHarras = HarrasMenu.AddSwitcher("Key Styles", ["Hold key", "Turn on / Turn off"])
export const HarrasAbility = HarrasMenu.AddImageSelector("Ability", array_ability_harras, new Map(array_ability_harras.map(name => [name, true])))

const SettingTarget = Menu.AddNode("Settings")
const ComboHitAndRunTree = SettingTarget.AddNode("HitAndRun")
export const ComboHitAndRunAttack = ComboHitAndRunTree.AddToggle("Auto attack", true)
export const TypeHitAndRun = ComboHitAndRunTree.AddSwitcher("Type Run", ["Run to target", "Run to cursor", "None"])

export const Menu_Settings_FindTargetRadius = SettingTarget.AddSlider("Near Mouse (Range)", 800, 100, 1000)
export const Menu_Combo_BlinkDistance = SettingTarget.AddSlider("Blink Distance From Enemy", 300, 100, 1200)
export const BladeMailCancel = SettingTarget.AddToggle("Cancel Combo in blade mail")
export const WithoutFailsState = SettingTarget.AddToggle("Without fails shadow raze", true)
export const Menu_Combo_LinkenBreaker_Items = SettingTarget.AddImageSelector("Linken Break", arrayBreakLinkItems, new Map(arrayBreakLinkItems.map(name => [name, true])))

const Drawing = Menu.AddNode("Drawing")
export const DrawingStatus = Drawing.AddToggle("Draw Target", true)
export const Radius = Drawing.AddImageSelector("Select", array_radius)
const AttackRangeRadiusTree = Drawing.AddNode("Attack Range")
export const AttackRangeRadius = AttackRangeRadiusTree.AddToggle("Enable")
export const RadiusColorAttackRange = AttackRangeRadiusTree.AddColorPicker("Color", Color.Yellow)
export const BlinkRadiusItemColor = Drawing.AddColorPicker("Blink", Color.White)
export const CycloneRadiusItemColor = Drawing.AddColorPicker("Cyclone", Color.White)

const ShadowRaze1RadiusCustom = Drawing.AddNode("Shadow Raze")

// loop-optimizer: KEEP
let abils = Object.keys(parseSpells.DOTAAbilities).filter(abil => abil.includes("nevermore_shadowraze"));
const razeRadius = [];
// loop-optimizer: KEEP
abils.forEach(abil => {
	const abilValues = parseSpells.DOTAAbilities[abil];
	const abilSpec = abilValues.AbilitySpecial;
	if (abilSpec === undefined)
		return;
	for (var count in abilSpec) {
		if (count === "values")
			continue;
		const abilSpecVal = abilSpec[count].values;
		if (abilSpecVal.shadowraze_radius !== undefined)
			razeRadius.push(parseFloat(abilSpecVal.shadowraze_radius));
	}
})

export const ShadowRaze1Radius = ShadowRaze1RadiusCustom.AddSlider("Radius Raze 1", razeRadius[0], 10, razeRadius[0])
export const ShadowRaze2Radius = ShadowRaze1RadiusCustom.AddSlider("Radius Raze 2", razeRadius[1], 10, razeRadius[1])
export const ShadowRaze3Radius = ShadowRaze1RadiusCustom.AddSlider("Radius Raze 3", razeRadius[2], 10, razeRadius[2])

export const ShadowRaze1RadiusColor = ShadowRaze1RadiusCustom.AddColorPicker("Color Raze 1", Color.White)
export const ShadowRaze2RadiusColor = ShadowRaze1RadiusCustom.AddColorPicker("Color Raze 2", Color.White)
export const ShadowRaze3RadiusColor = ShadowRaze1RadiusCustom.AddColorPicker("Color Raze 3", Color.White)