import { WrapperClass } from "../../../Decorators"
import EntityManager from "../../../Managers/EntityManager"
import EventsSDK from "../../../Managers/EventsSDK"
import GameState from "../../../Utils/GameState"
import Ability from "../../Base/Ability"
import { TrackingProjectile } from "../../Base/Projectile"
import Unit from "../../Base/Unit"

@WrapperClass("spirit_breaker_charge_of_darkness")
export default class spirit_breaker_charge_of_darkness extends Ability {
	public StartedChargingTime = 0
	public CurrentProjectile: Nullable<TrackingProjectile>
}

EventsSDK.on("ParticleCreated", (id, path, _particleSystemHandle, _attach, target) => {
	if (
		path !== "particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_start.vpcf"
		|| !(target instanceof Unit)
	)
		return

	const abil = target.GetAbilityByClass(spirit_breaker_charge_of_darkness)
	if (abil === undefined)
		return

	abil.StartedChargingTime = GameState.RawGameTime
})
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.ParticlePath !== undefined || proj.Source !== undefined)
		return
	EntityManager.GetEntitiesByClass(spirit_breaker_charge_of_darkness).some(abil => {
		if (
			abil.StartedChargingTime !== GameState.RawGameTime
			|| abil.CurrentProjectile !== undefined
		)
			return false
		abil.CurrentProjectile = proj
		return true
	})
})
EventsSDK.on("TrackingProjectileDestroyed", proj => {
	EntityManager.GetEntitiesByClass(spirit_breaker_charge_of_darkness).some(abil => {
		if (abil.CurrentProjectile !== proj)
			return false
		abil.CurrentProjectile = undefined
		return true
	})
})
EventsSDK.on("ModifierRemoved", mod => {
	const abil = mod.Ability
	if (abil instanceof spirit_breaker_charge_of_darkness)
		abil.CurrentProjectile = undefined
})
