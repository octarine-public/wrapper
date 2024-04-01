import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { EObstacleType } from "../../Enums/EObstacleType"
import { GridNavCellFlags } from "../../Enums/GridNavCellFlags"
import { GridNav } from "../../Resources/ParseGNV"
import { DegreesToRadian } from "../../Utils/Math"

type MapObstacle = Map<number, [EObstacleType, Vector3, Vector3, number]>

export class ObstacleManager {
	public readonly Obstacles: MapObstacle = new Map()

	private obstacleId = 1
	private readonly invalid = new Vector3().Invalidate()

	public AddObstacle(
		position: Vector3,
		radius: number,
		end?: Vector3,
		obstacleType?: EObstacleType
	) {
		const endPos = end ?? new Vector3()
		const obstacleId = this.obstacleId++
		const type = end !== undefined ? EObstacleType.Line : EObstacleType.Circle
		this.Obstacles.set(obstacleId, [obstacleType ?? type, position, endPos, radius])
		return obstacleId
	}

	public GetBestPosition(
		position: Vector3,
		rotationRad: number,
		speed: number,
		turnRate: number,
		hullRadius: number,
		flying: boolean
	): Vector3 {
		if (GridNav === undefined) {
			throw "Grid navigation is not initialized."
		}

		if (speed === 0) {
			return this.invalid
		}

		const angleStep = 45,
			offsetStep = 24,
			position2D = Vector2.FromVector3(position),
			direction = Vector2.FromAngle(rotationRad)

		let maxTime = Infinity,
			bestPosition: Nullable<Vector2>

		for (let deg = 0; deg < 360; deg += angleStep) {
			const rotatedDirection = direction.Rotated(DegreesToRadian(deg))

			for (let offset = offsetStep; offset < 300; offset += offsetStep) {
				const rotationPoint = position2D.Rotation(rotatedDirection, offset)
				const flags = GridNav.GetCellFlagsForPos(rotationPoint)
				if (this.shouldBreak(flying, flags)) {
					break
				}
				if (this.hasObstacle(rotationPoint, hullRadius)) {
					continue
				}
				const totalTime = this.getTotalTime(
					position2D,
					rotationPoint,
					rotationRad,
					speed,
					turnRate
				)
				if (bestPosition === undefined || totalTime < maxTime) {
					maxTime = totalTime
					bestPosition = rotationPoint
				}
			}
		}
		if (bestPosition === undefined) {
			return this.invalid
		}
		return Vector3.FromVector2(bestPosition)
	}

	public DeleteObstacle(obstacleId: number) {
		this.Obstacles.delete(obstacleId)
	}

	public ClearObstacles() {
		this.obstacleId = 1
		this.Obstacles.clear()
	}

	private getTotalTime(
		position: Vector2,
		rotationPoint: Vector2,
		rotationRad: number,
		speed: number,
		turnRate: number
	) {
		const minRotation = turnRate / speed
		const rotationAngle = position.FindRotationAngle(rotationPoint, rotationRad)
		const rotTime = rotationAngle > minRotation ? position.RotationTime(turnRate) : 0
		return position.Distance(rotationPoint) / speed + rotTime
	}

	private hasObstacle(targetPosition: Vector2, hullRadius: number): boolean {
		let isSome = false
		this.Obstacles.forEach(([obstacleType, startPos, endPos, obstacleRadius]) => {
			const radius = obstacleRadius + hullRadius
			isSome =
				obstacleType === EObstacleType.Circle
					? this.isCircle(targetPosition, startPos, radius)
					: this.isLine(targetPosition, startPos, endPos, radius)
		})
		return isSome
	}

	private shouldBreak(flying: boolean, flags: number): boolean {
		if (flying) {
			return false
		}
		if (
			flags.hasBit(GridNavCellFlags.Tree) ||
			!flags.hasBit(GridNavCellFlags.Walkable) ||
			flags.hasBit(GridNavCellFlags.MovementBlocker)
		) {
			return true
		}
		return false
	}

	private isLine(
		position: Vector2,
		startPos: Vector3,
		endPos: Vector3,
		radius: number
	) {
		const projection = position.ProjectOn(
			Vector2.FromVector3(startPos),
			Vector2.FromVector3(endPos)
		)
		if (!projection.IsOnSegment) {
			return false
		}
		return projection.SegmentPoint.Distance(position) < radius
	}

	private isCircle(position: Vector2, center: Vector3, radius: number) {
		return position.Distance(Vector2.FromVector3(center)) <= radius
	}
}
