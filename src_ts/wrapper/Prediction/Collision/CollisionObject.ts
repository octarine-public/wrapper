import Entity from "../../Objects/Base/Entity"
import Unit from "../../Objects/Base/Unit"

export class CollisionObject {
	constructor(
		public Entity: Unit | Entity,
		public Position = Entity.Position.toVector2(),
		public Radius = Entity instanceof Unit ? Entity.HullRadius : 0,
	) { }
}
