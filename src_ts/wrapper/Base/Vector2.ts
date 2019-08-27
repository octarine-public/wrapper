import Vector3 from "./Vector3"

export default class Vector2 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean = true, offset: number = 0): Vector2 {
		if (buffer !== true)
			return undefined
		return new Vector2(IOBuffer[offset + 0], IOBuffer[offset + 1])
	}
	static fromArray(array: [number, number]): Vector2 {
		return new Vector2(array[0] || 0, array[1] || 0)
	}
	static FromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}
	/**
	 * From polar coordinates
	 * @param radial
	 * @param polar
	 */
	static FromPolarCoordinates(radial: number, polar: number): Vector2 {
		return new Vector2(Math.cos(polar) * radial, Math.sin(polar) * radial)
	}
	static GetCenterType<T>(array: T[], callback: (value: T) => Vector2): Vector2 {

		let newVec = new Vector2()

		array.forEach(vec => newVec.AddForThis(callback(vec)))

		return newVec.DivideScalarForThis(array.length)

	}
	static GetCenter(array: Vector2[]): Vector2 {

		let newVec = new Vector2()

		array.forEach(vec => newVec.AddForThis(vec))

		return newVec.DivideScalarForThis(array.length)

	}
	static CopyFrom(vec: Vector2): Vector2 {
		return new Vector2(vec.x, vec.y)
	}

	/* ================ Constructors ================ */
	/**
	 * Create new Vector2 with x, y
	 *
	 * @example
	 * var vector = new Vector2(1, 2)
	 * vector.Normalize();
	 */
	constructor(public x: number = 0, public y: number = 0) {
		this.SetVector(x, y)
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
	 * Angle of the Vector2
	 */
	get Angle(): number {
		return Math.atan2(this.y, this.x)
	}
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	get Polar(): number {
		if (Math.abs(this.x - 0) <= 1e-9)
			return this.y > 0 ? 90 : this.y < 0 ? 270 : 0

		let theta = Math.atan(this.y / this.x) * (180 / Math.PI)

		if (this.x < 0)
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

		return x > -tolerance && x < tolerance
			&& y > -tolerance && y < tolerance
	}
	/**
	 * Are length of this vector are  greater than value?
	 */
	IsLengthGreaterThan(val: number): boolean {
		return this.LengthSqr > val ** 2
	}
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number): boolean {
		return this.LengthSqr < val ** 2
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
	 * Copy this vector to another vector and return it
	 * @param vec The another vector
	 * @returns another vector
	 */
	CopyTo(vec: Vector2): Vector2 {
		vec.x = this.x
		vec.y = this.y
		return vec
	}
	/**
	 * Copy fron another vector to this vector and return it
	 * @param vec The another vector
	 * @returns this vector
	 */
	CopyFrom(vec: Vector2): Vector2 {
		this.x = vec.x
		this.y = vec.y
		return this
	}
	/**
	 * Set vector by numbers
	 */
	SetVector(x: number = 0, y: number = 0): Vector2 {
		this.x = x
		this.y = y
		return this
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
	Normalize(scalar?: number): Vector2 {
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
		return new Vector2 (
			Math.min((this.x > max.x) ? max.x : this.x, min.x),
			Math.min((this.y > max.y) ? max.y : this.y, min.y),
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
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector (this vector)
	 */
	AddForThis(vec: Vector2): Vector2 {
		this.x += vec.x
		this.y += vec.y
		return this
	}
	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x + scalar,
			this.y + scalar,
		)
	}
	/**
	 * Add scalar to vector
	 * @returns (this Vector2)
	 */
	AddScalarForThis(scalar: number): Vector2 {
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
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector (this vector)
	 */
	SubtractForThis(vec: Vector2): Vector2 {
		this.x -= vec.x
		this.y -= vec.y
		return this
	}
	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x - scalar,
			this.y - scalar,
		)
	}
	/**
	 * Subtract scalar from vector
	 * @returns (this vector)
	 */
	SubtractScalarForThis(scalar: number): Vector2 {
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
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector (this vector)
	 */
	MultiplyForThis(vec: Vector2): Vector2 {
		this.x *= vec.x
		this.y *= vec.y
		return this
	}
	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x * scalar,
			this.y * scalar,
		)
	}
	/**
	 * Multiply the vector by scalar
	 * @return (this vector)
	 */
	MultiplyScalarForThis(scalar: number): Vector2 {
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
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division (this vector)
	 */
	DivideForThis(vec: Vector2): Vector2 {
		this.x /= vec.x
		this.y /= vec.y
		return this
	}
	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector2 {
		return new Vector2 (
			this.x / scalar,
			this.y / scalar,
		)
	}
	/**
	 * Divide the scalar by vector
	 * @returns (this vector)
	 */
	DivideScalarForThis(scalar: number): Vector2 {
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
	/**
	 * Multiply, add, and assign to this vector and return new vector
	 */
	MultiplyAddForThis(vec2: Vector2, scalar: number): Vector2 {
		return this.AddForThis(vec2).MultiplyScalarForThis(scalar)
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
	 * Calculates the polar angle of the given vector. Returns degree values on default, radian if requested.
	 */
	PolarAngle(radian: boolean = false): number {
		if (radian)
			return this.Angle

		return this.Angle * (180 / Math.PI)
	}
	/**
	 * Rotates the Vector2 to a set angle.
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
		return this.Rotation(rotation.DegreesToRadians(), distance)
	}
	/**
	 * Extends vector in the rotation direction by angle
	 * @param angle for ex. Entity#RotationRad
	 * @param distance distance to be added
	 */
	InFrontFromAngle(angle: number, distance: number): Vector2 {
		return this.Rotation(Vector2.FromAngle(angle), distance)
	}
	/**
	 *
	 * @param vec The another vector
	 * @param vecAngleRadian Angle of this vector
	 */
	FindRotationAngle(vec: Vector2, vecAngleRadian: number): number {
		let angle = Math.abs(Math.atan2(vec.y - this.y, vec.x - this.x) - vecAngleRadian)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}
	RotationTime(rot_speed: number): number {
		return this.Angle / (30 * rot_speed)
	}
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector2): number {
		var theta = this.Polar - vec.Polar
		if (theta < 0) {
			theta = theta + 360
		}

		if (theta > 180) {
			theta = 360 - theta
		}

		return theta
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
		return vec.Subtract(this).Normalize().MultiplyScalarForThis(distance).AddForThis(this) // this + (distance * (vec - this).Normalize())
	}
	Clone(): Vector2 {
		return new Vector2(this.x, this.y)
	}
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector2, range: number): boolean {
		return this.DistanceSqr(vec) < range ** 2
	}
	Closest(vecs: Vector2[]): Vector2 {
		let minVec = new Vector2()
		let distance = Number.POSITIVE_INFINITY

		vecs.forEach(vec => {

			let tempDist = this.Distance(vec)
			if (tempDist < distance) {
				distance = tempDist
				minVec = vec
			}
		})
		return minVec
	}
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number) {
		return this.x > x && this.x < (x + width) && this.y > y && this.y < (y + height)
	}
	RadiansToDegrees(): Vector2 {
		return this.MultiplyScalar(180).DivideScalar(Math.PI)
	}
	DegreesToRadians(): Vector2 {
		return this.MultiplyScalar(Math.PI).DivideScalar(180)
	}
	/* ================== Geometric ================== */
	/**
	 * Vector2 to String Vector2
	 * @return new Vector2(x,y,z)
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

	toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.x
		IOBuffer[offset + 1] = this.y
		return true
	}
}
global.Vector2 = Vector2
