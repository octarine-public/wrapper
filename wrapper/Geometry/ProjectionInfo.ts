import Vector2 from "../Base/Vector2"

export class ProjectionInfo {
	constructor(
		public IsOnSegment: boolean,
		public SegmentPoint: Vector2,
		public LinePoint: Vector2,
	) {}
}
