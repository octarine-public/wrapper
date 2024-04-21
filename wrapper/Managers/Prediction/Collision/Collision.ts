import { Vector2 } from "../../../Base/Vector2"
import { CollisionObject } from "./CollisionObject"
import { CollisionResult } from "./CollisionResult"

function getSqrtRadius(radius: number, collision: CollisionObject) {
	return radius + collision.Radius + Math.sqrt(collision.Entity.CollisionRadius)
}

export function GetCollision(
	startPosition: Vector2,
	endPosition: Vector2,
	radius: number,
	collisionObjects: CollisionObject[]
): CollisionResult {
	const collisions = collisionObjects.filter(
		collision =>
			collision.Position.DistanceSegment(startPosition, endPosition, true) <
			getSqrtRadius(radius, collision)
	)
	return new CollisionResult(
		collisions.orderBy(collision => collision.Position.DistanceSqr(startPosition))
	)
}
