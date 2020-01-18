import { execute_ability } from "../Data"
import { Unit, GameSleeper, Ability, Item, Input, void_spirit_dissimilate, item_aeon_disk } from "wrapper/Imports"
import { UnitsOrbWalker, AbilityHelper, XIAOlinkenItems, XAIOPrediction, XAIOSkillshotType, XAIOCollisionTypes } from "../../../Core/bootstrap"
import { AbilityMenu, ItemsMenu, XAIOStyleCombo, XAIOOrbWalkerSwitchState, XAIOOrbWalkerState, XAIOComboKey, LinkenBreakAbilityItems } from "../Menu"

let Sleep = new GameSleeper()
let Helper = new AbilityHelper()
let InitPrediction = new XAIOPrediction()

export let ComboActived: boolean = false
XAIOComboKey.OnRelease(() => ComboActived = !ComboActived)


function Combo(
	Owner: Unit,
	target: Unit,
	class_name: (typeof Ability),
	Helper: AbilityHelper
) {
	if (Owner.IsIllusion)
		return

	let abil = Owner.GetAbilityByClass(class_name) ?? Owner.GetItemByClass(class_name as Constructor<Item>)

	if (abil === undefined || !abil.CanBeCasted())
		return false

	if (Owner.IsInvulnerable || Owner.IsSilenced)
		return false

	if (!AbilityMenu.IsEnabled(abil.Name) && !ItemsMenu.IsEnabled(abil.Name.includes("item_dagon") ? "item_dagon_5" : abil.Name))
		return false

	let etherealbuff = target.ModifiersBook.GetAnyBuffByNames(["modifier_item_ethereal_blade_slow", "modifier_item_ethereal_blade_ethereal"])

	if (abil.Name === "void_spirit_aether_remnant"
		&& !Sleep.Sleeping(abil)
		&& abil.CanHit(target)
	) {
		let Speed = target.IdealSpeed < 400 ? 500 : 700
		Owner.CastVectorTargetPosition(abil,
			target.Position.Extend(target.InFront(1000), target.IsMoving ? Speed : 300),
			target.Position.Extend(target.InFront(-1000), 1000 + (target.IsMoving ? Speed : 300)))
		Sleep.Sleep(Helper.OrderCastDelay, abil)
		return true
	}

	if (!abil.CanHit(target))
		return false

	if (abil.Name === "void_spirit_astral_step" && !Owner.IsRooted) {
		if (Helper.UseAbility(abil, false, false,
			InitPrediction.GetPrediction(abil, Owner, target, true, XAIOSkillshotType.None, XAIOCollisionTypes.None).CastPosition))
			return true
	}

	if (abil.Name === "void_spirit_dissimilate" && Owner.IsInRange(target, abil.AOERadius / 2) && !Owner.IsRooted) {
		if (Helper.UseAbility(abil))
			return true
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (abil.Name === "void_spirit_dissimilate" && Owner.IsRooted)
			return false
		if (abil.Name !== "void_spirit_dissimilate" && Helper.UseAbility(abil))
			return
	}

	if (abil.Name !== "void_spirit_aether_remnant" && abil.Name === "void_spirit_astral_step"
		&& abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)
		&& !Sleep.Sleeping(abil)
		&& !Owner.IsRooted
	) {
		Owner.CastPosition(abil, target.Position)
		Sleep.Sleep(Helper.OrderCastDelay, abil)
		return true
	}

	if (abil.Name === "item_ethereal_blade") {
		if (etherealbuff?.IsValid && etherealbuff.RemainingTime >= 0.8)
			return false
		if (Helper.UseAbility(abil, false, false, target)) {
			Sleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_ethereal", true)
			return true
		}
	}

	if (abil.Name.includes("item_dagon")) {
		if (!Sleep.Sleeping("await_ethereal"))
			if (Helper.UseAbility(abil, false, false, target))
				return true
	}


	if (abil.Name === "item_nullifier") {
		let AeonDisk = target.GetItemByClass(item_aeon_disk)
		if (AeonDisk === undefined) {
			if (Helper.UseAbility(abil, false, false, target))
				return true
		} else if (AeonDisk !== undefined && target.HPPercent <= 70) {
			if (Helper.UseAbility(abil, false, false, target))
				return true
		}
	}

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
		if (abil.Name === "item_lotus_orb" && target.IsInRange(Owner, 800))
			if (Helper.UseAbility(abil, false))
				return true

		if (Helper.UseAbility(abil, false, false, target))
			return true
	}
}

export function XAIOvoidSpiritCombo(unit: Unit, enemy: Unit) {

	if (unit === undefined || enemy === undefined)
		return

	if ((XAIOStyleCombo.selected_id === 1 && !ComboActived) || (XAIOStyleCombo.selected_id === 0 && !XAIOComboKey.is_pressed))
		return

	if (Helper.IsBlockingAbilities(unit, enemy, XIAOlinkenItems, LinkenBreakAbilityItems))
		return

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

	orbWalker.OrbwalkingPoint = XAIOOrbWalkerSwitchState.selected_id === 0
		? enemy.Position
		: Input.CursorOnWorld

	if (!orbWalker.Execute(enemy))
		return

	if (!UnitsOrbWalker.get(unit)?.Execute(enemy))
		return
}
