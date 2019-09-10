import Vector3 from "../Base/Vector3";
import Color from "../Base/Color";

export class WorldPolygon {
	public Points: Vector3[] = [];
	
	public WorldPolygon(...points: Vector3[]) {
		this.Points = points
	}
	private AddPoint(point: Vector3) {
		this.Points.push(point)
	}
	public Add(polygon: WorldPolygon | Vector3): void {
		if (polygon instanceof WorldPolygon) {
			// loop-optimizer: FORWARD
			polygon.Points.forEach(point => this.AddPoint(point))
		} else
			this.AddPoint(polygon)
	}
}