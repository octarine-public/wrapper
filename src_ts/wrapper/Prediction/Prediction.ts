import Unit from "../Objects/Base/Unit"
import Entity from "../Objects/Base/Entity"
import NavMeshPathfinding from "./NavMesh/NavMeshPathfinding"
import Obstacle from "./NavMesh/Obstacle"
import MovingObstacle from "./NavMesh/MovingObstacle"
import Creep from "../Objects/Base/Creep"
import Hero from "../Objects/Base/Hero"
import EntityManager from "../Managers/EntityManager"
import Vector2 from "../Base/Vector2"

// import Unit from "../Objects/Base/Unit"

export default class Prediction {
	// private readonly Pathfinder = new NavMeshPathfinding()
	constructor(private readonly Owner: Unit) { }
	public GetHitTargets(
		radius: number,
		collision_size: number,
		speed = this.Owner.IdealSpeed,
		angle = this.Owner.Forward.toVector2(),
		delay = 0,
		obstacles?: Entity[]
	): Entity[] {
		if (obstacles === undefined)
			obstacles = EntityManager.GetEntitiesByClasses<Entity>([Creep, Hero]).filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2))
		let obs2ent = new Map<Obstacle, Entity>()
		obstacles.forEach(ent => obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent))
		return new NavMeshPathfinding(
			new MovingObstacle(
				this.Owner.Position.toVector2(),
				collision_size,
				angle.MultiplyScalarForThis(speed),
				radius / speed
			),
			[...obs2ent.keys()],
			delay,
		).GetHitObstacles().map(obs => obs2ent.get(obs)!)
	}
	public GetFirstHitTarget(
		radius: number,
		collision_size: number,
		speed = this.Owner.IdealSpeed,
		angle = this.Owner.Forward.toVector2(),
		delay = 0,
		obstacles?: Entity[]
	): Nullable<Entity> {
		if (obstacles === undefined)
			obstacles = EntityManager.GetEntitiesByClasses<Entity>([Creep, Hero]).filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2))
		let obs2ent = new Map<Obstacle, Entity>()
		obstacles.forEach(ent => obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent))
		return obs2ent.get(
			new NavMeshPathfinding(
				new MovingObstacle(
					this.Owner.Position.toVector2(),
					collision_size,
					angle.MultiplyScalarForThis(speed),
					radius / speed
				),
				[...obs2ent.keys()],
				delay,
			).GetFirstHitObstacle()!
		)
	}
	public GetAngleForObstacleFirstHit(
		radius: number,
		collision_size: number,
		target: Entity,
		speed = this.Owner.IdealSpeed,
		delay = 0,
		dynamic_delay_func = (ang: number) => 0,
		obstacles?: Entity[]
	): Nullable<number> {
		if (obstacles === undefined)
			obstacles = EntityManager.GetEntitiesByClasses<Entity>([Creep, Hero]).filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2))
		let ent2obs = new Map<Entity, Obstacle>()
		obstacles.forEach(ent => ent2obs.set(ent, ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent)))
		return new NavMeshPathfinding(
			new MovingObstacle(
				this.Owner.Position.toVector2(),
				collision_size,
				new Vector2(speed, speed),
				radius / speed
			),
			[...ent2obs.values()],
			delay,
		).GetAngleForObstacleFirstHit(ent2obs.get(target)!, dynamic_delay_func)
	}
}
