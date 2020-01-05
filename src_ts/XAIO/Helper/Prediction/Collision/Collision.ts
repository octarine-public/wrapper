import XAIOCollisionObject from "./CollisionObject"
import { Vector2, Vector3 } from "wrapper/Imports"

export default class XAIOCollision {
	public static GetCollision(startPosition: Vector2 | Vector3, endPosition: Vector2, radius: number, collisionObjects: XAIOCollisionObject[]) {
		return collisionObjects.some(list => {
			if (list === undefined)
				return false
			return list.Position.DistanceSegment((startPosition as Vector2), endPosition, true) < (radius + list.Radius)
		})
	}
}
