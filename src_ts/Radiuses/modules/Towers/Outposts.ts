import { Entity, Outpost, EventsSDK, ParticlesSDK } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { ParticleUpdatePattern } from "../../base/MenuParticle"

import { Outposts } from "./Menu"
import {
	OnStateBase,
	ParticleSetRadiusByRadius,
	ParticlesSetRanges
} from "./Base"


// --------
const outpostsParticles = new ParticlesSDK()

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(outpostsParticles, state, Outpost, Outposts)

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
		ParticleSetRadiusByRadius(outpostsParticles, ent => ent.DayVision)
	}
}

// --------

stateMain.OnValue(self => OnState(self.value))

EventsSDK.on("EntityTeamChanged", ent => {
	if (ent instanceof Outpost) {
		RestartParticles()
	}
})

EventsSDK.on("EntityDestroyed", (ent: Entity) => outpostsParticles.DestroyByKey(ent))