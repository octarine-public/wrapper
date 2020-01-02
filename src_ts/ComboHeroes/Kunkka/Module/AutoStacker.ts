//@ts-nocheck
import { Ability, ArrayExtensions, Color, Game, RendererSDK, Vector2, EntityManager, Creep, TickSleeper, Vector3 } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Owner, initAbilityMap } from "../Listeners"
import { AutoStakerState, AutoStakerVisuals, State } from "../Menu"
export let is_stacking = false
let Sleep = new TickSleeper()

function IsInRangeCreepSpot(spot: Vector3) {
	return EntityManager.GetEntitiesByClass(Creep).some(x => x.IsEnemy()
		&& x.IsValid
		&& x.IsNeutral && ((x.IsAlive && !x.IsVisible) || (!x.IsWaitingToSpawn && x.IsVisible))
		&& x.IsInRange(spot, 250))

}

export function InitStaker() {
	if (!Base.IsRestrictions(State) || !AutoStakerState.value)
		return
	let Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined)
		return
	let Q = Abilities.Torrent as Ability,
		cur_time = Game.GameTime
	if (cur_time < 60)
		return

	if (is_stacking || Sleep.Sleeping) {
		is_stacking = false
		return
	}
	if (
		Math.abs(
			(cur_time % 60) -
			(60 - (Q.CastPoint + Q.GetSpecialValue("delay") + 0.6)), // it tooks ~0.6sec to raise y coord of creeps
		) >= 1 / 30
	)
		return

	let my_vec = Owner.Position, cast_range = Q.CastRange + Owner.CastRangeBonus
	// loop-optimizer: KEEP
	ArrayExtensions.orderBy(Base.Spots.filter(spot => spot.Distance2D(my_vec) < cast_range), spot => spot.Distance2D(my_vec)).every(spot => {
		if (IsInRangeCreepSpot(spot) && Q.CanBeCasted()) {
			Owner.CastPosition(Q, spot)
			is_stacking = true
			Sleep.Sleep((Q.CastPoint * 1000) + 30)
			return
		}
	})
}

export function InitDrawStaker() {
	if (!AutoStakerState.value || !AutoStakerVisuals.value || Owner === undefined)
		return
	Base.Spots.forEach((spot, i) => {
		let screen_pos = RendererSDK.WorldToScreen(spot)
		if (screen_pos === undefined || !IsInRangeCreepSpot(spot))
			return
		RendererSDK.FilledRect(screen_pos.SubtractScalar(2).AddScalarX(-4), new Vector2(20, 23), new Color(255, 0, 0))
		RendererSDK.Text((i + 1).toString(), screen_pos, new Color(0, 255, 0))
		if (is_stacking)
			RendererSDK.Text("Stacking...", screen_pos.SubtractScalar(5).AddScalarY(20).AddScalarX(-24), new Color(0, 255, 0))
	})
}

export function AutoStakerGameEnded() {
	is_stacking = false
}
