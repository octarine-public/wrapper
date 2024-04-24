// import { Entity } from "../Objects/Base/Entity"
import { ObstacleManager } from "./ObstacleManager"

// TODO
export const PathfinderSDK = new (class CPathfinder {
	public readonly ObstacleManager = new ObstacleManager()

	// private obstacleAutoId = 0
	// private readonly entityObstacles = new Map<Entity, number[]>()
})()
