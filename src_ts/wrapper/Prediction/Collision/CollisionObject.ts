import Entity from "../../Objects/Base/Entity"
import Unit from "../../Objects/Base/Unit"
import Vector2 from "../../Base/Vector2"

export class CollisionObject {
	constructor(
		public Entity: Unit | Entity,
		public Position = Vector2.FromVector3(Entity.Position),
		public Radius = Entity instanceof Unit ? Entity.HullRadius : 0,
	) { }
}
