import Vector2 from "../Base/Vector2"
import EntityManager from "../Managers/EntityManager"
import Creep from "../Objects/Base/Creep"
import Entity from "../Objects/Base/Entity"
import Hero from "../Objects/Base/Hero"
import Unit from "../Objects/Base/Unit"
import MovingObstacle from "./NavMesh/MovingObstacle"
import NavMeshPathfinding from "./NavMesh/NavMeshPathfinding"
import Obstacle from "./NavMesh/Obstacle"

// import Unit from "../Objects/Base/Unit"

export default class Prediction {
	// private readonly Pathfinder = new NavMeshPathfinding()
	constructor(private readonly Owner: Unit) { }
	public GetHitTargets(
		radius: number,
		collision_size: number,
		speed = this.Owner.IdealSpeed,
		angle = Vector2.FromVector3(this.Owner.Forward),
		delay = 0,
		obstacles?: Entity[]
	): Entity[] {
		if (obstacles === undefined) {
			const ents = [...EntityManager.GetEntitiesByClass(Creep), ...EntityManager.GetEntitiesByClass(Hero)]
			obstacles = ents.filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2) && ent.IsAlive && ent.IsVisible && (!(ent instanceof Unit) || !ent.IsInvulnerable))
		}
		const obs2ent = new Map<Obstacle, Entity>()
		obstacles.forEach(ent => obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent))
		return new NavMeshPathfinding(
			new MovingObstacle(
				Vector2.FromVector3(this.Owner.Position),
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
		angle = Vector2.FromVector3(this.Owner.Forward),
		delay = 0,
		obstacles?: Entity[]
	): Nullable<[Entity, number]> {
		if (obstacles === undefined) {
			const ents = [...EntityManager.GetEntitiesByClass(Creep), ...EntityManager.GetEntitiesByClass(Hero)]
			obstacles = ents.filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2) && ent.IsAlive && ent.IsVisible && (!(ent instanceof Unit) || !ent.IsInvulnerable))
		}
		const obs2ent = new Map<Obstacle, Entity>()
		obstacles.forEach(ent => obs2ent.set(ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent), ent))
		const predict_res = new NavMeshPathfinding(
			new MovingObstacle(
				Vector2.FromVector3(this.Owner.Position),
				collision_size,
				angle.MultiplyScalarForThis(speed),
				radius / speed
			),
			[...obs2ent.keys()],
			delay,
		).GetFirstHitObstacle()
		if (predict_res === undefined)
			return undefined
		return [obs2ent.get(predict_res[0])!, predict_res[1]]
	}
	public GetAngleForObstacleFirstHit(
		radius: number,
		collision_size: number,
		target: Entity,
		speed = this.Owner.IdealSpeed,
		delay = 0,
		dynamic_delay_func = (ang: number) => 0,
		obstacles?: Entity[]
	): Nullable<[number, number]> {
		if (obstacles === undefined) {
			const ents = [...EntityManager.GetEntitiesByClass(Creep), ...EntityManager.GetEntitiesByClass(Hero)]
			obstacles = ents.filter(ent => ent !== this.Owner && ent.IsInRange(this.Owner, radius * 2) && ent.IsAlive && ent.IsVisible && (!(ent instanceof Unit) || !ent.IsInvulnerable))
		}
		const ent2obs = new Map<Entity, Obstacle>()
		obstacles.forEach(ent => ent2obs.set(ent, ent instanceof Unit ? MovingObstacle.FromUnit(ent) : Obstacle.FromEntity(ent)))
		return new NavMeshPathfinding(
			new MovingObstacle(
				Vector2.FromVector3(this.Owner.Position),
				collision_size,
				new Vector2(speed, speed),
				radius / speed
			),
			[...ent2obs.values()],
			delay,
		).GetAngleForObstacleFirstHit(ent2obs.get(target)!, dynamic_delay_func)
	}
}
