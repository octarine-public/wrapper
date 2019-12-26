//@ts-nocheck
import { Ability, Hero, Flow_t } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Heroes, Owner, initAbilityMap } from "../Listeners"
import { AutoStealAbility, AutoStealState, BladeMailCancel, State } from "../Menu"

function IsReadySteal(ability: Ability, target: Hero) {
	return ability !== undefined
		&& AutoStealAbility.IsEnabled(ability.Name) && target.IsAlive
		&& ability.CanBeCasted() && Owner.Distance2D(target) <= ability.CastRange
}
//let Sleep = new TickSleeper()
export function InitAutoSteal() {
	if (!Base.IsRestrictions(State) || !AutoStealState.value)
		return
	let target = Heroes.sort((a, b) => b.Distance2D(Owner) - a.Distance2D(Owner))
		.filter(x => x.IsValid && x.IsAlive && x.IsEnemy())
		.find(e => !e.IsMagicImmune && !e.IsInvulnerable)

	if (target === undefined || target.ModifiersBook.GetAnyBuffByNames(
		["modifier_item_helm_of_the_undying", "modifier_skeleton_king_reincarnation_scepter_active"]
	) || (BladeMailCancel.value && target.HasBuffByName("modifier_item_blade_mail_reflect")))
		return

	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined)
		return

	let DMG_TYPE_LAGUNA = Owner.HasScepter
		? DAMAGE_TYPES.DAMAGE_TYPE_PURE
		: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
		Laguna = Abilities.LagunaBlade,
		StrikeArray = Abilities.LightStrikeArray,
		DraGonSlave = Abilities.DragonSlave,
		StealDMGStrike = target.CalculateDamage(StrikeArray.GetSpecialValue("light_strike_array_damage"), DraGonSlave.AbilityDamage, target),
		StealDMDraGonSlave = target.CalculateDamage(DraGonSlave.AbilityDamage, DraGonSlave.DamageType, target),
		StealDMGLaguna = target.CalculateDamage(Laguna.AbilityDamage, DMG_TYPE_LAGUNA, target)

	let PredictionSlave = target.VelocityWaypoint((DraGonSlave.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
	let PredictionArray = target.VelocityWaypoint((Abilities.LightStrikeArray.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))

	if (!target.IsMagicImmune && target.HP < StealDMGStrike && IsReadySteal(StrikeArray, target)) {
		Abilities.UseAbility(StrikeArray, false, false, PredictionArray)
		return
	}

	if (!target.IsMagicImmune && target.HP < StealDMDraGonSlave && IsReadySteal(DraGonSlave, target)) {
		Abilities.UseAbility(DraGonSlave, false, false, PredictionSlave)
		return
	}

	if (target.HP < StealDMGLaguna
		&& IsReadySteal(Laguna, target) && Owner.Distance2D(target) <= Laguna.CastRange) {
		Abilities.UseAbility(Laguna, false, false, target)
		return
	}

	if (target.HP < (StealDMDraGonSlave + StealDMGLaguna + StealDMGStrike)
		&& Owner.Mana >= (DraGonSlave.ManaCost + StrikeArray.ManaCost + Laguna.ManaCost)
		&& IsReadySteal(DraGonSlave, target) && IsReadySteal(Laguna, target)) {
		Abilities.UseAbility(Laguna, false, false, target)
		return
	}
}

export function AutoStealGameEnded() {
	//Sleep.ResetTimer()
}
