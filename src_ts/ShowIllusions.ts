import { Color, EventsSDK, Game, Hero, LocalPlayer, Menu as MenuSDK, EntityManager } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Visual", "Show Illusions"]),
	illus_color = new Color(0, 0, 255),
	stateMain = Menu.AddToggle("State", true)

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !Game.IsInGame || LocalPlayer === undefined || LocalPlayer.IsSpectator)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(illus => {
		if (!illus.IsIllusion || !illus.IsEnemy())
			return
		illus_color.toIOBuffer() // set IOBuffer frmm color
		illus.m_pBaseEntity.m_nRenderMode = RenderMode_t.kRenderTransColor
		illus.m_pBaseEntity.m_clrRender = true // set from IOBuffer
		illus.m_pBaseEntity.OnColorChanged()
	})
})
