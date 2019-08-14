import { ArrayExtensions, Entity, EventsSDK, Game, LocalPlayer, MenuManager } from "./wrapper/Imports"

// Menu //
const Config = MenuManager.MenuFactory("Auto Deward")
const Config_State = Config.AddToggle("State", false)
const Config_IssueOrderDelay = Config.AddSliderFloat("Delay between actions:", 0.1, 0, 1)
const Config_Items = Config.AddListBox("Items", ["Quelling Blade", "Battle Fury", "Tango", "Shared Tango"], [true, true, true, true])

// Variables //
var IssueOrderT = 0
var ward_list: Entity[] = []
const Items = ["item_quelling_blade", "item_bfury", "item_tango", "item_tango_single"]

// Events //
EventsSDK.on("Tick", () => {
	if (!Config_State.value || ward_list.length === 0)
		return

	const myHero = LocalPlayer.Hero
	if (
		myHero === undefined
		|| !myHero.IsAlive
		|| myHero.IsStunned
		|| LocalPlayer.ActiveAbility !== undefined
		|| IssueOrderT + Config_IssueOrderDelay.value > Game.RawGameTime
	)
		return

	myHero.Inventory.GetItemsByNames(["item_quelling_blade", "item_bfury", "item_tango", "item_tango_single"]).filter(item =>
		item !== undefined
		&& Config_Items.IsSelectedID(Items.indexOf(item.Name))
		&& item.IsReady
		&& item.CanBeCasted,
	).some(item => ward_list.filter(ent => ent.IsAlive && ent.IsVisible && ent.IsInRange(myHero, item.CastRange)).some(ent => {
		myHero.CastTarget(item, ent)
		IssueOrderT = Game.RawGameTime
		return true
	}))
})

function IsDewardable(ent: Entity) {
	return ent.IsEnemy() && (
		ent.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward
		|| ent.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward_TrueSight
		|| (
			ent.m_pBaseEntity instanceof C_DOTA_NPC_TechiesMines
			&& (
				ent.Name === "npc_dota_techies_remote_mine"
				|| ent.Name === "npc_dota_techies_stasis_trap"
			)
		)
	)
}

EventsSDK.on("EntityCreated", ent => {
	if (IsDewardable(ent))
		ward_list.push(ent)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (IsDewardable(ent))
		ArrayExtensions.arrayRemove(ward_list, ent)
})

EventsSDK.on("GameEnded", () => IssueOrderT = 0)
