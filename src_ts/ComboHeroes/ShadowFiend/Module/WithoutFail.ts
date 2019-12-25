import { Ability, ExecuteOrder, Unit, dotaunitorder_t, EntityManager, Hero, Creep } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { initAbilityMap, Owner } from "../Listeners"
import { State, WithoutFailsState } from "../Menu"
import { PredictionRize } from "./Combo"

const prdictPos = (abil: Ability, enemy: Unit) =>
	PredictionRize(abil, enemy, abil.GetSpecialValue("shadowraze_radius"))

export function OnExecuteOrder(order: ExecuteOrder): boolean {
	if (!Base.IsRestrictions(State) || !WithoutFailsState.value) {
		return true
	}
	let ability = order.Ability as Ability

	if (
		Owner === undefined
		|| order.Unit !== Owner
		|| order.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
	)
		return true

	if (!(ability instanceof Ability) || ability === undefined || !ability.Name.includes("nevermore_shadowraze")) {
		return true
	}
	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined || ability.Level === 0)
		return true

	return EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep], DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).some(enemy => {
		if (!enemy.IsVisible)
			return false
		switch (ability.Name) {
			case Abilities.Shadowraze1.Name:
				return prdictPos(Abilities.Shadowraze1, enemy)
			case Abilities.Shadowraze2.Name:
				return prdictPos(Abilities.Shadowraze2, enemy)
			case Abilities.Shadowraze3.Name:
				return prdictPos(Abilities.Shadowraze3, enemy)
			default: return false
		}
	})
}
// export function FailTick() {
// 	if (AbilityInPhase === undefined || !Base.IsRestrictions(State) || !WithoutFailsState.value || !AbilityInPhase.IsInAbilityPhase) {
// 		return
// 	}
// 	[...Heroes, ...Creeps].every(enemy => {
// 		if (!enemy.IsEnemy() || !enemy.IsVisible || Sleep.Sleeping(enemy.Index))
// 			return true
// 		if (prdictPos(AbilityInPhase, enemy)) {
// 			return false
// 		}
// 		Owner.OrderStop()
// 		Sleep.Sleep(GetDelayCast(), enemy.Index)
// 		return true
// 	})
// }

// export function WithoutFailGameEdned() {
// 	//AbilityInPhase = undefined
// }