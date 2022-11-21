import { WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"
import { TrackingProjectile } from "../../Base/Projectile"
import { Unit } from "../../Base/Unit"

@WrapperClass("spirit_breaker_charge_of_darkness")
export class spirit_breaker_charge_of_darkness extends Ability {
	public StartedChargingTime = 0
	public CurrentProjectile: Nullable<TrackingProjectile>
}

EventsSDK.on("ParticleCreated", par => {
	if (
		par.PathNoEcon !==
			"particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_start.vpcf" ||
		!(par.AttachedTo instanceof Unit)
	)
		return

	const abil = par.AttachedTo.GetAbilityByClass(
		spirit_breaker_charge_of_darkness
	)
	if (abil === undefined) return

	abil.StartedChargingTime = GameState.RawGameTime
})

const abils = EntityManager.GetEntitiesByClass(
	spirit_breaker_charge_of_darkness
)
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.ParticlePath !== undefined || proj.Source !== undefined) return
	for (const abil of abils)
		if (
			abil.StartedChargingTime === GameState.RawGameTime &&
			abil.CurrentProjectile === undefined
		) {
			abil.CurrentProjectile = proj
			break
		}
})
EventsSDK.on("TrackingProjectileDestroyed", proj => {
	for (const abil of abils)
		if (abil.CurrentProjectile === proj) {
			abil.CurrentProjectile = undefined
			break
		}
})

EventsSDK.on("ModifierRemoved", mod => {
	const abil = mod.Ability
	if (abil instanceof spirit_breaker_charge_of_darkness)
		abil.CurrentProjectile = undefined
})
