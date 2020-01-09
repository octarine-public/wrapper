import Unit from "../Objects/Base/Unit"
import Entity from "../Objects/Base/Entity"
import NavMeshPathfinding from "./NavMesh/NavMeshPathfinding"
import Obstacle from "./NavMesh/Obstacle"
import MovingObstacle from "./NavMesh/MovingObstacle"
import Creep from "../Objects/Base/Creep"
import Hero from "../Objects/Base/Hero"

// import Unit from "../Objects/Base/Unit"

export default class Prediction {
	// private readonly Pathfinder = new NavMeshPathfinding()
	constructor(private readonly Owner: Unit) { }
	public GetFirstHitTarget(
		radius: number,
		collision_size: number,
		speed = this.Owner.IdealSpeed,
		angle = this.Owner.Forward.toVector2(),
		delay = 0,
		filter = (ent: Entity) => ent !== this.Owner && (ent instanceof Hero || ent instanceof Creep)
	): Nullable<Entity> {
		let obs2ent = new Map<Obstacle, Entity>()
		EntityManager.GetEntitiesInRange(this.Owner.Position, radius * 2).forEach(ent => {
			if (filter(ent))
				obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent)
		})
		return obs2ent.get(
			new NavMeshPathfinding(
				new MovingObstacle(
					this.Owner.Position.toVector2(),
					collision_size,
					angle.MultiplyScalarForThis(speed),
					(radius / speed) + 0.03
				),
				[...obs2ent.keys()],
				delay,
			).GetFirstHitObstacle()!
		)
	}
	public GetHitTargets(
		radius: number,
		collision_size: number,
		speed = this.Owner.IdealSpeed,
		angle = this.Owner.Forward.toVector2(),
		delay = 0,
		filter = (ent: Entity) => ent !== this.Owner && (ent instanceof Hero || ent instanceof Creep)
	): Entity[] {
		let obs2ent = new Map<Obstacle, Entity>()
		EntityManager.GetEntitiesInRange(this.Owner.Position, radius * 2).forEach(ent => {
			if (filter(ent))
				obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent)
		})
		return new NavMeshPathfinding(
			new MovingObstacle(
				this.Owner.Position.toVector2(),
				collision_size,
				angle.MultiplyScalarForThis(speed),
				(radius / speed) + 0.03
			),
			[...obs2ent.keys()],
			delay,
		).GetHitObstacles().map(obs => obs2ent.get(obs)!)
	}
}
