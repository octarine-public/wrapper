export default class Vector2D {
	/* ================== Static ================== */
	static fromArray(array: [number, number]): Vector2D {
		return new Vector2D(array[0] || 0, array[1] || 0)
	}

	static fromObject(object: { x: number, y: number }): Vector2D {
		return new Vector2D(object.x, object.y)
	}

	static FromAngle(angle: number): Vector2D {
		return new Vector2D(Math.cos(angle), Math.sin(angle))
	}

	static FromAngleCoordinates(radial: number, angle: number): Vector2D {
		return new Vector2D(Math.cos(angle) * radial, Math.sin(angle) * radial)
	}

	/* =================== Fields =================== */
	x: number
	y: number

	/* ================ Constructors ================ */
	/**
	 * Create new Vector with x, y
	 *
	 * @example
	 * var vector = new Vector2D(1, 2)
	 * vector.Normalize();
	 */
	constructor(x: Vector2D | Vector2D | number = 0, y: number = 0) {
		if (x instanceof Vector || x instanceof Vector2D) {
			this.x = x.x
			this.y = x.y
		} else {
			this.x = x as number
			this.y = y
		}
	}

	/* ================== Getters ================== */
	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	get IsValid(): boolean {
		var x = this.x,
			y = this.y

		return !Number.isNaN(x) && Number.isFinite(x)
			&& !Number.isNaN(y) && Number.isFinite(y)
	}

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2
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
	Equals(vec: Vector2D): boolean {
		return this.x === vec.x
			&& this.y === vec.y
	}

	/**
	 * Are all components of this vector are 0?
	 */
	IsZero(tolerance: number = 0.01): boolean {
		var x = this.x,
			y = this.y

		return x > tolerance && x < tolerance
			&& y > tolerance && y < tolerance
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
	Invalidate(): Vector2D {
		this.x = this.y = NaN
		return this
	}
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector2D {
		this.x = this.y = 0
		return this
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector2D {
		this.x *= -1
		this.y *= -1
		return this
	}
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector2D {
		this.x = Math.random() * (maxVal - minVal) + minVal
		this.y = Math.random() * (maxVal - minVal) + minVal
		return this
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector2D): Vector2D {
		return new Vector2D (
			Math.min(this.x, vec.x),
			Math.min(this.y, vec.y)
		)
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector2D): Vector2D {
		return new Vector2D (
			Math.max(this.x, vec.x),
			Math.max(this.y, vec.y)
		)
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector2D {
		return new Vector2D (
			Math.abs(this.x),
			Math.abs(this.y),
		)
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector2D {
		return new Vector2D (
			Math.sqrt(this.x),
			Math.sqrt(this.y),
		)
	}

	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector2D {
		this.x = num
		return this
	}
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector2D {
		this.y = num
		return this
	}

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector2D {
		var length = this.Length

		if (length !== 0)
			this.DivideScalar(scalar !== undefined ? length * scalar : length)

		return this
	}
	/**
	 * Returns the cross product Z value.
	 */
	Cross(vec: Vector2D): number {
		return (vec.y * this.x) - (vec.x * this.y)
	}
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector2D): number {
		return this.x * vec.x + this.y * vec.y
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector2D {
		var length = this.Length

		if (length === 0) {
			this.x = 0
			this.y = 0
			this.y = 0
		} else
			this.MultiplyScalar(scalar / length)

		return this
	}
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector2D {
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
	Clamp(min: Vector2D, max: Vector2D): Vector2D {
		const { x, y } = this,
			max_x = max.x,
			max_y = max.y
		return new Vector2D (
			Math.min((x > max_x) ? max_x : x, min.x),
			Math.min((y > max_y) ? max_y : y, min.y)
		)
	}

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector2D): Vector2D {
		return new Vector2D (
			this.x + vec.x,
			this.y + vec.y,
		)
	}

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector2D {
		this.x += scalar
		this.y += scalar
		return this
	}
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector2D {
		this.x += scalar
		return this
	}
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector2D {
		this.y += scalar
		return this
	}

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector2D): Vector2D {
		return new Vector2D (
			this.x - vec.x,
			this.y - vec.y,
		)
	}

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector2D {
		this.x -= scalar
		this.y -= scalar
		return this
	}
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector2D {
		this.x -= scalar
		return this
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector2D {
		this.y -= scalar
		return this
	}

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector2D): Vector2D {
		return new Vector2D (
			this.x * vec.x,
			this.y * vec.y,
		)
	}

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector2D {
		this.x *= scalar
		this.y *= scalar
		return this
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector2D {
		this.x *= scalar
		return this
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector2D {
		this.y *= scalar
		return this
	}

	/* ======== Divide ======== */

	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector2D): Vector2D {
		return new Vector2D (
			this.x / vec.x,
			this.y / vec.y,
		)
	}

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector2D {
		this.x /= scalar
		this.y /= scalar
		return this
	}
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector2D {
		this.x /= scalar
		return this
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector2D {
		this.y /= scalar
		return this
	}

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector2D, vec2: Vector2D, scalar: number): Vector2D {
		return vec.Add(vec2).MultiplyScalar(scalar)
	}

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector2D): number {
		return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2
	}
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector2D): number {
		return Math.sqrt(this.DistanceSqr(vec))
	}
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector2D): number {
		return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2)
	}

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x: boolean = true): Vector2D {
		return is_x
			? new Vector2D(-this.y, this.x)
			: new Vector2D(this.y, -this.x)
	}
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector2D {
		var cos = Math.cos(angle),
			sin = Math.sin(angle)

		return new Vector2D (
			(this.x * cos) - (this.y * sin),
			(this.y * cos) + (this.x * sin)
		)
	}
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector2D, distance: number): Vector2D {
		return new Vector2D (
			this.x + rotation.x * distance,
			this.y + rotation.y * distance
		)
	}
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector2D, distance: number): Vector2D {
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
	AngleBetweenVectors(vec: Vector2D): number {
		return Math.atan2(vec.y - this.y, vec.x - this.x)
	}
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector2D): number {
		return Math.acos((this.x * front.x) + (this.y * front.y))
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector2D, distance: number): Vector2D {
		return this.Rotation(Vector2D.FromAngle(this.AngleBetweenVectors(vec)), distance)
	}

	/* ================== Geometric ================== */
	/**
	 * Vector to String Vector
	 * @return new Vector(x,y,z)
	 */
	toString(): string {
		return "Vector2D(" + this.x + "," + this.y + ")"
	}
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number] {
		return [this.x, this.y]
	}
}
