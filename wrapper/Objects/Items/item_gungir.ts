import { WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
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

	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("chain_radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(_level: number): number {
		// https://dota2.fandom.com/wiki/Rod_of_Atos
		return this.CurrectionSpeed_
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("active_damage", level)
	}
}

// TODO: fix me, move to event obstacle types
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (proj.ParticlePathNoEcon !== "particles/items3_fx/gleipnir_projectile.vpcf") {
		return
	}
	if (proj.Ability instanceof item_gungir) {
		if (proj.Ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Rod Of Atos => set new speed old value deprecated")
			proj.Ability.CurrectionSpeed_ = proj.Speed
		}
		return
	}
	const abilities = EntityManager.GetEntitiesByClass(item_gungir)
	for (let index = abilities.length - 1; index > -1; index--) {
		const ability = abilities[index]
		if (ability.CurrectionSpeed_ !== proj.Speed) {
			console.warn("Gungir => set new speed old value deprecated")
			ability.CurrectionSpeed_ = proj.Speed
		}
	}
})
