import Vector2 from "../../Base/Vector2"
import Entity from "../../Objects/Base/Entity"

export default class Obstacle {
	public static FromEntity(ent: Entity): Obstacle {
		return new Obstacle(Vector2.FromVector3(ent.Position), Math.sqrt(ent.CollisionRadius))
	}

	constructor(
		protected Position_: Vector2,
		public readonly Radius: number,
	) { }

	public PositionAtTime(time: number): Vector2 {
		return this.Position_.Clone()
	}
}
