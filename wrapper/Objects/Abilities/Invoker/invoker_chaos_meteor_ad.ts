import { WrapperClass } from "../../../Decorators"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { LinearProjectile } from "../../Base/Projectile"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_chaos_meteor_ad")
export class invoker_chaos_meteor_ad extends invoker_spell_extends {
	public HasProjectile_ = false

	public GetBaseSpeedForLevel(level: number): number {
		return this.HasProjectile_ ? this.GetSpecialValue("travel_speed", level) : 0
	}
}

// TODO: fix me, move to event obstacle types
const path = "particles/units/heroes/hero_invoker/invoker_chaos_meteor.vpcf"
function UpdateSpeed(proj: LinearProjectile) {
	if (proj.ParticlePathNoEcon !== path) {
		return
	}
	const abilities = EntityManager.GetEntitiesByClass(invoker_chaos_meteor_ad)
	for (let index = abilities.length - 1; index > -1; index--) {
		const ability = abilities[index]
		if (proj.Source === ability.Owner) {
			ability.HasProjectile_ = !ability.HasProjectile_
		}
	}
}

EventsSDK.on("LinearProjectileCreated", proj => UpdateSpeed(proj))
EventsSDK.on("LinearProjectileDestroyed", proj => UpdateSpeed(proj))
