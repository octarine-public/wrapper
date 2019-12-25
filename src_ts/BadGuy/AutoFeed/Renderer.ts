import { Color, RendererSDK, Unit, FontFlags_t } from "wrapper/Imports"
import { DrawTextSize, SwitchUnit } from "./Menu"
import { Units } from "./Listeners"

function DrawText(unit: Unit): boolean {
	if (!unit.IsAlive || !unit.IsControllable || !unit.IsVisible || (SwitchUnit.selected_id !== 1 && !unit.IsHero))
		return
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return
	RendererSDK.Text("Feed", position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
}
export function Renderer() {
	Units.forEach(DrawText)
}