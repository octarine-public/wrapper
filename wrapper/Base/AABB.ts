import { WorldPolygon } from "../Geometry/WorldPolygon"
import { Vector3 } from "./Vector3"

export class AABB {
	constructor(
		public readonly Base = new Vector3(),
		public readonly MinOffset = new Vector3(),
		public readonly MaxOffset = new Vector3(),
		public DeltaZ = 0
	) {}

	public get MaxZ(): number {
		return this.Base.z + this.MaxOffset.z + this.DeltaZ
	}
	public get Min(): Vector3 {
		return this.Base.Add(this.MinOffset).AddScalarZ(this.DeltaZ)
	}
	public get Max(): Vector3 {
		return this.Base.Add(this.MaxOffset).AddScalarZ(this.DeltaZ)
	}
	public get Points(): Vector3[] {
		const min = this.Min,
			max = this.Max
		return [
			min,
			new Vector3(max.x, min.y, min.z),
			new Vector3(max.x, max.y, min.z),
			new Vector3(min.x, max.y, min.z)
		]
	}
	public get Polygon(): WorldPolygon {
		const maxZ = this.MaxZ
		const basePoints = this.Points
		return new WorldPolygon(
			basePoints[0],
			basePoints[1],
			basePoints[2],
			basePoints[3],
			basePoints[0],
			basePoints[0].Clone().SetZ(maxZ),
			basePoints[1].Clone().SetZ(maxZ),
			basePoints[1],
			basePoints[1].Clone().SetZ(maxZ),
			basePoints[2].Clone().SetZ(maxZ),
			basePoints[2],
			basePoints[2].Clone().SetZ(maxZ),
			basePoints[3].Clone().SetZ(maxZ),
			basePoints[3],
			basePoints[3].Clone().SetZ(maxZ),
			basePoints[0].Clone().SetZ(maxZ)
		)
	}
	public Distance(vec: Vector3): number {
		return this.Points.reduce((a, b) => Math.min(a, b.Distance(vec)), Infinity)
	}
	public SetFromMinMax(min: Vector3, max: Vector3): this {
		this.Base.toZero()
		this.MinOffset.toZero()
		this.MaxOffset.toZero()
		this.DeltaZ = 0

		this.Base.AddForThis(min).AddForThis(max).DivideScalarForThis(2)
		this.MinOffset.AddForThis(min).SubtractForThis(this.Base)
		this.MaxOffset.AddForThis(max).SubtractForThis(this.Base)

		return this
	}
}
