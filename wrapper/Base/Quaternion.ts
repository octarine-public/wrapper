import { Vector3 } from "./Vector3"

export class Quaternion {
	/**
	 * Creates a Quaternion from a given Vector3, assuming
	 * the w component is 0.
	 *
	 * @param {Vector3} vec - The vector with x, y, and z
	 *                        components.
	 * @return {Quaternion}
	 */
	public static FromQuaternion(vec: Vector3): Quaternion {
		return new Quaternion(vec.x, vec.y, vec.z, 0)
	}
	/**
	 * Creates a new Quaternion from a Vector3 and scalar.
	 *
	 * @param {Vector3} vec - The vector part of the quaternion
	 * @param {number} scalar - The scalar part of the quaternion
	 * @return {Quaternion}
	 */
	public static FromQuaternionScalar(vec: Vector3, scalar: number): Quaternion {
		return new Quaternion(vec.x, vec.y, vec.z, scalar)
	}
	/**
	 * Creates a Quaternion from an axis vector and a rotation
	 * angle.
	 *
	 * @param {Vector3} axis - The axis of rotation.
	 * @param {number} angle - The rotation angle in radians.
	 * @return {Quaternion}
	 */
	public static FromAxisAngle(axis: Vector3, angle: number): Quaternion {
		const halfAngle = angle * 0.5
		const sinHalfAngle = Math.sin(halfAngle)
		const cosHalfAngle = Math.cos(halfAngle)
		return new Quaternion(
			axis.x * sinHalfAngle,
			axis.y * sinHalfAngle,
			axis.z * sinHalfAngle,
			cosHalfAngle
		)
	}
	/**
	 * Creates a Quaternion from the yaw, pitch, and roll angles.
	 *
	 * @param {number} yaw - Rotation around the y-axis in radians
	 * @param {number} pitch - Rotation around the x-axis in radians
	 * @param {number} roll - Rotation around the z-axis in radians
	 * @return {Quaternion} A new Quaternion representing the
	 *                      specified yaw, pitch, and roll.
	 */
	public static FromYawPitchRoll(yaw: number, pitch: number, roll: number): Quaternion {
		const halfRoll = roll * 0.5
		const sinRoll = Math.sin(halfRoll)
		const halfPitch = pitch * 0.5
		const sinPitch = Math.sin(halfPitch)
		const cosPitch = Math.cos(halfPitch)
		const halfYaw = yaw * 0.5
		const sinYaw = Math.sin(halfYaw)
		const cosYaw = Math.cos(halfYaw)
		return new Quaternion(
			cosYaw * sinPitch * sinRoll + sinYaw * cosPitch * sinRoll,
			sinYaw * cosPitch * sinRoll - cosYaw * sinPitch * sinRoll,
			cosYaw * cosPitch * sinRoll - sinYaw * sinPitch * sinRoll,
			cosYaw * cosPitch * sinRoll + sinYaw * sinPitch * sinRoll
		)
	}

	/**
	 * Quaternion constructor for representing rotations.
	 * @param x The x component. Default is 0.
	 * @param y The y component. Default is 0.
	 * @param z The z component. Default is 0.
	 * @param w The w component (real part). Default is 1.
	 */
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
		public w: number = 1
	) {}

	/**
	 * Calculates the squared length of a vector.
	 *
	 * @return {number}
	 */
	public get LengthSqr(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2
	}
	/**
	 * Calculates the length of a vector from its squared length.
	 * @description  The square root of the vector's squared length.
	 * @return {number}
	 */
	public get Length(): number {
		return Math.sqrt(this.LengthSqr)
	}
	/**
	 * Computes the conjugate of this quaternion.
	 * @description A new quaternion that is the conjugate of the current instance.
	 * @return {Quaternion}
	 */
	public Conjugate(): Quaternion {
		return new Quaternion(-this.x, -this.y, -this.z, this.w)
	}
	/**
	 *  The inverted quaternion.
	 *
	 * @description Inverts this quaternion by conjugating it and then dividing
	 * 				by the square of its length.
	 * @return {Quaternion}
	 */
	public Invert(): Quaternion {
		return this.Conjugate().DivideScalarForThis(this.LengthSqr)
	}
	/**
	 * Conjugates the quaternion by inverting the x, y,
	 * and z components. The conjugate of a quaternion
	 * represents the same rotation in the opposite
	 * direction.
	 *
	 * @return {Quaternion}
	 */
	public ConjugateForThis(): Quaternion {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z
		return this
	}
	/**
	 * Normalizes the Quaternion, optionally scaling it.
	 *
	 * @param {number} scalar - Scalar to multiply the Quaternion by
	 *                          after normalization. Default is 1.
	 * @description  A new normalized Quaternion if the length
	 *                      is not zero, otherwise returns itself.
	 * @return {Quaternion}
	 */
	public Normalize(scalar: number = 1): Quaternion {
		const length = this.Length
		return length !== 0 ? this.DivideScalarForThis(length * scalar) : this
	}
	/**
	 * Checks if this Quaternion is equal to another.
	 *
	 * @param {Quaternion} quat - The other quaternion to compare.
	 * @return {boolean}
	 */
	public Equals(quat: Quaternion): boolean {
		return (
			this.x === quat.x &&
			this.y === quat.y &&
			this.z === quat.z &&
			this.w === quat.w
		)
	}
	/**
	 * Concatenates this Quaternion with another by
	 * performing component-wise multiplication and
	 * adding the cross products of both quaternions.
	 * The scalar parts are combined separately.
	 *
	 * @param {Quaternion} quat - The Quaternion to concatenate with this one.
	 * @return {Quaternion}
	 */
	public Concatenate(quat: Quaternion): Quaternion {
		const wMul = this.w
		const multThis = this.Multiply(new Quaternion(wMul, wMul, wMul, 0))
		const multQuat = quat.Multiply(new Quaternion(wMul, wMul, wMul, 0))
		const crossProd = new Quaternion(
			this.y * quat.z - this.z * quat.y,
			this.z * quat.x - this.x * quat.z,
			this.x * quat.y - this.y * quat.x,
			0
		)
		const sum = multThis.Add(multQuat).Add(crossProd)
		const w = this.w * quat.w - (this.x * quat.x + this.y * quat.y + this.z * quat.z)
		return new Quaternion(sum.x, sum.y, sum.z, w)
	}
	/**
	 * Calculates the dot product of two quaternions.
	 *
	 * @param {Quaternion} quat - The other quaternion to dot with.
	 * @return {number}
	 */
	public Dot(quat: Quaternion): number {
		return this.x * quat.x + this.y * quat.y + this.z * quat.z + this.w * quat.w
	}
	/**
	 * Adds the given quaternion to the current quaternion.
	 *
	 * @param {Quaternion} quat - The quaternion to add.
	 * @return {Quaternion}
	 */
	public Add(quat: Quaternion): Quaternion {
		return new Quaternion(
			this.x + quat.x,
			this.y + quat.y,
			this.z + quat.z,
			this.w + quat.w
		)
	}
	/**
	 * Adds the provided quaternion to the current instance,
	 * modifying its components.
	 *
	 * @param {Quaternion} quat - The quaternion to add to this one.
	 * @return {Quaternion}
	 */
	public AddForThis(quat: Quaternion): Quaternion {
		this.x += quat.x
		this.y += quat.y
		this.z += quat.z
		this.w += quat.w
		return this
	}
	/**
	 * Adds a scalar value to each component of the quaternion.
	 *
	 * @param {number} scalar - The scalar value to add to the quaternion.
	 * @return {Quaternion}
	 */
	public AddScalar(scalar: number): Quaternion {
		return new Quaternion(
			this.x + scalar,
			this.y + scalar,
			this.z + scalar,
			this.w + scalar
		)
	}
	/**
	 * Adds a scalar value to each component of the quaternion.
	 *
	 * @param {number} scalar - The scalar value to add.
	 * @return {Quaternion}
	 */
	public AddScalarForThis(scalar: number): Quaternion {
		this.x += scalar
		this.y += scalar
		this.z += scalar
		this.w += scalar
		return this
	}
	/**
	 * Subtracts the given quaternion from the current instance.
	 *
	 * @param {Quaternion} quat - The quaternion to subtract.
	 * @return {Quaternion}
	 */
	public Substract(quat: Quaternion): Quaternion {
		return new Quaternion(
			this.x - quat.x,
			this.y - quat.y,
			this.z - quat.z,
			this.w - quat.w
		)
	}
	/**
	 * Subtracts a scalar value from each component of the quaternion.
	 *
	 * @param {number} scalar - The scalar value to subtract.
	 * @return {Quaternion}
	 */
	public SubstractScalar(scalar: number): Quaternion {
		return new Quaternion(
			this.x - scalar,
			this.y - scalar,
			this.z - scalar,
			this.w - scalar
		)
	}
	/**
	 * Subtracts the given quaternion from the current
	 * instance component-wise and returns the updated
	 * instance.
	 *
	 * @param {Quaternion} quat - The quaternion to be
	 * subtracted from the current instance.
	 * @return {Quaternion}
	 */
	public SubstractForThis(quat: Quaternion): Quaternion {
		this.x -= quat.x
		this.y -= quat.y
		this.z -= quat.z
		this.w -= quat.w
		return this
	}
	/**
	 * Subtracts the provided scalar from each component
	 * of this quaternion and returns the modified
	 * quaternion.
	 *
	 * @param {number} scalar - The scalar to subtract.
	 * @return {Quaternion}
	 */
	public SubstractScalarForThis(scalar: number): Quaternion {
		this.x -= scalar
		this.y -= scalar
		this.z -= scalar
		this.w -= scalar
		return this
	}
	/**
	 * Multiplies this Quaternion by another, returning a new Quaternion.
	 *
	 * @param {Quaternion} quat - The Quaternion to multiply with.
	 * @return {Quaternion}
	 */
	public Multiply(quat: Quaternion): Quaternion {
		const cross = this.Cross(quat)
		return new Quaternion(
			this.x * quat.w + quat.x * this.w + cross.y,
			this.y * quat.w + quat.y * this.w + cross.z,
			this.z * quat.w + quat.z * this.w + cross.x,
			this.w * quat.w - this.Dot(quat)
		)
	}
	/**
	 * Multiplies each component of the quaternion by a scalar.
	 *
	 * @param {number} scalar - The scalar to multiply with.
	 * @return {Quaternion}
	 */
	public MultiplyScalar(scalar: number): Quaternion {
		return new Quaternion(
			this.x * scalar,
			this.y * scalar,
			this.z * scalar,
			this.w * scalar
		)
	}
	/**
	 * Multiplies each component of the quaternion by a scalar.
	 *
	 * @param {number} scalar - The scalar value to multiply.
	 * @return {Quaternion}
	 */
	public MultiplyScalarForThis(scalar: number): Quaternion {
		this.x *= scalar
		this.y *= scalar
		this.z *= scalar
		this.w *= scalar
		return this
	}
	/**
	 * Calculates the cross product of this quaternion with another.
	 *
	 * @param {Quaternion} quat - The other quaternion to cross with
	 * @return {Quaternion}
	 */
	public Cross(quat: Quaternion): Quaternion {
		return new Quaternion(
			this.y * quat.z - this.z * quat.y,
			this.z * quat.x - this.x * quat.z,
			this.x * quat.y - this.y * quat.x,
			0
		)
	}
	/**
	 * Multiplies the current Quaternion instance by another,
	 * updating the instance with the result.
	 *
	 * @param {Quaternion} quat - The Quaternion to multiply with.
	 * @return {Quaternion}
	 */
	public MultiplyForThis(quat: Quaternion): Quaternion {
		const cross = this.Cross(quat)
		this.x = this.x * quat.w + quat.x * this.w + cross.y
		this.y = this.y * quat.w + quat.y * this.w + cross.z
		this.z = this.z * quat.w + quat.z * this.w + cross.x
		this.w = this.w * quat.w - this.Dot(quat)
		return this
	}
	/**
	 * Divides this Quaternion by another by multiplying
	 * with the inverse of the provided Quaternion.
	 *
	 * @param {Quaternion} quat - The quaternion to divide by
	 * @return {Quaternion}
	 */
	public Divide(quat: Quaternion): Quaternion {
		return this.Multiply(quat.Invert())
	}
	/**
	 * Divides each component of the quaternion by a scalar.
	 *
	 * @param {number} scalar - The scalar to divide by.
	 * @return {Quaternion}
	 */
	public DivideScalar(scalar: number): Quaternion {
		return new Quaternion(
			this.x / scalar,
			this.y / scalar,
			this.z / scalar,
			this.w / scalar
		)
	}
	/**
	 * Divides each component of this quaternion by
	 * the given scalar and returns the modified
	 * quaternion.
	 *
	 * @param {number} scalar - The number to divide by
	 * @return {Quaternion}
	 */
	public DivideScalarForThis(scalar: number): Quaternion {
		this.x /= scalar
		this.y /= scalar
		this.z /= scalar
		this.w /= scalar
		return this
	}
	/**
	 * Interpolates between the current quaternion and another
	 * quaternion by the given amount using linear interpolation.
	 *
	 * @param {Quaternion} quat - The target quaternion to interpolate
	 *                            towards.
	 * @param {number} amount - The interpolation factor between 0 and 1.
	 * @return {Quaternion}
	 */
	public Lerp(quat: Quaternion, amount: number): Quaternion {
		return this.MultiplyScalar(1 - amount)
			.Add(quat.MultiplyScalar(amount))
			.Normalize()
	}
	/**
	 * Performs spherical linear interpolation between
	 * this quaternion and another quaternion by the
	 * given amount.
	 *
	 * @param {Quaternion} quat - The target quaternion.
	 * @param {number} amount - The interpolation factor.
	 * @return {Quaternion}
	 */
	public Slerp(quat: Quaternion, amount: number): Quaternion {
		let dot = this.Dot(quat)
		if (dot < 0) {
			quat = quat.MultiplyScalar(-1)
			dot = -dot
		}
		if (dot > 0.9995) {
			return this.MultiplyScalar(1 - amount)
				.Add(quat.MultiplyScalar(amount))
				.Normalize()
		}
		const theta = Math.acos(dot)
		const sinTheta = Math.sqrt(1 - dot * dot)
		const ratioA = Math.sin((1 - amount) * theta) / sinTheta
		const ratioB = Math.sin(amount * theta) / sinTheta
		const blendA = this.MultiplyScalar(ratioA)
		const blendB = quat.MultiplyScalar(ratioB)
		return blendA.Add(blendB).Normalize()
	}
	/**
	 * Creates a new Quaternion object with the same x, y,
	 * z, and w values as the current instance.
	 *
	 * @return {Quaternion}
	 */
	public Clone(): Quaternion {
		return new Quaternion(this.x, this.y, this.z, this.w)
	}
	/**
	 * Copies the values from the current Quaternion into
	 * another.
	 *
	 * @description The quaternion with copied values.
	 * @param {Quaternion} quat - The target quaternion to copy
	 * values into.
	 * @return {Quaternion}
	 */
	public CopyTo(quat: Quaternion): Quaternion {
		quat.x = this.x
		quat.y = this.y
		quat.z = this.z
		quat.w = this.w
		return quat
	}
	/**
	 * Copies the values from the given quaternion to this quaternion.
	 *
	 * @description This instance with updated values.
	 * @param {Quaternion} quat - The quaternion to copy from.
	 * @return {Quaternion}
	 */
	public CopyFrom(quat: Quaternion): Quaternion {
		this.x = quat.x
		this.y = quat.y
		this.z = quat.z
		this.w = quat.w
		return this
	}
}
