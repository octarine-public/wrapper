import { EntityManager, Game, Hero, Menu, ParticlesSDK } from "wrapper/Imports"
import { Heroes, Owner } from "../Listeners"
import { AeonDiscItem } from "../Menu"
import InitItems from "./Items"

class LegionHelper {
	public IsRestrictions(State: Menu.Toggle) {
		return !this.IsSpectator && State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsEnemy() && x.IsAlive && !x.IsInvulnerable)
			|| !Owner.IsAlive
	}
	public Cancel(target: Hero): boolean {
		return !target.ModifiersBook.HasAnyBuffByNames(this.CancelModifiers)
	}
	public AeonDisc(target: Hero, menu: boolean = true): boolean {
		if (!AeonDiscItem.value && menu) {
			return false
		}
		let Items = new InitItems(target)
		if (Items.AeonDisc !== undefined && Items.AeonDisc.Cooldown <= 0) {
			return true
		}
		return false
	}
	public CancelAbilityRealm(target: Hero): boolean {
		return target.HasModifier("modifier_dark_willow_shadow_realm_buff")
	}
	public CancelAdditionally(target: Hero): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.HasAnyBuffByNames(["modifier_abaddon_borrowed_time", "modifier_item_combo_breaker_buff"])
	}
	public IsLinkensProtected(target: Hero): boolean {
		let Items = new InitItems(target)
		return target.HasModifier("modifier_item_sphere_target") || (Items.Sphere !== undefined && Items.Sphere.Cooldown === 0)
	}
	public IsBlockingAbilities(target: Hero, checkReflecting: boolean = false): boolean {
		if (checkReflecting && target.HasModifier("modifier_item_lotus_orb_active")) {
			return true
		}

		if (this.IsLinkensProtected(target)) {
			return true
		}
		// todo qop talent somehow ?
		return false
	}
	private get IsSpectator(): boolean {
		let LocalPlayer = EntityManager.LocalPlayer
		return LocalPlayer !== undefined && LocalPlayer.Team === 1
	}
	private CancelModifiers: string[]  = [
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict",
	]
}
export let Base = new LegionHelper()