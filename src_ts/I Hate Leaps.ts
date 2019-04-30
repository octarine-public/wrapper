import * as Orders from "Orders"
import * as Utils from "Utils"

let mks: C_DOTA_Unit_Hero_MonkeyKing[] = [],
	techiess: C_DOTA_Unit_Hero_Techies[] = [],
	enabled = true

Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (npc === LocalDOTAPlayer.m_hAssignedHero)
		return
	if (npc instanceof C_DOTA_Unit_Hero_MonkeyKing)
		mks.push(npc)
	if (npc instanceof C_DOTA_Unit_Hero_Techies)
		techiess.push(npc)
})
Events.addListener("onEntityDestroyed", (npc: C_DOTA_BaseNPC) => {
	if (npc instanceof C_DOTA_Unit_Hero_MonkeyKing)
		Utils.arrayRemove(mks, npc)
	if (npc instanceof C_DOTA_Unit_Hero_Techies)
		Utils.arrayRemove(techiess, npc)
})

Events.addListener("onTick", () => {
	if (!enabled)
		return
	const pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero
	if (pl_ent === undefined || pl_ent.m_bIsStunned || !pl_ent.m_bIsAlive || LocalDOTAPlayer.m_hActiveAbility !== undefined)
		return
	if (mks.length !== 0)
		// loop-optimizer: FORWARD
		[
			pl_ent.GetItemByName("item_quelling_blade"),
			pl_ent.GetItemByName("item_bfury"),
			pl_ent.GetItemByName("item_tango"),
		].filter(item => item !== undefined && item.m_fCooldown === 0).some(item => {
			if (!item.IsManaEnough(pl_ent))
				return false
			let castrange = Utils.GetCastRange(pl_ent, item)
			return mks.some(mk => {
				if (!mk.m_bIsVisible || !mk.m_bIsAlive)
					return false
				let m_nPerchedTree = mk.m_nPerchedTree
				if (m_nPerchedTree === 4294967295 || mk.DistTo2D(pl_ent) > castrange)
					return false
				Orders.CastTargetTree(pl_ent, item, m_nPerchedTree, false)
				return true
			})
		})
	let force = pl_ent.GetItemByName("item_force_staff")
	if (force !== undefined && force.m_fCooldown === 0) {
		if (!force.IsManaEnough(pl_ent))
			return false
		let force_castrange = Utils.GetCastRange(pl_ent, force);
		[...mks, ...techiess].some(hero => {
			if (!hero.m_bIsVisible || !hero.m_bIsAlive)
				return false
			if (hero.DistTo2D(pl_ent) > force_castrange)
				return false
			if (hero.GetBuffByName("modifier_item_forcestaff_active") !== undefined)
				return false
			if (hero instanceof C_DOTA_Unit_Hero_Techies && hero.GetBuffByName("modifier_techies_suicide_leap") === undefined)
				return false
			if (hero instanceof C_DOTA_Unit_Hero_MonkeyKing && hero.GetBuffByName("modifier_monkey_king_bounce_leap") === undefined)
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
