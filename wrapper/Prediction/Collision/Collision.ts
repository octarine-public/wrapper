import Vector2 from "../../Base/Vector2"
import * as ArrayExtensions from "../../Utils/ArrayExtensions"
import { CollisionObject } from "./CollisionObject"
import { CollisionResult } from "./CollisionResult"

export default new (class Collision {
	public GetCollision(startPosition: Vector2, endPosition: Vector2, radius: number, collisionObjects: CollisionObject[]): CollisionResult {
		return new CollisionResult(ArrayExtensions.orderBy(
			collisionObjects.filter(obj => obj.Position.DistanceSegment(startPosition, endPosition, true) < (radius + obj.Radius) + Math.sqrt(obj.Entity.CollisionRadius)),
			obj => obj.Position.DistanceSqr(startPosition),
		))
	}
})()
