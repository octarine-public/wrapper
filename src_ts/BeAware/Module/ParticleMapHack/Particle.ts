// import { Vector3, RendererSDK, EntityManager, Entity } from "wrapper/Imports";

// let Hero: C_BaseEntity | C_DOTA_Unit_Hero_Wisp,
// 	pos = new Vector3().Invalidate(),
// 	par_id = -1,
// 	par_id_n = [];

// export function ParticleUpdated(id: number, ent: C_BaseEntity) {
// 	if (id === par_id) {
// 		pos = Vector3.fromIOBuffer();
// 		Hero = ent as C_BaseEntity | C_DOTA_Unit_Hero_Wisp;
// 		console.log(par_id)
// 	}
// }
// export function ParticleCreate(id: number, handle: BigInt, target: C_BaseEntity) {
// 	switch (handle) {
// 		// wisp
// 		case 2971384879877296313n:
// 		// // invoker
// 		// case 5077511336076212576n:
// 		// case 8966909212642600721n:
// 		// case 16068608692953167828n:
// 		// // bounty hanter
// 		// case 6989698579171478207n:
// 		// // mirana leap 
// 		// case 15115639205087631833n:
// 		// // mirana moon
// 		// case 15874864990078876431n:
// 		// // monkey king form revert
// 		// case 15874864990078876431n:
// 		// // scroll
// 		//case 14739391071850926756n:	
// 			par_id = id;
// 		break;
// 	}
// }

// export function OnDraw() {
// 	let Hero_ = Hero instanceof C_BaseEntity ? EntityManager.GetEntityByNative(Hero) : undefined;
// 	if (Hero_ !== undefined && (!Hero_.IsEnemy() || Hero_.IsVisible || !Hero_.IsAlive))
// 		return;
// 	pos.toIOBuffer()
// 	let screen_pos = RendererSDK.WorldToScreen(pos);
// 	if (screen_pos === undefined)
// 		return;
// 	RendererSDK.Image(`panorama/images/heroes/icons/${Hero_.Name}_png.vtex_c`, screen_pos);
// }
// export function GameEnded() {
// 	Hero = undefined;
// 	pos.Invalidate();
// 	par_id = -1;
// }










