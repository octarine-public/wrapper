import { Entity, Outpost } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { RegisterModule } from "../../base/RegisterModule"
import { ParticleUpdatePattern } from "../../base/MenuRangeParticle"

import { Outposts } from "./Menu"
import {
	OnStateBase,
	ParticleDestroy,
	ParticleSetRadius,
	ParticlesSetRanges
} from "./Base"


// --------
const outpostsParticles = new Map<Outpost, number>()

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(state, Outpost, outpostsParticles, Outposts)

const RestartParticles = () => {
	OnState(false)
	OnState(true && stateMain.value)
}

// --------

Outposts.State.OnValue(self => OnState(self.value && stateMain.value))

Outposts.Team.OnValue(RestartParticles)

ParticleUpdatePattern(Outposts.Style,
	() => ParticlesSetRanges(outpostsParticles, Outposts),
	RestartParticles)

// --------

function OnState(state: boolean) {
	state = state && Outposts.State.value

	OnStateMenu(state)

	if (state) {
		ParticleSetRadius(outpostsParticles, ent => ent.DayVision)
	}
}

const EntityDestroyed = (ent: Entity) => ParticleDestroy(outpostsParticles, ent as Outpost)

// --------

EventsSDK.on("EntityTeamChanged", ent => {
	if (ent instanceof Outpost) {
		RestartParticles()
	}
})

RegisterModule({
	OnState,
	EntityDestroyed
})