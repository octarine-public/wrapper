import { execute_ability } from "../Data"
import { UnitsOrbWalker, AbilityHelper, XIAOlinkenItems, XAIOPrediction, XAIOSkillshotType, XAIOCollisionTypes } from "XAIO/Core/bootstrap"
import { Unit, GameSleeper, Ability, Item, void_spirit_dissimilate, item_aeon_disk, EventsSDK, item_cyclone, void_spirit_aether_remnant, Menu, } from "wrapper/Imports"
import { AbilityMenu, ItemsMenu, XAIOStyleCombo, XAIOOrbWalkerSwitchState, XAIOOrbWalkerState, XAIOComboKey, LinkenBreakAbilityItems, XAIOSettingsBladMailState } from "../Menu"

let Sleep = new GameSleeper()
let Helper = new AbilityHelper()
let InitPrediction = new XAIOPrediction()

export let ComboActived: boolean = false
XAIOComboKey.OnRelease(() => ComboActived = !ComboActived)

let ModifiersBlade = ["modifier_item_ethereal_blade_slow", "modifier_item_ethereal_blade_ethereal"]

function IsValidCycloneCombo(abil: Ability, enemy: Unit, selector: Menu.ImageSelector) {
	return abil !== undefined
		&& enemy !== undefined
		&& abil.CanHit(enemy)
		&& abil.CanBeCasted()
		&& selector.IsEnabled(abil.Name)
}

function Combo(
	Owner: Unit,
	target: Unit,
	class_name: (typeof Ability),
	Helper: AbilityHelper
) {

	if (Owner.IsIllusion)
		return false

	let abil = Owner.GetAbilityByClass(class_name) ?? Owner.GetItemByClass(class_name as Constructor<Item>)

	if (abil === undefined || !abil.CanBeCasted())
		return false

	if (!AbilityMenu.IsEnabled(abil.Name) && !ItemsMenu.IsEnabled(abil.Name.includes("item_dagon") ? "item_dagon_5" : abil.Name))
		return false

	let etherealbuff = target.ModifiersBook.GetAnyBuffByNames(ModifiersBlade)

	if (!abil.CanHit(target))
		return false

	if (abil.Name === "void_spirit_astral_step" && !Owner.IsRooted && !target.IsInvulnerable)
		if (Helper.UseAbility(abil, false, false,
			InitPrediction.GetPrediction(abil, Owner, target, true, XAIOSkillshotType.None, XAIOCollisionTypes.None).CastPosition))
			return true

	if (abil.Name === "void_spirit_aether_remnant" && !Sleep.Sleeping(abil))
		if (!target.IsMagicImmune && Helper.UseAbility(abil, false, false, target, true))
			return true

	if (Sleep.Sleeping("cycloneCombo") || target.IsInvulnerable)
		return false
	if (abil.Name === "void_spirit_dissimilate" && Owner.IsInRange(target, abil.AOERadius / 2) && !Owner.IsRooted) {
		if (!target.IsMagicImmune && Helper.UseAbility(abil))
			return true
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) && !target.IsMagicImmune) {
		if (abil.Name === "void_spirit_dissimilate" && Owner.IsRooted)
			return false
		if (abil.Name !== "void_spirit_dissimilate" && Helper.UseAbility(abil))
			return
	}

	if (abil.Name !== "void_spirit_aether_remnant" && abil.Name !== "void_spirit_astral_step"
		&& !target.IsMagicImmune
		&& abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)
		&& !Sleep.Sleeping(abil)
		&& !Owner.IsRooted
		&& Helper.UseAbility(abil, false, false, target.Position))
		return true

	if (abil.Name === "item_ethereal_blade" && !target.IsMagicImmune) {
		if (etherealbuff?.IsValid && etherealbuff.RemainingTime >= 0.8)
			return false
		if (Helper.UseAbility(abil, false, false, target)) {
			Sleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_ethereal", true)
			return true
		}
	}

	if (abil.Name.includes("item_dagon") && !target.IsMagicImmune) {
		if (!Sleep.Sleeping("await_ethereal"))
			if (Helper.UseAbility(abil, false, false, target))
				return true
	}


	if (abil.Name === "item_nullifier" && !target.IsMagicImmune) {
		let AeonDisk = target.GetItemByClass(item_aeon_disk)
		if (AeonDisk === undefined) {
			if (Helper.UseAbility(abil, false, false, target))
				return true
		} else if (AeonDisk !== undefined && target.HPPercent <= 70) {
			if (Helper.UseAbility(abil, false, false, target))
				return true
		}
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) && !target.IsMagicImmune) {
		if (abil.Name === "item_nullifier" || abil.Name === "item_ethereal_blade" || abil.Name.includes("item_dagon"))
			return false

		if (abil.Name === "item_lotus_orb" && target.IsInRange(Owner, 800))
			if (Helper.UseAbility(abil, false))
				return true

		if (Helper.UseAbility(abil, false, false, target))
			return true
	}
}

export function XAIOvoidSpiritCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined)
		return

	if (XAIOSettingsBladMailState.value && enemy.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	if ((XAIOStyleCombo.selected_id === 1 && !ComboActived) || (XAIOStyleCombo.selected_id === 0 && !XAIOComboKey.is_pressed))
		return

	if (Helper.IsBlockingAbilities(unit, enemy, XIAOlinkenItems, LinkenBreakAbilityItems))
		return

	let cyclone = unit.GetItemByClass(item_cyclone),
		remenat = unit.GetAbilityByClass(void_spirit_aether_remnant)


	if (!Sleep.Sleeping("cycloneCombo")
		&& IsValidCycloneCombo(cyclone!, enemy, ItemsMenu)
		&& IsValidCycloneCombo(remenat!, enemy, AbilityMenu)
		&& Helper.UseAbility(cyclone!, false, false, enemy)
		&& Helper.UseAbility(remenat!, false, false, enemy, true)) {
		Sleep.Sleep(600, "cycloneCombo")
		return
	}

	if (execute_ability.some(class_name => Combo(unit, enemy, class_name, Helper)))
		return

	let dissimilate = unit.GetAbilityByClass(void_spirit_dissimilate)
	if (dissimilate && unit.HasBuffByName("modifier_void_spirit_dissimilate_phase") && !Sleep.Sleeping(enemy)) {
		unit.MoveTo(InitPrediction.GetPrediction(dissimilate, unit, enemy, true, XAIOSkillshotType.None, XAIOCollisionTypes.None).CastPosition)
		Sleep.Sleep(Helper.OrderCastDelay, enemy)
		return
	}

	if (!XAIOOrbWalkerState.value || unit.IsInvulnerable)
		return

	let orbWalker = UnitsOrbWalker.get(unit)

	if (orbWalker === undefined)
		return

	if (!orbWalker.Execute(enemy, XAIOOrbWalkerSwitchState.selected_id))
		return

	unit.AttackTarget(enemy)
}

EventsSDK.on("GameEnded", () => {
	Sleep.FullReset()
	ComboActived = false
})