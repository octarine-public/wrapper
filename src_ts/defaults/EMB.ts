import * as Utils from "Utils"

var enabled = true,
	manabars: C_DOTA_BaseNPC_Hero[] = [],
	heroes: C_DOTA_BaseNPC_Hero[] = []

Events.on("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (
		npc instanceof C_DOTA_BaseNPC_Hero
		&& npc.IsEnemy(LocalDOTAPlayer)
		&& !npc.m_bIsIllusion
		&& npc.m_hReplicatingOtherHeroModel === undefined
	)
		heroes.push(npc)
})
Events.on("onEntityDestroyed", ent => {
	if (ent instanceof C_DOTA_BaseNPC_Hero)
		Utils.arrayRemove(heroes, ent)
})

Events.on("onUpdate", () => {
	if (!enabled || IsPaused())
		return
	manabars = heroes.filter(npc => npc.m_bIsAlive && npc.m_bIsVisible)
})
Events.on("onDraw", () => {
	if (!enabled || !IsInGame())
		return
	var off_x = 0, off_y, manabar_w, manabar_h
	{ // TODO: multiple aspect ratio support (current: 16:10)
		var screen_size = Renderer.WindowSize
		off_x = screen_size.x * -0.03095
		off_y = screen_size.y * -0.01715
		manabar_w = screen_size.x * 0.0583
		manabar_h = screen_size.y * 0.0067
	}
	manabars.forEach(hero => {
		var hero_pos = hero.m_pGameSceneNode.m_vecAbsOrigin
		var render_pos = Renderer.WorldToScreen(new Vector(hero_pos.x, hero_pos.y, hero_pos.z + hero.m_iHealthBarOffset))

		if (!render_pos.IsValid)
			return
		Renderer.FilledRect(render_pos.x + off_x, render_pos.y + off_y, manabar_w, manabar_h, 0, 0, 0) // black background
		Renderer.FilledRect(render_pos.x + off_x, render_pos.y + off_y, manabar_w * (hero.m_flMana / hero.m_flMaxMana), manabar_h, 0, 0, 0xFF)
	})
})

{
	let root = new Menu_Node("EnemyManaBars")
	root.entries.push(new Menu_Toggle (
		"State",
		enabled,
		node => enabled = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
