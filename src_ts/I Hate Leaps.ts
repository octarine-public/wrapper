import * as Orders from "Orders"
import * as Utils from "Utils"

let mks: C_DOTA_Unit_Hero_MonkeyKing[] = [],
	techiess: C_DOTA_Unit_Hero_Techies[] = [],
	enabled = true

Events.on("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (LocalDOTAPlayer === undefined || npc === LocalDOTAPlayer.m_hAssignedHero)
		return
	if (npc instanceof C_DOTA_Unit_Hero_MonkeyKing)
		mks.push(npc)
	if (npc instanceof C_DOTA_Unit_Hero_Techies)
		techiess.push(npc)
})
Events.on("onEntityDestroyed", (npc: C_DOTA_BaseNPC) => {
	if (npc instanceof C_DOTA_Unit_Hero_MonkeyKing)
		Utils.arrayRemove(mks, npc)
	if (npc instanceof C_DOTA_Unit_Hero_Techies)
		Utils.arrayRemove(techiess, npc)
})

Events.on("onTick", () => {
	if (!enabled)
		return
	const pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero
	if (pl_ent === undefined || Utils.IsUnitStateFlagSet(pl_ent, modifierstate.MODIFIER_STATE_STUNNED) || !Utils.IsAlive(pl_ent) || LocalDOTAPlayer.m_hActiveAbility !== undefined)
		return
	if (mks.length !== 0)
		// loop-optimizer: FORWARD
		[
			Utils.GetItemByName(pl_ent, "item_quelling_blade"),
			Utils.GetItemByName(pl_ent, "item_bfury"),
			Utils.GetItemByName(pl_ent, "item_tango"),
		].filter(item => item !== undefined && item.m_fCooldown === 0).some(item => {
			if (!Utils.IsManaEnough(pl_ent, item))
				return false
			let castrange = Utils.GetCastRange(pl_ent, item)
			return mks.some(mk => {
				if (!Utils.IsVisible(mk) || !Utils.IsAlive(mk))
					return false
				let m_nPerchedTree = mk.m_nPerchedTree
				if (m_nPerchedTree === 4294967295 || mk.m_vecNetworkOrigin.Distance2D(pl_ent.m_vecNetworkOrigin) > castrange)
					return false
				Orders.CastTargetTree(pl_ent, item, m_nPerchedTree, false)
				return true
			})
		})
	let force = Utils.GetItemByName(pl_ent, "item_force_staff")
	if (force !== undefined && force.m_fCooldown === 0) {
		if (!Utils.IsManaEnough(pl_ent, force))
			return false
		let force_castrange = Utils.GetCastRange(pl_ent, force);
		[...mks, ...techiess].some(hero => {
			if (!Utils.IsVisible(hero) || !Utils.IsAlive(hero))
				return false
			if (hero.m_vecNetworkOrigin.Distance2D(pl_ent.m_vecNetworkOrigin) > force_castrange)
				return false
			if (Utils.GetBuffByName(hero, "modifier_item_forcestaff_active") !== undefined)
				return false
			if (hero instanceof C_DOTA_Unit_Hero_Techies && Utils.GetBuffByName(hero, "modifier_techies_suicide_leap") === undefined)
				return false
			if (hero instanceof C_DOTA_Unit_Hero_MonkeyKing && Utils.GetBuffByName(hero, "modifier_monkey_king_bounce_leap") === undefined)
				return false
			Orders.CastTarget(pl_ent, force, hero, false)
			return true
		})
	}
})

{
	let root = new Menu_Node("I Hate Leaps")
	root.entries.push(new Menu_Toggle (
		"State",
		enabled,
		node => enabled = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
