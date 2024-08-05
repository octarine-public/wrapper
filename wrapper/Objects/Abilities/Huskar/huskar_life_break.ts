import { WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { ProjectileManager } from "../../../Managers/ProjectileManager"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"
import { TrackingProjectile } from "../../Base/Projectile"

@WrapperClass("huskar_life_break")
export class huskar_life_break extends Ability {
	public StartedChargingTime = 0
	public CurrentProjectile: Nullable<TrackingProjectile>

	public GetBaseCastRangeForLevel(level: number): number {
		return (
			super.GetBaseCastRangeForLevel(level) +
			((this.Owner?.HasScepter ?? false)
				? this.GetSpecialValue("cast_range_bonus", level)
				: 0)
		)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("charge_speed", level)
	}
}

const abils = EntityManager.GetEntitiesByClass(huskar_life_break)
EventsSDK.on("ModifierCreated", mod => {
	if (mod.Name !== "modifier_huskar_life_break_charge") {
		return
	}

	const caster = mod.Caster,
		abil = mod.Ability
	if (
		caster === undefined ||
		!(abil instanceof huskar_life_break) ||
		abil.CurrentProjectile !== undefined
	) {
		return
	}

	abil.StartedChargingTime = GameState.RawGameTime
	for (const proj of ProjectileManager.AllTrackingProjectiles) {
		if (
			proj.ParticlePath === undefined &&
			proj.Source === undefined &&
			proj.LaunchTick === GameState.CurrentGameTick &&
			caster.Position.Distance(proj.Position) < 0.1
		) {
			abil.CurrentProjectile = proj
			break
		}
	}
})

EventsSDK.on("ModifierRemoved", mod => {
	const abil = mod.Ability
	if (abil instanceof huskar_life_break) {
		abil.CurrentProjectile = undefined
	}
})

EventsSDK.on("TrackingProjectileDestroyed", proj => {
	for (const abil of abils) {
		if (abil.CurrentProjectile === proj) {
			abil.CurrentProjectile = undefined
			break
		}
	}
})
