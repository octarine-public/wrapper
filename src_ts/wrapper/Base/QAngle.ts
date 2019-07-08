import Vector3 from "./Vector3"

export default class QAngle extends Vector3 {
	/* ================== Static ================== */
	static fromIOBuffer(bufferOrOffset?: boolean | number, offset: number = 0): QAngle {

		if (bufferOrOffset === undefined)
			return new QAngle(IOBuffer[0], IOBuffer[1], IOBuffer[2])

		if (typeof bufferOrOffset === "boolean") {

			if (!bufferOrOffset)
				return new QAngle()

			bufferOrOffset = offset
		}

		return new QAngle(IOBuffer[bufferOrOffset + 0], IOBuffer[bufferOrOffset + 1], IOBuffer[bufferOrOffset + 2])
	}

	/* ================ Constructors ================ */
	/**
	 * Create new QAngle with pitch, yaw, roll
	 *
	 * @example
	 * var QAngle = new QAngle(1, 2, 3)
	 */

	/* ================== To ================== */
	/**
	 * QAngle to String QAngle
	 * @return QAngle(pitch,yaw,roll)
	 */
	toString(): string {
		return "QAngle(" + this.x + "," + this.y + "," + this.z + ")"
	}
}

//global.QAngle = QAngle;