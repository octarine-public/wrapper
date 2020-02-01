import { CollisionObject } from "./CollisionObject"
import { CollisionResult } from "./CollisionResult"
import { Vector2, ArrayExtensions } from "wrapper/Imports"

export default new (class Collision {
	public GetCollision(startPosition: Vector2, endPosition: Vector2, radius: number, collisionObjects: CollisionObject[]): CollisionResult {
		return new CollisionResult(ArrayExtensions.orderBy(
			collisionObjects.filter(obj => obj.Position.DistanceSegment(startPosition, endPosition, true) < (radius + obj.Radius) + obj.Entity.CollisionRadius),
			obj => obj.Position.DistanceSqr(startPosition),
		))
	}
})()
