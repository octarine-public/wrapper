import { ProjectionInfo } from "../Geometry/ProjectionInfo"
import Vector3 from "./Vector3"

export default class Vector2 {
	public static fromIOBuffer(offset = 0): Vector2 {
		return new Vector2(IOBuffer[offset + 0], IOBuffer[offset + 1])
	}
	public static fromArray(array: number[]): Vector2 {
		return new Vector2(array[0] ?? 0, array[1] ?? 0)
	}
	public static FromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}
	public static FromString(str: string): Vector2 {
		return new Vector2(...str.split(" ").map(el => parseFloat(el)))
	}
	/**
	 * From polar coordinates
	 * @param radial
	 * @param polar
	 */
	public static FromPolarCoordinates(radial: number, polar: number): Vector2 {
		return new Vector2(Math.cos(polar) * radial, Math.sin(polar) * radial)
	}
	public static GetCenterType<T>(array: T[], callback: (value: T) => Vector2): Vector2 {
		const newVec = new Vector2()
		array.forEach(vec => newVec.AddForThis(callback(vec)))
		return newVec.DivideScalarForThis(array.length)
	}
	public static GetCenter(array: Vector2[]): Vector2 {
		const newVec = new Vector2()
		array.forEach(vec => newVec.AddForThis(vec))
		return newVec.DivideScalarForThis(array.length)

	}
	public static CopyFrom(vec: Vector2): Vector2 {
		return new Vector2(vec.x, vec.y)
	}
	public static FromVector3(vec: Vector3): Vector2 {
		return new Vector2(vec.x, vec.y)
	}

	/**
	 * Create new Vector2 with x, y
	 *
	 * @example
	 * let vec = new Vector2(1, 2)
	 * vec.Normalize()
	 */
	constructor(public x: number = 0, public y: number = 0) { }

	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	get IsValid(): boolean {
		const x = this.x,
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

	public Equals(vec: Vector2): boolean {
		return this.x === vec.x
			&& this.y === vec.y
	}

	/**
	 * Are all components of this vector are 0?
	 */
	public IsZero(tolerance: number = 0.01): boolean {
		const x = this.x,
			y = this.y

		return x > -tolerance && x < tolerance
			&& y > -tolerance && y < tolerance
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
	public Invalidate(): Vector2 {
		this.x = this.y = NaN
		return this
	}
	/**
	 * Zeroes this vector
	 */
	public toZero(): Vector2 {
		this.x = this.y = 0
		return this
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	public Negate(): Vector2 {
		this.x *= -1
		this.y *= -1
		return this
	}
	/**
	 * Randomizes this vector within given values
	 */
	public Random(minVal: number, maxVal: number): Vector2 {
		this.x = Math.random() * (maxVal - minVal) + minVal
		this.y = Math.random() * (maxVal - minVal) + minVal
		return this
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	public Min(vec: Vector2 | number): Vector2 {
		return new Vector2(
			Math.min(this.x, vec instanceof Vector2 ? vec.x : vec),
			Math.min(this.y, vec instanceof Vector2 ? vec.y : vec),
		)
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	public Max(vec: Vector2 | number): Vector2 {
		return new Vector2(
			Math.max(this.x, vec instanceof Vector2 ? vec.x : vec),
			Math.max(this.y, vec instanceof Vector2 ? vec.y : vec),
		)
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	public Abs(): Vector2 {
		return new Vector2(
			Math.abs(this.x),
			Math.abs(this.y),
		)
	}
	public Ceil(count: number = 0): Vector2 {
		const pow = 10 ** count
		return new Vector2(
			Math.ceil(this.x * pow) / pow,
			Math.ceil(this.y * pow) / pow,
		)
	}
	public CeilForThis(count: number = 0): Vector2 {
		const pow = 10 ** count

		this.x = Math.ceil(this.x * pow) / pow
		this.y = Math.ceil(this.y * pow) / pow

		return this
	}
	public Round(count = 0): Vector2 {
		const pow = 10 ** count
		return new Vector2(
			Math.round(this.x * pow) / pow,
			Math.round(this.y * pow) / pow,
		)
	}
	public RoundForThis(count = 0): Vector2 {
		const pow = 10 ** count

		this.x = Math.round(this.x * pow) / pow
		this.y = Math.round(this.y * pow) / pow

		return this
	}
	public Floor(count: number = 0): Vector2 {
		const pow = 10 ** count
		return new Vector2(
			Math.floor(this.x * pow) / pow,
			Math.floor(this.y * pow) / pow,
		)
	}
	public FloorForThis(count: number = 0): Vector2 {
		const pow = 10 ** count

		this.x = Math.floor(this.x * pow) / pow
		this.y = Math.floor(this.y * pow) / pow

		return this
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	public SquareRoot(): Vector2 {
		return new Vector2(
			Math.sqrt(this.x),
			Math.sqrt(this.y),
		)
	}
	/**
	 * Copy this vector to another vector and return it
	 * @param vec The another vector
	 * @returns another vector
	 */
	public CopyTo(vec: Vector2): Vector2 {
		vec.x = this.x
		vec.y = this.y
		return vec
	}
	/**
	 * Copy fron another vector to this vector and return it
	 * @param vec The another vector
	 * @returns this vector
	 */
	public CopyFrom(vec: Vector2): Vector2 {
		this.x = vec.x
		this.y = vec.y
		return this
	}
	/**
	 * Set vector by numbers
	 */
	public SetVector(x: number = 0, y: number = 0): Vector2 {
		this.x = x
		this.y = y
		return this
	}
	/**
	 * Set X of vector by number
	 */
	public SetX(num: number): Vector2 {
		this.x = num
		return this
	}
	/**
	 * Set Y of vector by number
	 */
	public SetY(num: number): Vector2 {
		this.y = num
		return this
	}

	/**
	 * Normalize the vector
	 */
	public Normalize(scalar = 1): Vector2 {
		const length = this.Length
		if (length !== 0)
			this.DivideScalarForThis(length * scalar)
		return this
	}
	/**
	 * Returns the cross product Z value.
	 */
	public Cross(vec: Vector2): number {
		return (vec.y * this.x) - (vec.x * this.y)
	}
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	public Dot(vec: Vector2): number {
		return this.x * vec.x + this.y * vec.y
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	public ScaleTo(scalar: number): Vector2 {
		const length = this.Length
		if (length === 0)
			this.toZero()
		else
			this.MultiplyScalar(scalar / length)

		return this
	}
	/**
	 * Divides both vector axis by the given scalar value
	 */
	public DivideTo(scalar: number): Vector2 {
		const length = this.Length
		if (length === 0)
			this.toZero()
		else
			this.DivideScalar(scalar / length)

		return this
	}
	/**
	 * Restricts a vector between a min and max value.
	 */
	public Clamp(min: Vector2, max: Vector2): Vector2 {
		return new Vector2(
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
	public Add(vec: Vector2): Vector2 {
		return new Vector2(
			this.x + vec.x,
			this.y + vec.y,
		)
	}
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector (this vector)
	 */
	public AddForThis(vec: Vector2): Vector2 {
		this.x += vec.x
		this.y += vec.y
		return this
	}
	/**
	 * Add scalar to vector
	 */
	public AddScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x + scalar,
			this.y + scalar,
		)
	}
	/**
	 * Add scalar to vector
	 * @returns (this Vector2)
	 */
	public AddScalarForThis(scalar: number): Vector2 {
		this.x += scalar
		this.y += scalar
		return this
	}
	/**
	 * Add scalar to X of vector
	 */
	public AddScalarX(scalar: number): Vector2 {
		this.x += scalar
		return this
	}
	/**
	 * Add scalar to Y of vector
	 */
	public AddScalarY(scalar: number): Vector2 {
		this.y += scalar
		return this
	}

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	public Subtract(vec: Vector2): Vector2 {
		return new Vector2(
			this.x - vec.x,
			this.y - vec.y,
		)
	}
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector (this vector)
	 */
	public SubtractForThis(vec: Vector2): Vector2 {
		this.x -= vec.x
		this.y -= vec.y
		return this
	}
	/**
	 * Subtract scalar from vector
	 */
	public SubtractScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x - scalar,
			this.y - scalar,
		)
	}
	/**
	 * Subtract scalar from vector
	 * @returns (this vector)
	 */
	public SubtractScalarForThis(scalar: number): Vector2 {
		this.x -= scalar
		this.y -= scalar
		return this
	}
	/**
	 * Subtract scalar from X of vector
	 */
	public SubtractScalarX(scalar: number): Vector2 {
		this.x -= scalar
		return this
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	public SubtractScalarY(scalar: number): Vector2 {
		this.y -= scalar
		return this
	}

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	public Multiply(vec: Vector2): Vector2 {
		return new Vector2(
			this.x * vec.x,
			this.y * vec.y,
		)
	}
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector (this vector)
	 */
	public MultiplyForThis(vec: Vector2): Vector2 {
		this.x *= vec.x
		this.y *= vec.y
		return this
	}
	/**
	 * Multiply the vector by scalar
	 */
	public MultiplyScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x * scalar,
			this.y * scalar,
		)
	}
	/**
	 * Multiply the vector by scalar
	 * @return (this vector)
	 */
	public MultiplyScalarForThis(scalar: number): Vector2 {
		this.x *= scalar
		this.y *= scalar
		return this
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	public MultiplyScalarX(scalar: number): Vector2 {
		this.x *= scalar
		return this
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	public MultiplyScalarY(scalar: number): Vector2 {
		this.y *= scalar
		return this
	}

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	public Divide(vec: Vector2): Vector2 {
		return new Vector2(
			this.x / vec.x,
			this.y / vec.y,
		)
	}
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division (this vector)
	 */
	public DivideForThis(vec: Vector2): Vector2 {
		this.x /= vec.x
		this.y /= vec.y
		return this
	}
	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	public DivideScalar(scalar: number): Vector2 {
		return new Vector2(
			this.x / scalar,
			this.y / scalar,
		)
	}
	/**
	 * Divide the scalar by vector
	 * @returns (this vector)
	 */
	public DivideScalarForThis(scalar: number): Vector2 {
		this.x /= scalar
		this.y /= scalar
		return this
	}
	/**
	 * Divide the scalar by X of vector
	 */
	public DivideScalarX(scalar: number): Vector2 {
		this.x /= scalar
		return this
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	public DivideScalarY(scalar: number): Vector2 {
		this.y /= scalar
		return this
	}

	/**
	 * Multiply, add, and return new vector
	 */
	public MultiplyAdd(vec: Vector2, scalar: number): Vector2 {
		return this.MultiplyScalar(scalar).AddForThis(vec)
	}
	/**
	 * Multiply, add, and assign to this vector
	 */
	public MultiplyAddForThis(vec2: Vector2, scalar: number): Vector2 {
		return this.MultiplyScalarForThis(scalar).AddForThis(vec2)
	}
	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	public DistanceSqr(vec: Vector2): number {
		return (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2
	}
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	public Distance(vec: Vector2): number {
		return Math.sqrt(this.DistanceSqr(vec))
	}
	public ProjectOn(segmentStart: Vector2, segmentEnd: Vector2): ProjectionInfo {
		const segmentSize = segmentEnd.Subtract(segmentStart)
		const rL = this.Subtract(segmentStart).Dot(segmentSize) / segmentSize.LengthSqr
		const rS = Math.min(1, Math.max(0, rL)) // normalized to segment bounds
		const pointLine = segmentStart.Add(segmentSize.MultiplyScalar(rL))
		const pointSegment = segmentStart.Add(segmentSize.MultiplyScalar(rS))
		return new ProjectionInfo(pointSegment, pointLine)
	}
	public DistanceSegmentSqr(segmentStart: Vector2, segmentEnd: Vector2, onlyIfOnSegment = false): number {
		const objects = this.ProjectOn(segmentStart, segmentEnd)
		if (!objects.IsOnSegment && onlyIfOnSegment)
			return Number.MAX_VALUE
		return this.DistanceSqr(objects.SegmentPoint)
	}
	public DistanceSegment(segmentStart: Vector2, segmentEnd: Vector2, onlyIfOnSegment = false): number {
		const sqr = this.DistanceSegmentSqr(segmentStart, segmentEnd, onlyIfOnSegment)
		if (sqr === Number.MAX_VALUE)
			return Number.MAX_VALUE
		return Math.sqrt(sqr)
	}

	/**
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	public Perpendicular(is_x: boolean = true): Vector2 {
		return is_x
			? new Vector2(-this.y, this.x)
			: new Vector2(this.y, -this.x)
	}
	/**
	 * Calculates the polar angle of the given vector. Returns degree values on default, radian if requested.
	 */
	public PolarAngle(radian: boolean = false): number {
		if (radian)
			return this.Angle

		return this.Angle * (180 / Math.PI)
	}
	/**
	 * Rotates the Vector2 to a set angle.
	 */
	public Rotated(angle: number): Vector2 {
		const cos = Math.cos(angle),
			sin = Math.sin(angle)
		return new Vector2(
			(this.x * cos) - (this.y * sin),
			(this.y * cos) + (this.x * sin),
		)
	}
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	public Rotation(rotation: Vector2, distance: number): Vector2 {
		return new Vector2(
			this.x + rotation.x * distance,
			this.y + rotation.y * distance,
		)
	}
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	public RotationRad(rotation: Vector2, distance: number): Vector2 {
		return this.Rotation(rotation.DegreesToRadians(), distance)
	}
	/**
	 * Extends vector in the rotation direction by angle
	 * @param angle for ex. Entity#RotationRad
	 * @param distance distance to be added
	 */
	public InFrontFromAngle(angle: number, distance: number): Vector2 {
		return this.Rotation(Vector2.FromAngle(angle), distance)
	}
	/**
	 *
	 * @param vec The another vector
	 * @param vecAngleRadian Angle of this vector
	 */
	public FindRotationAngle(vec: Vector2, vecAngleRadian = 0): number {
		let angle = Math.abs(Math.atan2(vec.y - this.y, vec.x - this.x) - vecAngleRadian)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}
	public RotationTime(rot_speed: number): number {
		return this.Angle / (30 * rot_speed)
	}
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	public AngleBetweenVectors(vec: Vector2): number {
		let theta = this.Polar - vec.Polar
		if (theta < 0)
			theta = theta + 360
		if (theta > 180)
			theta = 360 - theta
		return theta
	}
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	public AngleBetweenFronts(front: Vector2): number {
		return Math.acos((this.x * front.x) + (this.y * front.y))
	}
	public GetDirectionTo(target: Vector2): Vector2 {
		return target.Subtract(this).Normalize()
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	public Extend(vec: Vector2, distance: number): Vector2 {
		return this.GetDirectionTo(vec).MultiplyScalarForThis(distance).AddForThis(this) // this + (distance * (vec - this).Normalize())
	}
	public Clone(): Vector2 {
		return new Vector2(this.x, this.y)
	}
	/**
	 * Returns if the distance to target is lower than range
	 */
	public IsInRange(vec: Vector2, range: number): boolean {
		return this.DistanceSqr(vec) < range ** 2
	}
	public Closest(vecs: Vector2[]): Vector2 {
		let minVec = new Vector2()
		let distance = Number.POSITIVE_INFINITY

		vecs.forEach(vec => {
			const tempDist = this.Distance(vec)
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
	public IsUnderRectangle(x: number, y: number, width: number, height: number) {
		return this.x > x && this.x < (x + width) && this.y > y && this.y < (y + height)
	}
	public RadiansToDegrees(): Vector2 {
		return this.MultiplyScalar(180).DivideScalar(Math.PI)
	}
	public DegreesToRadians(): Vector2 {
		return this.MultiplyScalar(Math.PI).DivideScalar(180)
	}

	/**
	 * @return x y
	 */
	public toString(): string {
		return `${this.x} ${this.y}`
	}
	/**
	 * @return [x, y, z]
	 */
	public toArray(): [number, number] {
		return [this.x, this.y]
	}
	public toJSON() {
		return this.toArray()
	}

	public toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.x
		IOBuffer[offset + 1] = this.y
		return true
	}
}
