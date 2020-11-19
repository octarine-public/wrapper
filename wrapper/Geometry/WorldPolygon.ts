import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import RendererSDK from "../Native/RendererSDK"

export class WorldPolygon {
	public Points: Vector3[] = []

	constructor(...points: Vector3[]) {
		this.Points = points
	}
	public Add(polygon: WorldPolygon | Vector3): void {
		if (polygon instanceof WorldPolygon)
			polygon.Points.forEach(point => this.AddPoint(point))
		else
			this.AddPoint(polygon)
	}
	public Draw(color: Color, width = 1): void {
		const cam_pos = Vector3.fromIOBuffer(Camera.Position)!,
			cam_ang = QAngle.fromIOBuffer(Camera.Angles)!,
			cam_dist = Camera.Distance ?? 1200
		for (let i = 0, end = this.Points.length; i < end; i++) {
			const j = i + 1 % end
			const pos1 = RendererSDK.WorldToScreenCustom(this.Points[i], cam_pos, cam_dist, cam_ang),
				pos2 = RendererSDK.WorldToScreenCustom(this.Points[j], cam_pos, cam_dist, cam_ang)
			if (pos1 !== undefined && pos2 !== undefined)
				RendererSDK.Line(pos1, pos2, color)
		}
	}
	/**
	 *
	 * @description Need test
	 */
	public IsInside(point: Vector3) {
		return !this.IsOutside(point)
	}
	public IsOutside(point: Vector3) {
		return this.PointInPolygon(point) === 0
	}
	private AddPoint(point: Vector3) {
		this.Points.push(point)
	}
	private PointInPolygon(point: Vector3) {
		let result = 0
		const cnt = this.Points.length
		if (cnt < 3)
			return 0

		let ip = this.Points[0]
		for (let i = 1; i <= cnt; i++) {
			const ipNext = (i === cnt) ? this.Points[0] : this.Points[i]
			if (ipNext.y === point.y && (ipNext.x === point.x || (ip.y === point.y && ipNext.x > point.x === ip.x < point.x)))
				return -1

			if (ip.y < point.y !== ipNext.y < point.y) {
				if (ip.x >= point.x) {
					if (ipNext.x > point.x) {
						result = 1 - result
					} else {
						const d = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.x) * (ip.y - point.y)
						if (d === 0)
							return -1
						if (d > 0 === ipNext.y > ip.y)
							result = 1 - result
					}
				} else if (ipNext.x > point.x) {
					const d2 = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.y) * (ip.y - point.y)
					if (d2 === 0)
						return -1
					if (d2 > 0 === ipNext.y > ip.y)
						result = 1 - result
				}
			}
			ip = ipNext
		}
		return result
	}

	/*
	public PointInPolygon(point: Vector3): number {
		if (this.Points.length < 3)
			return 0
		let result = 0
		for (let i = 0, end = this.Points.length; i < end; i++) {
			let point1 = this.Points[i],
				point2 = this.Points[i + 1 % end]
			if (point2.y === point.y && (point2.x === point.x || (point1.y === point.y && (point2.x > point.x) === (point1.x < point.x))))
				return -1
			if ((point1.y < point.y) === (point2.y < point.y))
				continue
			if (point1.x >= point.x) {
				if (point2.x <= point.x) {
					let d = (point1.x - point.x) * (point2.y - point.y) - (point2.x - point.x) * (point1.y - point.y)
					if (d === 0)
						return -1
					if ((d > 0) === (point2.y > point1.y))
						result = 1 - result
				} else
					result = 1 - result
			} else if (point2.x > point.x) {
				let d = (point1.x - point.x) * (point2.y - point.y) - (point2.x - point.x) * (point1.y - point.y)
				if (d === 0)
					return -1
				if ((d > 0) === (point2.y > point1.y))
					result = 1 - result
			}
		}
		return result
	}
	*/
}
