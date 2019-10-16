import { ArrayExtensions, Entity, ParticlesSDK, Unit, Tower, Vector3 } from "wrapper/Imports"
import { State, TowerSwitcher, TowerOnlyTarget } from "./Menu"

let Towers: Unit[] = [], 
	pars = new Map<Entity, number>(),
	TowerRange = new Map<Entity, number>()
	
export function Destroy(ent: Entity) {
	if (ArrayExtensions.arrayRemove(Towers, ent)) {
		pars.delete(ent)
		TowerRange.delete(ent)
	}
}

function DrawTarget(ent: Tower, Owner: Unit) {
	if (Owner !== undefined && ent.IsAlive) {
		ParticlesSDK.SetControlPoint(pars.get(ent), 2, ent.Position)
		ParticlesSDK.SetControlPoint(pars.get(ent), 6, new Vector3(10))
		ParticlesSDK.SetControlPoint(pars.get(ent), 7, Owner.Position)
	}
}

export function Create(ent: Entity) {
	if (ent instanceof Tower) {
		Towers.push(ent)
		if (State.value)
			CreateTowerRange(ent)
	}
}
function CreateTowerRange(ent: Tower) {
	var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	ParticlesSDK.SetControlPoint(par, 1, new Vector3(ent.AttackRange + ent.HullRadius + 25, 0, 0))
	TowerRange.set(ent, par)
}
function SwicthTowers(particle_range: number, tower: Tower) {
	if (particle_range !== undefined) {
		ParticlesSDK.Destroy(particle_range)
		TowerRange.delete(tower)
	}
}
function RemoveTarget(particle: number, tower: Tower) {
	if (particle !== undefined) {
		ParticlesSDK.Destroy(particle)
		pars.delete(tower)
	}
}
export function OnDraw() {
	if (!State.value || Towers.length <= 0) {
		return
	}
	// loop-optimizer: KEEP
	Towers.forEach((tower: Tower, i) => {
		if (tower === undefined || i === undefined) {
			return
		}
		let particle_range = TowerRange.get(tower)
		if (!TowerOnlyTarget.value) {
			switch (TowerSwitcher.selected_id) {
				case 0: 
					if(!tower.IsEnemy()) {
						SwicthTowers(particle_range, tower)
					}
					else {
						if (particle_range === undefined)
							CreateTowerRange(tower)
					}
					break
				case 1: 
					if (tower.IsEnemy()) {
						SwicthTowers(particle_range, tower)
					}
					else {
						if (particle_range === undefined)
							CreateTowerRange(tower)
					}
				break
				case 2:
					if (particle_range === undefined) {
						CreateTowerRange(tower)
					}
				break
			}
		}
		else SwicthTowers(particle_range, tower)
		State.OnValue(x => {
			if(!x.value) {
				SwicthTowers(particle_range, tower)
				RemoveTarget(particle, tower)
			}
		})
		let particle = pars.get(tower)
		if (tower.TowerAttackTarget === undefined || !tower.IsAlive ||
			tower.Distance2D(tower.TowerAttackTarget.Position) >= tower.AttackRange + tower.HullRadius + 25) {
			RemoveTarget(particle, tower)
			return
		}
		if (particle === undefined) {
			let par: number
			switch (TowerSwitcher.selected_id) {
				case 0:
					if(tower.IsEnemy()) {
						par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
					}
				break
				case 1:
					if (!tower.IsEnemy()) {
						par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
					}
				break
				case 2:
					par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
				break
			}
			if (par !== undefined)
				pars.set(tower, par)
		}
		if (pars.has(tower)) {
			DrawTarget(tower, tower.TowerAttackTarget)
		}
	})
}
export function GameEnded() {
	Towers = []
	pars.clear()
	TowerRange.clear()
}
