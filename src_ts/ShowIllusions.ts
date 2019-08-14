import { ArrayExtensions, Color, EventsSDK, Game, Hero, MenuManager, RendererSDK, Vector2 } from "wrapper/Imports"

var heroes: Hero[] = []

const Menu = MenuManager.MenuFactory("Show Illusions"),
	illus_color = new Color(0, 0, 255),
	stateMain = Menu.AddToggle("State", true)

EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& npc.IsIllusion
	)
		heroes.push(npc)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame)
		return

	heroes.forEach(hero => {
		illus_color.toIOBuffer() // set IOBuffer frmm color
		hero.m_pBaseEntity.m_nRenderMode = RenderMode_t.kRenderTransColor
		hero.m_pBaseEntity.m_clrRender = true // set from IOBuffer
		hero.m_pBaseEntity.OnColorChanged()
	})
})
