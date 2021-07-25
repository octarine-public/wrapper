import { WorldPolygon } from "../Geometry/WorldPolygon"
import Vector3 from "./Vector3"

export default class AABB {
	constructor(
		public readonly Base = new Vector3(),
		public readonly MinOffset = new Vector3(),
		public readonly MaxOffset = new Vector3(),
		public DeltaZ = 0,
	) { }

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
			new Vector3(min.x, max.y, min.z),
		]
	}
	public get Polygon(): WorldPolygon {
		const max_z = this.Base.z + this.MaxOffset.z + this.DeltaZ
		const base_points = this.Points
		return new WorldPolygon(
			base_points[0],
			base_points[1],
			base_points[2],
			base_points[3],
			base_points[0],
			base_points[0].Clone().SetZ(max_z),
			base_points[1].Clone().SetZ(max_z),
			base_points[1],
			base_points[1].Clone().SetZ(max_z),
			base_points[2].Clone().SetZ(max_z),
			base_points[2],
			base_points[2].Clone().SetZ(max_z),
			base_points[3].Clone().SetZ(max_z),
			base_points[3],
			base_points[3].Clone().SetZ(max_z),
			base_points[0].Clone().SetZ(max_z),
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
