declare class Vector {
	/* ================== Static ================== */
	static fromArray(array: [number, number, number]): Vector
	static fromObject(object: { x: number, y: number, z?: number }): Vector
	static FromAngle(angle: number): Vector
	static FromAngleCoordinates(radial: number, angle: number): Vector

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
	constructor(x?: number, y?: number, z?: number)

	/* ================== Getters ================== */
	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	readonly IsValid: boolean

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	readonly LengthSqr: number
	/**
	 * Get the length of the vector
	 */
	readonly Length: number
	/**
	 * Angle of the Vector
	 */
	readonly Angle: number
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	readonly Polar: number

	/* ================== Methods ================== */
	Equals(vec: Vector): boolean

	/**
	 * Are all components of this vector are 0?
	 */
	IsZero(tolerance?: number): boolean
	/**
	 * Are length of this vector are  greater than value?
	 */
	IsLengthGreaterThan(val: number): boolean
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number): boolean
	/**
	 * Invalidates this vector
	 */
	Invalidate(): Vector
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector): Vector
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector): Vector
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector

	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector
	/**
	 * Set Z of vector by number
	 */
	SetZ(num: number): Vector

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector
	/**
	 * The cross product of this and vec.
	 */
	Cross(vec: Vector): Vector
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector): number
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector, max: Vector): Vector

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector): Vector

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector
	/**
	 * Add scalar to Z of vector
	 */
	AddScalarZ(scalar: number): Vector

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector): Vector

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector
	/**
	 * Subtract scalar from Z of vector
	 */
	SubtractScalarZ(scalar: number): Vector

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector): Vector

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector
	/**
	 * Multiply the Z of vector by scalar
	 */
	MultiplyScalarZ(scalar: number): Vector

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector): Vector

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector
	/**
	 * Divide the scalar by Z of vector
	 */
	DivideScalarZ(scalar: number): Vector

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector, vec2: Vector, scalar: number): Vector

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector): number
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector): number
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
    Distance2D(vec: Vector): number
    /**
	 * @returns all entities in given range of this vector
	 */
	GetEntitiesInRange(range: number): C_BaseEntity[]

	/* ================== Geometric ================== */
	FindRotationAngle(from: C_BaseEntity): number
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x?: boolean): Vector
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
    Rotation(rotation: Vector, distance: number): Vector
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector, distance: number): Vector
	RotationTime(rot_speed: number): number
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector): number
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFaces(front: Vector): number
    /**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec 2nd vector
	 * @param distance distance to extend
	 * @returns extended vector
	 */
	Extend(vec: Vector, distance: number): Vector
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number): boolean
	/* ================== To ================== */
	/**
	 * Vector to String Vector
	 * @return new Vector(x,y,z)
	 */
	toString(): string
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number, number]
}

declare class Vector2D {
	/* ================== Static ================== */
	static fromArray(array: [number, number]): Vector2D
	static fromObject(object: { x: number, y: number }): Vector2D
	static FromAngle(angle: number): Vector2D
	static FromAngleCoordinates(radial: number, angle: number): Vector2D

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
	constructor(x?: number, y?: number)

	/* ================== Getters ================== */
	/**
	 * Is this vector valid? (every value must not be infinity/NaN)
	 */
	readonly IsValid: boolean

	/**
	 * Get the length of the vector squared. This operation is cheaper than Length().
	 */
	readonly LengthSqr: number
	/**
	 * Get the length of the vector
	 */
	readonly Length: number
	/**
	 * Angle of the Vector
	 */
	readonly Angle: number
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	readonly Polar: number

	/* ================== Methods ================== */
	Equals(vec: Vector2D): boolean

	/**
	 * Are all components of this vector are 0?
	 */
	IsZero(tolerance?: number): boolean
	/**
	 * Are length of this vector are  greater than value?
	 */
	IsLengthGreaterThan(val: number): boolean
	/**
	 * Are length of this vector are less than value?
	 */
	IsLengthLessThan(val: number): boolean
	/**
	 * Invalidates this vector
	 */
	Invalidate(): Vector2D
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector2D
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector2D
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector2D
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector2D): Vector2D
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector2D): Vector2D
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector2D
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector2D
	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector2D
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector2D

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector2D
	/**
	 * Returns the cross product Z value.
	 */
	Cross(vec: Vector2D): number
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector2D): number
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector2D
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector2D
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector2D, max: Vector2D): Vector2D

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector2D): Vector2D

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector2D
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector2D
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector2D

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector2D): Vector2D

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector2D
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector2D
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector2D

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector2D): Vector2D

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector2D
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector2D
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector2D

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector2D): Vector2D

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector2D
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector2D
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector2D

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector2D, vec2: Vector2D, scalar: number): Vector2D

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector2D): number
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector2D): number
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector2D): number

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x?: boolean): Vector2D
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector2D
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector2D, distance: number): Vector2D
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector2D, distance: number): Vector2D
	RotationTime(rot_speed: number): number
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector2D): number
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector2D): number
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector2D, distance: number): Vector2D
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector2D, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number)
	/* ================== Geometric ================== */
	/**
	 * Vector to String Vector
	 * @return new Vector(x,y,z)
	 */
	toString(): string
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number]
}

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: "onGameStarted", callback: (pl_ent: C_DOTA_BaseNPC_Hero) => void): bigint
	public on(name: "onGameEnded", callback: () => void): bigint
	/**
	 * Also, this event emitted about ALL entities that have already been created before reload scripts
	 */
	public on(name: "onEntityCreated", callback: (ent: C_BaseEntity, id: number) => void): bigint
	public on(name: "onEntityDestroyed", callback: (ent: C_BaseEntity, id: number) => void): bigint
	public on(name: "onWndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): bigint
	public on(name: "onTick", callback: () => void): bigint
	public on(name: "onUpdate", callback: () => void): bigint
	public on(name: "onSendMove", callback: (cmd: CUserCmd) => void): bigint
	public on(name: "onUnitStateChanged", callback: (npc: C_DOTA_BaseNPC) => void): bigint
	public on(name: "onTeamVisibilityChanged", callback: (npc: C_DOTA_BaseNPC) => void): bigint
	public on(name: "onDraw", callback: () => void): bigint
	public on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: C_BaseEntity) => void): bigint
	public on(name: "onParticleUpdated", callback: (id: number, control_point: number, position: Vector) => void): bigint
	public on(name: "onParticleUpdatedEnt", callback: (
		id: number,
		control_point: number,
		ent: C_BaseEntity,
		attach: ParticleAttachment_t,
		attachment: number,
		fallback_position: Vector,
		include_wearables: boolean
	) => void): bigint
	public on(name: "onBloodImpact", callback: (target: C_BaseEntity, scale: number, xnormal: number, ynormal: number) => void): bigint
	public on(name: "onPrepareUnitOrders", callback: (order: CUnitOrder) => false | any): bigint
	public on(name: "onLinearProjectileCreated", callback: (
		proj: LinearProjectile,
		origin: Vector,
		velocity: Vector2D,
		ent: C_BaseEntity,
		path: string,
		particleSystemHandle: bigint,
		acceleration: Vector2D,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number,
		colorgemcolor: Color
	) => void): bigint
	public on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): bigint
	public on(name: "onTrackingProjectileCreated", callback: (
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		colorgemcolor: Color,
		launch_tick: number
	) => void): bigint
	public on(name: "onTrackingProjectileUpdated", callback: (
		proj: TrackingProjectile,
		vSourceLoc: Vector,
		path: string,
		particleSystemHandle: bigint,
		colorgemcolor: Color,
		launch_tick: number
	) => void): bigint
	public on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): bigint
	public on(name: "onUnitAnimation", callback: (
		npc: C_DOTA_BaseNPC,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): bigint
	public on(name: "onUnitAnimationEnd", callback: (
		npc: C_DOTA_BaseNPC,
		snap: boolean
	) => void): bigint
	public on(name: "onBuffAdded", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): bigint
	public on(name: "onBuffRemoved", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): bigint
	public on(name: "onBuffStackCountChanged", listener: (buff: CDOTA_Buff) => void): bigint
	public on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): bigint
	public on(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}
declare var Events: EventEmitter
