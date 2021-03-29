export default class Vector4 {
	public static FromString(str: string): Vector4 {
		return new Vector4(...str.split(" ").map(el => parseFloat(el)))
	}
	/**
	 * Create new Vector4 with x, y, z, w
	 *
	 * @example
	 * let vec = new Vector4(1, 2, 3, 4)
	 * vec.Normalize()
	 */
	constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) { }

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2
	}
	/**
	 * Get the length of the vector
	 */
	get Length(): number {
		return Math.sqrt(this.LengthSqr)
	}
	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSqr2D(): number {
		return this.x ** 2 + this.y ** 2
	}
	/**
	 * Get the length 2D of the vector
	 */
	get Length2D(): number {
		return Math.sqrt(this.LengthSqr2D)
	}
	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSqr3D(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2
	}
	/**
	 * Get the length 3D of the vector
	 */
	get Length3D(): number {
		return Math.sqrt(this.LengthSqr3D)
	}

	/**
	 * Divide the scalar by vector
	 * @returns (this vector)
	 */
	public DivideScalarForThis(scalar: number): Vector4 {
		this.x /= scalar
		this.y /= scalar
		this.z /= scalar
		this.w /= scalar
		return this
	}
	/**
	 * Normalize the vector
	 */
	public Normalize(scalar = 1): Vector4 {
		const length = this.Length
		return length !== 0 ? this.DivideScalarForThis(length * scalar) : this
	}

	/**
	 * @return x y z w
	 */
	public toString(): string {
		return `${this.x} ${this.y} ${this.z} ${this.w})`
	}
	/**
	 * @return [x, y, z, w]
	 */
	public toArray(): [number, number, number, number] {
		return [this.x, this.y, this.z, this.w]
	}
	public toJSON() {
		return this.toArray()
	}
}
