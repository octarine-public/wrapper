import { ArrayExtensions, Color, Creep, Entity, RendererSDK, Team, Vector2 } from "wrapper/Imports"
import { alpha, ComboBox, Size, State } from "./Menu"
let allNeutrals: Creep[] = []

export function onEntityAdded(ent: Entity) {
	if (ent instanceof Creep && !ent.IsLaneCreep && ent.Team === Team.Neutral)
		allNeutrals.push(ent)
}

export function EntityDestroyed(ent: Entity) {
	if (ent instanceof Creep)
		ArrayExtensions.arrayRemove(allNeutrals, ent)
}

export function OnDraw() {
	if (!State.value)
		return
	allNeutrals.forEach(creep => {
		let isWaitSpawn = creep.IsWaitingToSpawn
		if ((!isWaitSpawn && creep.IsVisible))
			return
		let wts = RendererSDK.WorldToScreen(creep.Position)
		if (wts !== undefined) {
			switch (ComboBox.selected_id) {
				case 0:
					let name = creep.Name.replace("npc_dota_neutral_", "").split("_").join(" ")
					RendererSDK.Text(name, wts, new Color(0, isWaitSpawn ? 0 : 255, isWaitSpawn ? 255 : 0, alpha.value),
						"Arial", new Vector2(Size.value, 200))
					break
				case 1:
					RendererSDK.Image(`panorama/images/heroes/${creep.Name}_png.vtex_c`,
						wts.SubtractScalar(Size.value / 4),
						new Vector2(Size.value / 2, Size.value / 2), new Color(255, 255, 255, alpha.value))
					break
				default:
					break
			}
		}
	})
}

export function GameEnded() {
	allNeutrals = []
}
