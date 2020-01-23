import { Color, EventsSDK, GameRules, Hero, LocalPlayer, Menu as MenuSDK, EntityManager } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Visual", "Show Illusions"]),
	illus_color = new Color(0, 0, 255),
	stateMain = Menu.AddToggle("State", true)

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !GameRules?.IsInGame || LocalPlayer === undefined || LocalPlayer.IsSpectator)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(illus => {
		let native_entity = illus.NativeEntity
		if (!illus.IsIllusion || !illus.IsEnemy() || native_entity === undefined)
			return
		illus_color.toIOBuffer() // set IOBuffer frmm color
		native_entity.m_nRenderMode = RenderMode_t.kRenderTransColor
		native_entity.m_clrRender = true // set from IOBuffer
		native_entity.OnColorChanged()
	})
})
