import { ParticlesSDK, Unit, Vector3 } from "wrapper/Imports"

let allParticles = new Map<string, number>()

export function GameEnded() {
	// loop-optimizer: KEEP
	allParticles.forEach(partl => ParticlesSDK.Destroy(partl, true))
}

export function AddOrUpdateParticle(name: string, unit: Unit, pos: Vector3, range: number) {
	let nameOfParticle = name + unit.Index,
		particle = allParticles.get(nameOfParticle)

	if (particle === undefined) {
		particle = ParticlesSDK.Create("particles/ui_mouseactions/drag_selected_ring.vpcf", 0, unit)

		ParticlesSDK.SetControlPoint(particle, 1, new Vector3(0, 255, 255))
		ParticlesSDK.SetControlPoint(particle, 2, new Vector3(range * 1.1, 255, 0))

		allParticles.set(nameOfParticle, particle)
	}

	ParticlesSDK.SetControlPoint(particle, 0, pos)
}

export function RemoveParticle(name: string, unit: Unit) {
	let nameOfParticle = name + unit.Index,
		particle = allParticles.get(nameOfParticle)

	if (particle !== undefined) {
		ParticlesSDK.Destroy(particle, true)
		allParticles.delete(nameOfParticle)
	}
}
