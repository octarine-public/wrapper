import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

// const currentGaleForces = new Map<NetworkedParticle, [Vector3, number, number]>()
// const pathName = "particles/units/heroes/hero_windrunner/windrunner_gale_force_owner.vpcf"

@WrapperClassModifier()
export class modifier_windrunner_gale_force extends Modifier {
	public readonly IsDebuff = true

	// private isEmited = false
	// protected SetBonusMoveSpeed(_specialName?: string, _subtract = false): void {
	// 	const owner = this.Parent
	// 	if (owner === undefined) {
	// 		return
	// 	}
	// 	this.emitToPostData()
	// 	this.BonusMoveSpeed = this.getRotationSpeed(owner)
	// }

	// private getRotationSpeed(owner: Unit): number {
	// 	for (const [pos, rotation, radius] of currentGaleForces.values()) {
	// 		if (owner.Distance2D(pos) < radius) {
	// 			let angle =
	// 				owner.RotationRad -
	// 				DegreesToRadian(owner.RotationDifference) -
	// 				rotation
	// 			while (angle > Math.PI) {
	// 				angle -= 2 * Math.PI
	// 			}
	// 			while (angle < -Math.PI) {
	// 				angle += 2 * Math.PI
	// 			}
	// 			return this.GetSpecialValue("wind_strength") * (angle / (Math.PI / 2))
	// 		}
	// 	}
	// 	return 0
	// }

	// private addIntervalThink(): void {
	// 	if (this.isEmited) {
	// 		return
	// 	}
	// 	const duration = this.Ability?.MaxDuration ?? 4
	// 	ModifierManager.EmitToPostDataUpdate(this, duration)
	// 	this.isEmited = true
	// }
}

// EventsSDK.on("GameEnded", () => {
// 	currentGaleForces.clear()
// })

// EventsSDK.on("ParticleDestroyed", par => {
// 	if (par.PathNoEcon === pathName) {
// 		currentGaleForces.delete(par)
// 	}
// })

// EventsSDK.on("ParticleUpdated", par => {
// 	if (par.PathNoEcon !== pathName) {
// 		return
// 	}
// 	const pos = par.ControlPoints.get(0)
// 	if (pos === undefined) {
// 		return
// 	}
// 	const rotation = par.ControlPointsQuaternion.get(3)
// 	if (rotation === undefined) {
// 		return
// 	}
// 	const radius = par.ControlPoints.get(1)
// 	if (radius === undefined) {
// 		return
// 	}
// 	const angle = RadianToDegrees(Math.atan2(rotation.z, rotation.w)) * 2
// 	currentGaleForces.set(par, [pos, angle, radius.x])
// })
