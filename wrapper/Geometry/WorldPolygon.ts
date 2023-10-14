import { Color } from "../Base/Color"
import { Vector3 } from "../Base/Vector3"
import { ParticlesSDK } from "../Managers/ParticleManager"
import { RendererSDK } from "../Native/RendererSDK"
import { Entity } from "../Objects/Base/Entity"

export class WorldPolygon {
	public Points: Vector3[] = []

	constructor(...points: Vector3[]) {
		this.Points = points
	}
	public get Center(): Vector3 {
		return this.Points.reduce(
			(a, b) => a.AddForThis(b),
			new Vector3()
		).DivideScalarForThis(this.Points.length)
	}
	public Add(polygon: WorldPolygon | Vector3): void {
		if (polygon instanceof WorldPolygon) {
			polygon.Points.forEach(point => this.AddPoint(point))
		} else {
			this.AddPoint(polygon)
		}
	}

	public Draw(
		key: string,
		ent: Entity,
		particleManager: ParticlesSDK,
		color: Color,
		width = 10,
		mode2D = 10,
		useParticles = true
	): void {
		for (let i = 0; i < this.Points.length; i++) {
			const nextIndex = this.Points.length - 1 === i ? 0 : i + 1
			if (!useParticles) {
				const point1 = RendererSDK.WorldToScreen(this.Points[i], false),
					point2 = RendererSDK.WorldToScreen(this.Points[nextIndex], false)
				if (point1 !== undefined && point2 !== undefined) {
					RendererSDK.Line(point1, point2, color, width / 8)
				}
			} else {
				particleManager.DrawLine(`${key}_${i}`, ent, this.Points[nextIndex], {
					Position: this.Points[i],
					Color: color,
					Width: width,
					Mode2D: mode2D
				})
			}
		}
	}
	public Destroy(key: string, particleManager: ParticlesSDK): void {
		for (let i = 0; i < this.Points.length; i++) {
			particleManager.DestroyByKey(`${key}_${i}`)
		}
	}

	public IsInside(point: Vector3): boolean {
		return !this.IsOutside(point)
	}
	public IsOutside(point: Vector3): boolean {
		return this.PointInPolygon(point) === 0
	}
	private AddPoint(point: Vector3): void {
		this.Points.push(point)
	}
	private PointInPolygon(point: Vector3): number {
		let result = 0
		const cnt = this.Points.length
		if (cnt < 3) {
			return 0
		}

		let ip = this.Points[0]
		for (let i = 1; i <= cnt; i++) {
			const ipNext = i === cnt ? this.Points[0] : this.Points[i]
			if (
				ipNext.y === point.y &&
				(ipNext.x === point.x ||
					(ip.y === point.y && ipNext.x > point.x === ip.x < point.x))
			) {
				return -1
			}

			if (ip.y < point.y !== ipNext.y < point.y) {
				if (ip.x >= point.x) {
					if (ipNext.x > point.x) {
						result = 1 - result
					} else {
						const d =
							(ip.x - point.x) * (ipNext.y - point.y) -
							(ipNext.x - point.x) * (ip.y - point.y)
						if (d === 0) {
							return -1
						}
						if (d > 0 === ipNext.y > ip.y) {
							result = 1 - result
						}
					}
				} else if (ipNext.x > point.x) {
					const d2 =
						(ip.x - point.x) * (ipNext.y - point.y) -
						(ipNext.x - point.y) * (ip.y - point.y)
					if (d2 === 0) {
						return -1
					}
					if (d2 > 0 === ipNext.y > ip.y) {
						result = 1 - result
					}
				}
			}
			ip = ipNext
		}
		return result
	}
}
