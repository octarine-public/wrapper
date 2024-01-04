import { SmoothStep } from "../Utils/Math"
import { Quaternion } from "./Quaternion"
import { Vector3 } from "./Vector3"

export class Vector4 {
	/**
	 * Creates a Vector4 object from an array-like object.
	 *
	 * @description A new Vector4 instance with components from the
	 * 	array-like object, defaulting to 0 for any undefined indices.
	 * @param {ArrayLike<number>} array - An array-like object containing
	 *     up to four numerical elements.
	 * @return {Vector4}
	 */
	public static fromArray(array: ArrayLike<number>): Vector4 {
		return new Vector4(array[0] ?? 0, array[1] ?? 0, array[2] ?? 0, array[3] ?? 0)
	}
	/**
	 * Converts a string of space-separated numbers into a
	 * Vector4 object.
	 *
	 * @description A new Vector4 object with the parsed float values from the string.
	 * @param {string} str - The string to convert.
	 * @return {Vector4}
	 */
	public static FromString(str: string): Vector4 {
		return new Vector4(...str.split(" ").map(el => parseFloat(el)))
	}
	/**
	 * Creates a Vector4 from a Vector3 with a w value of 0.
	 *
	 * @description A new Vector4 with the w value set to 0
	 * @param {Vector3} vec - The Vector3 to convert
	 * @return {Vector4}
	 */
	public static FromVector3(vec: Vector3): Vector4 {
		return new Vector4(vec.x, vec.y, vec.z, 0)
	}
	/**
	 * Creates a Vector4 object from an IOBuffer starting at the given offset.
	 *
	 * @description A new Vector4 instance with values from the IOBuffer
	 * @param {number} [offset=0] - The starting index in the IOBuffer
	 * @return {Vector4}
	 */
	public static fromIOBuffer(offset: number = 0): Vector4 {
		return new Vector4(
			IOBuffer[offset + 0],
			IOBuffer[offset + 1],
			IOBuffer[offset + 2],
			IOBuffer[offset + 3]
		)
	}

	/**
	 * Initializes a new instance of a 4D point.
	 *
	 * @param {number} x - The x coordinate. Default is 0.
	 * @param {number} y - The y coordinate. Default is 0.
	 * @param {number} z - The z coordinate. Default is 0.
	 * @param {number} w - The w coordinate. Default is 0.
	 */
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
		public w: number = 0
	) {}

	/**
	 * Checks if the current value is both not NaN and finite.
	 *
	 * @return {boolean}
	 */
	public get IsValid(): boolean {
		return this.IsFinite
	}
	/**
	 * Checks if the vector components are finite numbers.
	 *
	 * @return {boolean}
	 */
	public get IsFinite(): boolean {
		return (
			Number.isFinite(this.x) &&
			Number.isFinite(this.y) &&
			Number.isFinite(this.z) &&
			Number.isFinite(this.w)
		)
	}
	/**
	 * Checks if the vector components are within a tolerance of zero.
	 *
	 * @param {number} [tolerance=0.01] - The threshold to consider as zero.
	 * @return {boolean}
	 */
	public IsZero(tolerance: number = 0.01): boolean {
		const x = this.x,
			y = this.y,
			z = this.z,
			w = this.w
		return (
			x > -tolerance &&
			x < tolerance &&
			y > -tolerance &&
			y < tolerance &&
			z > -tolerance &&
			z < tolerance &&
			w > -tolerance &&
			w < tolerance
		)
	}
	/**
	 * Resets the components of the vector to zero.
	 *
	 * @return {Vector4}
	 */
	public toZero(): Vector4 {
		this.x = this.y = this.z = this.w = 0
		return this
	}
	/**
	 * Invalidates the components of the vector by setting
	 * each to NaN and returns the modified vector.
	 *
	 * @description The current instance with all components set to NaN.
	 * @return {Vector4}
	 */
	public Invalidate(): Vector4 {
		this.x = this.y = this.z = this.w = NaN
		return this
	}
	/**
	 * Negates the vector components.
	 *
	 * @description The current instance with negated components.
	 * @return {Vector4}
	 */
	public Negate(): Vector4 {
		this.x *= -1
		this.y *= -1
		this.z *= -1
		this.w *= -1
		return this
	}
	/**
	 * Calculates the squared length of a 4D vector.
	 * @description The sum of the squares of the vector's components.
	 * @return {number}
	 */
	public get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2
	}
	/**
	 * Calculates the length of a vector from its squared
	 * length property.
	 * @description The square root of the vector's squared length.
	 * @return {number}
	 */
	public get Length(): number {
		return Math.sqrt(this.LengthSqr)
	}
	/**
	 * Checks if the current vector is equal to the given vector.
	 *
	 * @param {Vector4} vec - The vector to compare with.
	 * @return {boolean}
	 */
	public Equals(vec: Vector4): boolean {
		return (
			this.x === vec.x && this.y === vec.y && this.z === vec.z && this.w === vec.w
		)
	}
	/**
	 * Returns a new Vector4 with the smallest values from the
	 * current vector and the input, which can be a number or
	 * another Vector4.
	 *
	 * @description A new vector with the minimum components.
	 * @param {Vector4 | number} vec - The second vector to
	 * compare to, or a number to compare each component against.
	 * @return {Vector4}
	 */
	public Min(vec: Vector4 | number): Vector4 {
		return new Vector4(
			Math.min(this.x, vec instanceof Vector4 ? vec.x : vec),
			Math.min(this.y, vec instanceof Vector4 ? vec.y : vec),
			Math.min(this.z, vec instanceof Vector4 ? vec.z : vec),
			Math.min(this.w, vec instanceof Vector4 ? vec.w : vec)
		)
	}
	/**
	 * Creates a new Vector4 where each component is the maximum value
	 * of the corresponding components of the current instance and the
	 * input vector or number.
	 *
	 * @description  A new Vector4 instance with the maximum values.
	 * @param {Vector4 | number} vec - A Vector4 instance or a number to
	 *                                 compare with the current instance's
	 *                                 components.
	 * @return {Vector4}
	 */
	public Max(vec: Vector4 | number): Vector4 {
		return new Vector4(
			Math.max(this.x, vec instanceof Vector4 ? vec.x : vec),
			Math.max(this.y, vec instanceof Vector4 ? vec.y : vec),
			Math.max(this.z, vec instanceof Vector4 ? vec.z : vec),
			Math.max(this.w, vec instanceof Vector4 ? vec.w : vec)
		)
	}
	/**
	 * Clamps the vector components to the specified
	 * min and max values.
	 *
	 * @param {Vector4 | number} min - The lower bounds to
	 *                                 clamp to, or the value to
	 *                                 clamp each component if
	 *                                 a number is provided.
	 * @param {Vector4 | number} max - The upper bounds to
	 *                                 clamp to, or the value to
	 *                                 clamp each component if
	 *                                 a number is provided.
	 * @return {Vector4}
	 */
	public Clamp(min: Vector4 | number, max: Vector4 | number): Vector4 {
		return this.Max(min).Min(max)
	}
	/**
	 * Calculates the square root of each component of the
	 * vector and returns a new Vector4 instance with the
	 * results.
	 *
	 * @return {Vector4}
	 */
	public SquareRoot(): Vector4 {
		return new Vector4(this.x ** 0.5, this.y ** 0.5, this.z ** 0.5, this.w ** 0.5)
	}
	/**
	 * Returns a new Vector4 instance with the absolute
	 * values of the current vector's components.
	 *
	 * @return {Vector4}
	 */
	public Abs(): Vector4 {
		return new Vector4(
			Math.abs(this.x),
			Math.abs(this.y),
			Math.abs(this.z),
			Math.abs(this.w)
		)
	} /**
	 * Rounds up the components of the vector to the nearest
	 * integer, optionally at a specified decimal place.
	 *
	 * @description A new Vector4 instance with the rounded values.
	 * @param {number} count - The number of decimal places to round up to. Default is 0.
	 * @return {Vector4}
	 */
	public Ceil(count: number = 0): Vector4 {
		const pow = 10 ** count
		return new Vector4(
			Math.ceil(this.x * pow) / pow,
			Math.ceil(this.y * pow) / pow,
			Math.ceil(this.z * pow) / pow,
			Math.ceil(this.w * pow) / pow
		)
	} /**
	 * Rounds up the components of the vector to the nearest
	 * integer, optionally at a specified decimal precision.
	 *
	 * @param {number} count - The number of decimal places to
	 * preserve. Defaults to 0, rounding to the nearest whole
	 * number.
	 * @return {Vector4}
	 */
	public CeilForThis(count: number = 0): Vector4 {
		const pow = 10 ** count
		this.x = Math.ceil(this.x * pow) / pow
		this.y = Math.ceil(this.y * pow) / pow
		this.z = Math.ceil(this.z * pow) / pow
		this.w = Math.ceil(this.w * pow) / pow
		return this
	}
	/**
	 * Rounds the components of the vector to a specified
	 * number of decimal places.
	 *
	 * @param {number} count - The number of decimal places
	 * to round to. Default is 0.
	 * @return {Vector4}
	 */
	public Round(count = 0): Vector4 {
		const pow = 10 ** count
		return new Vector4(
			Math.round(this.x * pow) / pow,
			Math.round(this.y * pow) / pow,
			Math.round(this.z * pow) / pow,
			Math.round(this.w * pow) / pow
		)
	}
	/**
	 * Rounds the components of the vector to a specified
	 * number of decimal places.
	 *
	 * @description The vector with its components rounded to the specified number of decimal places.
	 * @param {number} count - The number of decimal places to round
	 *                         to. Default is 0.
	 * @return {Vector4}
	 */
	public RoundForThis(count: number = 0): Vector4 {
		const pow = 10 ** count
		this.x = Math.round(this.x * pow) / pow
		this.y = Math.round(this.y * pow) / pow
		this.z = Math.round(this.z * pow) / pow
		this.w = Math.round(this.w * pow) / pow
		return this
	}
	/**
	 * Rounds down the components of the vector to the nearest
	 * integer less than or equal to them, at a specific decimal
	 * place defined by count.
	 *
	 * @description  A new Vector4 instance with each component
	 * rounded down to the nearest value at the specified precision.
	 * @param {number} count - The number of decimal places to round
	 * to. Defaults to 0, which means rounding to an integer.
	 * @return {Vector4}
	 */
	public Floor(count: number = 0): Vector4 {
		const pow = 10 ** count
		return new Vector4(
			Math.floor(this.x * pow) / pow,
			Math.floor(this.y * pow) / pow,
			Math.floor(this.z * pow) / pow,
			Math.floor(this.w * pow) / pow
		)
	}
	/**
	 * Floors the components of the vector to a specified
	 * number of decimal places.
	 *
	 * @description The vector with its components floored.
	 * @param {number} count - The number of decimal places to floor
	 *                         to. Defaults to 0 if not provided.
	 * @return {Vector4}
	 */
	public FloorForThis(count: number = 0): Vector4 {
		const pow = 10 ** count
		this.x = Math.floor(this.x * pow) / pow
		this.y = Math.floor(this.y * pow) / pow
		this.z = Math.floor(this.z * pow) / pow
		this.w = Math.floor(this.w * pow) / pow
		return this
	}
	/**
	 * Adds the components of the provided vector to the
	 * components of the current vector and returns the
	 * result as a new Vector4 instance.
	 *
	 * @description A new vector resulting from the component-wise addition
	 * @param {Vector4} vec - The vector to add to the current vector
	 * @return {Vector4}
	 */
	public Add(vec: Vector4): Vector4 {
		return new Vector4(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w)
	}
	/**
	 * Adds the components of the given vector to this vector.
	 *
	 * @param {Vector4} vec - The vector to be added to this one.
	 * @return {Vector4} This vector after addition.
	 */
	public AddForThis(vec: Vector4): Vector4 {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
		this.w += vec.w
		return this
	}
	/**
	 * Adds a scalar value to each component of a 4D vector.
	 *
	 * @description A new Vector4 instance with the result.
	 * @param {number} scalar - The scalar value to add.
	 * @return {Vector4}
	 */
	public AddScalar(scalar: number): Vector4 {
		return new Vector4(
			this.x + scalar,
			this.y + scalar,
			this.z + scalar,
			this.w + scalar
		)
	}
	/**
	 * Adds a scalar value to each component of the vector.
	 *
	 * @param {number} scalar - The scalar to add to x, y, z, w.
	 * @return {Vector4}
	 */
	public AddScalarForThis(scalar: number): Vector4 {
		this.x += scalar
		this.y += scalar
		this.z += scalar
		this.w += scalar
		return this
	}
	/**
	 * Subtracts the provided Vector4 from this vector.
	 *
	 * @description A new vector representing the difference.
	 * @param {Vector4} vec - The vector to subtract.
	 * @return {Vector4}
	 */
	public Subtract(vec: Vector4): Vector4 {
		return new Vector4(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w)
	}
	/**
	 * Subtracts the components of the provided vector from
	 * the components of the `this` vector.
	 *
	 * @param {Vector4} vec - The vector to subtract from `this`.
	 * @return {Vector4}
	 */
	public SubtractForThis(vec: Vector4): Vector4 {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
		this.w -= vec.w
		return this
	}
	/**
	 * Subtracts the given scalar from each component of the vector.
	 *
	 * @description  A new vector with the scalar subtracted from each component.
	 * @param {number} scalar - The scalar to subtract from each vector component.
	 * @return {Vector4}
	 */
	public SubtractScalar(scalar: number): Vector4 {
		return new Vector4(
			this.x - scalar,
			this.y - scalar,
			this.z - scalar,
			this.w - scalar
		)
	}
	/**
	 * Subtracts a scalar value from each component of the vector.
	 *
	 * @param {number} scalar - The scalar value to subtract.
	 * @return {Vector4}
	 */
	public SubtractScalarForThis(scalar: number): Vector4 {
		this.x -= scalar
		this.y -= scalar
		this.z -= scalar
		this.w -= scalar
		return this
	}
	/**
	 * Multiplies the components of this vector by another
	 * Vector4's components.
	 *
	 * @param {Vector4} vec - The vector to multiply with.
	 * @return {Vector4}
	 */
	public Multiply(vec: Vector4): Vector4 {
		return new Vector4(this.x * vec.x, this.y * vec.y, this.z * vec.z, this.w * vec.w)
	}
	/**
	 * Multiplies the properties of the current Vector4
	 * instance by the corresponding properties of
	 * the provided Vector4.
	 *
	 * @param {Vector4} vec - The Vector4 to multiply with.
	 * @return {Vector4}
	 */
	public MultiplyForThis(vec: Vector4): Vector4 {
		this.x *= vec.x
		this.y *= vec.y
		this.z *= vec.z
		this.w *= vec.w
		return this
	}
	/**
	 * Multiplies each component of the vector by a scalar.
	 *
	 * @param {number} scalar - The number to multiply with.
	 * @return {Vector4}
	 */
	public MultiplyScalar(scalar: number): Vector4 {
		return new Vector4(
			this.x * scalar,
			this.y * scalar,
			this.z * scalar,
			this.w * scalar
		)
	}
	/**
	 * Multiplies each component of the vector by a scalar.
	 *
	 * @param {number} scalar - The number to multiply by.
	 * @return {Vector4}
	 */
	public MultiplyScalarForThis(scalar: number): Vector4 {
		this.x *= scalar
		this.y *= scalar
		this.z *= scalar
		this.w *= scalar
		return this
	}
	/**
	 * Divides the components of the current vector by
	 * the corresponding components of the provided vector.
	 *
	 * @param {Vector4} vec - The vector to divide by
	 * @return {Vector4}
	 */
	public Divide(vec: Vector4): Vector4 {
		return new Vector4(this.x / vec.x, this.y / vec.y, this.z / vec.z, this.w / vec.w)
	}
	/**
	 * Divides the components of the current Vector4 by the
	 * components of the provided Vector4.
	 *
	 * @param {Vector4} vec - The Vector4 by which to divide.
	 * @return {Vector4}
	 */
	public DivideForThis(vec: Vector4): Vector4 {
		this.x /= vec.x
		this.y /= vec.y
		this.z /= vec.z
		this.w /= vec.w
		return this
	}
	/**
	 * Divides each component of the vector by a scalar.
	 *
	 * @param {number} scalar - The number to divide by.
	 * @return {Vector4}
	 */
	public DivideScalar(scalar: number): Vector4 {
		return new Vector4(
			this.x / scalar,
			this.y / scalar,
			this.z / scalar,
			this.w / scalar
		)
	}
	/**
	 * Divides each component of the vector by a scalar.
	 *
	 * @param {number} scalar - The number to divide by.
	 * @return {Vector4}
	 */
	public DivideScalarForThis(scalar: number): Vector4 {
		this.x /= scalar
		this.y /= scalar
		this.z /= scalar
		this.w /= scalar
		return this
	}
	/**
	 * Linearly interpolates between this vector and a
	 * target vector by a given scalar amount.
	 *
	 * @param {Vector4} target - The target vector to interpolate towards.
	 * @param {number} amount - The interpolation factor between 0 and 1.
	 * @return {Vector4}
	 */
	public Lerp(target: Vector4, amount: number): Vector4 {
		return this.Add(target.Subtract(this).MultiplyScalar(amount))
	}
	/**
	 * Interpolates between the current vector and the
	 * provided vector by a given scalar amount.
	 *
	 * @param {Vector4} vec - The vector to interpolate towards.
	 * @param {number} amount - The ratio of interpolation.
	 * @return {Vector4}
	 */
	public LerpForThis(vec: Vector4, amount: number): Vector4 {
		return this.AddForThis(vec.Subtract(this).MultiplyScalar(amount))
	}
	/**
	 * Interpolates between the vector and the target
	 * vector using a smoothstep easing function.
	 *
	 * @param {Vector4} vec - The target vector for
	 *                        interpolation.
	 * @param {number} amount - The interpolation
	 *                          factor between 0 and 1.
	 * @return {Vector4}
	 */
	public SmoothStep(vec: Vector4, amount: number): Vector4 {
		return this.Lerp(vec, SmoothStep(amount))
	}
	/**
	 * Interpolates between this vector and the provided vector using
	 * a smooth step function based on the given amount.
	 *
	 * @param {Vector4} vec - The target vector to interpolate towards.
	 * @param {number} amount - The interpolation coefficient (0-1).
	 * @return {Vector4}
	 */
	public SmoothStepForThis(vec: Vector4, amount: number): Vector4 {
		return this.LerpForThis(vec, SmoothStep(amount))
	}
	/**
	 * Calculates the interpolated value at the given fraction
	 * of the way between two values, using Hermite spline
	 * interpolation. The tension and bias of the spline are
	 * defined by the tangents provided.
	 *
	 * @param {Vector4} tan1 - The tangent of the first value
	 * @param {Vector4} val2 - The second value to interpolate
	 * @param {Vector4} tan2 - The tangent of the second value
	 * @param {number} amt - The weight of the second value
	 * @return {Vector4}
	 */
	public Hermite(tan1: Vector4, val2: Vector4, tan2: Vector4, amt: number): Vector4 {
		const amtSq = amt * amt
		const amtCb = amt * amtSq
		const blend1 = 2 * amtCb - 3 * amtSq + 1
		const blend2 = -2 * amtCb + 3 * amtSq
		const blendTan1 = amtCb - 2 * amtSq + amt
		const blendTan2 = amtCb - amtSq
		return this.MultiplyScalar(blend1)
			.Add(val2.MultiplyScalar(blend2))
			.Add(tan1.MultiplyScalar(blendTan1))
			.Add(tan2.MultiplyScalar(blendTan2))
	}
	/**
	 * Calculates the barycentric coordinates by interpolating
	 * two vectors with given weights and then adding them.
	 *
	 * @param {Vector4} v2 - The second vector for interpolation
	 * @param {Vector4} v3 - The third vector for interpolation
	 * @param {number} a1 - The weight for the second vector
	 * @param {number} a2 - The weight for the third vector
	 * @return {Vector4}
	 */
	public Barycentric(v2: Vector4, v3: Vector4, a1: number, a2: number): Vector4 {
		return this.Lerp(v2, a1).Add(this.Lerp(v3, a2))
	}
	/**
	 * Transforms the vector by a given rotation.
	 *
	 * @description The rotated vector with original w component
	 * @param {Quaternion} rotation - The rotation to apply to the vector
	 * @return {Vector4}
	 */
	public Transform(rotation: Quaternion): Vector4 {
		const vectorQuat = new Quaternion(this.x, this.y, this.z, 0)
		const rotatedQuat = rotation.Multiply(vectorQuat).Multiply(rotation.Invert())
		return new Vector4(rotatedQuat.x, rotatedQuat.y, rotatedQuat.z, this.w)
	}
	/**
	 * Copies the values from a given Vector4 into this vector.
	 *
	 * @param {Vector4} vec - The source vector to copy from.
	 * @return {Vector4}
	 */
	public CopyFrom(vec: Vector4): Vector4 {
		this.x = vec.x
		this.y = vec.y
		this.z = vec.z
		this.w = vec.w
		return this
	}
	/**
	 * Copies the values from the given Vector4 into this vector.
	 *
	 * @param {Vector4} vec - The source vector to copy from.
	 * @return {Vector4}
	 */
	public CopyTo(vec: Vector4): Vector4 {
		vec.x = this.x
		vec.y = this.y
		vec.z = this.z
		vec.w = this.w
		return vec
	}
	/**
	 * Converts the vector properties to an array.
	 *
	 * @description An array of the vector's x, y, z, and w values.
	 * @return {[number, number, number, number]}
	 */
	public toArray(): [number, number, number, number] {
		return [this.x, this.y, this.z, this.w]
	}
	/**
	 * Writes the vector components to the IOBuffer at the
	 * specified offset and returns true.
	 *
	 * @param {number} offset - The starting index in the IOBuffer.
	 * @return {true}
	 */
	public toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.x
		IOBuffer[offset + 1] = this.y
		IOBuffer[offset + 2] = this.z
		IOBuffer[offset + 3] = this.w
		return true
	}

	public Clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w)
	}
}
