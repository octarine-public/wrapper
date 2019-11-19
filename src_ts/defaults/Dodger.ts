import { EntityManager, EventsSDK, Game, LinearProjectile, ProjectileManager, TrackingProjectile, Unit, Vector3 } from "wrapper/Imports"

// menu
/* const DodgerMenu = Menu.AddEntry("Dodger");
const stateMain = DodgerMenu.AddToggle("State", false); */

let enabled = false

function Dodge(pl_ent: Unit, delay: number, target_pos?: Vector3, aoe: number = 0) {
	pl_ent.AbilitiesBook.GetSpell(2).UseAbility()
}

function TryDodge(pl_ent: Unit, proj: TrackingProjectile | LinearProjectile) {
	if (proj instanceof TrackingProjectile) {
		switch (proj.ParticlePath) {
			case "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf":
				let positionProj = proj.TargetLoc
				if (positionProj.Distance2D(pl_ent.Position) <= 200 + pl_ent.HullRadius)
					Dodge(pl_ent, positionProj.Distance(proj.Position) / proj.Speed, positionProj, 200)
				break
			default:
				break
		}
	} else if (proj instanceof LinearProjectile)
		console.log(proj.ParticlePath)
}

EventsSDK.on("Tick", () => {
	if (!enabled /* stateMain.value */ || !Game.IsInGame)
		return

	let pl_ent = EntityManager.LocalHero
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	// loop-optimizer: KEEP
	ProjectileManager.AllTrackingProjectiles.forEach(proj => TryDodge(pl_ent, proj))
	// loop-optimizer: KEEP
	ProjectileManager.AllLinearProjectiles.forEach(proj => TryDodge(pl_ent, proj))
})
EventsSDK.on("TrackingProjectileCreated", proj => {
	if (!enabled /* stateMain.value */  || !Game.IsInGame)
		return
	let pl_ent = EntityManager.LocalHero
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	TryDodge(pl_ent, proj)
})
EventsSDK.on("LinearProjectileCreated", proj => {
	if (!enabled /* stateMain.value */ || !Game.IsInGame)
		return
	let pl_ent = EntityManager.LocalHero
	if (pl_ent === undefined || pl_ent.IsWaitingToSpawn || pl_ent.IsStunned)
		return
	TryDodge(pl_ent, proj)
})
