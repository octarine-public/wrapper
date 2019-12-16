import { Color, RendererSDK, Unit, FontFlags_t } from "wrapper/Imports"
import { DrawTextSize, Swhicher } from "./Menu"
import { Units } from "./Listeners"

function DrawText(unit: Unit): boolean {
	if (!unit.IsAlive || !unit.IsControllable || !unit.IsVisible || !(Swhicher.selected_id !== 1 && !unit.IsHero))
		return
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return false

	RendererSDK.Text("Feed", position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
	return true
}
export function Renderer() {
	Units.forEach(DrawText)
}