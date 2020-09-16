import Vector3 from "./Vector3"

export default class QAngle extends Vector3 {
	public toString(): string {
		return "QAngle(" + this.x + "," + this.y + "," + this.z + ")"
	}
}
