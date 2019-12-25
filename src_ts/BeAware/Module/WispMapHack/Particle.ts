import { Color, RendererSDK, Vector3, Entity } from "wrapper/Imports"
import { State } from "./Menu"

let wisp: Entity | number | undefined,
	pos = new Vector3().Invalidate(),
	par_id = -1

export function ParticleCreate(id: number, handle: BigInt) {
	if (handle === 2971384879877296313n)
		par_id = id
}

export function ParticleUpdated(id: number, ent: Entity, vector: Vector3) {
	if (id === par_id || (ent !== undefined && ent.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp && ent.IsEnemy())) {
		pos = vector
		wisp = ent as Entity | number
	}
}

export function OnDraw() {
	if (!State.value || !pos.IsValid)
		return
	let wisp_ = wisp instanceof Entity ? wisp : undefined
	if (wisp_ !== undefined && (!wisp_.IsEnemy() || wisp_.IsVisible || !wisp_.IsAlive))
		return
	RendererSDK.DrawMiniMapIcon("minimap_heroicon_npc_dota_hero_wisp", pos, 64 * 12, new Color(255, 255, 255))
	let screen_pos = RendererSDK.WorldToScreen(pos)
	if (screen_pos === undefined)
		return
	RendererSDK.Image("panorama/images/heroes/icons/npc_dota_hero_wisp_png.vtex_c", screen_pos)
}

export function Init() {
	wisp = undefined
	pos.Invalidate()
	par_id = -1
}
