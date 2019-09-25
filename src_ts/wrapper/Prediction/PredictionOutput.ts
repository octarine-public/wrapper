import Vector3 from "../Base/Vector3"
import Unit from "../Objects/Base/Unit"
import { CollisionResult } from "./Collision/CollisionResult"
import { HitChance } from "./HitChance"

export class PredictionOutput {
	constructor(
		public AoeTargetsHit: PredictionOutput[] = [],
		public ArrivalTime = 0,
		public CastPosition: Vector3,
		public CollisionResult: CollisionResult,
		public HitChance: HitChance,
		public Unit: Unit,
		public UnitPosition: Vector3,
	) {}
}
