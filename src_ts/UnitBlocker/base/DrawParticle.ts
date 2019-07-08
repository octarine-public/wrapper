import { Unit, Vector3 } from "wrapper/Imports"

let allParticles = new Map<string, number>()

export function GameEnded() {
	// loop-optimizer: KEEP
	allParticles.forEach(partl => Particles.Destroy(partl, true))
}

export function AddOrUpdateParticle(name: string, unit: Unit, pos: Vector3, range: number) {

	let nameOfParticle = name + unit.Index,
		particle = allParticles.get(nameOfParticle)

	if (particle === undefined) {
		allParticles.set(nameOfParticle, Particles.Create("particles/ui_mouseactions/drag_selected_ring.vpcf", 0, unit.m_pBaseEntity))

		particle = allParticles.get(nameOfParticle)

		IOBuffer[0] = 0
		IOBuffer[1] = 255
		IOBuffer[2] = 255
		Particles.SetControlPoint(particle, 1)

		IOBuffer[0] = range * 1.1
		IOBuffer[1] = 255
		IOBuffer[2] = 0
		Particles.SetControlPoint(particle, 2)
	}

	pos.toIOBuffer()
	Particles.SetControlPoint(particle, 0)
}

export function RemoveParticle(name: string, unit: Unit) {

	let nameOfParticle = name + unit.Index,
		particle = allParticles.get(nameOfParticle)

	if (particle !== undefined) {
		Particles.Destroy(particle, true)
		allParticles.delete(nameOfParticle)
	}
}