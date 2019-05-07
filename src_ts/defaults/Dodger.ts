import * as Orders from "Orders"
import * as Utils from "Utils"

var proj2path: string[] = [],
	proj_list: Array<TrackingProjectile | LinearProjectile> = [],
	enabled = false

function DeleteProjectile(proj: TrackingProjectile | LinearProjectile) {
	Utils.arrayRemove(proj_list, proj)
}

function Dodge(pl_ent: C_DOTA_BaseNPC, delay: number, target_pos?: Vector, aoe: number = 0) {
	Orders.CastNoTarget(pl_ent, pl_ent.GetAbility(2))
}

function TryDodge(pl_ent: C_DOTA_BaseNPC, proj: TrackingProjectile | LinearProjectile) {
	let path = proj2path[(proj instanceof TrackingProjectile ? 1024 : 0) + proj.m_iID]
	if (path === undefined || !proj.m_bIsValid) {
		DeleteProjectile(proj)
		return
	}
	if (proj instanceof TrackingProjectile) {
		switch (path) {
			case "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf":
				if (proj.m_vecTarget.Distance2D(pl_ent.m_vecNetworkOrigin) <= 200 + pl_ent.m_flHullRadius)
					Dodge(pl_ent, proj.m_vecTarget.Distance(proj.m_vecPosition) / proj.m_iSpeed, proj.m_vecTarget, 200)
				break
			default:
				break
		}
	} else if (proj instanceof LinearProjectile)
		console.log(path)
}

Events.on("onTick", () => {
	if (!enabled || !IsInGame())
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || !pl_ent.m_bIsValid || pl_ent.m_bIsWaitingToSpawn || pl_ent.m_bIsStunned)
		return
	// loop-optimizer: KEEP
	proj_list.forEach(proj => TryDodge(pl_ent, proj))
})
Events.on("onTrackingProjectileCreated", (proj, sourceAttachment, path) => {
	if (!enabled || !IsInGame())
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || !pl_ent.m_bIsValid || pl_ent.m_bIsWaitingToSpawn || pl_ent.m_bIsStunned)
		return
	proj2path[1024 + proj.m_iID] = path
	proj_list.push(proj)
	TryDodge(pl_ent, proj)
})
Events.on("onLinearProjectileCreated", (proj, origin, velocity, ent, path) => {
	if (!enabled || !IsInGame())
		return
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || !pl_ent.m_bIsValid || pl_ent.m_bIsWaitingToSpawn || pl_ent.m_bIsStunned)
		return
	proj2path[proj.m_iID] = path
	proj_list.push(proj)
	TryDodge(pl_ent, proj)
})
Events.on("onTrackingProjectileDestroyed", DeleteProjectile)
Events.on("onLinearProjectileDestroyed", DeleteProjectile)
