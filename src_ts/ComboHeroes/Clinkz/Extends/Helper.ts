
import { Game, Hero, Menu } from "wrapper/Imports"
import { Heroes, Owner, initItemsTargetMap } from "../Listeners"
import { AeonDiscItem } from "../Menu"
class ClinkzHelper {
	private CancelModifiers: string[] = [
		"modifier_item_blade_mail_reflect",
		"modifier_item_combo_breaker_buff",
		"modifier_winter_wyvern_winters_curse_aura",
		"modifier_winter_wyvern_winters_curse",
		"modifier_oracle_fates_edict",
	]
	private CancelModifiersItems: string[] = [
		"modifier_item_lotus_orb_active",
	]
	public get DeadInSide(): boolean {
		return Heroes.length === 0
			|| Owner === undefined
			|| !Heroes.some(x => x.IsEnemy() && x.IsAlive && !x.IsInvulnerable)
			|| !Owner.IsAlive
	}
	public IsRestrictions(State: Menu.Toggle) {
		return State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
	}
	public AeonDisc(target: Hero, menu: boolean = true): boolean {
		if (!AeonDiscItem.value && menu) {
			return false
		}
		let Items = initItemsTargetMap.get(target)
		if (Items === undefined) {
			return false
		}
		if (Items.AeonDisk !== undefined && Items.AeonDisk.Cooldown <= 0) {
			return true
		}
		return false
	}
	public Cancel(target: Hero): boolean {
		return !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiers);
	}
	public CancelItems(target: Hero): boolean {
		return !target.IsMagicImmune && !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiersItems);
	}
	public IsLinkensProtected(target: Hero): boolean {
		let Items = initItemsTargetMap.get(target)
		if (Items === undefined) {
			return false
		}
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
}
export let Base = new ClinkzHelper()