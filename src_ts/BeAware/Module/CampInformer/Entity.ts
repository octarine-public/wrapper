import { Color, Creep, RendererSDK, Vector2, EntityManager, Team, LocalPlayer } from "wrapper/Imports"
import { alpha, ComboBox, Size, State, OtimizeState, OtimizeSlider } from "./Menu"
let allNeutrals: Creep[] = []
export function Tick() {
	if (!State.value)
		return
	allNeutrals = EntityManager.GetEntitiesByClass(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
		.filter(x => !x.IsLaneCreep && x.Team === Team.Neutral && (OtimizeState.value && LocalPlayer!.Hero?.IsInRange(x, OtimizeSlider.value)))
}
export function OnDraw() {
	if (!State.value)
		return
	if (allNeutrals.map(creep => {
		let isWaitSpawn = creep.IsWaitingToSpawn
		if (!isWaitSpawn && (!creep.IsAlive || creep.IsVisible))
			return false
		let wts = RendererSDK.WorldToScreen(creep.Position)
		if (wts === undefined)
			return false
		switch (ComboBox.selected_id) {
			case 0:
				let name = creep.Name.replace("npc_dota_neutral_", "").split("_").join(" ")
				RendererSDK.Text(name, wts, new Color(0, isWaitSpawn ? 0 : 255, isWaitSpawn ? 255 : 0, alpha.value),
					"Arial", Size.value)
				break
			case 1:
				RendererSDK.Image(
					`panorama/images/heroes/${creep.Name}_png.vtex_c`,
					wts.SubtractScalar(Size.value / 4),
					-1,
					new Vector2(Size.value / 2, Size.value / 2),
					new Color(255, 255, 255, alpha.value)
				)
				break
		}
		return true
	}))
		return
}

export function Init() {
	allNeutrals = []
}
