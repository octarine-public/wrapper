import { ParticlesSDK, Building } from "wrapper/Imports"

import { IBuildingPattern } from "./Menu"
import { RangeRenderPath } from "../../base/ParticlesPaths"


function particleCreate(particles: Map<Building, number>, ent: Building, pattern: IBuildingPattern) {
	let particle = particles.get(ent)

	if (particle !== undefined)
		return

	if (!pattern.State.value
		|| (pattern.Team.selected_id === 0 && !ent.IsEnemy())
		|| (pattern.Team.selected_id === 1 && ent.IsEnemy()))
		return

	particle = ParticlesSDK.Create(RangeRenderPath(pattern.Style.Style.selected_id),
		ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)

	ParticlesSDK.SetControlPoint(particle, 1, new Vector3(50, 0, 0))

	particleSetControls(particle, pattern)

	particles.set(ent, particle)
}

function particleSetControls(particle: number, pattern: IBuildingPattern) {
	ParticlesSDK.SetControlPoint(particle, 2, pattern.Style.Color)
	ParticlesSDK.SetControlPoint(particle, 3, new Vector3(pattern.Style.Width.value, 0, 0))
	ParticlesSDK.SetControlPoint(particle, 4, new Vector3(pattern.Style.A.value, 0, 0))
}

// -------

export function ParticleSetRadius(particles: Map<Building, number>, getRange: (ent: Building) => number) {
	// loop-optimizer: KEEP
	particles.forEach((particle, building) =>
		ParticlesSDK.SetControlPoint(particle, 1, new Vector3(getRange(building), 0, 0)))
}

export function ParticlesSetControls(particles: Map<Building, number>, pattern: IBuildingPattern) {
	// loop-optimizer: KEEP
	particles.forEach(particle => particleSetControls(particle, pattern))
}

export function ParticleDestroy(particles: Map<Building, number>, ent: Building) {
	let particle = particles.get(ent)

	if (particle === undefined)
		return

	ParticlesSDK.Destroy(particle)
	particles.delete(ent)
}

export function OnStateBase(
	state: boolean,
	class_: Constructor<Building>,
	particles: Map<Building, number>,
	pattern: IBuildingPattern) {

	if (state) {

		EntityManager.GetEntitiesByClass(class_)
			.forEach(building => particleCreate(particles, building, pattern))
	}
	else {
		// loop-optimizer: KEEP
		particles.forEach((_particle, building) => ParticleDestroy(particles, building))
	}
}