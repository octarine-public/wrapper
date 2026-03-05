import { Vector3 } from "../../Base/Vector3"
import { HitChance } from "../../Enums/HitChance"
import { Unit } from "../../Objects/Base/Unit"

export class PredictionOutput {
	public readonly HitChance_: HitChance
	public readonly CastPosition: Vector3
	public readonly PredictedPosition: Vector3
	public readonly CollisionObjects: Unit[]
	public readonly TimeToHit: number
	public readonly AoeTargets: Unit[]

	constructor(
		hitChance: HitChance,
		castPosition: Vector3,
		predictedPosition: Vector3,
		collisionObjects: Unit[],
		timeToHit: number,
		aoeTargets: Unit[]
	) {
		this.HitChance_ = hitChance
		this.CastPosition = castPosition
		this.PredictedPosition = predictedPosition
		this.CollisionObjects = collisionObjects
		this.TimeToHit = timeToHit
		this.AoeTargets = aoeTargets
	}

	public static Empty(): PredictionOutput {
		return new PredictionOutput(
			HitChance.Impossible,
			new Vector3(),
			new Vector3(),
			[],
			0,
			[]
		)
	}
}
