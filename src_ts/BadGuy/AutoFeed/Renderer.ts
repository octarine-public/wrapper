import { Color, RendererSDK, Unit } from "wrapper/Imports";
import { AllUnits } from "../Base/ListenersBase";
import { DrawTextSize, Swhicher } from "./Menu";

function DrawText(unit: Unit): boolean {
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined)
		return false

	RendererSDK.Text("Feed", position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
	return true
}
export function Renderer() {
	if (AllUnits.length <= 0)
		return

	AllUnits.filter(x =>
		x.IsAlive
		&& x.IsControllable
		&& x.IsVisible
		&& !(Swhicher.selected_id !== 1 && !x.IsHero)
	).forEach(DrawText)
}