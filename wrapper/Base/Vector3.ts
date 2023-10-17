import { RadianToDegrees } from "../Utils/Math"
import { Vector2 } from "./Vector2"

export class Vector3 {
	public static fromIOBuffer(offset = 0): Vector3 {
		return new Vector3(
			IOBuffer[offset + 0],
			IOBuffer[offset + 1],
			IOBuffer[offset + 2]
		)
	}
	public static fromArray(array: ArrayLike<number>): Vector3 {
		return new Vector3(array[0] ?? 0, array[1] ?? 0, array[2] ?? 0)
	}
	public static FromAngle(angle: number): Vector3 {
		return new Vector3(Math.cos(angle), Math.sin(angle))
	}
	public static FromString(str: string): Vector3 {
		return new Vector3(...str.split(" ").map(el => parseFloat(el)))
	}
	/**
	 * From polar coordinates
	 *
	 * @param radial
	 * @param polar
	 */
	public static FromPolarCoordinates(radial: number, polar: number): Vector3 {
		return new Vector3(Math.cos(polar) * radial, Math.sin(polar) * radial)
	}
	public static GetCenterType<T>(array: T[], callback: (value: T) => Vector3): Vector3 {
		return array
			.reduce((prev, cur) => prev.AddForThis(callback(cur)), new Vector3())
			.DivideScalarForThis(array.length)
	}
	public static GetCenter(array: Vector3[]): Vector3 {
		return array
			.reduce((prev, cur) => prev.AddForThis(cur), new Vector3())
			.DivideScalarForThis(array.length)
	}
	public static CopyFrom(vec: Vector3): Vector3 {
		return new Vector3(vec.x, vec.y, vec.z)
	}
	public static FromVector2(vec: Vector2): Vector3 {
		return new Vector3(vec.x, vec.y, 0)
	}
	/**
	 * Create new Vector3 with x, y, z
	 *
	 * @example
	 * let vec = new Vector3(1, 2, 3)
	 * vec.Normalize()
	 */
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0
	) {}

	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	public get IsValid(): boolean {
		const x = this.x,
			y = this.y,
			z = this.z

		return (
			!Number.isNaN(x) &&
			Number.isFinite(x) &&
			!Number.isNaN(y) &&
			Number.isFinite(y) &&
			!Number.isNaN(z) &&
			Number.isFinite(z)
		)
	}

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	public get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2
	}
	/**
	 * Get the length of the vector
	 */
	public get Length(): number {
		return Math.sqrt(this.LengthSqr)
	}
	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	public get LengthSqr2D(): number {
		return this.x ** 2 + this.y ** 2
	}
	/**
	 * Get the length 2D of the vector
	 */
	public get Length2D(): number {
		return Math.sqrt(this.LengthSqr2D)
	}
	/**
	 * Angle of the Vector3
	 */
	public get Angle(): number {
		return Math.atan2(this.y, this.x)
	}
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	public get Polar(): number {
		if (Math.abs(this.x) <= 1e-9) {
			return this.y > 0 ? 90 : this.y < 0 ? 270 : 0
		}
		return RadianToDegrees(Math.atan2(this.y, this.x) + 360) % 360
	}

	public Equals(vec: Vector3): boolean {
		return this.x === vec.x && this.y === vec.y && this.z === vec.z
	}

	/**
	 * Are all components of this vector are 0?
	 */
	public IsZero(tolerance = 0.01): boolean {
		const x = this.x,
			y = this.y,
			z = this.z

		return (
			x > -tolerance &&
			x < tolerance &&
			y > -tolerance &&
			y < tolerance &&
			z > -tolerance &&
			z < tolerance
		)
	}
	/**
	 * Are length of this vector are  greater than value?
	 */
	public IsLengthGreaterThan(val: number): boolean {
		return this.LengthSqr > val ** 2
	}
	/**
	 * Are length of this vector are less than value?
	 */
	public IsLengthLessThan(val: number): boolean {
		return this.LengthSqr < val ** 2
	}
	/**
	 * Invalidates this vector
	 */
	public Invalidate(): Vector3 {
		this.x = this.y = this.z = NaN
		return this
	}
	/**
	 * Zeroes this vector
	 */
	public toZero(): Vector3 {
		this.x = this.y = this.z = 0
		return this
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	public Negate(): Vector3 {
		this.x *= -1
		this.y *= -1
		this.z *= -1
		return this
	}
	/**
	 * Randomizes this vector within given values
	 */
	public Random(minVal: number, maxVal: number): Vector3 {
		const range = maxVal - minVal
		const randomRange = Math.random() * range
		this.x = randomRange + minVal
		this.y = randomRange + minVal
		this.z = randomRange + minVal
		return this
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 *
	 * @param The another vector
	 */
	public Min(vec: Vector3 | number): Vector3 {
		return new Vector3(
			Math.min(this.x, vec instanceof Vector3 ? vec.x : vec),
			Math.min(this.y, vec instanceof Vector3 ? vec.y : vec),
			Math.min(this.z, vec instanceof Vector3 ? vec.z : vec)
		)
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 *
	 * @param The another vector
	 */
	public Max(vec: Vector3 | number): Vector3 {
		return new Vector3(
			Math.max(this.x, vec instanceof Vector3 ? vec.x : vec),
			Math.max(this.y, vec instanceof Vector3 ? vec.y : vec),
			Math.max(this.z, vec instanceof Vector3 ? vec.z : vec)
		)
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	public Abs(): Vector3 {
		return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
	}
	public Ceil(count: number = 0): Vector3 {
		const pow = 10 ** count
		return new Vector3(
			Math.ceil(this.x * pow) / pow,
			Math.ceil(this.y * pow) / pow,
			Math.ceil(this.z * pow) / pow
		)
	}
	public CeilForThis(count: number = 0): Vector3 {
		const pow = 10 ** count

		this.x = Math.ceil(this.x * pow) / pow
		this.y = Math.ceil(this.y * pow) / pow
		this.z = Math.ceil(this.z * pow) / pow

		return this
	}
	public Round(count: number = 0): Vector3 {
		const pow = 10 ** count
		return new Vector3(
			Math.round(this.x * pow) / pow,
			Math.round(this.y * pow) / pow,
			Math.round(this.z * pow) / pow
		)
	}
	public RoundForThis(count: number = 0): Vector3 {
		const pow = 10 ** count

		this.x = Math.round(this.x * pow) / pow
		this.y = Math.round(this.y * pow) / pow
		this.z = Math.round(this.z * pow) / pow

		return this
	}
	public Floor(count = 0): Vector3 {
		const pow = 10 ** count
		return new Vector3(
			Math.floor(this.x * pow) / pow,
			Math.floor(this.y * pow) / pow,
			Math.floor(this.z * pow) / pow
		)
	}
	public FloorForThis(count = 0): Vector3 {
		const pow = 10 ** count

		this.x = Math.floor(this.x * pow) / pow
		this.y = Math.floor(this.y * pow) / pow
		this.z = Math.floor(this.y * pow) / pow

		return this
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	public SquareRoot(): Vector3 {
		return new Vector3(this.x ** 0.5, this.y ** 0.5, this.z ** 0.5)
	}
	/**
	 * Copy this vector to another vector and return it
	 *
	 * @param vec The another vector
	 * @returns another vector
	 */
	public CopyTo(vec: Vector3): Vector3 {
		vec.x = this.x
		vec.y = this.y
		vec.z = this.z
		return vec
	}
	/**
	 * Copy from another vector to this vector and return it
	 *
	 * @param vec The another vector
	 * @returns this vector
	 */
	public CopyFrom(vec: Vector3): Vector3 {
		this.x = vec.x
		this.y = vec.y
		this.z = vec.z
		return this
	}
	/**
	 * Set vector by numbers
	 */
	public SetVector(x: number = 0, y: number = 0, z: number = 0): Vector3 {
		this.x = x
		this.y = y
		this.z = z
		return this
	}
	/**
	 * Set X of vector by number
	 */
	public SetX(num: number): Vector3 {
		this.x = num
		return this
	}
	/**
	 * Set Y of vector by number
	 */
	public SetY(num: number): Vector3 {
		this.y = num
		return this
	}
	/**
	 * Set Z of vector by number
	 */
	public SetZ(num: number): Vector3 {
		this.z = num
		return this
	}

	/**
	 * Normalize the vector
	 */
	public Normalize(scalar = 1): Vector3 {
		const length = this.Length
		return length !== 0 ? this.DivideScalarForThis(length * scalar) : this
	}
	/**
	 * The cross product of this and vec.
	 */
	public Cross(vec: Vector3): Vector3 {
		return new Vector3(
			this.y * vec.z - this.z * vec.y,
			this.z * vec.x - this.x * vec.z,
			this.x * vec.y - this.y * vec.x
		)
	}
	/**
	 * The dot product of this vector and another vector.
	 *
	 * @param vec The another vector
	 */
	public Dot(vec: Vector3): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	public ScaleTo(scalar: number): Vector3 {
		const length = this.Length
		if (length === 0) {
			this.toZero()
		} else {
			this.MultiplyScalarForThis(scalar / length)
		}

		return this
	}
	/**
	 * Divides both vector axis by the given scalar value
	 */
	public DivideTo(scalar: number): Vector3 {
		const length = this.Length
		if (length === 0) {
			this.toZero()
		} else {
			this.DivideScalar(scalar / length)
		}

		return this
	}
	/**
	 * Restricts a vector between a min and max value.
	 *
	 * @returns (new Vector3)
	 */
	public Clamp(min: Vector3, max: Vector3): Vector3 {
		return new Vector3(
			Math.min(this.x > max.x ? max.x : this.x, min.x),
			Math.min(this.y > max.y ? max.y : this.y, min.y),
			Math.min(this.z > max.z ? max.z : this.z, min.z)
		)
	}

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 *
	 * @param vec The another vector
	 * @returns	The summed vector (new Vector3)
	 */
	public Add(vec: Vector3): Vector3 {
		return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z)
	}
	/**
	 * Adds two vectors together
	 *
	 * @param vec The another vector
	 * @returns	The summed vector (this vector)
	 */
	public AddForThis(vec: Vector3): Vector3 {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
		return this
	}
	/**
	 * Add scalar to vector
	 *
	 * @returns (new Vector3)
	 */
	public AddScalar(scalar: number): Vector3 {
		return new Vector3(this.x + scalar, this.y + scalar, this.z + scalar)
	}
	/**
	 * Add scalar to vector
	 *
	 * @returns (this Vector3)
	 */
	public AddScalarForThis(scalar: number): Vector3 {
		this.x += scalar
		this.y += scalar
		this.z += scalar
		return this
	}
	/**
	 * Add scalar to X of vector
	 */
	public AddScalarX(scalar: number): Vector3 {
		this.x += scalar
		return this
	}
	/**
	 * Add scalar to Y of vector
	 */
	public AddScalarY(scalar: number): Vector3 {
		this.y += scalar
		return this
	}
	/**
	 * Add scalar to Z of vector
	 */
	public AddScalarZ(scalar: number): Vector3 {
		this.z += scalar
		return this
	}

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 *
	 * @param vec The another vector
	 * @returns The difference vector (new Vector3)
	 */
	public Subtract(vec: Vector3): Vector3 {
		return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z)
	}
	/**
	 * Subtracts the second vector from the first.
	 *
	 * @param vec The another vector
	 * @returns The difference vector (this vector)
	 */
	public SubtractForThis(vec: Vector3): Vector3 {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
		return this
	}
	/**
	 * Subtract scalar from vector
	 *
	 * @returns (new Vector3)
	 */
	public SubtractScalar(scalar: number): Vector3 {
		return new Vector3(this.x - scalar, this.y - scalar, this.z - scalar)
	}
	/**
	 * Subtract scalar from vector
	 *
	 * @returns (this vector)
	 */
	public SubtractScalarForThis(scalar: number): Vector3 {
		this.x -= scalar
		this.y -= scalar
		this.z -= scalar
		return this
	}
	/**
	 * Subtract scalar from X of vector
	 */
	public SubtractScalarX(scalar: number): Vector3 {
		this.x -= scalar
		return this
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	public SubtractScalarY(scalar: number): Vector3 {
		this.y -= scalar
		return this
	}
	/**
	 * Subtract scalar from Z of vector
	 */
	public SubtractScalarZ(scalar: number): Vector3 {
		this.z -= scalar
		return this
	}

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 *
	 * @param vec The another vector
	 * @return The product vector (new Vector3)
	 */
	public Multiply(vec: Vector3): Vector3 {
		return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z)
	}
	/**
	 * Multiplies two vectors together.
	 *
	 * @param vec The another vector
	 * @return The product vector (this vector)
	 */
	public MultiplyForThis(vec: Vector3): Vector3 {
		this.x *= vec.x
		this.y *= vec.y
		this.z *= vec.z
		return this
	}
	/**
	 * Multiply the vector by scalar
	 *
	 * @return (new Vector3)
	 */
	public MultiplyScalar(scalar: number): Vector3 {
		return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
	}
	/**
	 * Multiply the vector by scalar
	 *
	 * @return (this vector)
	 */
	public MultiplyScalarForThis(scalar: number): Vector3 {
		this.x *= scalar
		this.y *= scalar
		this.z *= scalar
		return this
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	public MultiplyScalarX(scalar: number): Vector3 {
		this.x *= scalar
		return this
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	public MultiplyScalarY(scalar: number): Vector3 {
		this.y *= scalar
		return this
	}
	/**
	 * Multiply the Z of vector by scalar
	 */
	public MultiplyScalarZ(scalar: number): Vector3 {
		this.z *= scalar
		return this
	}

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 *
	 * @param vec The another vector
	 * @return The vector resulting from the division (new Vector3)
	 */
	public Divide(vec: Vector3): Vector3 {
		return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z)
	}
	/**
	 * Divide this vector by another vector
	 *
	 * @param vec The another vector
	 * @return The vector resulting from the division (this vector)
	 */
	public DivideForThis(vec: Vector3): Vector3 {
		this.x /= vec.x
		this.y /= vec.y
		this.z /= vec.z
		return this
	}
	/**
	 * Divide the scalar by vector
	 *
	 * @returns (new Vector3)
	 */
	public DivideScalar(scalar: number): Vector3 {
		return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar)
	}
	/**
	 * Divide the scalar by vector
	 *
	 * @returns (this vector)
	 */
	public DivideScalarForThis(scalar: number): Vector3 {
		this.x /= scalar
		this.y /= scalar
		this.z /= scalar
		return this
	}
	/**
	 * Divide the scalar by X of vector
	 */
	public DivideScalarX(scalar: number): Vector3 {
		this.x /= scalar
		return this
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	public DivideScalarY(scalar: number): Vector3 {
		this.y /= scalar
		return this
	}
	/**
	 * Divide the scalar by Z of vector
	 */
	public DivideScalarZ(scalar: number): Vector3 {
		this.z /= scalar
		return this
	}

	/**
	 * Multiply, add, and return new vector
	 */
	public MultiplyAdd(vec2: Vector3, scalar: number): Vector3 {
		return this.MultiplyScalar(scalar).AddForThis(vec2)
	}
	/**
	 * Multiply, add, and assign to this vector
	 */
	public MultiplyAddForThis(vec2: Vector3, scalar: number): Vector3 {
		return this.MultiplyScalarForThis(scalar).AddForThis(vec2)
	}

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	public DistanceSqr(vec: Vector3): number {
		return (this.x - vec.x) ** 2 + (this.y - vec.y) ** 2 + (this.z - vec.z) ** 2
	}
	/**
	 * Returns the squared distance 2D between the this and another vector
	 *
	 * @param vec The another vector
	 */
	public DistanceSqr2D(vec: Vector3 | Vector2): number {
		return (this.x - vec.x) ** 2 + (this.y - vec.y) ** 2
	}
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	public Distance(vec: Vector3): number {
		return Math.sqrt(this.DistanceSqr(vec))
	}
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	public Distance2D(vec: Vector3 | Vector2): number {
		return Math.sqrt(this.DistanceSqr2D(vec))
	}

	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	public Perpendicular(isX = true): Vector3 {
		return isX
			? new Vector3(-this.y, this.x, this.z)
			: new Vector3(this.y, -this.x, this.z)
	}
	/**
	 * Calculates the polar angle of the given vector. Returns degree values on default, radian if requested.
	 */
	public PolarAngle(radian = false): number {
		if (radian) {
			return this.Angle
		}

		return this.Angle * (180 / Math.PI)
	}
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	public Rotated(angle: number): Vector3 {
		const cos = Math.cos(angle),
			sin = Math.sin(angle)

		return new Vector3(
			this.x * cos - this.y * sin,
			this.y * cos + this.x * sin,
			this.z
		)
	}
	/**
	 * Extends vector in the rotation direction
	 *
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	public Rotation(rotation: Vector3, distance: number): Vector3 {
		return new Vector3(
			this.x + rotation.x * distance,
			this.y + rotation.y * distance,
			this.z + rotation.z * distance
		)
	}
	/**
	 * Extends vector in the rotation direction by radian
	 *
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	public RotationRad(rotation: Vector3, distance: number): Vector3 {
		return this.Rotation(rotation.DegreesToRadians(), distance)
	}
	/**
	 * Extends vector in the rotation direction by angle
	 *
	 * @param angle for ex. Entity#RotationRad
	 * @param distance distance to be added
	 */
	public InFrontFromAngle(angle: number, distance: number): Vector3 {
		return this.Rotation(Vector3.FromAngle(angle), distance)
	}
	/**
	 *
	 * @param vec The another vector
	 * @param vecAngleRadian Angle of this vector
	 */
	public FindRotationAngle(vec: Vector3, vecAngleRadian = 0): number {
		const angle = Math.abs(
			Math.atan2(vec.y - this.y, vec.x - this.x) - vecAngleRadian
		)
		return angle <= Math.PI ? angle : 2 * Math.PI - angle
	}
	public RotationTime(rotSpeed: number): number {
		return this.Angle / (30 * rotSpeed)
	}
	/**
	 * Angle between two vectors
	 *
	 * @param vec The another vector
	 */
	public AngleBetweenVectors(vec: Vector3): number {
		const theta = Math.abs((this.Polar - vec.Polar + 360) % 360)
		return Math.min(theta, 360 - theta)
	}
	/**
	 * Angle between two fronts
	 *
	 * @param vec The another vector
	 */
	public AngleBetweenFaces(front: Vector3): number {
		const dotProduct = this.x * front.x + this.y * front.y
		return Math.atan2(Math.sqrt(1 - dotProduct * dotProduct), dotProduct)
	}
	public GetDirectionTo(target: Vector3): Vector3 {
		return target.Subtract(this).Normalize()
	}
	public GetDirection2DTo(target: Vector3): Vector3 {
		return target.Subtract(this).SetZ(0).Normalize()
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 *
	 * @param vec 2nd vector
	 * @param distance distance to extend
	 * @returns extended vector (new Vector3)
	 */
	public Extend(vec: Vector3, distance: number): Vector3 {
		return this.GetDirectionTo(vec).MultiplyScalarForThis(distance).AddForThis(this) // this + (distance * (vec - this).Normalize())
	}
	public Extend2D(vec: Vector3, distance: number): Vector3 {
		return this.GetDirection2DTo(vec).MultiplyScalarForThis(distance).AddForThis(this) // this + (distance * (vec - this).SetZ(0).Normalize())
	}
	public Clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z)
	}
	/**
	 * Returns if the distance to target is lower than range
	 */
	public IsInRange(vec: Vector3, range: number): boolean {
		return this.DistanceSqr(vec) < range * range
	}
	public Closest(vecs: Vector3[]): Vector3 {
		let minVec = vecs[0]
		let minDist = this.Distance(minVec)
		for (let i = 1; i < vecs.length; i++) {
			const tempDist = this.Distance(vecs[i])
			if (tempDist < minDist) {
				minDist = tempDist
				minVec = vecs[i]
			}
		}
		return minVec
	}
	/**
	 * Returns true if the point is under the rectangle
	 */
	public IsUnderRectangle(
		x: number,
		y: number,
		width: number,
		height: number
	): boolean {
		return this.x > x && this.x < x + width && this.y > y && this.y < y + height
	}
	/**
	 * x * 180 / PI
	 */
	public RadiansToDegrees(): Vector3 {
		return this.MultiplyScalar(180).DivideScalar(Math.PI)
	}
	/**
	 * x * PI / 180
	 */
	public DegreesToRadians(): Vector3 {
		return this.MultiplyScalar(Math.PI).DivideScalar(180)
	}

	/**
	 * @return [x, y, z]
	 */
	public toArray(): [number, number, number] {
		return [this.x, this.y, this.z]
	}
	public toJSON() {
		return this.toArray()
	}

	public toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.x
		IOBuffer[offset + 1] = this.y
		IOBuffer[offset + 2] = this.z
		return true
	}
}
