import { Entity, Tower } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { RegisterModule } from "../../base/RegisterModule"
import { ParticleUpdatePattern } from "../../base/MenuRangeParticle"

import { Towers } from "./Menu"
import {
	OnStateBase,
	ParticleDestroy,
	ParticleSetRadius,
	ParticlesSetControls
} from "./Base"


// --------
const towersParticles = new Map<Tower, number>()

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(state, Tower, towersParticles, Towers)

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}

// --------

Towers.State.OnValue(self => OnState(self.value && stateMain.value))

Towers.Team.OnValue(RestartParticles)

ParticleUpdatePattern(Towers.Style,
	() => ParticlesSetControls(towersParticles, Towers),
	RestartParticles)

// --------

function OnState(state: boolean) {
	state = state && Towers.State.value

	OnStateMenu(state)

	if (state) {
		ParticleSetRadius(towersParticles, ent => ent.AttackRangeBonus())
	}
}

const EntityDestroyed = (ent: Entity) => ParticleDestroy(towersParticles, ent as Tower)

// --------

RegisterModule({
	OnState,
	EntityDestroyed
})