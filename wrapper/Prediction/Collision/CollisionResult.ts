import { Vector3 } from "../../Base/Vector3"
import { Unit } from "../../Objects/Base/Unit"

export class CollisionResult {
	public readonly Collided: boolean
	public readonly Objects: Unit[]
	public readonly Position: Vector3

	constructor(collided: boolean, objects: Unit[], position: Vector3) {
		this.Collided = collided
		this.Objects = objects
		this.Position = position
	}

	public static None(): CollisionResult {
		return new CollisionResult(false, [], new Vector3())
	}
}
