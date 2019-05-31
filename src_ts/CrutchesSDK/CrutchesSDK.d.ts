// must be called only in onDraw!
declare interface RendererSDK {
	readonly WindowSize: Vector2

	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * FilledCircle(x: number, y: number, radius: number[, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	FilledCircle(x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * OutlinedCircle(x: number, y: number, radius: number[, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	OutlinedCircle(x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * Line(baseX: number, baseY: number, baseW: number, baseH: number[, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	Line(baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * FilledRect(baseX: number, baseY: number, baseW: number, baseH: number[, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	FilledRect(baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * OutlinedRect(baseX: number, baseY: number, baseW: number, baseH: number[, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	OutlinedRect(baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * @param path start it with "~/" (without double-quotes) to load image from "%loader_path%/scripts_files/path"
	 * @param path also must end with "_c" (without double-quotes), if that's vtex_c
	 * VPK isn't supported yet.
	 * Allowed non-passable element groups:
	 * [baseW, baseH] (or you can use -1 as one/both of those values to leave them auto)
	 * [r, g, b]
	 * [a]
	 * NodeJS-like decl:
	 * Image(path: string, baseX: number, baseY: number[, baseW?: number, baseH?: number][, r?: number, g?: number, b?: number][, a?: number]): void
	 */
	Image(path: string, baseX: number, baseY: number, baseW?: number, baseH?: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * @param font_name default: "Calibri"
	 * @param font_size default: 12
	 * @param font_weight default: 150
	 * @param flags see FontFlags_t. You can use it like (FontFlags_t.OUTLINE | FontFlags_t.BOLD)
	 * @param flags default: FontFlags_t.OUTLINE
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 * [font_name, font_size]
	 * [font_weight]
	 * [flags]
	 * NodeJS-like decl:
	 * Text(x: number, y: number, text: string[, r?: number, g?: number, b?: number][, a?: number][, font_name?: string, uint8_t font_size][, uint16_t font_weight][, int flags]): void
	 */
	Text(x: number, y: number, text: string, r?: number, g?: number, b?: number, a?: number, font_name?: string, font_size?: number, font_weight?: number, flags?: number): void
	/**
	 * @param pos world position that needs to be turned to screen position
	 * @returns screen position, or invalid Vector2 (WorldToScreen(...).IsValid === false)
	 */
	WorldToScreen(position: Vector3): Vector3
}

declare class ExecuteOrder {
	static fromObject(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability,
		orderIssuer?: PlayerOrderIssuer_t,
		unit?: Unit,
		queue: boolean,
		showEffects: boolean
	}): ExecuteOrder
	static fromNative(orderNative: CUnitOrder): ExecuteOrder
	
	private m_OrderType: dotaunitorder_t
	private m_Target: Entity | number
	private m_Position: Vector3
	private m_Ability: Ability
	private m_OrderIssuer: PlayerOrderIssuer_t
	private m_Unit: Unit
	private m_Queue: boolean
	private m_ShowEffects: boolean
	
	constructor(
		orderType: dotaunitorder_t,
		target: Entity | number,
		position: Vector3,
		ability: Ability,
		issuer: PlayerOrderIssuer_t,
		unit: Unit,
		queue: boolean,
		showEffects?: boolean,
	)
	
	readonly OrderType: dotaunitorder_t
	readonly Target: Entity
	readonly Position: Vector3
	readonly Ability: Ability
	readonly OrderIssuer: PlayerOrderIssuer_t
	readonly Unit: Unit
	readonly Queue: boolean
	readonly ShowEffects: boolean
	
	/**
	 * pass Position: Vector3 at IOBuffer offset 0
	 */
	toNative(): {
		OrderType: dotaunitorder_t,
		Target: C_BaseEntity,
		Ability: C_DOTABaseAbility,
		OrderIssuer: PlayerOrderIssuer_t
		Unit: C_DOTA_BaseNPC,
		Queue: boolean,
		ShowEffects: boolean
	}
	/**
	 * Execute order with this fields
	 */
	ExecuteOrder(): this
}

declare interface EventsSDK extends EventEmitter {
	on(name: "onGameStarted", callback: (localPlayer: Hero) => void): EventEmitter
	on(name: "onGameEnded", callback: () => void): EventEmitter
	on(name: "onLocalPlayerTeamAssigned", callback: (teamNum: DOTATeam_t) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have may be in "Staging" and Is NOT Valid flag (NPC and childs, PhysicalItems and etc.)
	 * 
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 * 
	 * Emitted ONLY after LocalPlayer choose team (event: onLocalPlayerTeamAssigned)
	 * 
	 * CAREFUL !Use this if you know what you are doing!
	 */
	on(name: "onEntityPreCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	/**
	 * Emitted about ALL entities that have Valid flag. This callback is best suited for use.
	 * 
	 * Also, this event emitted about ALL entities that have already been created (and valids) before reloading scripts
	 * 
	 * Emitted ONLY after LocalPlayer choose team (event: onLocalPlayerTeamAssigned)
	 */
	on(name: "onEntityCreated", callback: (ent: Entity, index: number) => void): EventEmitter
	on(name: "onEntityDestroyed", callback: (ent: Entity, index: number) => void): EventEmitter
	on(name: "onWndProc", callback: (messageType: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	/**
	 * Every ~33ms. Emitted after LocalPlayer has been created
	 */
	on(name: "onTick", callback: () => void): EventEmitter
	on(name: "onUpdate", callback: (cmd: CUserCmd) => void): EventEmitter
	on(name: "onUnitStateChanged", callback: (npc: Unit) => void): EventEmitter
	on(name: "onTeamVisibilityChanged", callback: (npc: Unit, new_m_iTaggedAsVisibleByTeam: number) => void): EventEmitter
	on(name: "onDraw", callback: () => void): EventEmitter
	on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity) => void): EventEmitter
	on(name: "onParticleUpdated", callback: (id: number, controlPoint: number, position: Vector3) => void): EventEmitter
	on(name: "onParticleUpdatedEnt", callback: (
		id: number,
		controlPoint: number,
		ent: Entity,
		attach: ParticleAttachment_t,
		attachment: number,
		fallbackPosition: Vector3,
		includeWearables: boolean
	) => void): EventEmitter
	on(name: "onBloodImpact", callback: (target: Entity, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "onPrepareUnitOrders", callback: (order: ExecuteOrder) => false | any): EventEmitter
	on(name: "onLinearProjectileCreated", callback: (
		proj: LinearProjectile,
		ent: Entity,
		path: string,
		particleSystemHandle: bigint,
		maxSpeed: number,
		fowRadius: number,
		stickyFowReveal: boolean,
		distance: number,
		colorgemcolor: Color
	) => void): EventEmitter
	on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "onTrackingProjectileCreated", callback: (
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		colorgemcolor: Color,
		launchTick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileUpdated", callback: (
		proj: TrackingProjectile,
		vSourceLoc: Vector3,
		path: string,
		particleSystemHandle: bigint,
		colorgemcolor: Color,
		launchTick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "onUnitAnimation", callback: (
		npc: Unit,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	on(name: "onUnitAnimationEnd", callback: (
		npc: Unit,
		snap: boolean
	) => void): EventEmitter
	/**
	 *	Also, this event emitted about ALL buffs(modifiers) that have already been created (and valids) before reloading scripts
	 */
	on(name: "onBuffAdded", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "onBuffRemoved", listener: (npc: Unit, buff: Modifier) => void): EventEmitter
	on(name: "onBuffStackCountChanged", listener: (buff: Modifier) => void): EventEmitter
	on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	//on(name: "onNetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
}
declare var EventsSDK: EventsSDK

declare class Sleeper {

	private SleepDB: { string?: number }

	/**
	 * Sleeper by Date.now()
	 */
	constructor();
	
	Sleep(ms: number, id: string, extend?: boolean): number
	
	Sleeping(id: string): boolean

	FullReset(): this
}

export class GameSleeper extends Sleeper {

	/**
	 * Sleeper by Game.RawGameTime
	 */
	constructor();
}

declare class Vector2 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): Vector2
	static fromArray(array: [number, number]): Vector2
	static FromAngle(angle: number): Vector2
	static FromPolarCoordinates(radial: number, angle: number): Vector2
	static CopyFrom(vec: Vector2): Vector2

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
	Invalidate(): this
	/**
	 * Zeroes this vector
	 */
	toZero(): this
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): this
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): this
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector2): this
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector2): this
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): this
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): this
	/**
	 * Set vector by numbers
	 */
	SetVector(x?: number, y?: number): this
	/**
	 * Set X of vector by number
	 */
	SetX(num: number): this
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): this

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): this
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
	ScaleTo(scalar: number): this
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): this
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector2, max: Vector2): this

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector2): this

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): this
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): this
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): this

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector2): this

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): this
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): this
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): this

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector2): this

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): this
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): this
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): this

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector2): this

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): this
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): this
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): this

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector2, vec2: Vector2, scalar: number): this

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
	Perpendicular(is_x?: boolean): this
	/**
	 * Calculates the polar angle of the given vector. Returns degree values on default, radian if requested.
	 */
	PolarAngle(radian?: boolean): number
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): Vector2
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector2, distance: number): this
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector2, distance: number): this
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
	Extend(vec: Vector2, distance: number): this
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector2, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number): boolean
	RadiansToDegrees(): this
	DegreesToRadians(): this
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
	toIOBuffer(offset?: number): true
}

declare class Vector3 {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset?: number): Vector3
	static fromArray(array: [number, number, number]): Vector3
	static FromAngle(angle: number): Vector3
	static FromPolarCoordinates(radial: number, angle: number): Vector3
	static CopyFrom(vec: Vector3): Vector3

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
	Invalidate(): this
	/**
	 * Zeroes this vector
	 */
	toZero(): this
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): this
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number): this
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Min(vec: Vector3): this
	/**
	 * Returns a vector whose elements are the minimum of each of the pairs of elements in the two source vectors
	 * @param The another vector
	 */
	Max(vec: Vector3): this
	/**
	 * Returns a vector whose elements are the absolute values of each of the source vector's elements.
	 */
	Abs(): this
	/**
	 * Returns a vector whose elements are the square root of each of the source vector's elements
	 */
	SquareRoot(): this
	/**
	 * Set vector by numbers
	 */
	SetVector(x?: number, y?: number, z?: number): this
	/**
	 * Set X of vector by number
	 */
	SetX(num: number): this
	/**
	 * Set Y of vector by number
	 */
	SetY(num: number): this
	/**
	 * Set Z of vector by number
	 */
	SetZ(num: number): this

	/**
	 * Normalize the vector
	 */
	Normalize(scalar: number): this
	/**
	 * The cross product of this and vec.
	 */
	Cross(vec: Vector3): this
	/**
	 * The dot product of this vector and another vector.
	 * @param vec The another vector
	 */
	Dot(vec: Vector3): number
	/**
	 * Scale the vector to length. ( Returns 0 vector if the length of this vector is 0 )
	 */
	ScaleTo(scalar: number): this
	/**
	 * Divides both vector axis by the given scalar value
	 */
	DivideTo(scalar: number): this
	/**
	 * Restricts a vector between a min and max value.
	 */
	Clamp(min: Vector3, max: Vector3): this

	/* ======== Add ======== */
	/**
	 * Adds two vectors together
	 * @param vec The another vector
	 * @returns	The summed vector
	 */
	Add(vec: Vector3): this

	/**
	 * Add scalar to vector
	 */
	AddScalar(scalar: number): this
	/**
	 * Add scalar to X of vector
	 */
	AddScalarX(scalar: number): this
	/**
	 * Add scalar to Y of vector
	 */
	AddScalarY(scalar: number): this
	/**
	 * Add scalar to Z of vector
	 */
	AddScalarZ(scalar: number): this

	/* ======== Subtract ======== */
	/**
	 * Subtracts the second vector from the first.
	 * @param vec The another vector
	 * @returns The difference vector
	 */
	Subtract(vec: Vector3): this

	/**
	 * Subtract scalar from vector
	 */
	SubtractScalar(scalar: number): this
	/**
	 * Subtract scalar from X of vector
	 */
	SubtractScalarX(scalar: number): this
	/**
	 * Subtract scalar from Y of vector
	 */
	SubtractScalarY(scalar: number): this
	/**
	 * Subtract scalar from Z of vector
	 */
	SubtractScalarZ(scalar: number): this

	/* ======== Multiply ======== */
	/**
	 * Multiplies two vectors together.
	 * @param vec The another vector
	 * @return The product vector
	 */
	Multiply(vec: Vector3): this

	/**
	 * Multiply the vector by scalar
	 */
	MultiplyScalar(scalar: number): this
	/**
	 * Multiply the X of vector by scalar
	 */
	MultiplyScalarX(scalar: number): this
	/**
	 * Multiply the Y of vector by scalar
	 */
	MultiplyScalarY(scalar: number): this
	/**
	 * Multiply the Z of vector by scalar
	 */
	MultiplyScalarZ(scalar: number): this

	/* ======== Divide ======== */
	/**
	 * Divide this vector by another vector
	 * @param vec The another vector
	 * @return The vector resulting from the division
	 */
	Divide(vec: Vector3): this

	/**
	 * Divide the scalar by vector
	 * @param {number} scalar
	 */
	DivideScalar(scalar: number): this
	/**
	 * Divide the scalar by X of vector
	 */
	DivideScalarX(scalar: number): this
	/**
	 * Divide the scalar by Y of vector
	 */
	DivideScalarY(scalar: number): this
	/**
	 * Divide the scalar by Z of vector
	 */
	DivideScalarZ(scalar: number): this

	/**
	 * Multiply, add, and assign to this
	 */
	MultiplyAdd(vec: Vector3, vec2: Vector3, scalar: number): this

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
	Perpendicular(is_x?: boolean): this
	/**
	 * Calculates the polar angle of the given vector. Returns degree values on default, radian if requested.
	 */
	PolarAngle(radian?: boolean): number
	/**
	 * Rotates the Vector3 to a set angle.
	 */
	Rotated(angle: number): this
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	Rotation(rotation: Vector3, distance: number): this
	/**
	 * Extends vector in the rotation direction by radian
	 * @param rotation for ex. Entity#Forward
	 * @param distance distance to be added
	 */
	RotationRad(rotation: Vector3, distance: number): this
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
	Extend(vec: Vector3, distance: number): this
	/**
	 * Returns if the distance to target is lower than range
	 */
	IsInRange(vec: Vector3, range: number): boolean
	/**
	 * Returns true if the point is under the rectangle
	 */
	IsUnderRectangle(x: number, y: number, width: number, height: number): boolean
	RadiansToDegrees(): this
	DegreesToRadians(): this
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
	toIOBuffer(offset?: number): true
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

	/* ================== Getters ================== */
	/**
	 * Angle of the QAngle
	 */
	readonly Angle: number
	/* ================== To ================== */
	/**
	 * QAngle to String QAngle
	 * @return QAngle(pitch,yaw,roll,a)
	 */
	toString(): string
}

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
	constructor(r?: number, g?: number, b?: number, a?: number)

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

	toIOBuffer(offset?: number): true
}

// TODO
declare class Entity { }
declare class Unit extends Entity { }
declare class Hero extends Unit { }
declare class Ability { }
declare class Item extends Ability { }
declare class Modifier { }
