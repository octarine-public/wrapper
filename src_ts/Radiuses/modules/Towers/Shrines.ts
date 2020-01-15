import { Entity, Shrine, EntityManager, Ability } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { RegisterModule } from "../../base/RegisterModule"
import { ParticleUpdatePattern } from "../../base/MenuRangeParticle"

import { Shrines } from "./Menu"
import {
	OnStateBase,
	ParticleDestroy,
	ParticleSetRadius,
	ParticlesSetRanges
} from "./Base"


// --------
const shrinesParticles = new Map<Shrine, number>()

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(state, Shrine, shrinesParticles, Shrines)

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}

// because need to get radius from ability
function GetShrineRadius(ent: Entity) {
	if (!(ent instanceof Ability) || !ent.Name.includes("filler_ability"))
		return

	let radius = (ent as Ability).GetSpecialValue("radius")

	if (radius > 0) {
		ParticleSetRadius(shrinesParticles, () => radius)
	}
}

// --------

Shrines.State.OnValue(self => OnState(self.value && stateMain.value))

Shrines.Team.OnValue(RestartParticles)

ParticleUpdatePattern(Shrines.Style,
	() => ParticlesSetRanges(shrinesParticles, Shrines),
	RestartParticles)

// --------

function OnState(state: boolean) {
	state = state && Shrines.State.value

	OnStateMenu(state)

	if (state) {
		EntityManager.AllEntities.forEach(GetShrineRadius)
	}
}

const EntityCreated = (ent: Entity) => GetShrineRadius(ent)

const EntityDestroyed = (ent: Entity) => ParticleDestroy(shrinesParticles, ent as Shrine)

// --------

RegisterModule({
	OnState,
	EntityCreated,
	EntityDestroyed
})