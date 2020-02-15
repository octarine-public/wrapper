import { ParticlesSDK, Unit, Vector3 } from "wrapper/Imports"

let particleManager = new ParticlesSDK()

export function GameEnded() {
	particleManager.DestroyAll()
}

export function AddOrUpdateParticle(name: string, unit: Unit, pos: Vector3, range: number) {
	particleManager.AddOrUpdate(
		name + unit.Index,
		"particles/ui_mouseactions/drag_selected_ring.vpcf",
		ParticleAttachment_t.PATTACH_ABSORIGIN,
		unit,
		[0, pos],
		[1, new Vector3(0, 255, 255)],
		[2, new Vector3(range * 1.1, 255, 0)],
	)
}

export function RemoveParticle(name: string, unit: Unit) {
	particleManager.DestroyByKey(name + unit.Index)
}
