/// internal declarations
/// you may use ONLY this ones & default V8 things
declare var global: any

/// actual code
global.QAngle = class QAngle extends Vector3 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset: number = 0): QAngle {
		return buffer
			? new QAngle(
				IOBuffer[offset + 0],
				IOBuffer[offset + 1],
				IOBuffer[offset + 2])
			: new QAngle();
	}

	get Angle(): number {
		return this.DegreesToRadians().Angle
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