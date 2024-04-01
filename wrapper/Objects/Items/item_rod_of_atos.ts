import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Item } from "../Base/Item"

@WrapperClass("item_rod_of_atos")
export class item_rod_of_atos extends Item {
	// The current speed by server via tracking projectile
	public CurrectionSpeed_ = 1900

	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Rod_of_Atos
		return this.CurrectionSpeed_
	}
}

// TODO: fix me, move to event obstacle types
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.ParticlePathNoEcon !== "particles/items2_fx/rod_of_atos_attack.vpcf") {
		return
	}
	if (proj.Ability instanceof item_rod_of_atos) {
		if (proj.Ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Rod Of Atos => set new speed old value deprecated")
			proj.Ability.CurrectionSpeed_ = proj.Speed
		}
		return
	}
	const abilities = EntityManager.GetEntitiesByClass(item_rod_of_atos)
	for (let index = abilities.length - 1; index > -1; index--) {
		const ability = abilities[index]
		if (ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Rod Of Atos => set new speed old value deprecated")
			ability.CurrectionSpeed_ = proj.Speed
		}
	}
})
