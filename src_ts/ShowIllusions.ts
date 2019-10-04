import { ArrayExtensions, Color, EventsSDK, Game, Hero, Menu as MenuSDK, LocalPlayer } from "wrapper/Imports"

var illusions: Hero[] = []

const Menu = MenuSDK.AddEntry(["Utility", "Show Illusions"]),
	illus_color = new Color(0, 0, 255),
	stateMain = Menu.AddToggle("State", true)

EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsIllusion
	)
		illusions.push(npc)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(illusions, ent)
})

EventsSDK.on("Draw", () => {
	if (LocalPlayer === undefined) {
		return false
	}
	if (!stateMain.value || !Game.IsInGame || LocalPlayer.IsSpectator) {
		return false
	}
	illusions.forEach(illus => {
		if (!illus.IsEnemy())
			return
		illus_color.toIOBuffer() // set IOBuffer frmm color
		illus.m_pBaseEntity.m_nRenderMode = RenderMode_t.kRenderTransColor
		illus.m_pBaseEntity.m_clrRender = true // set from IOBuffer
		illus.m_pBaseEntity.OnColorChanged()
	})
})
