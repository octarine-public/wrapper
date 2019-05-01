import * as Orders from "Orders"
import * as Utils from "Utils"

var enabled = false,
	doingTP = false

Events.addListener("onTick", () => {
	if (!enabled || doingTP || LocalDOTAPlayer.m_hAssignedHero === undefined)
		return
	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (!MyEnt.m_bIsAlive) return
	var buff = MyEnt.GetBuffByName("modifier_skeleton_king_reincarnation_scepter_active"),
		tp = Utils.GetItemByRegexp(MyEnt, /item_(tpscroll|travel_boots)/),
		bkb = MyEnt.GetItemByName("item_black_king_bar"),
		waitTime = 1 + (bkb === undefined ? 1 : 2) / 30
	if (buff === undefined || tp === undefined || tp.m_fCooldown > 0 || buff.m_flDieTime - GameRules.m_fGameTime - (tp.m_fChannelTime + waitTime) > 1 / 30) return
	doingTP = true
	Orders.CastNoTarget(MyEnt, bkb, false)
	// loop-optimizer: POSSIBLE_UNDEFINED
	var fountain = Entities.GetAllEntities().filter(ent =>
		!ent.IsEnemy(LocalDOTAPlayer)
		&& ent instanceof C_DOTA_BaseNPC
		&& ent.m_iszUnitName === "dota_fountain",
	)[0]
	Orders.CastPosition(MyEnt, tp, fountain.m_vecNetworkOrigin, false)
	setTimeout((waitTime + GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 + 30, () => doingTP = false)
})

{
	let root = new Menu_Node("WK Abuse")
	root.entries.push(new Menu_Toggle("State", false, toggle => enabled = toggle.value))
	root.Update()
	Menu.AddEntry(root)
}
