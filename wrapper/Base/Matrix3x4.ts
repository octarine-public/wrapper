import { QAngle } from "./QAngle"
import { Vector3 } from "./Vector3"

export class Matrix3x4 {
	public static AngleMatrix(ang: QAngle, pos: Vector3, scale: number): Matrix3x4 {
		const matrix = new Matrix3x4()
		const yaw = Math.degreesToRadian(ang.y),
			pitch = Math.degreesToRadian(ang.x),
			roll = Math.degreesToRadian(ang.z)
		const sr = Math.sin(roll),
			sp = Math.sin(pitch),
			sy = Math.sin(yaw),
			cr = Math.cos(roll),
			cp = Math.cos(pitch),
			cy = Math.cos(yaw)

		// matrix = (YAW * PITCH) * ROLL
		matrix.SetRowValue(0, 0, scale * (cp * cy))
		matrix.SetRowValue(1, 0, scale * (cp * sy))
		matrix.SetRowValue(2, 0, scale * -sp)

		const crcy = cr * cy,
			crsy = cr * sy,
			srcy = sr * cy,
			srsy = sr * sy

		matrix.SetRowValue(0, 1, scale * (sp * srcy - crsy))
		matrix.SetRowValue(1, 1, scale * (sp * srsy + crcy))
		matrix.SetRowValue(2, 1, scale * (sr * cp))

		matrix.SetRowValue(0, 2, scale * (sp * crcy + srsy))
		matrix.SetRowValue(1, 2, scale * (sp * crsy - srcy))
		matrix.SetRowValue(2, 2, scale * (cr * cp))

		matrix.SetRowValue(0, 3, pos.x)
		matrix.SetRowValue(1, 3, pos.y)
		matrix.SetRowValue(2, 3, pos.z)

		return matrix
	}
	public static ConcatTransforms(in1: Matrix3x4, in2: Matrix3x4): Matrix3x4 {
		const out = new Matrix3x4()

		out.SetRowValue(
			0,
			0,
			in1.GetRowValue(0, 0) * in2.GetRowValue(0, 0) +
				in1.GetRowValue(0, 1) * in2.GetRowValue(1, 0) +
				in1.GetRowValue(0, 2) * in2.GetRowValue(2, 0)
		)
		out.SetRowValue(
			0,
			1,
			in1.GetRowValue(0, 0) * in2.GetRowValue(0, 1) +
				in1.GetRowValue(0, 1) * in2.GetRowValue(1, 1) +
				in1.GetRowValue(0, 2) * in2.GetRowValue(2, 1)
		)
		out.SetRowValue(
			0,
			2,
			in1.GetRowValue(0, 0) * in2.GetRowValue(0, 2) +
				in1.GetRowValue(0, 1) * in2.GetRowValue(1, 2) +
				in1.GetRowValue(0, 2) * in2.GetRowValue(2, 2)
		)
		out.SetRowValue(
			0,
			3,
			in1.GetRowValue(0, 0) * in2.GetRowValue(0, 3) +
				in1.GetRowValue(0, 1) * in2.GetRowValue(1, 3) +
				in1.GetRowValue(0, 2) * in2.GetRowValue(2, 3) +
				in1.GetRowValue(0, 3)
		)
		out.SetRowValue(
			1,
			0,
			in1.GetRowValue(1, 0) * in2.GetRowValue(0, 0) +
				in1.GetRowValue(1, 1) * in2.GetRowValue(1, 0) +
				in1.GetRowValue(1, 2) * in2.GetRowValue(2, 0)
		)
		out.SetRowValue(
			1,
			1,
			in1.GetRowValue(1, 0) * in2.GetRowValue(0, 1) +
				in1.GetRowValue(1, 1) * in2.GetRowValue(1, 1) +
				in1.GetRowValue(1, 2) * in2.GetRowValue(2, 1)
		)
		out.SetRowValue(
			1,
			2,
			in1.GetRowValue(1, 0) * in2.GetRowValue(0, 2) +
				in1.GetRowValue(1, 1) * in2.GetRowValue(1, 2) +
				in1.GetRowValue(1, 2) * in2.GetRowValue(2, 2)
		)
		out.SetRowValue(
			1,
			3,
			in1.GetRowValue(1, 0) * in2.GetRowValue(0, 3) +
				in1.GetRowValue(1, 1) * in2.GetRowValue(1, 3) +
				in1.GetRowValue(1, 2) * in2.GetRowValue(2, 3) +
				in1.GetRowValue(1, 3)
		)
		out.SetRowValue(
			2,
			0,
			in1.GetRowValue(2, 0) * in2.GetRowValue(0, 0) +
				in1.GetRowValue(2, 1) * in2.GetRowValue(1, 0) +
				in1.GetRowValue(2, 2) * in2.GetRowValue(2, 0)
		)
		out.SetRowValue(
			2,
			1,
			in1.GetRowValue(2, 0) * in2.GetRowValue(0, 1) +
				in1.GetRowValue(2, 1) * in2.GetRowValue(1, 1) +
				in1.GetRowValue(2, 2) * in2.GetRowValue(2, 1)
		)
		out.SetRowValue(
			2,
			2,
			in1.GetRowValue(2, 0) * in2.GetRowValue(0, 2) +
				in1.GetRowValue(2, 1) * in2.GetRowValue(1, 2) +
				in1.GetRowValue(2, 2) * in2.GetRowValue(2, 2)
		)
		out.SetRowValue(
			2,
			3,
			in1.GetRowValue(2, 0) * in2.GetRowValue(0, 3) +
				in1.GetRowValue(2, 1) * in2.GetRowValue(1, 3) +
				in1.GetRowValue(2, 2) * in2.GetRowValue(2, 3) +
				in1.GetRowValue(2, 3)
		)

		return out
	}

	public readonly values = new Float32Array(3 * 4)
	public GetRowValue(row: number, col: number): number {
		return this.values[row * 4 + col]
	}
	public SetRowValue(row: number, col: number, val: number): void {
		this.values[row * 4 + col] = val
	}

	public get Angles(): Vector3 {
		const angles = new Vector3()

		const forward = [
			this.GetRowValue(0, 0),
			this.GetRowValue(1, 0),
			this.GetRowValue(2, 0)
		]
		const left = [
			this.GetRowValue(0, 1),
			this.GetRowValue(1, 1),
			this.GetRowValue(2, 1)
		]
		const upZ = this.GetRowValue(2, 2),
			xyDist = Math.sqrt(forward[0] * forward[0] + forward[1] * forward[1])

		if (xyDist > 0.001) {
			angles.y = Math.atan2(forward[1], forward[0])
			angles.x = Math.atan2(-forward[2], xyDist)
			angles.z = Math.atan2(left[2], upZ)
		} else {
			angles.y = Math.atan2(-left[0], left[1])
			angles.x = Math.atan2(-forward[2], xyDist)
			angles.z = 0
		}

		return angles
	}

	public get Translation(): Vector3 {
		return new Vector3(
			this.GetRowValue(0, 3),
			this.GetRowValue(1, 3),
			this.GetRowValue(2, 3)
		)
	}
}
