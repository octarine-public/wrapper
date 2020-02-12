import { Tower, EntityManager, EventsSDK, ParticlesSDK } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { ParticleUpdatePattern, MenuCheckTeam } from "../../base/MenuParticle"

import { TowersRange, ShowAttackTarget } from "./Menu"
import {
	OnStateBase,
	ParticleSetRadiusByRadius,
	ParticlesSetRanges
} from "./Base"


// --------
const towersParticles = new ParticlesSDK()
const towersAttackParticles = new ParticlesSDK()

let Towers: Tower[] = []

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(towersParticles, state, Tower, TowersRange)

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}

const IsShowAttackTarget = () => stateMain.value && ShowAttackTarget.State.value

const OnState = (state: boolean) => {
	state = state && TowersRange.State.value

	OnStateMenu(state)

	if (state) {
		ParticleSetRadiusByRadius(towersParticles, ent => ent.AttackRangeBonus())
	}
}



// -------- Menu

stateMain.OnValue(self => OnState(self.value))

// -------- Tower Range

TowersRange.State.OnValue(self => OnState(self.value && stateMain.value))

TowersRange.Team.OnValue(RestartParticles)

ParticleUpdatePattern(TowersRange.Style,
	() => ParticlesSetRanges(towersParticles, TowersRange),
	RestartParticles)

// -------- Tower Attack Target

ShowAttackTarget.Team.OnValue(() => towersAttackParticles.DestroyAll())

// -------- EventsSDK

EventsSDK.on("Tick", () => {
	if (!IsShowAttackTarget())
		return

	Towers = EntityManager.GetEntitiesByClass(Tower).filter(x => x.IsAlive)
})

EventsSDK.on("Draw", () => {
	if (!IsShowAttackTarget())
		return

	Towers.forEach(tower => {
		let target = tower.TowerAttackTarget

		if (target === undefined
			|| !target.IsAlive
			|| !tower.IsInRange(target.Position, tower.AttackRangeBonus())) {

			if (towersAttackParticles.AllParticles.has(tower))
				towersAttackParticles.DestroyByKey(tower)

			return
		}

		if (MenuCheckTeam(ShowAttackTarget, tower))
			return

		towersAttackParticles.DrawLineToTarget(tower, tower, target,
			ShowAttackTarget.Style.Color)
	})
})

EventsSDK.on("EntityDestroyed", ent => {
	towersParticles.DestroyByKey(ent)
	towersAttackParticles.DestroyByKey(ent)
})