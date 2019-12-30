import { Color, RendererSDK, Unit, FontFlags_t } from "wrapper/Imports"
import { DrawTextSize, SwitchUnit } from "./Menu"
import { Units, filterUnits } from "./Listeners"

function DrawText(unit: Unit) {
	if (!filterUnits(unit) || !unit.IsVisible || (SwitchUnit.selected_id !== 1 && !unit.IsHero))
		return
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return
	RendererSDK.Text("Feeding" + (unit.HasBuffByName("modifier_teleporting") ? ": teleporting..." : ""),
		position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
}
export function Renderer() {
	Units.forEach(DrawText)
}
