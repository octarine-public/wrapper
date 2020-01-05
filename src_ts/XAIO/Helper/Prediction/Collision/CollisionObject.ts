import { Unit, Entity, Vector2 } from "wrapper/Imports"

export default class XAIOCollisionObject {
	constructor(
		public Entity: Unit | Entity,
		public Position: Vector2 = Entity.Position.toVector2(),
		public Radius = Entity instanceof Unit ? Entity.HullRadius : 0,
	) { }
}
