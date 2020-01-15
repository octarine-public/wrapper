import { Entity, Tower } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { RegisterModule } from "../../base/RegisterModule"
import { ParticleUpdatePattern } from "../../base/MenuRangeParticle"

import { Towers as TowersMenu, ShowAttackTarget } from "./Menu"
import {
	OnStateBase,
	ParticleDestroy,
	ParticleSetRadius,
	ParticlesSetRanges,
	ParticleCreateTarget,
	ParticleUpdateTarget
} from "./Base"


// --------
const towersParticles = new Map<Tower, number>()
const towersAttackParticles = new Map<Tower, number>()

let Towers: Tower[] = []

// --------

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(state, Tower, towersParticles, TowersMenu)

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}

const IsShowAttackTarget = () => stateMain.value
	&& TowersMenu.State.value && ShowAttackTarget.value

// --------

TowersMenu.State.OnValue(self => OnState(self.value && stateMain.value))

TowersMenu.Team.OnValue(RestartParticles)

ParticleUpdatePattern(TowersMenu.Style,
	() => ParticlesSetRanges(towersParticles, TowersMenu),
	RestartParticles)

// --------

function OnState(state: boolean) {
	state = state && TowersMenu.State.value

	OnStateMenu(state)

	if (state) {
		ParticleSetRadius(towersParticles, ent => ent.AttackRangeBonus())
	}
}

function Tick() {
	if (!IsShowAttackTarget())
		return

	Towers = EntityManager.GetEntitiesByClass(Tower).filter(x => x.IsAlive)
}

function Draw() {
	if (!IsShowAttackTarget())
		return

	Towers.forEach(tower => {

		let particle = towersAttackParticles.get(tower)

		let target = tower.TowerAttackTarget

		if (target === undefined
			|| !target.IsAlive
			|| !tower.IsInRange(target.Position, tower.AttackRangeBonus())) {

			if (particle !== undefined)
				ParticleDestroy(towersAttackParticles, tower)

			return
		}

		if (particle === undefined) {
			particle = ParticleCreateTarget(towersAttackParticles, tower, TowersMenu)
		}

		if (particle === undefined)
			return

		ParticleUpdateTarget(particle, tower, target)
	})
}

const EntityDestroyed = (ent: Entity) => {
	ParticleDestroy(towersParticles, ent as Tower)
	ParticleDestroy(towersAttackParticles, ent as Tower)
}


// --------

RegisterModule({
	OnState,
	Tick,
	Draw,
	EntityDestroyed
})