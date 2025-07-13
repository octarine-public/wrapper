import { WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Item } from "../Base/Item"

@WrapperClass("item_gungir")
export class item_gungir extends Item {
	/**
	 * @ingnore
	 * @internal
	 * @description current speed by server via tracking projectile
	 */
	public CurrectionSpeed_ = 1900

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("chain_radius", level)
	}

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Rod_of_Atos
		return this.CurrectionSpeed_
	}
}

// TODO: fix me, move to event obstacle types
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.Ability instanceof item_gungir) {
		if (proj.Ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Rod Of Atos => set new speed old value deprecated")
			proj.Ability.CurrectionSpeed_ = proj.Speed
		}
	}
})
