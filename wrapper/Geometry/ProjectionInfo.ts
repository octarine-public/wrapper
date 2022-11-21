import { Vector2 } from "../Base/Vector2"

export class ProjectionInfo {
	constructor(public SegmentPoint: Vector2, public LinePoint: Vector2) {}

	public get IsOnSegment(): boolean {
		return this.SegmentPoint.Equals(this.LinePoint)
	}
}
