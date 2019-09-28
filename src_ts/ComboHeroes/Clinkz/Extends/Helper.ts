
// import { EntityManager, Game, Hero, Menu, ParticlesSDK } from "wrapper/Imports"
// import { Heroes, Owner } from "../Listeners"
// import InitItems from "./Items"

// class ClinkzHelper {
// 	public IsRestrictions(State: Menu.Toggle) {
// 		return !this.IsSpectator && State.value && !Game.IsPaused && Game.IsInGame && Owner !== undefined && Owner.IsAlive
// 	}
// 	public Cancel(target: Hero): boolean {
// 		return !target.IsMagicImmune && !target.IsInvulnerable && !target.ModifiersBook.GetAnyBuffByNames(this.CancelModifiers);
// 	}
// 	private CancelModifiers: string[] = [
// 		"modifier_abaddon_borrowed_time",
// 		"modifier_item_combo_breaker_buff",
// 		"modifier_winter_wyvern_winters_curse_aura",
// 		"modifier_winter_wyvern_winters_curse",
// 		"modifier_oracle_fates_edict"
// 	]
// 	private get IsSpectator(): boolean {
// 		let LocalPlayer = EntityManager.LocalPlayer
// 		return LocalPlayer !== undefined && LocalPlayer.Team === 1
// 	}
// }
// export let Base = new ClinkzHelper()