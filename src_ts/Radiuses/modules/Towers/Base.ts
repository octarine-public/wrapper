import { ParticlesSDK, Building, Tower, Unit } from "wrapper/Imports"

import { IBuildingPattern } from "./Menu"
import { RangeRenderPath } from "../../base/ParticlesPaths"


// -------

function ParticleCreate(
	pathParticle: string,
	attachmentParticle: ParticleAttachment_t,
	particles: Map<Building, number>,
	ent: Building,
	pattern: IBuildingPattern
) {
	let particle = particles.get(ent)

	if (particle !== undefined)
		return

	if (!pattern.State.value
		|| (pattern.Team.selected_id === 1 && !ent.IsEnemy())
		|| (pattern.Team.selected_id === 2 && ent.IsEnemy()))
		return

	particle = ParticlesSDK.Create(pathParticle, attachmentParticle, ent)

	particles.set(ent, particle)

	return particle
}

function ParticleUpdateRange(particle: number, pattern: IBuildingPattern) {
	ParticlesSDK.SetControlPoint(particle, 2, pattern.Style.Color)
	ParticlesSDK.SetControlPoint(particle, 3, new Vector3(pattern.Style.Width.value))
	ParticlesSDK.SetControlPoint(particle, 4, new Vector3(pattern.Style.A.value))
}

// -------

export function ParticleCreateTarget(particles: Map<Building, number>, ent: Building, pattern: IBuildingPattern) {
	return ParticleCreate(
		"particles/ui_mouseactions/range_finder_tower_aoe.vpcf",
		ParticleAttachment_t.PATTACH_ABSORIGIN,
		particles,
		ent, pattern)
}

export function ParticleCreateRange(particles: Map<Building, number>, ent: Building, pattern: IBuildingPattern) {
	let particle = ParticleCreate(
		RangeRenderPath(pattern.Style.Style.selected_id),
		ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
		particles,
		ent, pattern)

	if (particle === undefined)
		return

	ParticleUpdateRange(particle, pattern)
}

export function ParticleUpdateTarget(particle: number, tower: Tower, target: Unit) {
	ParticlesSDK.SetControlPoint(particle, 2, tower.Position)
	ParticlesSDK.SetControlPoint(particle, 6, new Vector3(10))
	ParticlesSDK.SetControlPoint(particle, 7, target.Position)
}

export function ParticleSetRadius(particles: Map<Building, number>, getRange: (ent: Building) => number) {
	// loop-optimizer: KEEP
	particles.forEach((particle, building) =>
		ParticlesSDK.SetControlPoint(particle, 1, new Vector3(getRange(building))))
}

export function ParticlesSetRanges(particles: Map<Building, number>, pattern: IBuildingPattern) {
	// loop-optimizer: KEEP
	particles.forEach(particle => ParticleUpdateRange(particle, pattern))
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
			.forEach(building => ParticleCreateRange(particles, building, pattern))
	}
	else {
		// loop-optimizer: KEEP
		particles.forEach((_particle, building) => ParticleDestroy(particles, building))
	}
}