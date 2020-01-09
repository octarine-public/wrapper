import Obstacle from "./Obstacle"
import Vector2 from "../../Base/Vector2"
import Unit from "../../Objects/Base/Unit"

export default class MovingObstacle extends Obstacle {
	public static FromUnit(unit: Unit): MovingObstacle {
		return new MovingObstacle(
			unit.Position.toVector2(),
			unit.HullRadius + unit.CollisionPadding,
			unit.IsMoving
				? unit.Forward.toVector2().MultiplyScalarForThis(unit.IdealSpeed)
				: new Vector2()
		)
	}

	constructor(
		Position_: Vector2,
		Radius: number,
		public readonly Velocity: Vector2,
		public readonly EndTime = Number.MAX_SAFE_INTEGER
	) { super(Position_, Radius) }

	public PositionAtTime(time: number): Vector2 {
		return this.Position_.Add(this.Velocity.MultiplyScalar(Math.min(time, this.EndTime)))
	}
}
