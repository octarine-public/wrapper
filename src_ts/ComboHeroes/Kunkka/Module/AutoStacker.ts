import { Game, Ability, ArrayExtensions, RendererSDK, Color, Vector2 } from "wrapper/Imports";
import { Base } from "../Extends/Helper";
import { State, AutoStakerState, AutoStakerVisuals } from "../Menu";
import InitAbility from "../Extends/Abilities"
import { Owner, CreepsNeutrals } from "../Listeners";
export let is_stacking = false
export function InitStaker() {
	if (!Base.IsRestrictions(State) || !AutoStakerState.value || is_stacking) {
		return false
	}
	let Abilities = new InitAbility(Owner),
		Q = Abilities.Torrent as Ability,
		cur_time = Game.GameTime
	if (cur_time < 60) {
		return false
	}
	if (
		Math.abs(
			(cur_time % 60) -
			(60 - (Q.CastPoint + Q.GetSpecialValue("delay") + 0.6)), // it tooks ~0.6sec to raise y coord of creeps
		) >= 1 / 30
	) {
		return false
	}
	let my_vec = Owner.NetworkPosition, cast_range = Q.CastRange + Owner.CastRangeBonus
	// loop-optimizer: KEEP
	ArrayExtensions.orderBy(Base.Spots.filter(spot => spot.Distance2D(my_vec) < cast_range), spot => spot.Distance2D(my_vec)).every(spot => {
		let CreepIsInside = CreepsNeutrals.some(x => x.IsValid && x.IsNeutral && ((x.IsAlive && !x.IsVisible) || (!x.IsWaitingToSpawn && x.IsVisible)) && x.IsInRange(spot, 250))
		if (CreepIsInside) {
			Owner.CastPosition(Q, spot)
			is_stacking = true
			setTimeout(() => is_stacking = false, Q.CastPoint * 1000 + 30)
			return false
		}
	})
}

export function InitDrawStaker() {
	if (!AutoStakerState.value || !AutoStakerVisuals.value) {
		return
	}
	Base.Spots.forEach((spot, i) => {
		let screen_pos = RendererSDK.WorldToScreen(spot),
			CreepIsInside = CreepsNeutrals.some(x => x.IsValid && x.IsNeutral && ((x.IsAlive && !x.IsVisible) || (!x.IsWaitingToSpawn && x.IsVisible)) && x.IsInRange(spot, 250))
		if (screen_pos === undefined || !CreepIsInside) {
			return
		}
		RendererSDK.FilledRect(screen_pos.SubtractScalar(2).AddScalarX(-4), new Vector2(20, 20), new Color(255, 0, 0))
		RendererSDK.Text((i + 1).toString(), screen_pos, new Color(0, 255, 0))
		if (is_stacking) {
			RendererSDK.Text("Stacking...", screen_pos.SubtractScalar(5).AddScalarY(20).AddScalarX(-20), new Color(0, 255, 0))
		}
	})
}

export function AutoStakerGameEnded() {
	is_stacking = false
}