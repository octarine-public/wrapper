declare class Color {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): Color

	/* =================== Fields =================== */
	r: number
	g: number
	b: number
	a: number

	/* ================ Constructors ================ */
	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * var color = new Color(1, 2, 3)
	 */
	constructor(r?: number , g?: number, b?: number, a?: number)

	/* ================== Getters ================== */


	/* ================== Methods ================== */
	/**
	 * Set Color by numbers
	 */
	SetColor(r?: number, g?: number, b?: number, a?: number): Color
	/**
	 * Set R of color by number
	 */
	SetR(r: number): Color
	/**
	 * Set G of color by number
	 */
	SetG(g: number): Color
	/**
	 * Set B of color by number
	 */
	SetB(b: number): Color
	/**
	 * Set A of color by number
	 */
	SetA(a: number): Color

	/* ================== To ================== */
	/**
	 * Color to String Color
	 * @return Color(r,g,b,a)
	 */
	toString(): string
	/**
	 * @return [r, g, b, a]
	 */
	toArray(): [number, number, number, number]

	toIOBuffer(offset?: number): void
}

declare class QAngle extends Vector3 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): QAngle

	/* ================ Constructors ================ */
	/**
	 * Create new QAngle with pitch, yaw, roll
	 *
	 * @example
	 * var QAngle = new QAngle(1, 2, 3)
	 */
	constructor(pitch?: number, yaw?: number, roll?: number)

	/* ================== To ================== */
	/**
	 * QAngle to String QAngle
	 * @return QAngle(pitch,yaw,roll,a)
	 */
	toString(): string
}


declare class EntityManager {
	readonly AllEntities: C_BaseEntity[];
	readonly EntitiesIDs: C_BaseEntity[];
	
	GetEntityID(ent: C_BaseEntity): number
	GetEntityByID(id: number): C_BaseEntity
	/**
	 * @returns all entities in given range of this vector
	 */
	GetEntitiesInRange(vec: Vector3, range: number): C_BaseEntity[]
}
declare var Entities: EntityManager;

declare class Vector3 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): Vector3
	static fromArray(array: [number, number, number]): Vector3
	static FromAngle(angle: number): Vector3
	static FromAngleCoordinates(radial: number, angle: number): Vector3

	/* =================== Fields =================== */
	x: number
	y: number
	z: number

	/* ================ Constructors ================ */
	/**
	 * Create new Vector3 with x, y, z
	 *
	 * @example
	 * var vector = new Vector3(1, 2, 3)
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
	 * Angle of the Vector3
	 */
	readonly Angle: number
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	readonly Polar: number

	/* ================== Methods ================== */
	Equals(vec: Vector3): boolean

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
	Invalidate(): Vector3
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector3
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector3
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector3
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector3): Vector3
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector3): Vector3
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector3
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector3
	/**
	 * Set vector by numbers
	 */
	SetVector(x?: number, y?: number, z?: number): Vector3
	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector3
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector3
	/**
	 * Set Z of vector by number
	 */
	SetZ(num: number): Vector3

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector3
	/**
	 * The cross product of this and vec.
	 */
	Cross(vec: Vector3): Vector3
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector3): number
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector3
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector3
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector3, max: Vector3): Vector3

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector3): Vector3

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector3
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector3
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector3
	/**
	 * Add scalar to Z of vector
	 */
	AddScalarZ(scalar: number): Vector3

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector3): Vector3

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector3
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector3
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector3
	/**
	 * Subtract scalar from Z of vector
	 */
	SubtractScalarZ(scalar: number): Vector3

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector3): Vector3

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector3
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector3
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector3
	/**
	 * Multiply the Z of vector by scalar
	 */
	MultiplyScalarZ(scalar: number): Vector3

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector3): Vector3

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector3
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector3
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector3
	/**
	 * Divide the scalar by Z of vector
	 */
	DivideScalarZ(scalar: number): Vector3

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector3, vec2: Vector3, scalar: number): Vector3

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector3): number
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector3): number
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
    Distance2D(vec: Vector3): number

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x?: boolean): Vector3
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector3
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
    Rotation(rotation: Vector3, distance: number): Vector3
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector3, distance: number): Vector3
	RotationTime(rot_speed: number): number
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector3): number
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFaces(front: Vector3): number
    /**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec 2nd vector
	 * @param distance distance to extend
	 * @returns extended vector
	 */
	Extend(vec: Vector3, distance: number): Vector3
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector3, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number): boolean
	/* ================== To ================== */
	/**
	 * Vector3 to String Vector3
	 * @return new Vector3(x,y,z)
	 */
	toString(): string
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number, number]
	toVector2(): Vector2
	toIOBuffer(offset?: number): void
}

declare class Vector2 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): Vector2
	static fromArray(array: [number, number]): Vector2
	static FromAngle(angle: number): Vector2
	static FromAngleCoordinates(radial: number, angle: number): Vector2

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
	 * Angle of the Vector3
	 */
	readonly Angle: number
	/**
	 * Returns the polar for vector angle (in Degrees).
	 */
	readonly Polar: number

	/* ================== Methods ================== */
	Equals(vec: Vector2): boolean

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
	Invalidate(): Vector2
	/**
	 * Zeroes this vector
	 */
	toZero(): Vector2
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): Vector2
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): Vector2
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector2): Vector2
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector2): Vector2
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): Vector2
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): Vector2
	/**
	 * Set vector by numbers
	 */
	SetVector(x?: number, y?: number): Vector2
	/**
	 * Set X of vector by number
	 */
	SetX(num: number): Vector2
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): Vector2

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): Vector2
	/**
	 * Returns the cross product Z value.
	 */
	Cross(vec: Vector2): number
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector2): number
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): Vector2
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): Vector2
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector2, max: Vector2): Vector2

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector2): Vector2

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): Vector2
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): Vector2
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): Vector2

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector2): Vector2

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): Vector2
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): Vector2
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): Vector2

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector2): Vector2

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): Vector2
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): Vector2
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): Vector2

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector2): Vector2

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): Vector2
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): Vector2
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): Vector2

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector2, vec2: Vector2, scalar: number): Vector2

	/* ======== Distance ======== */
	/**
	 * Returns the squared distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	DistanceSqr(vec: Vector2): number
	/**
	 * Returns the distance between the this and another vector
	 *
	 * @param vec The another vector
	 */
	Distance(vec: Vector2): number
	/**
	 * Returns the distance between the this and another vector in 2D
	 *
	 * @param vec The another vector
	 */
	Distance2D(vec: Vector2): number

	/* ================== Geometric ================== */
	/**
	 *
	 * @param {number} offset Axis Offset (0 = X, 1 = Y)
	 */
	Perpendicular(is_x?: boolean): Vector2
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector2
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector2, distance: number): Vector2
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector2, distance: number): Vector2
	RotationTime(rot_speed: number): number
	/**
	 * Angle between two vectors
	 * @param vec The another vector
	 */
	AngleBetweenVectors(vec: Vector2): number
	/**
	 * Angle between two fronts
	 * @param vec The another vector
	 */
	AngleBetweenFronts(front: Vector2): number
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec The another vector
	 */
	Extend(vec: Vector2, distance: number): Vector2
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector2, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number): boolean
	/* ================== Geometric ================== */
	/**
	 * Vector3 to String Vector3
	 * @return new Vector3(x,y,z)
	 */
	toString(): string
	/**
	 * @return [x, y, z]
	 */
	toArray(): [number, number]
	toVector3(): Vector3
	toIOBuffer(offset?: number): void
}

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: "onGameStarted", callback: (pl_ent: C_DOTA_BaseNPC_Hero) => void): EventEmitter
	public on(name: "onGameEnded", callback: () => void): EventEmitter
	/**
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 */
	public on(name: "onEntityCreated", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	public on(name: "onNPCCreated", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onEntityDestroyed", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	public on(name: "onWndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	public on(name: "onTick", callback: () => void): EventEmitter
	public on(name: "onUpdate", callback: (cmd: CUserCmd) => void): EventEmitter
	public on(name: "onUnitStateChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onTeamVisibilityChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onDraw", callback: () => void): EventEmitter
	public on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: C_BaseEntity) => void): EventEmitter
	public on(name: "onParticleUpdated", callback: (id: number, control_point: number) => void): EventEmitter // position: Vector3 at IOBuffer offset 0
	public on(name: "onParticleUpdatedEnt", callback: ( // fallback_position: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number,
		ent: C_BaseEntity,
		attach: ParticleAttachment_t,
		attachment: number,
		include_wearables: boolean
	) => void): EventEmitter
	public on(name: "onBloodImpact", callback: (target: C_BaseEntity, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	public on(name: "onPrepareUnitOrders", callback: (order: CUnitOrder) => false | any): EventEmitter
	public on(name: "onLinearProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: LinearProjectile,
		ent: C_BaseEntity,
		path: string,
		particleSystemHandle: bigint,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number
	) => void): EventEmitter
	public on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	public on(name: "onTrackingProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		launch_tick: number
	) => void): EventEmitter
	public on(name: "onTrackingProjectileUpdated", callback: ( // vSourceLoc: Vector3 at IOBuffer offset 0, colorgemcolor: Color at IOBuffer offset 3
		proj: TrackingProjectile,
		path: string,
		particleSystemHandle: bigint,
		launch_tick: number
	) => void): EventEmitter
	public on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	public on(name: "onUnitAnimation", callback: (
		npc: C_DOTA_BaseNPC,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	public on(name: "onUnitAnimationEnd", callback: (
		npc: C_DOTA_BaseNPC,
		snap: boolean
	) => void): EventEmitter
	public on(name: "onBuffAdded", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onBuffRemoved", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onBuffStackCountChanged", listener: (buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	public on(name: "onNetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
	public on(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}
declare var Events: EventEmitter
