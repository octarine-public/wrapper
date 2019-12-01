import { Base } from "../Extends/Helper"
import { TickSleeper, Utils, Ability, Item, Hero, Game } from "wrapper/Imports"
import { ComboKeyItem, State, СomboAbility, СomboItems, StyleCombo, ComboHitAndRunAttack, TypeHitAndRun } from "../Menu"
import { MouseTarget, Owner, initAbilityMap, initItemsMap, initHitAndRunMap, AetherRemnanPluse, AetherRemnanMinus } from "../Listeners"
let Sleep = new TickSleeper

export let ComboActived = false
ComboKeyItem.OnRelease(() => ComboActived = !ComboActived)

function Combo(abil: Ability | Item, target: Hero, length: number) {
	if (length === undefined || (!СomboAbility.IsEnabled(abil.Name) && !СomboItems.IsEnabled(abil.Name)))
		return false
	let SetSleeping = (length + (Game.Ping / 2000)) * 10
	if (abil.Name === "void_spirit_astral_step" && !Owner.IsInRange(target, abil.AOERadius - (Owner.HullRadius * 2))) {
		Owner.MoveTo(target.Position)
		Sleep.Sleep(SetSleeping)
		return true
	} else {
		if (abil.Name === "void_spirit_astral_step" && !Owner.IsRooted) {
			Owner.CastPosition(abil, target.IsMoving ? target.InFront(250) : target.Position)
			Sleep.Sleep(SetSleeping)
			return true
		}
		if (abil.Name === "void_spirit_aether_remnant") {
			Owner.CastVectorTargetPosition(abil, AetherRemnanPluse, AetherRemnanMinus)
			Sleep.Sleep(SetSleeping)
			return true
		}
		if (abil.Name === "void_spirit_dissimilate" && Owner.IsInRange(target, 785) && !Owner.IsRooted) {
			Owner.CastNoTarget(abil)
			Sleep.Sleep(SetSleeping)
			return true
		}
		if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
			if (abil.Name === "void_spirit_dissimilate" && Owner.IsRooted) {
				return false
			}
			Owner.CastNoTarget(abil)
			Sleep.Sleep(SetSleeping)
			return true
		}
		if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) && !Owner.IsRooted) {
			Owner.CastPosition(abil, target.Position)
			Sleep.Sleep(SetSleeping)
			return true
		}
		if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
			if (abil.Name === "item_lotus_orb") {
				Owner.CastTarget(abil, Owner)
				Sleep.Sleep(SetSleeping)
				return true
			}
			Owner.CastTarget(abil, target)
			Sleep.Sleep(SetSleeping)
			return true
		}
	}
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350)
		return
	}
	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)
	if (Abilities === undefined || Items === undefined || HitAndRun_Unit === undefined || !target.IsAlive)
		return
	let array_ability: Ability[] = [
		Abilities.AstralStep,
		Abilities.AetherRemnan,
		Items.BlackKingBar,
		Items.DiffusalBlade,
		Items.Medallion,
		Items.SolarCrest,
		Items.BladeMail,
		Items.LotusOrb,
		Items.Satanic,
		Items.UrnOfShadows,
		Items.RodofAtos,
		Items.SpiritVesel,
		Items.Sheeps,
		Items.Orchid,
		Items.Bloodthorn,
		Items.Shivas,
		Items.Nullifier,
		Abilities.ResonantPulse,
		Abilities.Dissimilate
	]
	if (array_ability.some(abil => abil !== undefined && abil.CanBeCasted() && Combo(abil, target, array_ability.length)))
		return
	if (!Owner.CanAttack(target) || (!HitAndRun_Unit.ExecuteTo(target, TypeHitAndRun.selected_id)
		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return
	Owner.AttackTarget(target)
	return
}