import { WrapperClass } from "../../../Decorators"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { LinearProjectile } from "../../Base/Projectile"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_chaos_meteor")
export class invoker_chaos_meteor extends invoker_spell_extends {
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
function UpdateSpeed(proj: LinearProjectile, destroy: boolean = false) {
	if (proj.Ability instanceof invoker_chaos_meteor) {
		proj.Ability.HasProjectile_ = !destroy
	}
}

EventsSDK.on("LinearProjectileCreated", proj => UpdateSpeed(proj))
EventsSDK.on("LinearProjectileDestroyed", proj => UpdateSpeed(proj, true))
