//@ts-nocheck
import { Ability, Hero, Flow_t } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Owner, initAbilityMap } from "../Listeners"
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
	let target = EntityManager.GetEntitiesByClass(Hero).sort((a, b) => a.Distance2D(Owner) - b.Distance2D(Owner))
		.find(x => !x.IsIllusion && x.IsAlive && x.IsEnemy() && !x.IsMagicImmune && !x.IsInvulnerable)
	if (target === undefined || target.HasBuffByName("modifier_skeleton_king_reincarnation_scepter_active")
		|| (BladeMailCancel.value && target.HasBuffByName("modifier_item_blade_mail_reflect")))
		return
	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined)
		return

	let Laguna = Abilities.LagunaBlade,
		StrikeArray = Abilities.LightStrikeArray,
		DraGonSlave = Abilities.DragonSlave

	let StealDMGStrike = target.CalculateDamage(StrikeArray?.AbilityDamage, DraGonSlave?.AbilityDamage, target),
		StealDMDraGonSlave = target.CalculateDamage(DraGonSlave?.AbilityDamage, DraGonSlave?.DamageType, target),
		StealDMGLaguna = target.CalculateDamage(Laguna?.AbilityDamage, Laguna?.DamageType, target)

	let THP = target.HP
	let PredictionSlave = target.VelocityWaypoint(DraGonSlave?.CastPoint * 2 + GetAvgLatency(Flow_t.OUT))
	let PredictionArray = target.VelocityWaypoint(StrikeArray?.CastPoint * 2 + GetAvgLatency(Flow_t.OUT))

	if (!target.IsMagicImmune
		&& THP < StealDMDraGonSlave
		&& IsReadySteal(DraGonSlave, target)
	) {
		if (!Abilities.UseAbility(DraGonSlave, false, true, PredictionSlave))
			return
	}

	if (!target.IsMagicImmune
		&& THP < StealDMGStrike
		&& IsReadySteal(StrikeArray, target)) {
		if (!Abilities.UseAbility(StrikeArray, false, true, PredictionArray)) {
			return
		}
	}

	if (THP < StealDMGLaguna
		&& IsReadySteal(Laguna, target)
		&& Owner.Distance2D(target) <= Laguna.CastRange
	) {
		if (!Abilities.UseAbility(Laguna, false, true, target))
			return
	}

	if (THP < StealDMDraGonSlave + StealDMGStrike
		&& Owner.Mana >= DraGonSlave.ManaCost + StrikeArray.ManaCost
		&& IsReadySteal(DraGonSlave, target)
		&& IsReadySteal(StrikeArray, target)
	) {
		if (!Abilities.UseAbility(StrikeArray, false, true, PredictionArray))
			return
		if (!Abilities.UseAbility(DraGonSlave, false, true, PredictionSlave))
			return
	}

	if (THP < StealDMGLaguna + StealDMGStrike
		&& Owner.Mana >= StrikeArray.ManaCost + Laguna.ManaCost
		&& IsReadySteal(Laguna, target)
		&& IsReadySteal(StrikeArray, target)
	) {
		if (!Abilities.UseAbility(StrikeArray, false, true, PredictionArray))
			return

		if (!Abilities.UseAbility(Laguna, false, true, target))
			return
	}

	if (THP < StealDMDraGonSlave + StealDMGLaguna
		&& Owner.Mana >= DraGonSlave.ManaCost + Laguna.ManaCost
		&& IsReadySteal(DraGonSlave, target) && IsReadySteal(Laguna, target)
	) {
		if (!Abilities.UseAbility(Laguna, false, true, target))
			return

		if (!Abilities.UseAbility(DraGonSlave, false, true, PredictionSlave))
			return
	}

	if (THP < StealDMDraGonSlave + StealDMGLaguna + StealDMGStrike
		&& Owner.Mana >= DraGonSlave.ManaCost + StrikeArray.ManaCost + Laguna.ManaCost
		&& IsReadySteal(Laguna, target)
		&& IsReadySteal(DraGonSlave, target)
		&& IsReadySteal(StrikeArray, target)
	) {
		if (!Abilities.UseAbility(Laguna, false, true, target))
			return

		if (!Abilities.UseAbility(StrikeArray, false, true, target))
			return
		if (!Abilities.UseAbility(DraGonSlave, false, true, target))
			return
	}
}

export function AutoStealGameEnded() {
	//Sleep.ResetTimer()
}
