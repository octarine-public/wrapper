import { ParticlesSDK, Unit, Particle, EntityManager, Vector3, } from "wrapper/Imports"

import { IParticlePattern } from "./MenuParticle"

// -------

function ParticleUpdateRange(particle: Particle, pattern: IParticlePattern) {
	particle.SetControlPoints(
		[2, pattern.Style.Color],
		[3, new Vector3(pattern.Style.Width.value)],
		[4, new Vector3(pattern.Style.A.value)]
	)
}

// -------

export function ParticleCreateRange(
	particleManager: ParticlesSDK,
	ent: Unit,
	pattern: IParticlePattern,
	onBeforeCreate?: (ent: Unit) => boolean
) {
	if (particleManager.AllParticles.has(ent))
		return

	if (onBeforeCreate?.(ent))
		return

	let particle = particleManager.DrawCircle(ent, ent, undefined, {
		RenderStyle: pattern.Style.Style.selected_id
	})

	ParticleUpdateRange(particle, pattern)
}


export function ParticleSetRadiusByRadius(particleManager: ParticlesSDK, getRange: (ent: Unit) => number) {
	// loop-optimizer: KEEP
	particleManager.AllParticles.forEach((particle, ent) => particle.SetControlPoint(1, getRange(ent)))
}

export function ParticlesSetRanges(particleManager: ParticlesSDK, pattern: IParticlePattern) {
	// loop-optimizer: KEEP
	particleManager.AllParticles.forEach(particle => ParticleUpdateRange(particle, pattern))
}

export function OnStateBase(
	particleManager: ParticlesSDK,
	state: boolean,
	class_: Constructor<Unit>,
	pattern: IParticlePattern,
	onBeforeCreate?: (ent: Unit) => boolean
) {

	if (state) {

		EntityManager.GetEntitiesByClass(class_)
			.forEach(unit => ParticleCreateRange(particleManager, unit, pattern, onBeforeCreate))
	}
	else particleManager.DestroyAll()
}