import { MenuManager, EventsSDK, Game, Vector3, Unit, Player, EntityManager, ArrayExtensions } from "../CrutchesSDK/Imports";

// menu 
/* const DodgerMenu = MenuManager.MenuFactory("Dodger");
const stateMain = DodgerMenu.AddToggle("State", false); */

let enabled = false;

//import * as Orders from "Orders"
//import * as Utils from "Utils"

var proj2path: string[] = [],
	proj_list: Array<TrackingProjectile | LinearProjectile> = [];

function DeleteProjectile(proj: TrackingProjectile | LinearProjectile) {
	ArrayExtensions.arrayRemove(proj_list, proj)
}

function Dodge(pl_ent: Unit, delay: number, target_pos?: Vector3, aoe: number = 0) {
	pl_ent.AbilitiesBook.GetSpell(2).UseAbility();
}

function TryDodge(pl_ent: Unit, proj: TrackingProjectile | LinearProjectile) {
	let path = proj2path[(proj instanceof TrackingProjectile ? 1024 : 0) + proj.m_iID]
	if (path === undefined || !proj.m_bIsValid) {
		DeleteProjectile(proj)
		return
	}
	if (proj instanceof TrackingProjectile) {
		switch (path) {
			case "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf":
				let positionProj = Vector3.fromIOBuffer(proj.m_vecTarget);
				if (positionProj.Distance2D(pl_ent.NetworkPosition) <= 200 + pl_ent.HullRadius)
					Dodge(pl_ent, positionProj.Distance(Vector3.fromIOBuffer(proj.m_vecPosition)) / proj.m_iSpeed, positionProj, 200)
				break
			default:
				break
		}
	} else if (proj instanceof LinearProjectile)
		console.log(path)
}

EventsSDK.on("onTick", () => {
	if (!enabled/* stateMain.value */ || !Game.IsInGame)
		return
		
	let pl_ent = EntityManager.LocalHero;
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	// loop-optimizer: KEEP
	proj_list.forEach(proj => TryDodge(pl_ent, proj))
})
Events.on("onTrackingProjectileCreated", (proj, sourceAttachment, path) => {
	if (!enabled/* stateMain.value */  || !Game.IsInGame)
		return
	let pl_ent = EntityManager.LocalHero;
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	proj2path[1024 + proj.m_iID] = path
	proj_list.push(proj)
	TryDodge(pl_ent, proj)
})
Events.on("onLinearProjectileCreated", (proj, ent, path) => {
	if (!enabled/* stateMain.value */ || !Game.IsInGame)
		return
	let pl_ent = EntityManager.LocalHero;
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	proj2path[proj.m_iID] = path
	proj_list.push(proj)
	TryDodge(pl_ent, proj)
})
Events.on("onTrackingProjectileDestroyed", DeleteProjectile)
Events.on("onLinearProjectileDestroyed", DeleteProjectile)
