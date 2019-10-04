import { Color, EntityManager, RendererSDK, Vector3} from "wrapper/Imports"
import { State } from "./Menu"

let wisp: C_DOTA_Unit_Hero_Wisp | number,
	pos = new Vector3().Invalidate(),
	par_id = -1

export function ParticleCreate(id: number, handle: BigInt) {
	if (!State.value)
		return
	if (handle === 2971384879877296313n)
		par_id = id
}
export function ParticleUpdated(id: number, ent: C_BaseEntity) {
	if (!State.value)
		return
	if (id === par_id || ent instanceof C_DOTA_Unit_Hero_Wisp) {
		pos = Vector3.fromIOBuffer()
		wisp = ent as C_DOTA_Unit_Hero_Wisp | number
	}
}
export function OnDraw() {
	if (!State.value || !pos.IsValid)
		return
	let wisp_ = wisp instanceof C_BaseEntity ? EntityManager.GetEntityByNative(wisp) : undefined
	if (wisp_ !== undefined && (!wisp_.IsEnemy() || wisp_.IsVisible || !wisp_.IsAlive))
		return
	RendererSDK.DrawMiniMapIcon("minimap_heroicon_npc_dota_hero_wisp", pos, 64 * 12, new Color(255, 255, 255))
	let screen_pos = RendererSDK.WorldToScreen(pos)
	if (screen_pos === undefined)
		return
	RendererSDK.Image("panorama/images/heroes/icons/npc_dota_hero_wisp_png.vtex_c", screen_pos)
}
export function GameEnded() {
	if (!State.value)
		return
	wisp = undefined
	pos.Invalidate()
	par_id = -1
}
export function GameStarted() {
	if(wisp !== undefined) {
		wisp = undefined
	}
}
