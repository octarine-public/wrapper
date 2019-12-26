//@ts-nocheck
import { Game, Menu, Unit, EntityManager, Hero } from "wrapper/Imports"
import { Owner } from "../Listeners"
class ShadowFiendHelper {
	constructor(public unit?: Unit) { }

	public get DeadInSide(): boolean {
		let Heroes = EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsAlive)
			|| !Owner.IsAlive
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public IsCounterspellProtected(target: Unit) {
		if (target === undefined) {
			return false
		}
		if (target.Name !== "npc_dota_hero_antimage") {
			return false
		}
		return target.HasBuffByName("modifier_antimage_counterspell")
	}
	public IsAeonProtected(target: Unit): boolean {
		if (target === undefined) {
			return false
		}
		return target.HasBuffByName("modifier_item_aeon_disk_buff")
	}
	public IsLinkensProtected(target: Unit) {
		var Linken = target.GetItemByName("item_sphere")
		return (Linken && Linken.IsCooldownReady) || target.HasBuffByName("modifier_item_sphere_target")
	}
	public IsBlockingAbilities(target: Unit, checkReflecting: boolean = false): boolean {
		if (checkReflecting && target.HasBuffByName("modifier_item_lotus_orb_active")) {
			return true
		}

		if (this.IsLinkensProtected(target)) {
			return true
		}
		// todo qop talent somehow ?
		return false
	}
}
export let Base = new ShadowFiendHelper()
