import { AllUnits } from "../Base/ListenersBase";
import { DrawTextSize, Swhicher } from "./Menu";
import { RendererSDK, Unit, Color } from "wrapper/Imports";

function DrawText(unit: Unit): boolean {
	let position_unit = RendererSDK.WorldToScreen(unit.Position)
	if (position_unit === undefined) {
		return false
	}
	RendererSDK.Text("Feed", position_unit, new Color(255, 255, 255), "Calibri", DrawTextSize.value, FontFlags_t.ANTIALIAS)
	return true
}
export function Renderer() {
	if (AllUnits.length <= 0) {
		return
	}
	// loop-optimizer: FORWARD
	let units = AllUnits.filter(x => x !== undefined && x.IsAlive && x.IsControllable)
	// loop-optimizer: FORWARD
	units.filter(x => {
		if (!x.IsVisible) {
			return false
		}
		switch (Swhicher.selected_id) {
			case 0: return x.IsHero && DrawText(x)
			case 1: return DrawText(x)
		}
	})
}