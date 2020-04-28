import { Color, RendererSDK, Vector3, Entity, npc_dota_hero_wisp, EntityManager } from "wrapper/Imports"
import { State } from "./Menu"

let wisp: Entity | number | undefined,
	pos = new Vector3().Invalidate(),
	par_id = -1,
	guaranteed_hero = false

export function ParticleCreated(id: number, handle: BigInt) {
	if (handle === 2971384879877296313n)
		par_id = id
}

export function ParticleUpdated(id: number, ent: Nullable<Entity | number>, vector: Vector3) {
	if (id === par_id || (par_id === -1 && (ent === wisp || (ent instanceof npc_dota_hero_wisp && ent.IsEnemy())))) {
		pos = vector
		wisp = ent as Entity | number
	}
}

export function GameEvent(name: string, obj: any) {
	if (name !== "dota_on_hero_finish_spawn" || obj.hero !== "npc_dota_hero_wisp")
		return
	let ent_id = obj.heroindex as number
	wisp = EntityManager.EntityByIndex(ent_id) ?? ent_id
	guaranteed_hero = true
}

export function OnDraw() {
	if (!State.value || !pos.IsValid)
		return

	if (typeof wisp !== "number" || !guaranteed_hero) {
		let wisp_ = wisp instanceof Entity ? wisp : undefined
		if (wisp_ !== undefined && (!wisp_.IsEnemy() || wisp_.IsVisible || !wisp_.IsAlive))
			return
	}
	RendererSDK.DrawMiniMapIcon("minimap_heroicon_npc_dota_hero_wisp", pos, 64 * 12, new Color(255, 255, 255))
	let screen_pos = RendererSDK.WorldToScreen(pos)
	if (screen_pos === undefined)
		return
	RendererSDK.Image("panorama/images/heroes/icons/npc_dota_hero_wisp_png.vtex_c", screen_pos)
}

export function Init() {
	wisp = undefined
	guaranteed_hero = false
	pos.Invalidate()
	par_id = -1
}
