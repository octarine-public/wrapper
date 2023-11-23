import { Vector2 } from "../Base/Vector2"

export class ProjectionInfo {
	constructor(
		public readonly SegmentPoint: Vector2,
		public readonly LinePoint: Vector2
	) {}

	public get IsOnSegment(): boolean {
		return this.SegmentPoint.Equals(this.LinePoint)
	}
}
