import Vector3 from "./Vector3"
import Vector4 from "./Vector4"

export default class Matrix4x4 {
	public static get Identity(): Matrix4x4 {
		return this.Identity_.Clone()
	}
	public static CreateFromVector4(vec: Vector4): Matrix4x4 {
		const sqx = vec.x * vec.x
		const sqy = vec.y * vec.y
		const sqz = vec.z * vec.z
		const sqw = vec.w * vec.w

		const xy = vec.x * vec.y
		const xz = vec.x * vec.z
		const xw = vec.x * vec.w

		const yz = vec.y * vec.z
		const yw = vec.y * vec.w
		const zw = vec.z * vec.w
		const s2 = 2 / (sqx + sqy + sqz + sqw)

		return new Matrix4x4([
			1 - (s2 * (sqy + sqz)), s2 * (xy + zw), s2 * (xz - yw), 0,
			s2 * (xy - zw), 1 - (s2 * (sqx + sqz)), s2 * (yz + xw), 0,
			s2 * (xz + yw), s2 * (yz - xw), 1 - (s2 * (sqx + sqy)), 0,
			0, 0, 0, 1,
		])
	}
	public static CreateTranslation(vec: Vector3): Matrix4x4 {
		const mat = Matrix4x4.Identity
		mat.SetRowValue(3, 0, vec.x)
		mat.SetRowValue(3, 1, vec.y)
		mat.SetRowValue(3, 2, vec.z)
		return mat
	}
	private static Identity_ = new Matrix4x4([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	])

	public readonly values = new Float32Array(16)
	constructor(values: ArrayLike<number> = []) {
		this.values.set(values)
	}
	public SetIdentity(): Matrix4x4 {
		this.values.set(Matrix4x4.Identity_.values)
		return this
	}
	public at(pos: number): number {
		return this.values[pos]
	}
	public GetRowValue(row: number, col: number): number {
		return this.at((row * 4) + col)
	}
	public SetRowValue(row: number, col: number, val: number): Matrix4x4 {
		this.values[(row * 4) + col] = val
		return this
	}
	public toArray(): number[] {
		const ar: number[] = []
		this.values.forEach(val => ar.push(val))
		return ar
	}
	public Multiply(matrix: Matrix4x4): Matrix4x4 {
		const a00 = this.values[0]
		const a01 = this.values[1]
		const a02 = this.values[2]
		const a03 = this.values[3]
		const a10 = this.values[4]
		const a11 = this.values[5]
		const a12 = this.values[6]
		const a13 = this.values[7]
		const a20 = this.values[8]
		const a21 = this.values[9]
		const a22 = this.values[10]
		const a23 = this.values[11]
		const a30 = this.values[12]
		const a31 = this.values[13]
		const a32 = this.values[14]
		const a33 = this.values[15]

		let b0 = matrix.at(0)
		let b1 = matrix.at(1)
		let b2 = matrix.at(2)
		let b3 = matrix.at(3)

		this.values[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
		this.values[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
		this.values[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
		this.values[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

		b0 = matrix.at(4)
		b1 = matrix.at(5)
		b2 = matrix.at(6)
		b3 = matrix.at(7)

		this.values[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
		this.values[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
		this.values[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
		this.values[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

		b0 = matrix.at(8)
		b1 = matrix.at(9)
		b2 = matrix.at(10)
		b3 = matrix.at(11)

		this.values[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
		this.values[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
		this.values[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
		this.values[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

		b0 = matrix.at(12)
		b1 = matrix.at(13)
		b2 = matrix.at(14)
		b3 = matrix.at(15)

		this.values[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
		this.values[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
		this.values[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
		this.values[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

		return this
	}
	public Invert(): Matrix4x4 {
		const a00 = this.values[0]
		const a01 = this.values[1]
		const a02 = this.values[2]
		const a03 = this.values[3]
		const a10 = this.values[4]
		const a11 = this.values[5]
		const a12 = this.values[6]
		const a13 = this.values[7]
		const a20 = this.values[8]
		const a21 = this.values[9]
		const a22 = this.values[10]
		const a23 = this.values[11]
		const a30 = this.values[12]
		const a31 = this.values[13]
		const a32 = this.values[14]
		const a33 = this.values[15]

		const det00 = a00 * a11 - a01 * a10
		const det01 = a00 * a12 - a02 * a10
		const det02 = a00 * a13 - a03 * a10
		const det03 = a01 * a12 - a02 * a11
		const det04 = a01 * a13 - a03 * a11
		const det05 = a02 * a13 - a03 * a12
		const det06 = a20 * a31 - a21 * a30
		const det07 = a20 * a32 - a22 * a30
		const det08 = a20 * a33 - a23 * a30
		const det09 = a21 * a32 - a22 * a31
		const det10 = a21 * a33 - a23 * a31
		const det11 = a22 * a33 - a23 * a32

		let det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06)

		if (det !== 0) {
			det = 1 / det

			this.values[0] = (a11 * det11 - a12 * det10 + a13 * det09) * det
			this.values[1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det
			this.values[2] = (a31 * det05 - a32 * det04 + a33 * det03) * det
			this.values[3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det
			this.values[4] = (-a10 * det11 + a12 * det08 - a13 * det07) * det
			this.values[5] = (a00 * det11 - a02 * det08 + a03 * det07) * det
			this.values[6] = (-a30 * det05 + a32 * det02 - a33 * det01) * det
			this.values[7] = (a20 * det05 - a22 * det02 + a23 * det01) * det
			this.values[8] = (a10 * det10 - a11 * det08 + a13 * det06) * det
			this.values[9] = (-a00 * det10 + a01 * det08 - a03 * det06) * det
			this.values[10] = (a30 * det04 - a31 * det02 + a33 * det00) * det
			this.values[11] = (-a20 * det04 + a21 * det02 - a23 * det00) * det
			this.values[12] = (-a10 * det09 + a11 * det07 - a12 * det06) * det
			this.values[13] = (a00 * det09 - a01 * det07 + a02 * det06) * det
			this.values[14] = (-a30 * det03 + a31 * det01 - a32 * det00) * det
			this.values[15] = (a20 * det03 - a21 * det01 + a22 * det00) * det
		}

		return this
	}
	public Decompose() {
		return {
			Position: new Vector3(
				this.GetRowValue(3, 0),
				this.GetRowValue(3, 1),
				this.GetRowValue(3, 2),
			),
		}
	}
	public Clone(): Matrix4x4 {
		return new Matrix4x4(this.values)
	}
}
