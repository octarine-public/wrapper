import { Entity, ParticlesSDK, Tower, Unit, Vector3, EntityManager } from "wrapper/Imports"
import { State, TowerOnlyTarget, TowerSwitcher } from "./Menu"

let pars = new Map<Entity, number>(),
	TowerRange = new Map<Tower, number>(),
	FirstCreate: boolean = false,
	Towers: Tower[] = []

export function Destroy(ent: Entity) {
	if (!(ent instanceof Tower))
		return
	pars.delete(ent)
	TowerRange.delete(ent)
}

function DrawTarget(ent: Tower, Owner: Unit) {
	if (Owner !== undefined && ent.IsAlive) {
		let par = pars.get(ent)
		if (par === undefined)
			return
		ParticlesSDK.SetControlPoint(par, 2, ent.Position)
		ParticlesSDK.SetControlPoint(par, 6, new Vector3(10))
		ParticlesSDK.SetControlPoint(par, 7, Owner.Position)
	}
}

function CreateTowerRange(ent: Tower) {
	var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	ParticlesSDK.SetControlPoint(par, 1, new Vector3(ent.AttackRange + ent.HullRadius + 25, 0, 0))
	TowerRange.set(ent, par)
	return par
}
function SwicthTowers(particle_range: number | undefined, tower: Tower) {
	if (particle_range === undefined)
		return
	ParticlesSDK.Destroy(particle_range)
	TowerRange.delete(tower)
}
function RemoveTarget(particle: number, tower: Tower) {
	if (particle !== undefined) {
		ParticlesSDK.Destroy(particle)
		pars.delete(tower)
	}
}
export function Tick() {
	if (!State.value)
		return
	Towers = EntityManager.GetEntitiesByClass(Tower).filter(x => x.IsAlive)
}

State.OnValue(x => {
	if (x.value)
		return
	// loop-optimizer: KEEP
	TowerRange.forEach((particle_range, tower) => {
		SwicthTowers(particle_range, tower)
		let par = pars.get(tower)
		if (par !== undefined)
			RemoveTarget(par, tower)
	})
})

export function OnDraw() {
	if (!State.value)
		return
	// loop-optimizer: KEEP
	Towers.forEach(tower => {
		if (!FirstCreate) { // shit, in ent create don'n work
			CreateTowerRange(tower)
			FirstCreate = true
		}
		let particle_range = TowerRange.get(tower)
		if (!TowerOnlyTarget.value) {
			switch (TowerSwitcher.selected_id) {
				case 0:
					if (!tower.IsEnemy()) {
						SwicthTowers(particle_range, tower)
					} else if (particle_range === undefined)
						CreateTowerRange(tower)
					break
				case 1:
					if (tower.IsEnemy()) {
						SwicthTowers(particle_range, tower)
					} else if (particle_range === undefined)
						CreateTowerRange(tower)
					break
				case 2:
					if (particle_range === undefined)
						CreateTowerRange(tower)
					break
				default: break
			}
		} else
			SwicthTowers(particle_range, tower)
		let particle = pars.get(tower)
		if (tower.TowerAttackTarget === undefined || !tower.IsAlive ||
			tower.Distance2D(tower.TowerAttackTarget.Position) >= tower.AttackRange + tower.HullRadius + 25) {
			if (particle !== undefined)
				RemoveTarget(particle, tower)
			return
		}
		if (particle === undefined) {
			let par: number | undefined
			switch (TowerSwitcher.selected_id) {
				case 0:
					if (tower.IsEnemy())
						par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
					break
				case 1:
					if (!tower.IsEnemy())
						par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
					break
				case 2:
					par = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, tower.TowerAttackTarget)
					break
			}
			if (par !== undefined)
				pars.set(tower, par)
		}
		if (pars.has(tower))
			DrawTarget(tower, tower.TowerAttackTarget)
	})
}

export function Init() {
	Towers = []
	pars.clear()
	TowerRange.clear()
}
