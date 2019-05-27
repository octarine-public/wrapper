import { EventsSDK, MenuManager, Unit, LocalPlayer, Utils } from "./CrutchesSDK/Imports";

//import * as Orders from "Orders"
//import * as Utils from "Utils"

const iHateLeapsMenu = MenuManager.MenuFactory("I Hate Leaps");
const stateMain = iHateLeapsMenu.AddToggle("State", false);

let mks: Unit[] = [],
	techiess: Unit[] = [];

EventsSDK.on("onEntityCreated", (npc: Unit) => {

	if (LocalPlayer === undefined || LocalPlayer.Hero === npc)
		return
	if (npc.m_pBaseEntity instanceof C_DOTA_Unit_Hero_MonkeyKing)
		mks.push(npc)
	if (npc.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Techies)
		techiess.push(npc)
})
EventsSDK.on("onEntityDestroyed", (npc: Unit) => {
	if (npc.m_pBaseEntity instanceof C_DOTA_Unit_Hero_MonkeyKing)
		Utils.arrayRemove(mks, npc)
	if (npc.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Techies)
		Utils.arrayRemove(techiess, npc)
})

EventsSDK.on("onTick", () => {
	if (!stateMain.value)
		return
	const pl_ent = LocalPlayer.Hero;
	if (pl_ent === undefined || pl_ent.IsStunned || !pl_ent.IsAlive || LocalPlayer.ActiveAbility !== undefined)
		return
	if (mks.length !== 0)
		// loop-optimizer: FORWARD
		pl_ent.Inventory.GetItemsByNames(["item_quelling_blade", "item_bfury", "item_tango"])
			.filter(item => item !== undefined && item.IsCooldownReady)
			.some(item => {
				if (!item.CanBeCasted())
					return false
					
				let castrange = item.CastRange;
				
				return mks.some(mk => {
					if (mk.IsDormant || !mk.IsAlive)
						return false
						
					let m_nPerchedTree = (mk.m_pBaseEntity as C_DOTA_Unit_Hero_MonkeyKing).m_nPerchedTree;
					if (m_nPerchedTree === 4294967295 || mk.Distance2D(pl_ent) > castrange)
						return false;
						
					pl_ent.CastTargetTree(item, m_nPerchedTree);
					return true
			})
		})
	let force = pl_ent.Inventory.GetItemByName("item_force_staff")
	if (force !== undefined && force.IsCooldownReady) {
		if (!force.CanBeCasted())
			return false
		let force_castrange = force.CastRange;
		[...mks, ...techiess].some(hero => {
			if (hero.IsDormant || !hero.IsAlive)
				return false
			if (hero.Distance2D(pl_ent) > force_castrange)
				return false
			if (hero.ModifiersBook.GetBuffByName("modifier_item_forcestaff_active") !== undefined)
				return false
			if (hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Techies && hero.ModifiersBook.GetBuffByName("modifier_techies_suicide_leap") === undefined)
				return false
			if (hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_MonkeyKing && hero.ModifiersBook.GetBuffByName("modifier_monkey_king_bounce_leap") === undefined)
				return false
			
			pl_ent.CastTarget(force, hero);
			return true
		})
	}
})