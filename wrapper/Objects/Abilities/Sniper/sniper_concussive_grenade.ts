import { WrapperClass } from "../../../Decorators"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"

@WrapperClass("sniper_concussive_grenade")
export class sniper_concussive_grenade extends Ability implements INuke {
	public CurrectionSpeed_ = 2500
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return this.CurrectionSpeed_
	}
}

EventsSDK.on("LinearProjectileCreated", proj => {
	if (proj.Ability instanceof sniper_concussive_grenade) {
		if (proj.Ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Concussive Grenade => set new speed old value deprecated")
			proj.Ability.CurrectionSpeed_ = proj.Speed
		}
	}
})
