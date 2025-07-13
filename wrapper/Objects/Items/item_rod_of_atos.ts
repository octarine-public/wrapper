import { WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Item } from "../Base/Item"

@WrapperClass("item_rod_of_atos")
export class item_rod_of_atos extends Item {
	// The current speed by server via tracking projectile
	public CurrectionSpeed_ = 1900
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Rod_of_Atos
		return this.CurrectionSpeed_
	}
}

// TODO: fix me, move to event obstacle types
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.Ability instanceof item_rod_of_atos) {
		if (proj.Ability.CurrectionSpeed_ !== proj.Speed) {
			proj.Ability.CurrectionSpeed_ = proj.Speed
		}
	}
})
