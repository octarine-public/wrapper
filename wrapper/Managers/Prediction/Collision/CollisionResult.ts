import { CollisionObject } from "./CollisionObject"

export class CollisionResult {
	constructor(public readonly CollisionObjects: CollisionObject[]) {}

	public get Collides() {
		return this.CollisionObjects.length > 0
	}
}
