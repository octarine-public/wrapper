import { Entity, Unit } from "wrapper/Imports"

export class CollisionObject {
	constructor(
		public Entity: Unit | Entity,
		public Position = Entity.Position.toVector2(),
		public Radius = Entity instanceof Unit ? Entity.HullRadius : 0,
	) { }
}
