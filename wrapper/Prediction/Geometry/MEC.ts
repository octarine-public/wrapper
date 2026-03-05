import { Vector3 } from "../../Base/Vector3"

export interface IMECResult {
	Center: Vector3
	Radius: number
}

export class MEC {
	public static GetMEC(points: Vector3[]): IMECResult {
		if (points.length === 0) {
			return { Center: new Vector3(), Radius: 0 }
		}
		if (points.length === 1) {
			return { Center: points[0], Radius: 0 }
		}
		const hull = this.MakeConvexHull(points)
		return this.findMinimalBoundingCircle(hull, points)
	}

	public static MakeConvexHull(points: Vector3[]): Vector3[] {
		if (points.length < 3) {
			return points.slice()
		}
		const pts = points.slice()
		let lowestIdx = 0
		for (let i = 1; i < pts.length; i++) {
			if (
				pts[i].y < pts[lowestIdx].y ||
				(pts[i].y === pts[lowestIdx].y && pts[i].x < pts[lowestIdx].x)
			) {
				lowestIdx = i
			}
		}
		const start = pts[lowestIdx]
		pts.splice(lowestIdx, 1)
		const hull: Vector3[] = [start]
		let sweepAngle = 0
		for (;;) {
			if (pts.length === 0) {
				break
			}
			const last = hull[hull.length - 1]
			let bestIdx = 0
			let bestAngle = 3600
			for (let i = 0; i < pts.length; i++) {
				const angle = this.angleValue(last.x, last.y, pts[i].x, pts[i].y)
				if (angle >= sweepAngle && bestAngle > angle) {
					bestAngle = angle
					bestIdx = i
				}
			}
			const firstAngle = this.angleValue(last.x, last.y, hull[0].x, hull[0].y)
			if (firstAngle >= sweepAngle && bestAngle >= firstAngle) {
				break
			}
			hull.push(pts[bestIdx])
			pts.splice(bestIdx, 1)
			sweepAngle = bestAngle
		}
		return hull
	}

	private static findMinimalBoundingCircle(
		hull: Vector3[],
		allPoints: Vector3[]
	): IMECResult {
		let bestCenter = allPoints[0]
		let bestRadiusSqr = Number.MAX_VALUE
		for (let i = 0; i < hull.length - 1; i++) {
			for (let j = i + 1; j < hull.length; j++) {
				const cx = (hull[i].x + hull[j].x) * 0.5
				const cy = (hull[i].y + hull[j].y) * 0.5
				const center = new Vector3(cx, cy, hull[i].z)
				const dx = cx - hull[i].x
				const dy = cy - hull[i].y
				const radiusSqr = dx * dx + dy * dy
				if (radiusSqr < bestRadiusSqr) {
					if (this.circleEnclosesAll(center, radiusSqr, allPoints)) {
						bestCenter = center
						bestRadiusSqr = radiusSqr
					}
				}
			}
		}
		for (let i = 0; i < hull.length - 2; i++) {
			for (let j = i + 1; j < hull.length - 1; j++) {
				for (let k = j + 1; k < hull.length; k++) {
					const result = this.circleFromThreePoints(hull[i], hull[j], hull[k])
					if (result === undefined) {
						continue
					}
					if (result.radiusSqr < bestRadiusSqr) {
						if (
							this.circleEnclosesAll(
								result.center,
								result.radiusSqr,
								allPoints
							)
						) {
							bestCenter = result.center
							bestRadiusSqr = result.radiusSqr
						}
					}
				}
			}
		}
		return {
			Center: bestCenter,
			Radius: bestRadiusSqr === Number.MAX_VALUE ? 0 : Math.sqrt(bestRadiusSqr)
		}
	}

	private static circleEnclosesAll(
		center: Vector3,
		radiusSqr: number,
		points: Vector3[]
	): boolean {
		const eps = 0.01
		for (let i = 0; i < points.length; i++) {
			const dx = points[i].x - center.x
			const dy = points[i].y - center.y
			if (dx * dx + dy * dy > radiusSqr + eps) {
				return false
			}
		}
		return true
	}

	private static circleFromThreePoints(
		p1: Vector3,
		p2: Vector3,
		p3: Vector3
	): { center: Vector3; radiusSqr: number } | undefined {
		const ax = p1.x
		const ay = p1.y
		const bx = p2.x
		const by = p2.y
		const cx = p3.x
		const cy = p3.y
		const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
		if (Math.abs(d) < 1e-10) {
			return undefined
		}
		const ux =
			((ax * ax + ay * ay) * (by - cy) +
				(bx * bx + by * by) * (cy - ay) +
				(cx * cx + cy * cy) * (ay - by)) /
			d
		const uy =
			((ax * ax + ay * ay) * (cx - bx) +
				(bx * bx + by * by) * (ax - cx) +
				(cx * cx + cy * cy) * (bx - ax)) /
			d
		const center = new Vector3(ux, uy, p1.z)
		const rdx = ax - ux
		const rdy = ay - uy
		return { center, radiusSqr: rdx * rdx + rdy * rdy }
	}

	private static angleValue(x1: number, y1: number, x2: number, y2: number): number {
		const dx = x2 - x1
		const ax = Math.abs(dx)
		const dy = y2 - y1
		const ay = Math.abs(dy)
		if (ax + ay === 0) {
			return 360 / 9
		}
		let t = dy / (ax + ay)
		if (dx < 0) {
			t = 2 - t
		} else if (dy < 0) {
			t = 4 + t
		}
		return t * 90
	}
}
