import { Color, EventsSDK, GameRules, Hero, LocalPlayer, Menu as MenuSDK, EntityManager } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Visual", "Show Illusions"])
const MenuColor = Menu.AddColorPicker("Color", new Color(0, 0, 160, 255)),
	stateMain = Menu.AddToggle("State", true)

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !GameRules?.IsInGame || LocalPlayer === undefined || LocalPlayer.IsSpectator)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(illus => {
		if (!illus.IsIllusion || !illus.IsEnemy())
			return
		MenuColor.Color.toIOBuffer() // set IOBuffer frmm color
		SetEntityColor(illus.Index, RenderMode_t.kRenderTransColor)
	})
})
