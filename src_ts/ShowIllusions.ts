import { Color, EventsSDK, GameRules, Hero, LocalPlayer, Menu as MenuSDK, EntityManager, RendererSDK, Vector2 } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Visual", "Show Illusions"])
const stateMain = Menu.AddToggle("State", true)
const deleteIllusion = Menu.AddToggle("Invisible illusions")
	.SetTooltip("Invisible illusions & draw circle pos")
const MenuColor = Menu.AddColorPicker("Color", new Color(0, 0, 160, 255))

EventsSDK.on("Draw", () => {
	if (!stateMain.value || !GameRules?.IsInGame || LocalPlayer === undefined || LocalPlayer.IsSpectator)
		return
	EntityManager.GetEntitiesByClass(Hero).forEach(illus => {
		if (!illus.IsIllusion || !illus.IsEnemy() || !illus.IsAlive)
			return

		if (!deleteIllusion.value)
			MenuColor.Color.toIOBuffer() // set IOBuffer frmm color

		if (deleteIllusion.value) {
			let pos = RendererSDK.WorldToScreen(illus.Position)
			if (pos === undefined)
				return
			RendererSDK.FilledCircle(pos, new Vector2(illus.HullRadius, illus.HullRadius), Color.Yellow)
			RendererSDK.OutlinedCircle(pos, new Vector2(illus.HullRadius, illus.HullRadius), Color.Orange)
		}

		SetEntityColor(illus.Index, !deleteIllusion.value
			? RenderMode_t.kRenderTransColor
			: RenderMode_t.kRenderDevVisualizer
		)
	})
})
