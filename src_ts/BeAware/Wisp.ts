import { Vector3, EntityManager, RendererSDK, Game } from "wrapper/Imports";

let wisp: C_DOTA_Unit_Hero_Wisp | number,
	pos = new Vector3().Invalidate(),
	par_id = -1;

Events.on("ParticleCreated", (id, path, handle) => {
	if (handle === 2971384879877296313n)
		par_id = id;
});

Events.on("ParticleUpdatedEnt", (id, cp, ent) => {
	if (id === par_id || !(ent instanceof C_BaseEntity) || ent instanceof C_DOTA_Unit_Hero_Wisp) {
		pos = Vector3.fromIOBuffer();
		wisp = ent as C_DOTA_Unit_Hero_Wisp | number;
	}
});

Events.on("GameEnded", () => {
	wisp = undefined;
	pos.Invalidate();
	par_id = -1;
})

Events.on("Draw", () => {
	if (!pos.IsValid || !Game.IsInGame)
		return;
	let wisp_ = wisp instanceof C_BaseEntity ? EntityManager.GetEntityByNative(wisp) : undefined;
	if (wisp_ !== undefined && (!wisp_.IsEnemy() || wisp_.IsVisible || !wisp_.IsAlive))
		return;
	let screen_pos = RendererSDK.WorldToScreen(pos);
	if (screen_pos === undefined)
		return;
	RendererSDK.Image("panorama/images/heroes/icons/npc_dota_hero_wisp_png.vtex_c", screen_pos);
})
