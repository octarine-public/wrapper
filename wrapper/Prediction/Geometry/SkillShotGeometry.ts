import { Vector3 } from "../../Base/Vector3"

export class SkillShotGeometry {
	public static LineCircleIntersection(
		lineStart: Vector3,
		lineEnd: Vector3,
		circleCenter: Vector3,
		circleRadius: number
	): boolean {
		const closest = this.ClosestPointOnLineSegment(circleCenter, lineStart, lineEnd)
		return circleCenter.Distance2D(closest) <= circleRadius
	}

	public static ClosestPointOnLineSegment(
		point: Vector3,
		lineStart: Vector3,
		lineEnd: Vector3
	): Vector3 {
		const dx = lineEnd.x - lineStart.x
		const dy = lineEnd.y - lineStart.y
		const lengthSqr = dx * dx + dy * dy
		if (lengthSqr === 0) {
			return lineStart
		}
		let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSqr
		t = Math.max(0, Math.min(1, t))
		return new Vector3(lineStart.x + t * dx, lineStart.y + t * dy, lineStart.z)
	}

	public static PointInCone(
		point: Vector3,
		coneOrigin: Vector3,
		coneDirection: Vector3,
		coneAngle: number,
		coneRange: number
	): boolean {
		const dist = coneOrigin.Distance2D(point)
		if (dist > coneRange) {
			return false
		}
		const dx = point.x - coneOrigin.x
		const dy = point.y - coneOrigin.y
		const len = Math.sqrt(dx * dx + dy * dy)
		if (len === 0) {
			return true
		}
		const dirX = dx / len
		const dirY = dy / len
		const coneLen = Math.sqrt(
			coneDirection.x * coneDirection.x + coneDirection.y * coneDirection.y
		)
		if (coneLen === 0) {
			return false
		}
		const coneDirX = coneDirection.x / coneLen
		const coneDirY = coneDirection.y / coneLen
		const dot = dirX * coneDirX + dirY * coneDirY
		const halfAngle = (coneAngle * Math.PI) / 360
		return dot >= Math.cos(halfAngle)
	}

	public static CirclesIntersect(
		c1: Vector3,
		r1: number,
		c2: Vector3,
		r2: number
	): boolean {
		return c1.Distance2D(c2) <= r1 + r2
	}

	public static PointInRectangle(
		point: Vector3,
		center: Vector3,
		halfWidth: number,
		halfHeight: number,
		rotationRad: number
	): boolean {
		const dx = point.x - center.x
		const dy = point.y - center.y
		const cos = Math.cos(-rotationRad)
		const sin = Math.sin(-rotationRad)
		const localX = dx * cos - dy * sin
		const localY = dx * sin + dy * cos
		return Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight
	}

	public static LineRectangleIntersection(
		lineStart: Vector3,
		lineEnd: Vector3,
		center: Vector3,
		halfWidth: number,
		halfHeight: number,
		rotationRad: number
	): boolean {
		const cos = Math.cos(-rotationRad)
		const sin = Math.sin(-rotationRad)
		const localStart = this.toLocal(lineStart, center, cos, sin)
		const localEnd = this.toLocal(lineEnd, center, cos, sin)
		return this.lineIntersectsAABB(
			localStart[0],
			localStart[1],
			localEnd[0],
			localEnd[1],
			-halfWidth,
			-halfHeight,
			halfWidth,
			halfHeight
		)
	}

	public static DistanceToLineSegmentSqr(
		point: Vector3,
		lineStart: Vector3,
		lineEnd: Vector3
	): number {
		const closest = this.ClosestPointOnLineSegment(point, lineStart, lineEnd)
		const dx = point.x - closest.x
		const dy = point.y - closest.y
		return dx * dx + dy * dy
	}

	private static toLocal(
		point: Vector3,
		center: Vector3,
		cos: number,
		sin: number
	): [number, number] {
		const dx = point.x - center.x
		const dy = point.y - center.y
		return [dx * cos - dy * sin, dx * sin + dy * cos]
	}

	private static lineIntersectsAABB(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		minX: number,
		minY: number,
		maxX: number,
		maxY: number
	): boolean {
		if (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) {
			return true
		}
		if (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY) {
			return true
		}
		const dx = x2 - x1
		const dy = y2 - y1
		let tMin = 0
		let tMax = 1
		if (dx !== 0) {
			const tx1 = (minX - x1) / dx
			const tx2 = (maxX - x1) / dx
			tMin = Math.max(tMin, Math.min(tx1, tx2))
			tMax = Math.min(tMax, Math.max(tx1, tx2))
		} else if (x1 < minX || x1 > maxX) {
			return false
		}
		if (dy !== 0) {
			const ty1 = (minY - y1) / dy
			const ty2 = (maxY - y1) / dy
			tMin = Math.max(tMin, Math.min(ty1, ty2))
			tMax = Math.min(tMax, Math.max(ty1, ty2))
		} else if (y1 < minY || y1 > maxY) {
			return false
		}
		return tMin <= tMax
	}
}
