/// internal declarations
/// you may use ONLY this ones & default V8 things
declare function setVector2Class(Vector2: object): void
declare var global: any

/// actual code
setVector2Class(global.Vector2 = class Vector2 {
	/* ================== Static ================== */
	static fromArray(array: [number, number]): Vector2 {
		return new Vector2(array[0] || 0, array[1] || 0)
	}

	static FromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	static FromAngleCoordinates(radial: number, angle: number): Vector2 {
		return new Vector2(Math.cos(angle) * radial, Math.sin(angle) * radial)
	}

	/* =================== Fields =================== */
	x: number
	y: number

	/* ================ Constructors ================ */
	/**
	 * Create new Vector3 with x, y
	 *
	 * @example
	 * var vector = new Vector2(1, 2)
	 * vector.Normalize();
	 */
	constructor(x: number = 0, y: number = 0) {
		this.x = x
		this.y = y
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
	 * Angle of the Vector3
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
	Equals(vec: Vector2): boolean {
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
	IsLengthGreaterThan(val: number): boolean {
		return this.LengthSqr > val * val
	}
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number): boolean {
		return this.LengthSqr < val * val
	}
	/**
	 * Invalidates this vector
	 */
	Invalidate(): Vector2 {
		this.x = this.y = NaN
		return this
	}
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector2 {
		this.x = this.y = 0
		return this
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector2 {
		this.x *= -1
		this.y *= -1
		return this
	}
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector2 {
		this.x = Math.random() * (maxVal - minVal) + minVal
		this.y = Math.random() * (maxVal - minVal) + minVal
		return this
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector2): Vector2 {
		return new Vector2 (
			Math.min(this.x, vec.x),
			Math.min(this.y, vec.y),
		)
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector2): Vector2 {
		return new Vector2 (
			Math.max(this.x, vec.x),
			Math.max(this.y, vec.y),
		)
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector2 {
		return new Vector2 (
			Math.abs(this.x),
			Math.abs(this.y),
		)
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector2 {
		return new Vector2 (
			Math.sqrt(this.x),
			Math.sqrt(this.y),
		)
	}

	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector2 {
		this.x = num
		return this
	}
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector2 {
		this.y = num
		return this
	}

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector2 {
		var length = this.Length

		if (length !== 0)
			this.DivideScalar(scalar !== undefined ? length * scalar : length)

		return this
	}
	/**
	 * Returns the cross product Z value.
	 */
	Cross(vec: Vector2): number {
		return (vec.y * this.x) - (vec.x * this.y)
	}
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector2): number {
		return this.x * vec.x + this.y * vec.y
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector2 {
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
	DivideTo(scalar: number): Vector2 {
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
	Clamp(min: Vector2, max: Vector2): Vector2 {
		const { x, y } = this,
			max_x = max.x,
			max_y = max.y
		return new Vector2 (
			Math.min((x > max_x) ? max_x : x, min.x),
			Math.min((y > max_y) ? max_y : y, min.y),
		)
	}

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector2): Vector2 {
		return new Vector2 (
			this.x + vec.x,
			this.y + vec.y,
		)
	}

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector2 {
		this.x += scalar
		this.y += scalar
		return this
	}
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector2 {
		this.x += scalar
		return this
	}
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector2 {
		this.y += scalar
		return this
	}

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector2): Vector2 {
		return new Vector2 (
			this.x - vec.x,
			this.y - vec.y,
		)
	}

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector2 {
		this.x -= scalar
		this.y -= scalar
		return this
	}
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector2 {
		this.x -= scalar
		return this
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector2 {
		this.y -= scalar
		return this
	}

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector2): Vector2 {
		return new Vector2 (
			this.x * vec.x,
			this.y * vec.y,
		)
	}

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector2 {
		this.x *= scalar
		this.y *= scalar
		return this
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector2 {
		this.x *= scalar
		return this
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector2 {
		this.y *= scalar
		return this
	}

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector2): Vector2 {
		return new Vector2 (
			this.x / vec.x,
			this.y / vec.y,
		)
	}

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector2 {
		this.x /= scalar
		this.y /= scalar
		return this
	}
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector2 {
		this.x /= scalar
		return this
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector2 {
		this.y /= scalar
		return this
	}

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector2, vec2: Vector2, scalar: number): Vector2 {
		return vec.Add(vec2).MultiplyScalar(scalar)
	}

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector2): number {
		return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2
	}
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector2): number {
		return Math.sqrt(this.DistanceSqr(vec))
	}
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector2): number {
		return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2)
	}

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x: boolean = true): Vector2 {
		return is_x
			? new Vector2(-this.y, this.x)
			: new Vector2(this.y, -this.x)
	}
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector2 {
		var cos = Math.cos(angle),
			sin = Math.sin(angle)

		return new Vector2 (
			(this.x * cos) - (this.y * sin),
			(this.y * cos) + (this.x * sin),
		)
	}
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector2, distance: number): Vector2 {
		return new Vector2 (
			this.x + rotation.x * distance,
			this.y + rotation.y * distance,
		)
	}
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector2, distance: number): Vector2 {
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
	AngleBetweenVectors(vec: Vector2): number {
		return Math.atan2(vec.y - this.y, vec.x - this.x)
	}
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector2): number {
		return Math.acos((this.x * front.x) + (this.y * front.y))
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector2, distance: number): Vector2 {
		return this.Rotation(Vector2.FromAngle(this.AngleBetweenVectors(vec)), distance)
	}
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector2, range: number): boolean {
		return this.DistanceSqr(vec) < range ** 2
	}
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number) {
		return this.x > x && this.x < (x + width) && this.y > y && this.y < (y + height)
	}
	/* ================== Geometric ================== */
	/**
	 * Vector3 to String Vector3
	 * @return new Vector3(x,y,z)
	 */
	toString(): string {
		return "Vector2(" + this.x + "," + this.y + ")"
	}
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number] {
		return [this.x, this.y]
	}

	toVector3(): Vector3 {
		return new Vector3(this.x, this.y, 0)
	}
})
