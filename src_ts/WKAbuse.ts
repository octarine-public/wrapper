import { EntityManager, EventsSDK, Game, LocalPlayer, Unit } from "./wrapper/Imports"

var enabled = false,
	doingTP = false

EventsSDK.on("Tick", () => {
	if (!enabled || doingTP || !LocalPlayer.HeroAssigned)
		return
	var MyEnt = LocalPlayer.Hero
	if (!MyEnt.IsAlive) return
	var buff = MyEnt.GetBuffByName("modifier_skeleton_king_reincarnation_scepter_active"),
		tp = MyEnt.GetItemByName(/item_(tpscroll|travel_boots)/),
		bkb = MyEnt.GetItemByName("item_black_king_bar"),
		waitTime = 1 + (bkb === undefined ? 1 : 2) / 30
	if (buff === undefined || tp === undefined || tp.Cooldown > 0 || buff.DieTime - Game.RawGameTime - (Math.max(Game.RawGameTime - tp.ChannelStartTime, 0) + waitTime) > 1 / 30) return
	doingTP = true
	MyEnt.CastNoTarget(bkb, false)
	var fountain = EntityManager.AllEntities.filter(ent =>
		!ent.IsEnemy()
		&& ent instanceof Unit
		&& ent.Name === "dota_fountain",
	)[0]
	MyEnt.CastPosition(tp, fountain.NetworkPosition, false)
	setTimeout(() => doingTP = false, (waitTime + GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000 + 30)
})

{
	let root = new Menu_Node("WK Abuse")
	root.entries.push(new Menu_Toggle("State", false, toggle => enabled = toggle.value))
	root.Update()
	Menu.AddEntry(root)
}
