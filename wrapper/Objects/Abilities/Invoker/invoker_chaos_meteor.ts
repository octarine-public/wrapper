import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { LinearProjectile } from "../../Base/Projectile"

@WrapperClass("invoker_chaos_meteor")
export class invoker_chaos_meteor extends Ability {
	@NetworkedBasicField("m_nQuasLevel")
	public QuasLevel = 0
	@NetworkedBasicField("m_nWexLevel")
	public WexLevel = 0
	@NetworkedBasicField("m_nExortLevel")
	public ExortLevel = 0

	/** @ignore */
	public HasProjectile_ = false

	public get LandTime() {
		return this.ActivationDelay
	}

	public get Speed() {
		return this.GetBaseSpeedForLevel(this.Level + this.WexLevel)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.HasProjectile_ ? this.GetSpecialValue("travel_speed", level) : 0
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("main_damage", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("land_time", level)
	}
}

// TODO: fix me, move to event obstacle types
const path = "particles/units/heroes/hero_invoker/invoker_chaos_meteor.vpcf"
function UpdateSpeed(proj: LinearProjectile) {
	if (proj.ParticlePathNoEcon !== path) {
		return
	}
	const abilities = EntityManager.GetEntitiesByClass(invoker_chaos_meteor)
	for (let index = abilities.length - 1; index > -1; index--) {
		const ability = abilities[index]
		if (proj.Source === ability.Owner) {
			ability.HasProjectile_ = !ability.HasProjectile_
		}
	}
}

EventsSDK.on("LinearProjectileCreated", proj => UpdateSpeed(proj))
EventsSDK.on("LinearProjectileDestroyed", proj => UpdateSpeed(proj))
