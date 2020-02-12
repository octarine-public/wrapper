import { ParticlesSDK, Unit, Particle, EntityManager, Vector3, } from "wrapper/Imports"

import { IBuildingParticlePattern } from "./Menu"
import { MenuCheckTeam } from "../../base/MenuParticle"


// -------

function ParticleUpdateRange(particle: Particle, pattern: IBuildingParticlePattern) {
	particle.SetControlPoints(
		[2, pattern.Style.Color],
		[3, new Vector3(pattern.Style.Width.value)],
		[4, new Vector3(pattern.Style.A.value)]
	)
}

// -------

export function ParticleCreateRange(particleManager: ParticlesSDK, ent: Unit, pattern: IBuildingParticlePattern) {

	let particle = particleManager.AllParticles.get(ent)

	if (particle !== undefined)
		return

	if (MenuCheckTeam(pattern, ent))
		return

	particle = particleManager.DrawCircle(ent, ent, undefined, {
		RenderStyle: pattern.Style.Style.selected_id
	})

	ParticleUpdateRange(particle, pattern)
}


export function ParticleSetRadiusByRadius(particleManager: ParticlesSDK, getRange: (ent: Unit) => number) {
	// loop-optimizer: KEEP
	particleManager.AllParticles.forEach((particle, ent) => particle.SetControlPoint(1, getRange(ent)))
}

export function ParticlesSetRanges(particleManager: ParticlesSDK, pattern: IBuildingParticlePattern) {
	// loop-optimizer: KEEP
	particleManager.AllParticles.forEach(particle => ParticleUpdateRange(particle, pattern))
}

export function OnStateBase(
	particleManager: ParticlesSDK,
	state: boolean,
	class_: Constructor<Unit>,
	pattern: IBuildingParticlePattern) {

	if (state) {

		EntityManager.GetEntitiesByClass(class_)
			.forEach(building => ParticleCreateRange(particleManager, building, pattern))
	}
	else {
		// loop-optimizer: KEEP
		particleManager.AllParticles.forEach((_particle, building) => particleManager.DestroyByKey(building))
	}
}