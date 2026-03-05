import { Vector3 } from "../../Base/Vector3"

export class ArcGeometry {
	public static GetArcPath(
		origin: Vector3,
		direction: Vector3,
		arcLength: number,
		arcAngle: number,
		segments: number = 20
	): Vector3[] {
		const points: Vector3[] = []
		for (let i = 0; i <= segments; i++) {
			points.push(
				this.PointOnArc(origin, direction, arcLength, arcAngle, i / segments)
			)
		}
		return points
	}

	public static PointOnArc(
		origin: Vector3,
		direction: Vector3,
		arcLength: number,
		arcAngle: number,
		t: number
	): Vector3 {
		const halfAngleRad = (arcAngle * Math.PI) / 360
		const currentAngle = -halfAngleRad + t * 2 * halfAngleRad
		const radius = arcLength / (2 * halfAngleRad || 1)
		const dirLen = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
		if (dirLen === 0) {
			return origin
		}
		const dirX = direction.x / dirLen
		const dirY = direction.y / dirLen
		const perpX = -dirY
		const perpY = dirX
		const centerX = origin.x - perpX * radius
		const centerY = origin.y - perpY * radius
		const startAngle = Math.atan2(perpY, perpX)
		const angle = startAngle + currentAngle
		return new Vector3(
			centerX + Math.cos(angle) * radius,
			centerY + Math.sin(angle) * radius,
			origin.z
		)
	}

	public static IsInsideArc(
		point: Vector3,
		origin: Vector3,
		direction: Vector3,
		arcLength: number,
		arcAngle: number,
		width: number,
		segments: number = 20
	): boolean {
		const halfWidth = width * 0.5
		const halfWidthSqr = halfWidth * halfWidth
		for (let i = 0; i < segments; i++) {
			const t0 = i / segments
			const t1 = (i + 1) / segments
			const p0 = this.PointOnArc(origin, direction, arcLength, arcAngle, t0)
			const p1 = this.PointOnArc(origin, direction, arcLength, arcAngle, t1)
			if (this.distToSegmentSqr(point, p0, p1) <= halfWidthSqr) {
				return true
			}
		}
		return false
	}

	public static GetArcHitTime(
		targetPos: Vector3,
		origin: Vector3,
		direction: Vector3,
		arcLength: number,
		arcAngle: number,
		speed: number,
		targetRadius: number,
		segments: number = 20
	): number | undefined {
		if (speed <= 0) {
			return undefined
		}
		const totalTime = arcLength / speed
		const radiusSqr = targetRadius * targetRadius
		let traveledDist = 0
		for (let i = 0; i < segments; i++) {
			const t0 = i / segments
			const t1 = (i + 1) / segments
			const p0 = this.PointOnArc(origin, direction, arcLength, arcAngle, t0)
			const p1 = this.PointOnArc(origin, direction, arcLength, arcAngle, t1)
			const dx = p1.x - p0.x
			const dy = p1.y - p0.y
			const segLen = Math.sqrt(dx * dx + dy * dy)
			if (this.distToSegmentSqr(targetPos, p0, p1) <= radiusSqr) {
				const distToTarget = Math.sqrt(
					(targetPos.x - p0.x) * (targetPos.x - p0.x) +
						(targetPos.y - p0.y) * (targetPos.y - p0.y)
				)
				return (traveledDist + Math.min(distToTarget, segLen)) / speed
			}
			traveledDist += segLen
		}
		if (traveledDist === 0) {
			return totalTime
		}
		return undefined
	}

	private static distToSegmentSqr(
		point: Vector3,
		segStart: Vector3,
		segEnd: Vector3
	): number {
		const dx = segEnd.x - segStart.x
		const dy = segEnd.y - segStart.y
		const lenSqr = dx * dx + dy * dy
		if (lenSqr === 0) {
			const px = point.x - segStart.x
			const py = point.y - segStart.y
			return px * px + py * py
		}
		let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lenSqr
		t = Math.max(0, Math.min(1, t))
		const closestX = segStart.x + t * dx
		const closestY = segStart.y + t * dy
		const rx = point.x - closestX
		const ry = point.y - closestY
		return rx * rx + ry * ry
	}
}
