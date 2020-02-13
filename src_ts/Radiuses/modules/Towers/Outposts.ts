import { Entity, Outpost, EventsSDK, ParticlesSDK } from "wrapper/Imports"

import { stateMain } from "../../base/MenuBase"
import { ParticleUpdatePattern } from "../../base/MenuParticle"

import { OutpostsMenu, MenuCheckTeam } from "./Menu"
import {
	OnStateBase,
	ParticleSetRadiusByRadius,
	ParticlesSetRanges
} from "../../base/UseParticles"


// --------

const outpostsParticles = new ParticlesSDK()

// --------

const OnStateMenu = (state: boolean) =>
	OnStateBase(outpostsParticles, state, Outpost, OutpostsMenu,
		(ent) => MenuCheckTeam(OutpostsMenu, ent))

const OnState = (newState: boolean = true) => {
	let state = stateMain.value && OutpostsMenu.State.value && newState

	OnStateMenu(state)

	if (state) {
		ParticleSetRadiusByRadius(outpostsParticles, ent => ent.DayVision)
	}
}

const RestartParticles = () => {
	OnState(false)
	OnState(true)
}

// -------- Menu

stateMain.OnValue(() => OnState())

// -------- Outpost

OutpostsMenu.State.OnValue(() => OnState())
OutpostsMenu.Team.OnValue(RestartParticles)

ParticleUpdatePattern(OutpostsMenu.Style,
	() => ParticlesSetRanges(outpostsParticles, OutpostsMenu),
	RestartParticles)

// --------

EventsSDK.on("EntityTeamChanged", ent => ent instanceof Outpost && RestartParticles())
EventsSDK.on("EntityDestroyed", (ent: Entity) => outpostsParticles.DestroyByKey(ent))
EventsSDK.on("GameStarted", () => OnState(true))
EventsSDK.on("GameEnded", () => OnState(false))