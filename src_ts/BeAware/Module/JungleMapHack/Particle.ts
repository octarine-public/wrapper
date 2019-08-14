import { ArrayExtensions, Color, RendererSDK, Unit, Vector3} from "wrapper/Imports"
import { ComboBox, DrawRGBA, Size, State } from "./Menu"
export let jungl_unit: Unit[] = []

function RenderPosition(pos: Vector3) {
	let position_unit = RendererSDK.WorldToScreen(pos),
		TextStyle: string
	RendererSDK.DrawMiniMapIcon("minimap_creep", pos, 500, DrawRGBA.Color)
	if (position_unit === undefined)
		return
	switch (ComboBox.selected_id) {
		case 0:
			TextStyle = "•"
			break
		case 1:
			TextStyle = "°"
			break
		case 2:
			TextStyle = "⍟"
			break
		case 3:
			TextStyle = "★"
			break
		case 4:
			TextStyle = "⊛"
			break
		case 5:
			TextStyle = "◊"
			break
		default:
		case 6:
			TextStyle = "⊗"
			break
		case 7:
			TextStyle = "[]"
			break
	}
	// -createhero k_drag enemy
	RendererSDK.Text (
		TextStyle,
		position_unit,
		new Color (
			DrawRGBA.R.value,
			DrawRGBA.G.value,
			DrawRGBA.B.value,
			DrawRGBA.A.value,
		),
		"Arial",
		Size.value,
	)
}
export function UnitAnimationCreate(unit: Unit) {
	if (!unit.IsValid || unit.IsVisible || !State.value)
		return
	jungl_unit.push(unit)
}
export function OnDraw() {
	if (!State.value)
		return
	jungl_unit.forEach(unit => {
		let pos = unit.Name !== "npc_dota_roshan" ? unit.Position : new Vector3(-2394.375, 1873.9375, 159.96875)
		if (pos.IsZero() || unit.IsHero || unit.IsLaneCreep)
			return
		RenderPosition(pos)

		setTimeout(() => ArrayExtensions.arrayRemove(jungl_unit, unit), 2000)
	})
}
export function GameEnded() {
	if (!State.value)
		return
	jungl_unit = []
}
