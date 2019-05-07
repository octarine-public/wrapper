import Vector2D from "./Vector2D";

export default class Vector {
	/* ================== Static ================== */
	static fromArray(array: [number, number, number]): Vector {
		return new Vector(array[0] || 0, array[1] || 0, array[2] || 0)
	}

	static fromObject(object: { x: number, y: number, z?: number }): Vector {
		return new Vector(object.x, object.y, object.z || 0)
	}

	static FromAngle(angle: number): Vector {
		return new Vector(Math.cos(angle), Math.sin(angle))
	}

	static FromAngleCoordinates(radial: number, angle: number): Vector {
		return new Vector(Math.cos(angle) * radial, Math.sin(angle) * radial)
	}

	/* =================== Fields =================== */
	x: number
	y: number
	z: number

	/* ================ Constructors ================ */
	/**
	 * Create new Vector with x, y, z
	 *
	 * @example
	 * var vector = new Vector(1, 2, 3)
	 * vector.Normalize();
	 */
	constructor(x: { x: number, y: number, z: number } | number = 0, y: number = 0, z: number = 0) {
		if (x instanceof Object) {
			this.x = x.x
			this.y = x.y
			this.z = x.z
		} else {
			this.x = x as number
			this.y = y
			this.z = z
		}
	}

	/* ================== Getters ================== */
	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	get IsValid(): boolean {
		var x = this.x,
			y = this.y,
			z = this.z

		return !Number.isNaN(x) && Number.isFinite(x)
			&& !Number.isNaN(y) && Number.isFinite(y)
			&& !Number.isNaN(z) && Number.isFinite(z)
	}

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2
	}
	/**
	 * Get the length of the vector
	 */
	get Length(): number {
		return Math.sqrt(this.LengthSqr)
	}
	/**
	 * Angle of the Vector
	 */
	get Angle(): number {
		return Math.atan2(this.y, this.x)
	}
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	get Polar(): number {
		let x = this.x,
			theta = Math.atan(this.y / x) * (180 / Math.PI)

		if (x < 0)
			theta += 180

		if (theta < 0)
			theta += 360

		return theta
	}

	/* ================== Methods ================== */
	Equals(vec: Vector): boolean {
		return this.x === vec.x
			&& this.y === vec.y
			&& this.z === vec.z
	}

	/**
	 * Are all components of this vector are 0?
	 */
	IsZero(tolerance: number = 0.01): boolean {
		var x = this.x,
			y = this.y,
			z = this.z

		return x > tolerance && x < tolerance
			&& y > tolerance && y < tolerance
			&& z > tolerance && z < tolerance
	}
	/**
	 * Are length of this vector are  greater than value?
	 */
	IsLengthGreaterThan(val: number) {
		return this.LengthSqr > val * val
	}
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number) {
		return this.LengthSqr < val * val
	}
	/**
	 * Invalidates this vector
	 */
	Invalidate(): Vector {
		this.x = this.y = this.z = NaN
		return this
	}
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector {
		this.x = this.y = this.z = 0
		return this
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector {
		this.x *= -1
		this.y *= -1
		this.z *= -1
		return this
	}
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector {
		this.x = Math.random() * (maxVal - minVal) + minVal
		this.y = Math.random() * (maxVal - minVal) + minVal
		this.z = Math.random() * (maxVal - minVal) + minVal
		return this
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector): Vector {
		return new Vector (
			Math.min(this.x, vec.x),
			Math.min(this.y, vec.y),
			Math.min(this.z, vec.z)
		)
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector): Vector {
		return new Vector (
			Math.max(this.x, vec.x),
			Math.max(this.y, vec.y),
			Math.max(this.z, vec.z)
		)
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector {
		return new Vector (
			Math.abs(this.x),
			Math.abs(this.y),
			Math.abs(this.z),
		)
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector {
		return new Vector (
			Math.sqrt(this.x),
			Math.sqrt(this.y),
			Math.sqrt(this.z),
		)
	}

	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector {
		this.x = num
		return this
	}
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector {
		this.y = num
		return this
	}
	/**
	 * Set Z of vector by number
	 */
	SetZ(num: number): Vector {
		this.z = num
		return this
	}

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector {
		var length = this.Length

		if (length !== 0)
			this.DivideScalar(scalar !== undefined ? length * scalar : length)

		return this
	}
	/**
	 * The cross product of this and vec.
	 */
	Cross(vec: Vector): Vector {
		return new Vector(
			this.y * vec.z - this.z * vec.y,
			this.z * vec.x - this.x * vec.z,
			this.x * vec.y - this.y * vec.x,
		)
	}
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector {
		var length = this.Length

		if (length === 0) {
			this.x = 0
			this.y = 0
			this.z = 0
		} else
			this.MultiplyScalar(scalar / length)

		return this
	}
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector {
		var length = this.Length

		if (length === 0)
			this.toZero()
		else
			this.DivideScalar(scalar / length)

		return this
	}
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector, max: Vector): Vector {
		const { x, y, z } = this,
			max_x = max.x,
			max_y = max.y,
			max_z = max.z
		return new Vector (
			Math.min((x > max_x) ? max_x : x, min.x),
			Math.min((y > max_y) ? max_y : y, min.y),
			Math.min((z > max_z) ? max_z : z, min.z)
		)
	}

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector): Vector {
		return new Vector (
			this.x + vec.x,
			this.y + vec.y,
			this.z + vec.z,
		)
	}

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector {
		this.x += scalar
		this.y += scalar
		this.z += scalar
		return this
	}
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector {
		this.x += scalar
		return this
	}
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector {
		this.y += scalar
		return this
	}
	/**
	 * Add scalar to Z of vector
	 */
	AddScalarZ(scalar: number): Vector {
		this.z += scalar
		return this
	}

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector): Vector {
		return new Vector (
			this.x - vec.x,
			this.y - vec.y,
			this.z - vec.z,
		)
	}

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector {
		this.x -= scalar
		this.y -= scalar
		this.z -= scalar
		return this
	}
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector {
		this.x -= scalar
		return this
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector {
		this.y -= scalar
		return this
	}
	/**
	 * Subtract scalar from Z of vector
	 */
	SubtractScalarZ(scalar: number): Vector {
		this.z -= scalar
		return this
	}

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector): Vector {
		return new Vector (
			this.x * vec.x,
			this.y * vec.y,
			this.z * vec.z,
		)
	}

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector {
		this.x *= scalar
		this.y *= scalar
		this.z *= scalar
		return this
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector {
		this.x *= scalar
		return this
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector {
		this.y *= scalar
		return this
	}
	/**
	 * Multiply the Z of vector by scalar
	 */
	MultiplyScalarZ(scalar: number): Vector {
		this.z *= scalar
		return this
	}

	/* ======== Divide ======== */

	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector): Vector {
		return new Vector (
			this.x / vec.x,
			this.y / vec.y,
			this.z / vec.z,
		)
	}

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector {
		this.x /= scalar
		this.y /= scalar
		this.z /= scalar
		return this
	}
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector {
		this.x /= scalar
		return this
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector {
		this.y /= scalar
		return this
	}
	/**
	 * Divide the scalar by Z of vector
	 */
	DivideScalarZ(scalar: number): Vector {
		this.z /= scalar
		return this
	}

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector, vec2: Vector, scalar: number): Vector {
		return vec.Add(vec2).MultiplyScalar(scalar)
	}

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector): number {
		return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2 + (vec.z - this.z) ** 2
	}
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector): number {
		return Math.sqrt(this.DistanceSqr(vec))
	}
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector): number {
		return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2)
	}

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x: boolean = true): Vector {
		return is_x
			? new Vector(-this.y, this.x, this.z)
			: new Vector(this.y, -this.x, this.z)
	}
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector {
		var cos = Math.cos(angle),
			sin = Math.sin(angle)

		return new Vector (
			(this.x * cos) - (this.y * sin),
			(this.y * cos) + (this.x * sin)
		)
	}
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector, distance: number): Vector {
		return new Vector (
			this.x + rotation.x * distance,
			this.y + rotation.y * distance,
			this.z + rotation.z * distance
		)
	}
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector, distance: number): Vector {
		var vec = this.Rotation(rotation, distance)
		return vec.MultiplyScalar(Math.PI).DivideScalar(180)
	}
	RotationTime(rot_speed: number): number {
		return this.Angle / (30 * rot_speed)
	}
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector): number {
		return Math.atan2(vec.y - this.y, vec.x - this.x)
	}
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector): number {
		return Math.acos((this.x * front.x) + (this.y * front.y))
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector, distance: number): Vector {
		return this.Rotation(Vector.FromAngle(this.AngleBetweenVectors(vec)), distance)
	}
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector, range: number): boolean {
		return this.DistanceSqr(vec) < range ** 2;
	}
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number) {
		return this.x > x && this.x < (x + width) && this.y > y && this.y < (y + height);
	}
	/* ================== To ================== */
	/**
	 * Vector to String Vector
	 * @return new Vector(x,y,z)
	 */
	toString(): string {
		return "Vector(" + this.x + "," + this.y + "," + this.z + ")"
	}
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number, number] {
		return [this.x, this.y, this.z]
	}
	/**
	 * Vector 3D to Vector 2D
	 */
	to2D(): Vector2D {
		return new Vector2D(this.x, this.y);
	}
}
