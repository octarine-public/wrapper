import { Base } from "../Extends/Helper"
import { Utils, Ability, Hero, Game, GameSleeper } from "wrapper/Imports"
import { ComboKeyItem, State, СomboAbility, СomboItems, StyleCombo, ComboHitAndRunAttack, TypeHitAndRun } from "../Menu"
import { MouseTarget, Owner, initAbilityMap, initItemsMap, initHitAndRunMap, AetherRemnanPluse, AetherRemnanMinus } from "../Listeners"
let Sleep = new GameSleeper

export let ComboActived = false
ComboKeyItem.OnRelease(() => ComboActived = !ComboActived)

function Combo(abil: Ability, target: Hero, length: number) {
	if (Sleep.Sleeping(abil) || Owner.IsInvulnerable || Owner.IsSilenced) {
		return false
	}
	if (length === undefined || (!СomboAbility.IsEnabled(abil.Name) && !СomboItems.IsEnabled(abil.Name)))
		return false
	let SetSleeping = Math.max(150, ((Game.Ping * 2) + (abil.CastPoint + length)))
	if (abil.Name === "void_spirit_astral_step" && !Owner.IsRooted) {
		Owner.CastPosition(abil, target.IsMoving ? target.InFront(250) : target.Position)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.Name === "void_spirit_aether_remnant") {
		Owner.CastVectorTargetPosition(abil, AetherRemnanPluse, AetherRemnanMinus)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.Name === "void_spirit_dissimilate" && Owner.IsInRange(target, 785) && !Owner.IsRooted) {
		Owner.CastNoTarget(abil)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (abil.Name === "void_spirit_dissimilate" && Owner.IsRooted) {
			return false
		}
		Owner.CastNoTarget(abil)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) && !Owner.IsRooted) {
		Owner.CastPosition(abil, target.Position)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
		if (abil.Name === "item_lotus_orb") {
			Owner.CastTarget(abil, Owner)
			Sleep.Sleep(SetSleeping, abil)
			return true
		}
		Owner.CastTarget(abil, target)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	return false
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping("Move"))
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(350, "Move")
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
	if (!Owner.IsInRange(target, Abilities.AstralStep.AOERadius + (Owner.HullRadius * 2))) {
		Owner.MoveTo(target.Position)
		Sleep.Sleep(350, "Move")
		return
	}
	if (array_ability.some(abil => abil !== undefined && abil.CanBeCasted() && Combo(abil, target, array_ability.length)))
		return
	if (!Owner.CanAttack(target) || (!HitAndRun_Unit.ExecuteTo(target, TypeHitAndRun.selected_id)
		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return
	Owner.AttackTarget(target)
	return
}