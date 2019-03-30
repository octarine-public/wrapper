// /// <reference path="../../Fusion-Native2.d.ts" />

/* ================== Vector (3D) ================== */

// import Vector from "modules/Vector"; console.log(Object.getOwnPropertyNames(Vector);

// import Vector from "modules/Vector"; console.log(Object.getOwnPropertyNames(Vector.prototype));

/**
 * Create new Vector with x, y, z
 *
 * @example
 * var vector = new Vector(1, 2, 3);
 *
 * vector.Normalize();
 */
export default class Vector {

	x: number
	y: number
	z: number

	constructor(x: Vector | number = 0, y: number = 0, z: number = 0) {

		if (x instanceof Vector) {

			this.x = (x as Vector).x;
			this.y = (x as Vector).y;
			this.z = (x as Vector).z;

		} else {
			this.x = x as number;

			this.y = y;

			this.z = z;
		}
	}

	/* ================== Getters ================== */

	/**
	 * Is valid this vector? (every value must not be infinity/NaN)
	 */
	get IsValid(): boolean {
		var x = this.x,
			y = this.y,
			z = this.z;

		return isNaN(x) && isFinite(x)
			&& isNaN(y) && isFinite(y)
			&& isNaN(z) && isFinite(z);
	}

	/**
	 * Get the length of the vector
	 */
	get Length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	get LengthSquared(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	/**
	 * Angle of the Vector
	 */
	get Angle(): number {
		return Math.atan2(this.y, this.x);
	}
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	get Polar(): number {
		var theta = Math.atan(this.y / this.x) * (180 / Math.PI);

		if (this.x < 0)
			theta += 180;

		if (theta < 0)
			theta += 360;

		return theta;
	}

	/* ================== Methods ================== */

	Equals(vec: Vector): boolean {
		return this.x == vec.x
			&& this.y == vec.y
			&& this.z == vec.z;
	}

	/**
	 * Are all components of this vector are 0?
	 */
	IsZero(tolerance: number = 0.01): boolean {
		var x = this.x,
			y = this.y,
			z = this.z;

		return x > tolerance && x < tolerance
			&& y > tolerance && y < tolerance
			&& z > tolerance && z < tolerance;
	}
	/**
	 * Are length of this vector are  greater than value?
	 */
	IsLengthGreaterThan(val: number) {
		return this.LengthSquared > val * val;
	}
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number) {
		return this.LengthSquared < val * val;
	}
	/**
	 * Invalidates this vector
	 */
	Invalidate(): void {
		this.x = this.y = this.z = NaN;
	}
	/**
	 * Zeroes this vector
	 */
	toZero(): void {
		this.x = this.y = this.z = 0;
	}
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): void {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	}
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): void {
		this.x = Math.random() * (maxVal - minVal) + minVal;
		this.y = Math.random() * (maxVal - minVal) + minVal;
		this.z = Math.random() * (maxVal - minVal) + minVal;
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector): Vector {
		return new Vector(
			(this.x < vec.x) ? this.x : vec.x,
			(this.y < vec.y) ? this.y : vec.y,
			(this.z < vec.z) ? this.z : vec.z);
	}
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector): Vector {
		return new Vector(
			(this.x > vec.x) ? this.x : vec.x,
			(this.y > vec.y) ? this.y : vec.y,
			(this.z > vec.z) ? this.z : vec.z);
	}
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector {
		return new Vector(
			Math.abs(this.x),
			Math.abs(this.y),
			Math.abs(this.z),
		);
	}
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector {
		return new Vector(
			Math.sqrt(this.x),
			Math.sqrt(this.y),
			Math.sqrt(this.z),
		);
	}

	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector {
		this.x = num;
		return this;
	}
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector {
		this.y = num;
		return this;
	}
	/**
	 * Set Z of vector by number
	 */
	SetZ(num: number): Vector {
		this.z = num;
		return this;
	}

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector {
		var length = this.Length;

		if (length != 0)
			this.DivideScalar(scalar !== undefined ? length * scalar : length);

		return this;
	}
	/**
	 * The cross product of this and vec.
	 */
	Cross(vec: Vector): Vector {
		return new Vector(
			this.y * vec.z - this.z * vec.y,
			this.z * vec.x - this.x * vec.z,
			this.x * vec.y - this.y * vec.x,
		);
	}
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector {
		var length = this.Length;

		if (length == 0) {
			this.x = 0;
			this.y = 0;
			this.y = 0;

		} else this.MultiplyScalar(scalar / length);

		return this;
	}
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector {
		var length = this.Length;

		if (length == 0) {
			this.x = 0;
			this.y = 0;
			this.y = 0;

		} else this.DivideScalar(scalar / length);

		return this;
	}
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector, max: Vector): Vector {

		var x = this.x,
			y = this.y,
			z = this.z;

		x = (x > max.x) ? max.x : x;
		x = (x < min.x) ? min.x : x;

		y = (y > max.y) ? max.y : y;
		y = (y < min.y) ? min.y : y;

		z = (z > max.z) ? max.z : z;
		z = (z < min.z) ? min.z : z;

		return new Vector(x, y, z);
	}

	/* ======== Add ======== */

	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector): Vector {
		return new Vector(
			this.x + vec.x,
			this.y + vec.y,
			this.z + vec.z,
		);
	}

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): void {
		this.x += scalar;
		this.y += scalar;
		this.z += scalar;
	}
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): void {
		this.x += scalar;
	}
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): void {
		this.y += scalar;
	}
	/**
	 * Add scalar to Z of vector
	 */
	AddScalarZ(scalar: number): void {
		this.z += scalar;
	}

	/* ======== Subtract ======== */

	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector): Vector {
		return new Vector(
			this.x - vec.x,
			this.y - vec.y,
			this.z - vec.z,
		);
	}

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): void {
		this.x -= scalar;
		this.y -= scalar;
		this.z -= scalar;
	}
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): void {
		this.x -= scalar;
	}
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): void {
		this.y -= scalar;
	}
	/**
	 * Subtract scalar from Z of vector
	 */
	SubtractScalarZ(scalar: number): void {
		this.z -= scalar;
	}

	/* ======== Multiply ======== */

	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector): Vector {
		return new Vector(
			this.x * vec.x,
			this.y * vec.y,
			this.z * vec.z,
		);
	}

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): void {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
	}
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): void {
		this.x *= scalar;
	}
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): void {
		this.y *= scalar;
	}
	/**
	 * Multiply the Z of vector by scalar
	 */
	MultiplyScalarZ(scalar: number): void {
		this.z *= scalar;
	}

	/* ======== Divide ======== */

	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector): Vector {
		return new Vector(
			this.x / vec.x,
			this.y / vec.y,
			this.z / vec.z,
		);
	}

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): void {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
	}
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): void {
		this.x /= scalar;
	}
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): void {
		this.y /= scalar;
	}
	/**
	 * Divide the scalar by Z of vector
	 */
	DivideScalarZ(scalar: number): void {
		this.z /= scalar;
	}

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector, vec2: Vector, scalar: number) {
		var newVec = vec.Add(vec2);

		newVec.MultiplyScalar(scalar);

		this.x = newVec.x;
		this.y = newVec.y;
		this.z = newVec.z;
	}

	/* ======== Distance ======== */

	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector): number {
		var dx = (vec.x - this.x);
		var dy = (vec.y - this.y);
		var dz = (vec.z - this.z);

		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector): number {
		var dx = (vec.x - this.x);
		var dy = (vec.y - this.y);

		return Math.sqrt(dx * dx + dy * dy);
	}
	/**
	 *
	 */
	DistanceSquared(vec: Vector): number {
		var dx = (vec.x - this.x);
		var dy = (vec.y - this.y);
		var dz = (vec.z - this.z);

		return dx * dx + dy * dy + dz * dz;
	}

	/* ================== Geometric ================== */

	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(offset: number = 0): Vector {

		return offset == 0
			? new Vector(-this.y, this.x, this.z)
			: new Vector(this.y, -this.x, this.z)
	}
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		return new Vector(
			(this.x * cos) - (this.y * sin),
			(this.y * cos) + (this.x * sin));
	}
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	*/
	Rotation(rotation: Vector, distance: number): Vector {
		return new Vector(
			this.x + rotation.x * distance,
			this.y + rotation.y * distance,
			this.z + rotation.z * distance);
	}
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector, distance: number): Vector {
		var vec = this.Rotation(rotation, distance)

		return vec.SetX((vec.x * Math.PI) / 180)
			.SetY((vec.x * Math.PI) / 180)
			.SetZ((vec.x * Math.PI) / 180);
	}
	RotationTime(rot_speed: number): number {
		return this.Angle / (30 * rot_speed);
	}
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector): number {
		return Math.atan2(vec.y - this.y, vec.x - this.x);
	}
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector): number {
		return Math.acos((this.x * front.x) + (this.y * front.y));
	}
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector, distance: number): Vector {
		return this.Rotation(Vector.FromAngle(this.AngleBetweenVectors(vec)), distance);
	}

	/* ================== Geometric ================== */

	/**
	 * Vector to String
	 * @return x,y,z
	 */
	toString(): string {
		return this.x + "," + this.y + "," + this.z;
	}
	/**
	 * Vector to String Vector
	 * @return new Vector(x,y,z)
	 */
	toStringVector(): string {
		return "new Vector(" + this.x + "," + this.y + "," + this.z + ")";
	}
	/**
	 * @return [x, y, z]
	 */
	toArray(): number[] {
		return [this.x, this.y, this.z];
	}

	/* ================== Static ================== */

	static fromArray(array: [number, number, number]): Vector {
		if (!array)
			return new Vector();
		return new Vector(array[0] || 0, array[1] || 0, array[2] || 0);
	}

	static fromObject(object: { x: number, y: number, z: number }): Vector {
		if (!object)
			return new Vector();
		return new Vector(object.x, object.y, object.z);
	}

	static FromAngle(angle: number): Vector {
		return new Vector(Math.cos(angle), Math.sin(angle));
	}

	static FromAngleCoordinates(radial: number, angle: number): Vector {
		return new Vector(Math.cos(angle) * radial, Math.sin(angle) * radial);
	}
	
}