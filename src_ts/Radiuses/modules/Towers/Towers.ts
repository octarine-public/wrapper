import { Tower, EntityManager, EventsSDK, ParticlesSDK } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { ParticleUpdatePattern } from "../../base/MenuParticle"

import { TowersRangeMenu, ShowAttackTargetMenu, MenuCheckTeam } from "./Menu"
import {
	OnStateBase,
	ParticleSetRadiusByRadius,
	ParticlesSetRanges
} from "../../base/UseParticles"


// --------
const towersParticles = new ParticlesSDK()
const towersAttackParticles = new ParticlesSDK()

let Towers: Tower[] = []

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(towersParticles, state, Tower, TowersRangeMenu,
		(ent) => MenuCheckTeam(TowersRangeMenu, ent))

const OnState = (newState: boolean = true) => {
	const state = stateMain.value && TowersRangeMenu.State.value && newState

	OnStateMenu(state)

	if (state) {
		ParticleSetRadiusByRadius(towersParticles, ent => ent.AttackRangeBonus())
	}
}

const IsShowAttackTarget = () => stateMain.value && ShowAttackTargetMenu.State.value

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}


// -------- Menu

stateMain.OnValue(() => OnState())

// -------- Tower Range

TowersRangeMenu.State.OnValue(() => OnState())
TowersRangeMenu.Team.OnValue(RestartParticles)

ParticleUpdatePattern(TowersRangeMenu.Style,
	() => ParticlesSetRanges(towersParticles, TowersRangeMenu),
	RestartParticles)

// -------- Tower Attack Target

ShowAttackTargetMenu.Team.OnValue(() => towersAttackParticles.DestroyAll())

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

		if (MenuCheckTeam(ShowAttackTargetMenu, tower))
			return

		towersAttackParticles.DrawLineToTarget(tower, tower, target,
			ShowAttackTargetMenu.Style.Color)
	})
})

EventsSDK.on("EntityDestroyed", ent => {
	towersParticles.DestroyByKey(ent)
	towersAttackParticles.DestroyByKey(ent)
})

EventsSDK.on("GameStarted", () => OnState(true))
EventsSDK.on("GameEnded", () => OnState(false))