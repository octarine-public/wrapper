import { Vector3 } from "./Vector3"
import { Vector4 } from "./Vector4"

export const Matrix4x4Identity = [
	1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
]

export class Matrix3x4 {
	public static AngleMatrix(quat: Vector4, pos: Vector3): Matrix3x4 {
		const ang = Matrix3x4.QuaternionMatrix(quat).Angles
		const matrix = new Matrix3x4()
		const yaw = ang.y,
			pitch = ang.x,
			roll = ang.z
		const sr = Math.sin(roll),
			sp = Math.sin(pitch),
			sy = Math.sin(yaw),
			cr = Math.cos(roll),
			cp = Math.cos(pitch),
			cy = Math.cos(yaw)

		// matrix = (YAW * PITCH) * ROLL
		matrix.SetRowValue(0, 0, cp * cy)
		matrix.SetRowValue(1, 0, cp * sy)
		matrix.SetRowValue(2, 0, -sp)

		const crcy = cr * cy,
			crsy = cr * sy,
			srcy = sr * cy,
			srsy = sr * sy

		matrix.SetRowValue(0, 1, sp * srcy - crsy)
		matrix.SetRowValue(1, 1, sp * srsy + crcy)
		matrix.SetRowValue(2, 1, sr * cp)

		matrix.SetRowValue(0, 2, sp * crcy + srsy)
		matrix.SetRowValue(1, 2, sp * crsy - srcy)
		matrix.SetRowValue(2, 2, cr * cp)

		matrix.SetRowValue(0, 3, pos.x)
		matrix.SetRowValue(1, 3, pos.y)
		matrix.SetRowValue(2, 3, pos.z)

		return matrix
	}
	public static QuaternionMatrix(q: Vector4): Matrix3x4 {
		const res = new Matrix3x4()

		res.SetRowValue(0, 0, 1 - 2 * q.y * q.y - 2 * q.z * q.z)
		res.SetRowValue(1, 0, 2 * q.x * q.y + 2 * q.w * q.z)
		res.SetRowValue(2, 0, 2 * q.x * q.z - 2 * q.w * q.y)

		res.SetRowValue(0, 1, 2 * q.x * q.y - 2 * q.w * q.z)
		res.SetRowValue(1, 1, 1 - 2 * q.x * q.x - 2 * q.z * q.z)
		res.SetRowValue(2, 1, 2 * q.y * q.z + 2 * q.w * q.x)

		res.SetRowValue(0, 2, 2 * q.x * q.z + 2 * q.w * q.y)
		res.SetRowValue(1, 2, 2 * q.y * q.z - 2 * q.w * q.x)
		res.SetRowValue(2, 2, 1 - 2 * q.x * q.x - 2 * q.y * q.y)

		res.SetRowValue(0, 3, 0)
		res.SetRowValue(1, 3, 0)
		res.SetRowValue(2, 3, 0)

		return res
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
