import Color from "../Base/Color"
import Vector3 from "../Base/Vector3"
import RendererSDK from "../Native/RendererSDK"

export class WorldPolygon {
	public Points: Vector3[] = []

	constructor(...points: Vector3[]) {
		this.Points = points
	}
	public Add(polygon: WorldPolygon | Vector3): void {
		if (polygon instanceof WorldPolygon) {
			// loop-optimizer: FORWARD
			polygon.Points.forEach(point => this.AddPoint(point))
		} else
			this.AddPoint(polygon)
	}
	public Draw(color: Color, width = 1): void {
		for (let i = 0, end = this.Points.length; i < end; i++) {
			let j = i + 1 % end
			let pos1 = RendererSDK.WorldToScreen(this.Points[i]),
				pos2 = RendererSDK.WorldToScreen(this.Points[j])
			RendererSDK.Line(pos1, pos2.Subtract(pos1), color)
		}
	}
	public IsInside(point: Vector3) {
		return !this.IsOutside(point)
	}
	public IsOutside(point: Vector3) {
		return this.PointInPolygon(point) !== 0
	}
	private AddPoint(point: Vector3) {
		this.Points.push(point)
	}
	private PointInPolygon(point: Vector3): number {
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
}
