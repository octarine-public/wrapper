import Obstacle from "./Obstacle"
import MovingObstacle from "./MovingObstacle"

export default class NavMeshPathfinding {
	constructor(
		public readonly PredictionTarget: MovingObstacle,
		public readonly Obstacles: Obstacle[],
	) { }

	public GetHitObstacle(): Nullable<Obstacle> {
		if (this.Obstacles.length === 0)
			return undefined
		let end_time = this.Obstacles.some(obs => obs instanceof MovingObstacle) ? this.PredictionTarget.EndTime : 0.03
		for (let time = 0; time < end_time; time += 0.03) {
			let target_pos = this.PredictionTarget.PositionAtTime(time)
			let result = (this.Obstacles.map(obs => [obs, obs.PositionAtTime(time).Distance(target_pos) - obs.Radius]) as [Obstacle, number][]).sort(([, dst1], [, dst2]) => dst1 - dst2)
			if (result[0][1] <= this.PredictionTarget.Radius)
				return result[0][0]
		}
		return undefined
	}
}
