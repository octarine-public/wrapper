import { Vector3, RendererSDK, ArrayExtensions, Unit} from "wrapper/Imports";
import { State, DrawRGBA, Size, ComboBox } from "./Menu"
export let jungl_unit: Unit[] = [];

function RenderPosition(pos: Vector3){
	let position_unit = RendererSDK.WorldToScreen(pos),
		TextStyle: string;
	if (position_unit !== undefined) {
		switch (ComboBox.selected_id) {
			case 0: TextStyle = "•"; break;
			case 1: TextStyle = "°"; break;
			case 2: TextStyle = "⍟"; break;
			case 3: TextStyle = "★"; break;
			case 4: TextStyle = "⊛"; break;
			case 5: TextStyle = "◊"; break;
			case 6: TextStyle = "⊗"; break;
			case 7: TextStyle = "[]"; break;
		}
		//-createhero creep enemy
		RendererSDK.DrawMiniMapIcon("minimap_courier", ConVars.GetInt("dota_minimap_hero_size"),pos,DrawRGBA.Color)
		Renderer.Text(position_unit.x, position_unit.y, TextStyle,
			DrawRGBA.R.value, DrawRGBA.G.value,DrawRGBA.B.value, DrawRGBA.A.value, "Arial", Size.value)
	}
}
export function UnitAnimationCreate(unit: Unit) {
	if (!unit.IsValid || unit.IsVisible || !State.value)
		return;
	jungl_unit.push(unit)
}
export function OnDraw() {
	if (!State.value)
		return;
	jungl_unit.forEach(unit => {
		let pos = unit.Position
		if (pos.IsZero() && unit.Name !== "npc_dota_roshan" || unit.IsHero || unit.IsLaneCreep)
			return
		unit.Name !== "npc_dota_roshan" 
			? RenderPosition(pos)
			: RenderPosition(new Vector3(-2394.375, 1873.9375, 159.96875));
			
		setTimeout(() => ArrayExtensions.arrayRemove(jungl_unit, unit), 1000)
	})
}
export function GameEnded() {
	if (!State.value)
		return
	jungl_unit = [];
}