import Obstacle from "./Obstacle"
import MovingObstacle from "./MovingObstacle"
import { Vector2, MathSDK } from "../../Imports"

export default class NavMeshPathfinding {
	constructor(
		public readonly PredictionSource: MovingObstacle,
		public readonly Obstacles: Obstacle[],
		public Delay = 0,
	) { }

	public GetHitObstacles(): Obstacle[] {
		let hit_obstacles: Obstacle[] = []
		if (this.Obstacles.length === 0)
			return hit_obstacles
		for (let time = 0; time < this.PredictionSource.EndTime; time += 1 / 30) {
			let src_pos = this.PredictionSource.PositionAtTime(time)
			let result = (this.Obstacles.map(obs => [obs.PositionAtTime(this.Delay + time).Distance(src_pos) - obs.Radius, obs]) as [number, Obstacle][])
				.filter(obs => obs[0] < this.PredictionSource.Radius)
				.map(obs => obs[1])

			hit_obstacles.push(...result)
		}
		return [...new Set(hit_obstacles)]
	}
	protected RayTraceFirstHit(time: number): Nullable<Obstacle> {
		let src_pos = this.PredictionSource.PositionAtTime(time)
		let result = (this.Obstacles.map(obs => [obs.PositionAtTime(this.Delay + time).Distance(src_pos) - obs.Radius, obs]) as [number, Obstacle][]).sort(([dst1], [dst2]) => dst1 - dst2)
		if (result[0][0] < this.PredictionSource.Radius) {
			//console.log(this.Delay, time, result[0][0], EntityManager.AllEntities.find(e => e.Position.toVector2().LengthSqr === result[0][1].PositionAtTime(0).LengthSqr)!.Name)
			return result[0][1]
		}
		return undefined
	}
	public GetFirstHitObstacle(): Nullable<Obstacle> {
		if (this.Obstacles.length === 0)
			return undefined
		for (let time = 0; time < this.PredictionSource.EndTime; time += 1 / 30) {
			let result = this.RayTraceFirstHit(time)
			if (result !== undefined)
				return result
		}
		return undefined
	}
	/**
	 * Pass ONLY speed to PredictionSource#Velocity vector
	 * @param target MUST be passed in this#Obstacles
	 */
	public GetAngleForObstacleFirstHit(target: Obstacle, dynamic_delay_func = (ang: number) => 0): Nullable<number> {
		if (this.Obstacles.length === 0 || !this.Obstacles.some(obs => obs === target))
			return undefined
		let orig_velocity = this.PredictionSource.Velocity.Clone()
		let orig_delay = this.Delay
		let blocked_spots: number[] = []
		for (let time = 0; time < this.PredictionSource.EndTime; time += 1 / 30) {
			let target_pos = target.PositionAtTime(time)
			let ang = MathSDK.RadianToDegrees(this.PredictionSource.PositionAtTime(0).GetDirectionTo(target_pos).Angle)
			for (let i = -5; i <= 5; i += 1) {
				let new_ang = MathSDK.DegreesToRadian(ang + i)
				if (blocked_spots.includes(new_ang))
					continue
				this.PredictionSource.Velocity.MultiplyForThis(Vector2.FromAngle(new_ang))
				this.Delay = orig_delay + dynamic_delay_func(new_ang)
				let result = this.RayTraceFirstHit(time)
				if (result === target)
					return new_ang
				if (result !== undefined)
					blocked_spots.push(new_ang)
				this.PredictionSource.Velocity.CopyFrom(orig_velocity)
			}
		}
		return undefined
	}
}
