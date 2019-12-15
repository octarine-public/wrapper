import { Color, RendererSDK, Unit, FontFlags_t, EntityManager, Hero, Creep, Courier } from "wrapper/Imports"
import { DrawTextSize, Swhicher } from "./Menu"
function DrawText(unit: Unit): boolean {
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return false

	RendererSDK.Text("Feed", position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
	return true
}
export function Renderer() {
	let Units = EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Courier], DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
	if (Units.length <= 0)
		return
	Units.filter(x =>
		x.IsAlive
		&& x.IsControllable
		&& x.IsVisible
		&& !(Swhicher.selected_id !== 1 && !x.IsHero)
	).forEach(DrawText)
}