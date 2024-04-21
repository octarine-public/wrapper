import { Vector3 } from "../../../Base/Vector3"
import { HitChance } from "../../../Enums/HitChance"
import { Unit } from "../../../Objects/Base/Unit"

export class PredictionOutput {
	public Target!: Unit
	public HitChance = HitChance.Impossible
	public readonly CastPosition = new Vector3()
	public readonly TargetPosition = new Vector3()
	public readonly BlinkLinePosition = new Vector3()
	public readonly AoeTargetsHit: PredictionOutput[] = []
}
