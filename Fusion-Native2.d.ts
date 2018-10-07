/// ENUMS

declare const enum dotaunitorder_t {
	DOTA_UNIT_ORDER_NONE = 0,
	DOTA_UNIT_ORDER_MOVE_TO_POSITION = 1,
	DOTA_UNIT_ORDER_MOVE_TO_TARGET = 2,
	DOTA_UNIT_ORDER_ATTACK_MOVE = 3,
	DOTA_UNIT_ORDER_ATTACK_TARGET = 4,
	DOTA_UNIT_ORDER_CAST_POSITION = 5,
	DOTA_UNIT_ORDER_CAST_TARGET = 6,
	DOTA_UNIT_ORDER_CAST_TARGET_TREE = 7,
	DOTA_UNIT_ORDER_CAST_NO_TARGET = 8,
	DOTA_UNIT_ORDER_CAST_TOGGLE = 9,
	DOTA_UNIT_ORDER_HOLD_POSITION = 10,
	DOTA_UNIT_ORDER_TRAIN_ABILITY = 11,
	DOTA_UNIT_ORDER_DROP_ITEM = 12,
	DOTA_UNIT_ORDER_GIVE_ITEM = 13,
	DOTA_UNIT_ORDER_PICKUP_ITEM = 14,
	DOTA_UNIT_ORDER_PICKUP_RUNE = 15,
	DOTA_UNIT_ORDER_PURCHASE_ITEM = 16,
	DOTA_UNIT_ORDER_SELL_ITEM = 17,
	DOTA_UNIT_ORDER_DISASSEMBLE_ITEM = 18,
	DOTA_UNIT_ORDER_MOVE_ITEM = 19,
	DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO = 20,
	DOTA_UNIT_ORDER_STOP = 21,
	DOTA_UNIT_ORDER_TAUNT = 22,
	DOTA_UNIT_ORDER_BUYBACK = 23,
	DOTA_UNIT_ORDER_GLYPH = 24,
	DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH = 25,
	DOTA_UNIT_ORDER_CAST_RUNE = 26,
	DOTA_UNIT_ORDER_PING_ABILITY = 27,
	DOTA_UNIT_ORDER_MOVE_TO_DIRECTION = 28,
	DOTA_UNIT_ORDER_PATROL = 29,
	DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION = 30,
	DOTA_UNIT_ORDER_RADAR = 31,
	DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK = 32,
	DOTA_UNIT_ORDER_CONTINUE = 33,
	DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED = 34,
	DOTA_UNIT_ORDER_CAST_RIVER_PAINT = 35,
	DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT = 36
}

declare const enum HeroID_t {
	npc_dota_hero_antimage = 1,
	npc_dota_hero_axe = 2,
	npc_dota_hero_bane = 3,
	npc_dota_hero_bloodseeker = 4,
	npc_dota_hero_crystal_maiden = 5,
	npc_dota_hero_drow_ranger = 6,
	npc_dota_hero_earthshaker = 7,
	npc_dota_hero_juggernaut = 8,
	npc_dota_hero_mirana = 9,
	npc_dota_hero_nevermore = 11,
	npc_dota_hero_morphling = 10,
	npc_dota_hero_phantom_lancer = 12,
	npc_dota_hero_puck = 13,
	npc_dota_hero_pudge = 14,
	npc_dota_hero_razor = 15,
	npc_dota_hero_sand_king = 16,
	npc_dota_hero_storm_spirit = 17,
	npc_dota_hero_sven = 18,
	npc_dota_hero_tiny = 19,
	npc_dota_hero_vengefulspirit = 20,
	npc_dota_hero_windrunner = 21,
	npc_dota_hero_zuus = 22,
	npc_dota_hero_kunkka = 23,
	npc_dota_hero_lina = 25,
	npc_dota_hero_lich = 31,
	npc_dota_hero_lion = 26,
	npc_dota_hero_shadow_shaman = 27,
	npc_dota_hero_slardar = 28,
	npc_dota_hero_tidehunter = 29,
	npc_dota_hero_witch_doctor = 30,
	npc_dota_hero_riki = 32,
	npc_dota_hero_enigma = 33,
	npc_dota_hero_tinker = 34,
	npc_dota_hero_sniper = 35,
	npc_dota_hero_necrolyte = 36,
	npc_dota_hero_warlock = 37,
	npc_dota_hero_beastmaster = 38,
	npc_dota_hero_queenofpain = 39,
	npc_dota_hero_venomancer = 40,
	npc_dota_hero_faceless_void = 41,
	npc_dota_hero_skeleton_king = 42,
	npc_dota_hero_death_prophet = 43,
	npc_dota_hero_phantom_assassin = 44,
	npc_dota_hero_pugna = 45,
	npc_dota_hero_templar_assassin = 46,
	npc_dota_hero_viper = 47,
	npc_dota_hero_luna = 48,
	npc_dota_hero_dragon_knight = 49,
	npc_dota_hero_dazzle = 50,
	npc_dota_hero_rattletrap = 51,
	npc_dota_hero_leshrac = 52,
	npc_dota_hero_furion = 53,
	npc_dota_hero_life_stealer = 54,
	npc_dota_hero_dark_seer = 55,
	npc_dota_hero_clinkz = 56,
	npc_dota_hero_omniknight = 57,
	npc_dota_hero_enchantress = 58,
	npc_dota_hero_huskar = 59,
	npc_dota_hero_night_stalker = 60,
	npc_dota_hero_broodmother = 61,
	npc_dota_hero_bounty_hunter = 62,
	npc_dota_hero_weaver = 63,
	npc_dota_hero_jakiro = 64,
	npc_dota_hero_batrider = 65,
	npc_dota_hero_chen = 66,
	npc_dota_hero_spectre = 67,
	npc_dota_hero_doom_bringer = 69,
	npc_dota_hero_ancient_apparition = 68,
	npc_dota_hero_ursa = 70,
	npc_dota_hero_spirit_breaker = 71,
	npc_dota_hero_gyrocopter = 72,
	npc_dota_hero_alchemist = 73,
	npc_dota_hero_invoker = 74,
	npc_dota_hero_silencer = 75,
	npc_dota_hero_obsidian_destroyer = 76,
	npc_dota_hero_lycan = 77,
	npc_dota_hero_brewmaster = 78,
	npc_dota_hero_shadow_demon = 79,
	npc_dota_hero_lone_druid = 80,
	npc_dota_hero_chaos_knight = 81,
	npc_dota_hero_meepo = 82,
	npc_dota_hero_treant = 83,
	npc_dota_hero_ogre_magi = 84,
	npc_dota_hero_undying = 85,
	npc_dota_hero_rubick = 86,
	npc_dota_hero_disruptor = 87,
	npc_dota_hero_nyx_assassin = 88,
	npc_dota_hero_naga_siren = 89,
	npc_dota_hero_keeper_of_the_light = 90,
	npc_dota_hero_wisp = 91,
	npc_dota_hero_visage = 92,
	npc_dota_hero_slark = 93,
	npc_dota_hero_medusa = 94,
	npc_dota_hero_troll_warlord = 95,
	npc_dota_hero_centaur = 96,
	npc_dota_hero_magnataur = 97,
	npc_dota_hero_shredder = 98,
	npc_dota_hero_bristleback = 99,
	npc_dota_hero_tusk = 100,
	npc_dota_hero_skywrath_mage = 101,
	npc_dota_hero_abaddon = 102,
	npc_dota_hero_elder_titan = 103,
	npc_dota_hero_legion_commander = 104,
	npc_dota_hero_ember_spirit = 106,
	npc_dota_hero_earth_spirit = 107,
	npc_dota_hero_terrorblade = 109,
	npc_dota_hero_phoenix = 110,
	npc_dota_hero_oracle = 111,
	npc_dota_hero_techies = 105,
	npc_dota_hero_target_dummy = 127,
	npc_dota_hero_winter_wyvern = 112,
	npc_dota_hero_arc_warden = 113,
	npc_dota_hero_abyssal_underlord = 108,
	npc_dota_hero_monkey_king = 114,
	npc_dota_hero_pangolier = 120,
	npc_dota_hero_dark_willow = 119,
	npc_dota_hero_grimstroke = 121
}

declare const enum PingType_t {
	NORMAL = 0,
	DANGER = 1,
	HEADING = 2,
	RETREAT = 3,
	ATTACK = 4,
	ENEMY_VISION = 5,
	OWN_VISION = 6
}

/// CLASSES

interface CUnitOrder {
	readonly type_name: string
	readonly order_type: dotaunitorder_t
	readonly queue: boolean
	readonly issuer: PlayerOrderIssuer_t
	readonly position: Vector
	readonly unit: C_DOTA_BaseNPC
	readonly target: C_BaseEntity
	readonly ability: C_BaseEntity
}

interface CUserCmd {
	readonly type_name: string
	arrow_up_down: number
	arrow_left_right: number
	random_seed: number
	mousex: number
	mousey: number
	camerax: number
	cameraz: number
	click_behaviors: number
	scoreboard_opened: boolean
	shop_type: number
	spectator_stats_category_id: number
	spectator_stats_sort_method: number
	arrow_flags: number // BigInt
	vec_under_cursor: Vector
	camera_angles: Vector
	some_ent1: C_BaseEntity
	some_ent2: C_BaseEntity
}

interface LinearProjectile {
	readonly type_name: string
	readonly m_vecOrigin: Vector
	readonly m_vecPosition: Vector
	readonly m_vecVelocity: Vector
	readonly m_vecAcceleration: Vector
}

interface TrackingProjectile {
	readonly type_name: string
	readonly m_hSource: C_DOTA_BaseNPC
	readonly m_hTarget: C_BaseEntity
	readonly m_vecPosition: Vector
	readonly m_vecTarget: Vector
	readonly m_particle: CNewParticleEffect
}

interface QAngle {
	readonly type_name: string
	readonly Length: number
	readonly LengthSqr: number
	readonly IsZero: boolean
	pitch: number
	yaw: number
	roll: number
}

/// GLOBAL OBJECTS

declare interface Color {
	readonly type_name: string
	r: number
	g: number
	b: number
	a: number

	/**
	 * Makes copy of col
	 */
	constructor(col: Color)
	/**
	 * equiv to r = g = b = val, a = 255
	 */
	constructor(val: number)
	/**
	 * Default alpha: 255
	 */
	constructor(r: number?, g: number?, b: number?, a?: number)
}

declare interface ConVars {
	Get(convar_name: string): number
	Set(convar_name: string, value:  string | number | boolean): void
}

declare interface Entities {
	GetAllEntities(): C_BaseEntity[]
	GetByID(ent_id: number): C_BaseEntity
}

declare interface Events {
	RegisterCallbackName(name: string): void
	RegisterCallback(name: string, callback: Function): void
	UnregisterCallback(name: string, callback_id: number): void
	FireCallback(name: string, ...args): void
}

declare interface Menu {
	AddEntryEz(entry_name: string, obj: any): void
}

declare interface Minimap {
	SendPing(location?: Vector, type?: PingType_t, direct_ping?: boolean, target?: C_BaseEntity): void
	SendLine(x: number, y: number, initial: boolean): void
}

declare interface Vector {
	readonly type_name: string
	/**
	 * Those numbers can also be accessed thru vec[0], vec[1], vec[2]
	 */
	x: number
	z: number
	y: number
	/** You can set (affecting on x, z, y) and get this value */
	Angle: number

	constructor()
	constructor(vec: Vector)
	constructor(val: number)
	constructor(x: number, z: number)
	constructor(x: number, z: number, y: number)

	/**
	 * @returns is valid this vector? (every value must not be infinity/NaN)
	 */
	IsValid(): boolean
	/**
	 * Invalidates this vector
	 */
	Invalidate(): void
	/**
	 * @returns this vector in representation of Vector2D (equiv to new Vector2D(this.x, this.z))
	 */
	AsVector2D(): Vector2D
	/**
	 * Randomizes this vector within given values
	 */
	Random(minVal: number, maxVal: number)
	/**
	 * Zeroes this vector
	 */
	Zero(): void
	/**
	 * Negates this vector (equiv to x = -x, z = -z, y = -y)
	 */
	Negate(): void
	/**
	 * @returns length of this vector
	 */
	Length(): number
	/**
	 * @returns Math.sqr(this.Length()), but faster
	 */
	LengthSqr(): number
	LengthRecipFast(): number
	/**
	 * @returns are all components of this vector are 0?
	 */
	IsZero(): boolean
	NormalizeInPlace(): number
	IsLengthGreaterThan(val: number): boolean
	IsLengthLessThan(val: number): boolean
	WithinAABox(boxmin: Vector, boxmax: Vector): boolean
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param dist distance to be added
	 * @returns extended vector
	 */
	VectorRotation(rotation: Vector, dist: number): Vector
	/**
	 * @param vec 2nd vector
	 * @returns angle between two vectors
	 */
	AngleBetweenTwoVectors(vec: Vector): number
	/**
	 * @param facing 2nd rotation
	 * @returns angle between two rotations
	 */
	AngleBetweenTwoFaces(facing: Vector): number
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec 2nd vector
	 * @param dist distance to extend
	 * @returns extended vector
	 */
	ExtendVector(vec: Vector, dist: number): Vector
	/**
	 * @returns all entities in given range of this vector
	 */
	GetEntitiesInRange(range: number): C_BaseEntity[]	
	/**
	 * @param rot_speed must be taken from npc_heroes MovementTurnRate
	 * @returns calculates full time that will be taken to rotate to this rotation
	 */
	RotationTime(rot_speed: number): number
	/**
	 * @param vec 2nd vector
	 * @returns distance between this and 2nd vector
	 */
	DistTo(vec: Vector): number
	MulAdd(a: Vector, b: Vector, scalar: number)
	Dot(vOther: Vector): number
	Length2D(): number
	Length2DSqr(): number
	Cross(vOther: Vector): Vector
}

declare interface Vector2D {
	readonly type_name: string
	/**
	 * Those numbers can also be accessed thru vec[0], vec[1]
	 */
	x: number
	z: number

	constructor()
	constructor(vec: Vector)
	constructor(vec: Vector2D)
	constructor(val: number)
	constructor(x: number, z: number)

	/**
	 * Zeroes this vector
	 */
	Zero(): void
	/**
	 * @returns length of this vector
	 */
	Length(): number
	/**
	 * @returns Math.sqr(this.Length()), but faster
	 */
	LengthSqr(): number
	/**
	 * @param vec 2nd vector
	 * @returns distance between this and 2nd vector
	 */
	DistTo(vec: Vector2D): number
	/**
	 * @returns is valid this vector? (every value must not be infinity/NaN)
	 */
	IsValid(): boolean
	/**
	 * Invalidates this vector
	 */
	Invalidate(): void
	/**
	 * Extends vector in the rotation direction
	 * @param rotation for ex. Entity#Forward
	 * @param dist distance to be added
	 * @returns extended vector
	 */
	VectorRotation(rotation: Vector2D, dist: number): Vector2D
	/**
	 * @param vec 2nd vector
	 * @returns angle between two vectors
	 */
	AngleBetweenTwoVectors(vec: Vector2D): number
	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param vec 2nd vector
	 * @param dist distance to extend
	 * @returns extended vector
	 */
	ExtendVector(vec: Vector2D, dist: number): Vector2D
	/**
	 * @returns this vector in representation of Vector (equiv to new Vector(this.x, this.z))
	 */
	TransformToVector(): Vector
}

declare interface Projectiles {
	FirstTracking(): TrackingProjectile
	NextTracking(prev: TrackingProjectile): TrackingProjectile
	GetAllTracking(): TrackingProjectile[]
	TrackingByID(id: number): TrackingProjectile
	
	FirstLinear(): LinearProjectile
	NextLinear(prev: LinearProjectile): LinearProjectile
	GetAllLinear(): LinearProjectile[]
	LinearByID(id: number): LinearProjectile
}

declare interface Particles {
	Create(path: string, attach: ParticleAttachment_t, ent?: C_BaseEntity): number
	Destroy(particle_id: number, immediate: boolean): void
	SetControlPoint(particle_id: number, control_point: number, vec: Vector): void
}

// must be called only in onDraw!
declare interface Renderer {
	readonly WindowSize: Vector2D
	
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 */
	FilledCircle(x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 */
	OutlinedCircle(x: number, y: number, radius: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 */
	Line(baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 */
	FilledRect(baseX: number, baseY: number, baseW: number, baseH: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
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
	 */
	Image(path: string, baseX: number, baseY: number, baseW?: number, baseH?: number, r?: number, g?: number, b?: number, a?: number): void
	/**
	 * Allowed non-passable element groups:
	 * [r, g, b]
	 * [a]
	 */
	Text(x: number, y: number, text: string, r?: number, g?: number, b?: number, a?: number): void
	WorldToScreen(pos: Vector): Vector2D
}

/// GLOBAL FUNCTIONS

declare function SendToConsole(command: string): void
declare function readFile(path: string): string
declare function sleep(ms: number): void
declare function IsInGame(): boolean
declare function GetLevelName(): string
declare function GetLevelNameShort(): string
declare function PrepareUnitOrders(obj: {
	Position: Vector,
	Ability: C_BaseEntity,
	Unit: C_BaseEntity,
	Queue: boolean,
	ShowEffects: boolean
}): void
declare function SelectUnit(ent: C_BaseEntity, bAddToGroup: boolean): boolean

/// AUTOMATICALLY GENERATED

interface CParticleFunction {
	readonly type_name: string
	readonly m_flOpStartFadeInTime: number
	readonly m_flOpEndFadeInTime: number
	readonly m_flOpStartFadeOutTime: number
	readonly m_flOpEndFadeOutTime: number
	readonly m_flOpFadeOscillatePeriod: number
	readonly m_flOpTimeOffsetMin: number
	readonly m_flOpTimeOffsetMax: number
	readonly m_nOpTimeOffsetSeed: number
	readonly m_nOpStrengthScaleSeed: number
	readonly m_flOpStrengthMinScale: number
	readonly m_flOpStrengthMaxScale: number
	readonly m_nOpTimeScaleSeed: number
	readonly m_flOpTimeScaleMin: number
	readonly m_flOpTimeScaleMax: number
	readonly m_bDisableOperator: boolean
	readonly m_nOpEndCapState: number
	readonly m_nOpScaleCP: number
	readonly m_strengthModifierAttribute: string
	readonly m_flAttributeInputLow: number
	readonly m_flAttributeInputHigh: number
	readonly m_Notes: string
}

interface CParticleFunctionInitializer extends CParticleFunction {
	readonly type_name: string
}

interface CDOTA_BuffParticle {
	readonly type_name: string
	readonly m_iIndex: number
	readonly m_iPriority: number
	readonly m_bDestroyImmediatly: boolean
	readonly m_bStatusEffect: boolean
	readonly m_bHeroEffect: boolean
	readonly m_bOverheadEffectOffset: boolean
}

interface CDOTA_PlayerChallengeInfo {
	readonly type_name: string
	readonly nType: number
	readonly nQuestID: number
	readonly nQuestChallengeID: number
	readonly nTier: number
	readonly nParam0: number
	readonly nParam1: number
	readonly nSlotID: number
	readonly nProgress: number
	readonly nCompletionThreshold: number
	readonly nPlayerID: number
	readonly nQueryIndex: number
	readonly nEventID: number
	readonly nSequenceID: number
	readonly nCompleted: number
	readonly nRank: number
}

interface CBaseAchievement {
	readonly type_name: string
	readonly m_pszName: string
	readonly m_iAchievementID: number
	readonly m_iFlags: number
	readonly m_iGoal: number
	readonly m_iProgressMsgIncrement: number
	readonly m_iProgressMsgMinimum: number
	readonly m_iPointValue: number
	readonly m_bHideUntilAchieved: boolean
	readonly m_bStoreProgressInSteam: boolean
	readonly m_pInflictorClassNameFilter: string
	readonly m_pInflictorEntityNameFilter: string
	readonly m_pVictimClassNameFilter: string
	readonly m_pAttackerClassNameFilter: string
	readonly m_pMapNameFilter: string
	readonly m_pGameDirFilter: string
	readonly m_pszComponentNames: string
	readonly m_pszComponentDisplayNames: string
	readonly m_iNumComponents: number
	readonly m_pszComponentPrefix: string
	readonly m_iComponentPrefixLen: number
	readonly m_bAchieved: boolean
	readonly m_iCount: number
	readonly m_iProgressShown: number
	readonly m_iComponentBits: number
	readonly m_nUserSlot: number
	readonly m_iDisplayOrder: number
	readonly m_bShowOnHUD: boolean
	readonly m_iAssetAwardID: number
}

interface fogparams_t {
	readonly type_name: string
	readonly dirPrimary: Vector
	readonly colorPrimary: Color
	readonly colorSecondary: Color
	readonly colorPrimaryLerpTo: Color
	readonly colorSecondaryLerpTo: Color
	readonly start: number
	readonly end: number
	readonly farz: number
	readonly maxdensity: number
	readonly exponent: number
	readonly HDRColorScale: number
	readonly skyboxFogFactor: number
	readonly skyboxFogFactorLerpTo: number
	readonly startLerpTo: number
	readonly endLerpTo: number
	readonly maxdensityLerpTo: number
	readonly lerptime: number
	readonly duration: number
	readonly enable: boolean
	readonly blend: boolean
	readonly m_bNoReflectionFog: boolean
	readonly m_bPadding: boolean
}

interface C_INIT_RandomColor extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_ColorMin: Color
	readonly m_ColorMax: Color
	readonly m_TintMin: Color
	readonly m_TintMax: Color
	readonly m_flTintPerc: number
	readonly m_flUpdateThreshold: number
	readonly m_nTintCP: number
	readonly m_nTintBlendMode: number
	readonly m_flLightAmplification: number
}

interface CParticleFunctionOperator extends CParticleFunction {
	readonly type_name: string
}

interface CBaseAnimMotor {
	readonly type_name: string
	readonly m_name: string
	readonly m_bDefault: boolean
}

interface ParticleControlPointDriver_t {
	readonly type_name: string
	readonly m_iControlPoint: number
	readonly m_iAttachType: number
	readonly m_attachmentName: string
	readonly m_vecOffset: Vector
	readonly m_angOffset: QAngle
	readonly m_entityName: string
}

interface C_OP_PlaneCull extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nPlaneControlPoint: number
	readonly m_vecPlaneDirection: Vector
	readonly m_flPlaneOffset: number
}

interface SceneViewId_t {
	readonly type_name: string
	readonly m_nViewId: number
	readonly m_nFrameCount: number
}

interface CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonOp: number
}

interface CRenderSkeleton {
	readonly type_name: string
	readonly m_bones: RenderSkeletonBone_t[]
	readonly m_boneParents: number[]
	readonly m_nBoneWeightCount: number
}

interface CPhysSurfacePropertiesSoundNames {
	readonly type_name: string
	readonly m_impactSoft: string
	readonly m_impactHard: string
	readonly m_scrapeSmooth: string
	readonly m_scrapeRough: string
	readonly m_bulletImpact: string
	readonly m_rolling: string
	readonly m_break: string
	readonly m_strain: string
}

interface PhysFeModelDesc_t {
	readonly type_name: string
	readonly m_nStaticNodeFlags: number
	readonly m_nDynamicNodeFlags: number
	readonly m_flLocalForce: number
	readonly m_flLocalRotation: number
	readonly m_nNodeCount: number
	readonly m_nStaticNodes: number
	readonly m_nRotLockStaticNodes: number
	readonly m_nSimdTriCount1: number
	readonly m_nSimdTriCount2: number
	readonly m_nSimdQuadCount1: number
	readonly m_nSimdQuadCount2: number
	readonly m_nQuadCount1: number
	readonly m_nQuadCount2: number
	readonly m_nCollisionSphereInclusiveCount: number
	readonly m_nTreeDepth: number
	readonly m_nFitMatrixCount1: number
	readonly m_nFitMatrixCount2: number
	readonly m_nSimdFitMatrixCount1: number
	readonly m_nSimdFitMatrixCount2: number
	readonly m_nRopeCount: number
	readonly m_nTriCount1: number
	readonly m_nTriCount2: number
	readonly m_nReservednumber: number
	readonly m_nExtraPressureIterations: number
	readonly m_nExtraGoalIterations: number
	readonly m_nExtraIterations: number
	readonly m_nReserved: number[]
	readonly m_flInternalPressure: number
	readonly m_flWindage: number
	readonly m_flWindDrag: number
	readonly m_flDefaultSurfaceStretch: number
	readonly m_flDefaultThreadStretch: number
	readonly m_flDefaultGravityScale: number
	readonly m_flDefaultVelAirDrag: number
	readonly m_flDefaultExpAirDrag: number
	readonly m_flDefaultVelQuadAirDrag: number
	readonly m_flDefaultExpQuadAirDrag: number
	readonly m_flDefaultVelRodAirDrag: number
	readonly m_flDefaultExpRodAirDrag: number
	readonly m_flRodVelocitySmoothRate: number
	readonly m_flQuadVelocitySmoothRate: number
	readonly m_flAddWorldCollisionRadius: number
	readonly m_flDefaultVolumetricSolveAmount: number
	readonly m_nRodVelocitySmoothIterations: number
	readonly m_nQuadVelocitySmoothIterations: number
}

interface RnCapsule_t {
	readonly type_name: string
	readonly m_vCenter: Vector[]
	readonly m_flRadius: number
}

interface PostProcessParameters_t {
	readonly type_name: string
	readonly m_flParameters: number[]
}

interface C_OP_MovementLoopInsideSphere extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flDistance: number
	readonly m_vecScale: Vector
}

interface C_INIT_DistanceToCPInit extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_nStartCP: number
	readonly m_bLOS: boolean
	readonly m_CollisionGroupName: string[]
	readonly m_flMaxTraceLength: number
	readonly m_flLOSScale: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bActiveRange: boolean
	readonly m_vecDistanceScale: Vector
	readonly m_flRemapBias: number
}

interface C_OP_RemapCPVisibilityToScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bScaleInitialRange: boolean
	readonly m_nControlPoint: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flRadius: number
}

interface LightDesc_t {
	readonly type_name: string
	readonly m_Type: number
	readonly m_Color: Vector
	readonly m_BounceColor: Vector
	readonly m_Range: number
	readonly m_Falloff: number
	readonly m_Attenuation0: number
	readonly m_Attenuation1: number
	readonly m_Attenuation2: number
	readonly m_Theta: number
	readonly m_Phi: number
	readonly m_bCastShadows: boolean
	readonly m_nShadowWidth: number
	readonly m_nShadowHeight: number
	readonly m_nShadowCascadeCount: number
	readonly m_flShadowCascadeDistance: number[]
	readonly m_nShadowCascadeResolution: number[]
	readonly m_nBakeLightIndex: number
	readonly m_flBakeLightIndexScale: number
	readonly m_bRenderDiffuse: boolean
	readonly m_bRenderSpecular: boolean
	readonly m_nPriority: number
	readonly m_Shape: number
	readonly m_flLightSourceDim0: number
	readonly m_flLightSourceDim1: number
	readonly m_flLightSourceSize0: number
	readonly m_flLightSourceSize1: number
	readonly m_flPrecomputedMaxRange: number
	readonly m_flFogContributionStength: number
	readonly m_vecUp: Vector
	readonly m_nFogLightingMode: number
	readonly m_bUsesIndexedBakedLighting: boolean
}

interface RnFace_t {
	readonly type_name: string
	readonly m_nEdge: number
}

interface EngineLoopState_t {
	readonly type_name: string
	readonly m_nPlatWindowWidth: number
	readonly m_nPlatWindowHeight: number
	readonly m_nRenderWidth: number
	readonly m_nRenderHeight: number
}

interface InfoForResourceTypeCNameListStacks {
	readonly type_name: string
}

interface ChangeAccessorFieldPathIndex_t {
	readonly type_name: string
	readonly m_Value: number
}

interface CEconItemAttribute {
	readonly type_name: string
	readonly m_iAttributeDefinitionIndex: number
	readonly m_flValue: number
}

interface EventSimulate_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_bFirstTick: boolean
	readonly m_bLastTick: boolean
}

interface C_INIT_RandomNamedModelElement extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_names: string[]
	readonly m_bShuffle: boolean
	readonly m_bLinear: boolean
	readonly m_bModelFromRenderer: boolean
}

interface SeqResourceIKLock_t {
	readonly type_name: string
	readonly m_nLocalBone: number
	readonly m_flPosWeight: number
	readonly m_flAngleWeight: number
}

interface AnimResourceAnimDesc_t_Flag_t {
	readonly type_name: string
	readonly m_bLooping: boolean
	readonly m_bAllZeros: boolean
	readonly m_bHidden: boolean
	readonly m_bDelta: boolean
	readonly m_bLegacyWorldspace: boolean
}

interface PermModelInfo_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_vHullMin: Vector
	readonly m_vHullMax: Vector
	readonly m_vViewMin: Vector
	readonly m_vViewMax: Vector
	readonly m_flMass: number
	readonly m_vEyePosition: Vector
	readonly m_flMaxEyeDeflection: number
stringstring}

interface EventModInitialized_t {
	readonly type_name: string
}

interface C_INIT_VelocityFromCP extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPoint: number
	readonly m_nControlPointCompare: number
	readonly m_nControlPointLocal: number
	readonly m_flVelocityScale: number
	readonly m_bDirectionOnly: boolean
}

interface CAnimMotorList {
	readonly type_name: string
}

interface MaterialGroup_t {
	readonly type_name: string
string}

interface IContextualQuery {
	readonly type_name: string
}

interface CAI_Expresser {
	readonly type_name: string
	readonly m_flStopTalkTime: number
	readonly m_flStopTalkTimeWithoutDelay: number
	readonly m_flBlockedTalkTime: number
	readonly m_voicePitch: number
	readonly m_flLastTimeAcceptedSpeak: number
}

interface CParticleVisibilityInputs {
	readonly type_name: string
	readonly m_flCameraBias: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flAlphaScaleMin: number
	readonly m_flAlphaScaleMax: number
	readonly m_flRadiusScaleMin: number
	readonly m_flRadiusScaleMax: number
	readonly m_flRadiusScaleFOVBase: number
	readonly m_flProxyRadius: number
	readonly m_flDistanceInputMin: number
	readonly m_flDistanceInputMax: number
	readonly m_flDotInputMin: number
	readonly m_flDotInputMax: number
	readonly m_flNoPixelVisibilityFallback: number
	readonly m_nCPin: number
	readonly m_bRightEye: boolean
}

interface VPhysXConstraintParams_t {
	readonly type_name: string
	readonly m_nType: number
	readonly m_nTranslateMotion: number
	readonly m_nRotateMotion: number
	readonly m_nFlags: number
	readonly m_anchor: Vector[]
	readonly m_maxForce: number
	readonly m_maxTorque: number
	readonly m_linearLimitValue: number
	readonly m_linearLimitRestitution: number
	readonly m_linearLimitSpring: number
	readonly m_linearLimitDamping: number
	readonly m_twistLowLimitValue: number
	readonly m_twistLowLimitRestitution: number
	readonly m_twistLowLimitSpring: number
	readonly m_twistLowLimitDamping: number
	readonly m_twistHighLimitValue: number
	readonly m_twistHighLimitRestitution: number
	readonly m_twistHighLimitSpring: number
	readonly m_twistHighLimitDamping: number
	readonly m_swing1LimitValue: number
	readonly m_swing1LimitRestitution: number
	readonly m_swing1LimitSpring: number
	readonly m_swing1LimitDamping: number
	readonly m_swing2LimitValue: number
	readonly m_swing2LimitRestitution: number
	readonly m_swing2LimitSpring: number
	readonly m_swing2LimitDamping: number
	readonly m_goalPosition: Vector
	readonly m_goalAngularVelocity: Vector
	readonly m_driveSpringX: number
	readonly m_driveSpringY: number
	readonly m_driveSpringZ: number
	readonly m_driveDampingX: number
	readonly m_driveDampingY: number
	readonly m_driveDampingZ: number
	readonly m_driveSpringTwist: number
	readonly m_driveSpringSwing: number
	readonly m_driveSpringSlerp: number
	readonly m_driveDampingTwist: number
	readonly m_driveDampingSwing: number
	readonly m_driveDampingSlerp: number
	readonly m_solverIterationCount: number
	readonly m_projectionLinearTolerance: number
	readonly m_projectionAngularTolerance: number
}

interface EventServerPollNetworking_t extends EventSimulate_t {
	readonly type_name: string
}

interface C_OP_DecayMaintainCount extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nParticlesToMaintain: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_flDecayDelay: number
}

interface C_INIT_RemapInitialCPDirectionToRotation extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flOffsetRot: number
}

interface InfoForResourceTypeIParticleSnapshot {
	readonly type_name: string
}

interface CParticleFunctionPreEmission extends CParticleFunctionOperator {
	readonly type_name: string
}

interface C_OP_PercentageBetweenCPsVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bActiveRange: boolean
	readonly m_bRadialCheck: boolean
}

interface FeKelagerBend2_t {
	readonly type_name: string
	readonly flWeight: number[]
	readonly flHeight0: number
	readonly nNode: number[]
	readonly nReserved: number
}

interface InfoForResourceTypeCVMixListResource {
	readonly type_name: string
}

interface SchemaMetadataSetData_t {
	readonly type_name: string
}

interface constraint_axislimit_t {
	readonly type_name: string
	readonly flMinRotation: number
	readonly flMaxRotation: number
	readonly flMotorTargetAngSpeed: number
	readonly flMotorMaxTorque: number
}

interface C_OP_VectorNoise extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_bAdditive: boolean
	readonly m_bOffset: boolean
	readonly m_flNoiseAnimationTimeScale: number
}

interface C_INIT_InitialSequenceFromModel extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
}

interface AnimNodeID {
	readonly type_name: string
	readonly m_id: number
}

interface C_OP_Orient2DRelToCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flRotOffset: number
	readonly m_flSpinStrength: number
	readonly m_nCP: number
}

interface C_OP_InheritFromParentParticles extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_nIncrement: number
	readonly m_bRandomDistribution: boolean
}

interface CGeneralSpin extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nSpinRateDegrees: number
	readonly m_nSpinRateMinDegrees: number
	readonly m_fSpinRateStopTime: number
}

interface CAnimNodeBase {
	readonly type_name: string
	readonly m_sName: string
	readonly m_vecPosition: Vector2D
	readonly m_nNodeID: AnimNodeID
	readonly m_networkMode: number
}

interface CFeJiggleBone {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_flLength: number
	readonly m_flTipMass: number
	readonly m_flYawStiffness: number
	readonly m_flYawDamping: number
	readonly m_flPitchStiffness: number
	readonly m_flPitchDamping: number
	readonly m_flAlongStiffness: number
	readonly m_flAlongDamping: number
	readonly m_flAngleLimit: number
	readonly m_flMinYaw: number
	readonly m_flMaxYaw: number
	readonly m_flYawFriction: number
	readonly m_flYawBounce: number
	readonly m_flMinPitch: number
	readonly m_flMaxPitch: number
	readonly m_flPitchFriction: number
	readonly m_flPitchBounce: number
	readonly m_flBaseMass: number
	readonly m_flBaseStiffness: number
	readonly m_flBaseDamping: number
	readonly m_flBaseMinLeft: number
	readonly m_flBaseMaxLeft: number
	readonly m_flBaseLeftFriction: number
	readonly m_flBaseMinUp: number
	readonly m_flBaseMaxUp: number
	readonly m_flBaseUpFriction: number
	readonly m_flBaseMinForward: number
	readonly m_flBaseMaxForward: number
	readonly m_flBaseForwardFriction: number
	readonly m_flRadius0: number
	readonly m_flRadius1: number
	readonly m_vPoint0: Vector
	readonly m_vPoint1: Vector
}

interface SchemaMetadataEntryData_t {
	readonly type_name: string
}

interface CGlowSprite {
	readonly type_name: string
	readonly m_vColor: Vector
	readonly m_flHorzSize: number
	readonly m_flVertSize: number
}

interface CNavVolume {
	readonly type_name: string
}

interface CNetworkVarChainer {
	readonly type_name: string
	readonly m_PathIndex: ChangeAccessorFieldPathIndex_t
}

interface C_OP_MoveToHitbox extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flLifeTimeLerpStart: number
	readonly m_flLifeTimeLerpEnd: number
	readonly m_flPrevPosScale: number
	readonly m_HitboxSetName: string[]
	readonly m_bUseBones: boolean
}

interface EventProfileStorageAvailable_t {
	readonly type_name: string
	readonly m_nSplitScreenSlot: number
}

interface C_OP_RemapCPVelocityToVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPoint: number
	readonly m_flScale: number
	readonly m_bNormalize: boolean
}

interface CAnimTagManager {
	readonly type_name: string
}

interface CGameSceneNodeHandle {
	readonly type_name: string
	readonly m_hOwner: C_BaseEntity
}

interface CountdownTimer {
	readonly type_name: string
	readonly m_duration: number
	readonly m_timestamp: number
	readonly m_bUseGlobalsTime: boolean
}

interface PurchasedItem_t {
	readonly type_name: string
	readonly nItemID: number
	readonly flPurchaseTime: number
}

interface CParticleFunctionRenderer extends CParticleFunction {
	readonly type_name: string
	readonly VisibilityInputs: CParticleVisibilityInputs
	readonly m_bCannotBeRefracted: boolean
}

interface C_OP_SetControlPointPositionToTimeOfDayValue extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_pszTimeOfDayParameter: string[]
	readonly m_vecDefaultValue: Vector
}

interface C_OP_SetChildControlPoints extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nChildGroupID: number
	readonly m_nFirstControlPoint: number
	readonly m_nNumControlPoints: number
	readonly m_nFirstSourcePoint: number
	readonly m_bSetOrientation: boolean
}

interface C_INIT_InheritFromParentParticles extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_nIncrement: number
	readonly m_bRandomDistribution: boolean
	readonly m_nRandomSeed: number
}

interface CLookHeadingCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface CSequenceTransitioner {
	readonly type_name: string
	readonly m_animationQueue: CAnimationLayer[]
	readonly m_bIsInSimulation: boolean
	readonly m_flSimOrRenderTime: number
	readonly m_flInterpolatedTime: number
}

interface CObstructionObject {
	readonly type_name: string
	readonly m_nObstructionProperties: number
}

interface CRMSG_Entity_Event {
	readonly type_name: string
	readonly m_nEHandle: number
	readonly m_nEvent: number
	readonly m_nSubEvent: number
	readonly m_nFrameNumber: number
	readonly m_nTimeUS: number
}

interface CNetworkOriginCellCoordQuantizedVector {
	readonly type_name: string
	readonly m_cellX: number
	readonly m_cellY: number
	readonly m_cellZ: number
	readonly m_nOutsideWorld: number
}

interface C_INIT_CreateFromParentParticles extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flVelocityScale: number
	readonly m_flIncrement: number
	readonly m_bRandomDistribution: boolean
	readonly m_nRandomSeed: number
	readonly m_bSubFrame: boolean
}

interface FeSimdRodConstraint_t {
	readonly type_name: string
	readonly nNode: number[]
}

interface C_OP_RenderStatusEffect extends CParticleFunctionRenderer {
	readonly type_name: string
}

interface C_INIT_InitFromCPSnapshot extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nLocalSpaceCP: number
	readonly m_bRandom: boolean
	readonly m_bReverse: boolean
	readonly m_nRandomSeed: number
}

interface C_INIT_PositionOffsetToCP extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumberStart: number
	readonly m_nControlPointNumberEnd: number
	readonly m_bLocalCoords: boolean
}

interface CSSDSMsg_EndFrame {
	readonly type_name: string
	readonly m_Views: CSSDSEndFrameViewInfo[]
}

interface AnimParamID {
	readonly type_name: string
	readonly m_id: number
}

interface SkeletonBoneBounds_t {
	readonly type_name: string
	readonly m_vecCenter: Vector
	readonly m_vecSize: Vector
}

interface InfoForResourceTypeCVirtualVolumeTexture {
	readonly type_name: string
}

interface CConstantForceController {
	readonly type_name: string
	readonly m_linear: Vector
	readonly m_angular: Vector
	readonly m_linearSave: Vector
	readonly m_angularSave: Vector
}

interface INextBotEventResponder {
	readonly type_name: string
}

interface CBoneConstraintBase {
	readonly type_name: string
}

interface EventAdvanceTick_t extends EventSimulate_t {
	readonly type_name: string
	readonly m_nCurrentTick: number
	readonly m_nTotalTicksThisFrame: number
	readonly m_nTotalTicks: number
}

interface C_OP_Cull extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flCullPerc: number
	readonly m_flCullStart: number
	readonly m_flCullEnd: number
	readonly m_flCullExp: number
}

interface C_INIT_AgeNoise extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bAbsVal: boolean
	readonly m_bAbsValInv: boolean
	readonly m_flOffset: number
	readonly m_flAgeMin: number
	readonly m_flAgeMax: number
	readonly m_flNoiseScale: number
	readonly m_flNoiseScaleLoc: number
	readonly m_vecOffsetLoc: Vector
}

interface SeqResourceSeqDesc_t_Flag_t {
	readonly type_name: string
	readonly m_bLooping: boolean
	readonly m_bSnap: boolean
	readonly m_bAutoplay: boolean
	readonly m_bPost: boolean
	readonly m_bHidden: boolean
	readonly m_bMulti: boolean
	readonly m_bLegacyDelta: boolean
	readonly m_bLegacyWorldspace: boolean
	readonly m_bLegacyCyclepose: boolean
	readonly m_bLegacyRealtime: boolean
}

interface CEntityClass {
	readonly type_name: string
	readonly m_pInputs: EntInput_t
	readonly m_nInputCount: number
	readonly m_pOutputs: EntOutput_t
	readonly m_nOutputCount: number
	readonly m_pComponentOverrides: EntClassComponentOverride_t
	readonly m_pClassInfo: CEntityClassInfo
	readonly m_pBaseClassInfo: CEntityClassInfo
	readonly m_designerName: string
	readonly m_flags: number
	readonly m_nAllHelpersFlags: number
	readonly m_requiredEHandle: C_BaseEntity
	readonly m_pNextClass: CEntityClass
}

interface MorphData_t {
	readonly type_name: string
string}

interface CVPhysXSurfacePropertiesList {
	readonly type_name: string
	readonly m_surfacePropertiesList: CPhysSurfaceProperties[]
}

interface CParticleFunctionEmitter extends CParticleFunction {
	readonly type_name: string
}

interface CParticleFunctionConstraint extends CParticleFunction {
	readonly type_name: string
}

interface MorphSetData_t {
	readonly type_name: string
	readonly m_nWidth: number
	readonly m_nHeight: number
	readonly m_nLookupType: number
	readonly m_nEncodingType: number
}

interface C_OP_BasicMovement extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Gravity: Vector
	readonly m_fDrag: number
	readonly m_nMaxConstraintPasses: number
	readonly m_bLockULCorner: boolean
	readonly m_bLockURCorner: boolean
	readonly m_bLockLLCorner: boolean
	readonly m_bLockLRCorner: boolean
}

interface FlexDesc_t {
	readonly type_name: string
string}

interface C_VerticalMotionController {
	readonly type_name: string
}

interface DOTA_AssassinMinigameNetworkState {
	readonly type_name: string
	readonly nAssassinState: number
	readonly nVictimHeroID: number
}

interface thinkfunc_t {
	readonly type_name: string
	readonly m_nNextThinkTick: number
	readonly m_nLastThinkTick: number
}

interface FileWeaponInfo_t {
	readonly type_name: string
	readonly m_bParsedScript: boolean
	readonly m_bLoadedHudElements: boolean
	readonly m_szClassName: string
	readonly m_szPrintName: string
	readonly m_szViewModel: string
	readonly m_szWorldModel: string
	readonly m_szAnimationPrefix: string
	readonly m_szMuzzleFlashParticle: string
	readonly m_szTracerParticle: string
	readonly m_iSlot: number
	readonly m_iPosition: number
	readonly m_iMaxClip1: number
	readonly m_iMaxClip2: number
	readonly m_iDefaultClip1: number
	readonly m_iDefaultClip2: number
	readonly m_iWeight: number
	readonly m_iRumbleEffect: number
	readonly m_bAutoSwitchTo: boolean
	readonly m_bAutoSwitchFrom: boolean
	readonly m_iFlags: number
	readonly m_szAmmo1: string
	readonly m_szAmmo2: string
	readonly m_szAIAddOn: string
	readonly m_bMeleeWeapon: boolean
	readonly m_bBuiltRightHanded: boolean
	readonly m_bAllowFlipping: boolean
	readonly m_iAmmoType: number
	readonly m_iAmmo2Type: number
	readonly m_aTextureData: WeaponTextureData_t[]
	readonly m_aShootSounds: WeaponSoundData_t[]
}

interface C_OP_RenderProjected extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_bProjectCharacter: boolean
	readonly m_bProjectWorld: boolean
	readonly m_bProjectWater: boolean
	readonly m_bFlipHorizontal: boolean
	readonly m_bEnableProjectedDepthControls: boolean
	readonly m_flMinProjectionDepth: number
	readonly m_flMaxProjectionDepth: number
	readonly m_flAnimationTimeScale: number
}

interface C_OP_OscillateScalarSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Rate: number
	readonly m_Frequency: number
	readonly m_flOscMult: number
	readonly m_flOscAdd: number
}

interface C_INIT_InitSkinnedPositionFromCPSnapshot extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nSnapshotControlPointNumber: number
	readonly m_nControlPointNumber: number
	readonly m_bRandom: boolean
	readonly m_nRandomSeed: number
	readonly m_bRigid: boolean
	readonly m_bSetNormal: boolean
	readonly m_bIgnoreDt: boolean
	readonly m_flMinNormalVelocity: number
	readonly m_flMaxNormalVelocity: number
	readonly m_flIncrement: number
	readonly m_nFullLoopIncrement: number
	readonly m_nSnapShotStartPoint: number
	readonly m_flBoneVelocity: number
	readonly m_flBoneVelocityMax: number
}

interface C_OP_SpringConstraint extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_flRestLengthU: number
	readonly m_flRestLengthV: number
	readonly m_flMinDistance: number
	readonly m_flMaxDistance: number
	readonly m_flAdjustmentScale: number
}

interface RnShapeDesc_t {
	readonly type_name: string
	readonly m_nCollisionAttributeIndex: number
	readonly m_nSurfacePropertyIndex: number
}

interface CAnimParameterBase {
	readonly type_name: string
	readonly m_name: string
	readonly m_id: AnimParamID
	readonly m_previewButton: number
	readonly m_bNetwork: boolean
	readonly m_bAutoReset: boolean
}

interface VPhysXAggregateData_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_nRefCounter: number
string}

interface C_INIT_ModelCull extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_bBoundBox: boolean
	readonly m_bCullOutside: boolean
	readonly m_bUseBones: boolean
	readonly m_HitboxSetName: string[]
}

interface CAnimInputDamping {
	readonly type_name: string
	readonly m_speedFunction: number
	readonly m_fSpeedScale: number
	readonly m_fMinSpeed: number
	readonly m_fMaxTension: number
}

interface CEntityClassInfo {
	readonly type_name: string
	readonly m_pszClassname: string
	readonly m_pszCPPClassname: string
	readonly m_pszDescription: string
	readonly m_pClass: CEntityClass
	readonly m_pBaseClassInfo: CEntityClassInfo
}

interface SchemaEnumInfoData_t {
	readonly type_name: string
	readonly m_nSizeOf: number
	readonly m_nAlignOf: number
	readonly m_Metadata: SchemaMetadataSetData_t
}

interface fogplayerparams_t {
	readonly type_name: string
	readonly m_hCtrl: C_BaseEntity
	readonly m_flTransitionTime: number
	readonly m_OldColor: Color
	readonly m_flOldStart: number
	readonly m_flOldEnd: number
	readonly m_flOldMaxDensity: number
	readonly m_flOldHDRColorScale: number
	readonly m_flOldFarZ: number
	readonly m_NewColor: Color
	readonly m_flNewStart: number
	readonly m_flNewEnd: number
	readonly m_flNewMaxDensity: number
	readonly m_flNewHDRColorScale: number
	readonly m_flNewFarZ: number
}

interface C_OP_DistanceBetweenCPsToCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_nOutputCP: number
	readonly m_nOutputCPField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flMaxTraceLength: number
	readonly m_flLOSScale: number
	readonly m_bLOS: boolean
	readonly m_CollisionGroupName: string[]
}

interface CPiecewiseCurveSchemaWrapper {
	readonly type_name: string
}

interface C_OP_ContinuousEmitter extends CParticleFunctionEmitter {
	readonly type_name: string
	readonly m_flEmissionDuration: number
	readonly m_flStartTime: number
	readonly m_flEmitRate: number
	readonly m_flEmissionScale: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_bScalePerParticle: boolean
	readonly m_bInitFromKilledParentParticles: boolean
}

interface C_INIT_RandomAlpha extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nAlphaMin: number
	readonly m_nAlphaMax: number
	readonly m_flAlphaRandExponent: number
}

interface CEffectData {
	readonly type_name: string
	readonly m_vOrigin: Vector
	readonly m_vStart: Vector
	readonly m_vNormal: Vector
	readonly m_vAngles: QAngle
	readonly m_hEntity: C_BaseEntity
	readonly m_hOtherEntity: C_BaseEntity
	readonly m_flScale: number
	readonly m_flMagnitude: number
	readonly m_flRadius: number
	readonly m_nDamageType: number
	readonly m_nMaterial: number
	readonly m_nHitBox: number
	readonly m_nColor: number
	readonly m_fFlags: number
	readonly m_nAttachmentIndex: number
	readonly m_iEffectName: number
}

interface CDOTA_AbilityDraftAbilityState {
	readonly type_name: string
	readonly m_nAbilityID: number
	readonly m_unPlayerID: number
	readonly m_unAbilityPlayerSlot: number
}

interface CSubtractAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_baseChildID: AnimNodeID
	readonly m_subtractChildID: AnimNodeID
	readonly m_timingBehavior: number
	readonly m_flTimingBlend: number
	readonly m_bResetBase: boolean
	readonly m_bResetSubtract: boolean
	readonly m_bApplyChannelsSeparately: boolean
}

interface HitBoxSet_t {
	readonly type_name: string
stringstring}

interface InfoForResourceTypeCPhysAggregateData {
	readonly type_name: string
}

interface C_OP_NoiseEmitter extends CParticleFunctionEmitter {
	readonly type_name: string
	readonly m_flEmissionDuration: number
	readonly m_flStartTime: number
	readonly m_flEmissionScale: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_nWorldNoisePoint: number
	readonly m_bAbsVal: boolean
	readonly m_bAbsValInv: boolean
	readonly m_flOffset: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flNoiseScale: number
	readonly m_flWorldNoiseScale: number
	readonly m_vecOffsetLoc: Vector
	readonly m_flWorldTimeScale: number
}

interface AnimTagID {
	readonly type_name: string
	readonly m_id: number
}

interface sky3dparams_t {
	readonly type_name: string
	readonly scale: number
	readonly origin: Vector
	readonly bClip3DSkyBoxNearToWorldFar: boolean
	readonly flClip3DSkyBoxNearToWorldFarOffset: number
	readonly fog: fogparams_t
}

interface JiggleData {
	readonly type_name: string
	readonly bone: number
	readonly id: number
	readonly lastUpdate: number
	readonly basePos: Vector
	readonly baseLastPos: Vector
	readonly baseVel: Vector
	readonly baseAccel: Vector
	readonly tipPos: Vector
	readonly tipVel: Vector
	readonly tipAccel: Vector
}

interface RnSphere_t {
	readonly type_name: string
	readonly m_vCenter: Vector
	readonly m_flRadius: number
}

interface PhysSoftbodyDesc_t {
	readonly type_name: string
}

interface CDOTA_Buff {
	readonly type_name: string
	readonly m_name: string
	readonly m_class: string
	readonly m_szModifierAura: string
	readonly m_iSerialNumber: number
	readonly m_iStringIndex: number
	readonly m_iIndex: number
	readonly m_flCreationTime: number
	readonly m_iCreationFrame: number
	readonly m_flLastAppliedTime: number
	readonly m_flDuration: number
	readonly m_flDieTime: number
	readonly m_hCaster: C_BaseEntity
	readonly m_hAbility: C_BaseEntity
	readonly m_hParent: C_BaseEntity
	readonly m_iStackCount: number
	readonly m_iAuraSearchTeam: number
	readonly m_iAuraSearchType: number
	readonly m_iAuraSearchFlags: number
	readonly m_iAuraRadius: number
	readonly m_iTeam: number
	readonly m_iAttributes: number
	readonly m_iPaddingToMakeSchemaHappy2: number
	readonly m_bIsAura: boolean
	readonly m_bIsAuraActiveOnDeath: boolean
	readonly m_bMarkedForDeletion: boolean
	readonly m_bAuraIsHeal: boolean
	readonly m_bProvidedByAura: boolean
	readonly m_bPurgedDestroy: boolean
	readonly m_flPreviousTick: number
	readonly m_flThinkInterval: number
	readonly m_flThinkTimeAccumulator: number
	readonly m_iParticles: CDOTA_BuffParticle[]
	readonly m_hAuraUnits: C_BaseEntity[]
}

interface C_OP_RemapNamedModelElementOnceTimed extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_inNames: string[]
	readonly m_outNames: string[]
	readonly m_fallbackNames: string[]
	readonly m_bModelFromRenderer: boolean
	readonly m_bProportional: boolean
	readonly m_flRemapTime: number
}

interface C_INIT_RemapParticleCountToScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nInputMin: number
	readonly m_nInputMax: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bActiveRange: boolean
	readonly m_bInvert: boolean
	readonly m_bWrap: boolean
	readonly m_flRemapBias: number
}

interface VMapResourceData_t {
	readonly type_name: string
}

interface FeCtrlSoftOffset_t {
	readonly type_name: string
	readonly nCtrlParent: number
	readonly nCtrlChild: number
	readonly vOffset: Vector
	readonly flAlpha: number
}

interface IBotController {
	readonly type_name: string
}

interface vehicle_controlparams_t {
	readonly type_name: string
	readonly throttle: number
	readonly steering: number
	readonly brake: number
	readonly boost: number
	readonly handbrake: boolean
	readonly handbrakeLeft: boolean
	readonly handbrakeRight: boolean
	readonly brakepedal: boolean
	readonly bHasBrakePedal: boolean
	readonly bAnalogSteering: boolean
}

interface C_OP_SetControlPointToHand extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCP1: number
	readonly m_nHand: number
	readonly m_vecCP1Pos: Vector
	readonly m_bOrientToHand: boolean
}

interface VSoundEventScript_t {
	readonly type_name: string
}

interface MorphRectData_t {
	readonly type_name: string
	readonly m_nXLeftDst: number
	readonly m_nYTopDst: number
	readonly m_flUWidthSrc: number
	readonly m_flVHeightSrc: number
}

interface InfoForResourceTypeProcessingGraph_t {
	readonly type_name: string
}

interface SchemaEnumeratorInfoData_t {
	readonly type_name: string
	readonly m_nValue: number
	readonly m_Metadata: SchemaMetadataSetData_t
}

interface DamageShareEvent_t {
	readonly type_name: string
	readonly m_flOriginalDamage: number
	readonly m_flTakenDamage: number
	readonly m_nPlayerID: number
}

interface CSimpleSimTimer {
	readonly type_name: string
	readonly m_next: number
}

interface C_INIT_RandomYawFlip extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flPercent: number
}

interface C_OP_RenderCables extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flTextureSize: number
	readonly m_nMinTesselation: number
	readonly m_nMaxTesselation: number
	readonly m_flTessScale: number
	readonly m_flTextureScrollRate: number
	readonly m_flNormalMapScrollRate: number
}

interface C_INIT_Orient2DRelToCP extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flRotOffset: number
}

interface InfoForResourceTypeCLightTree {
	readonly type_name: string
}

interface C_GameRules {
	readonly type_name: string
}

interface EventClientPostSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface InfoForResourceTypeCTextureBase {
	readonly type_name: string
}

interface PostProcessingTonemapParameters_t {
	readonly type_name: string
	readonly m_flExposureBias: number
	readonly m_flShoulderStrength: number
	readonly m_flLinearStrength: number
	readonly m_flLinearAngle: number
	readonly m_flToeStrength: number
	readonly m_flToeNum: number
	readonly m_flToeDenom: number
	readonly m_flWhitePoint: number
}

interface FlexController_t {
	readonly type_name: string
	readonly localToGlobal: number
	readonly min: number
	readonly max: number
}

interface ModelBoneFlexDriverControl_t {
	readonly type_name: string
	readonly m_nBoneComponent: number
	readonly m_flexControllerToken: number
	readonly m_flMin: number
	readonly m_flMax: number
}

interface FeNodeBase_t {
	readonly type_name: string
	readonly nNode: number
	readonly nDummy: number[]
	readonly nNodeX0: number
	readonly nNodeX1: number
	readonly nNodeY0: number
	readonly nNodeY1: number
}

interface IRagdoll {
	readonly type_name: string
}

interface C_OP_CycleScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flStartValue: number
	readonly m_flEndValue: number
	readonly m_flCycleTime: number
	readonly m_bDoNotRepeatCycle: boolean
	readonly m_bSynchronizeParticles: boolean
	readonly m_nCPScale: number
	readonly m_nCPFieldMin: number
	readonly m_nCPFieldMax: number
}

interface C_OP_SetCPOrientationToGroundNormal extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInterpRate: number
	readonly m_flMaxTraceLength: number
	readonly m_flTolerance: number
	readonly m_flTraceOffset: number
	readonly m_CollisionGroupName: string[]
	readonly m_nInputCP: number
	readonly m_nOutputCP: number
	readonly m_bIncludeWater: boolean
}

interface C_OP_SequenceFromModel extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
}

interface CBasePathAnimMotor extends CBaseAnimMotor {
	readonly type_name: string
	readonly m_bLockToPath: boolean
}

interface CResponseCriteriaSet {
	readonly type_name: string
	readonly m_nNumPrefixedContexts: number
	readonly m_bOverrideOnAppend: boolean
}

interface IParticleEffect {
	readonly type_name: string
}

interface C_OP_RemapCPVisibilityToVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bScaleInitialRange: boolean
	readonly m_nControlPoint: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_flRadius: number
}

interface C_OP_RemapCPOrientationToYaw extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flRotOffset: number
	readonly m_flSpinStrength: number
}

interface C_INIT_RemapParticleCountToNamedModelElementScalar extends C_INIT_RemapParticleCountToScalar {
	readonly type_name: string
	readonly m_outputMinName: string
	readonly m_outputMaxName: string
	readonly m_bModelFromRenderer: boolean
}

interface CCycleControlAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_param: AnimParamID
}

interface C_DOTA_Modifier_Lua extends CDOTA_Buff {
	readonly type_name: string
}

interface sAcquireHistory {
	readonly type_name: string
	readonly m_nAbilityID: number
	readonly m_nLevel: number
	readonly m_nGold: number
	readonly m_nNetWorth: number
	readonly m_bCombinedItem: number
	readonly m_fGameTime: number
	readonly m_vecItemList: number[]
	readonly m_vecTalentSkilledList: number[]
}

interface sBounceInfo {
	readonly type_name: string
	readonly iAttackIndex: number
	readonly iBounceCount: number
	readonly hAlreadyHitList: C_BaseEntity[]
}

interface AnimStateID {
	readonly type_name: string
	readonly m_id: number
}

interface VBitmapFontDiskData_t {
	readonly type_name: string
}

interface FeAxialEdgeBend_t {
	readonly type_name: string
	readonly te: number
	readonly tv: number
	readonly flDist: number
	readonly flWeight: number[]
	readonly nNode: number[]
}

interface CProjectedTextureBase {
	readonly type_name: string
	readonly m_hTargetEntity: C_BaseEntity
	readonly m_bState: boolean
	readonly m_bAlwaysUpdate: boolean
	readonly m_flLightFOV: number
	readonly m_bEnableShadows: boolean
	readonly m_bSimpleProjection: boolean
	readonly m_bLightOnlyTarget: boolean
	readonly m_bLightWorld: boolean
	readonly m_bCameraSpace: boolean
	readonly m_flBrightnessScale: number
	readonly m_LightColor: Color
	readonly m_flIntensity: number
	readonly m_flLinearAttenuation: number
	readonly m_flQuadraticAttenuation: number
	readonly m_bVolumetric: boolean
	readonly m_flVolumetricIntensity: number
	readonly m_flNoiseStrength: number
	readonly m_flFlashlightTime: number
	readonly m_nNumPlanes: number
	readonly m_flPlaneOffset: number
	readonly m_flColorTransitionTime: number
	readonly m_flAmbient: number
	readonly m_SpotlightTextureName: string[]
	readonly m_nSpotlightTextureFrame: number
	readonly m_nShadowQuality: number
	readonly m_flNearZ: number
	readonly m_flFarZ: number
	readonly m_flProjectionSize: number
	readonly m_flRotation: number
	readonly m_bFlipHorizontal: boolean
}

interface C_OP_RemapCPtoCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nInputControlPoint: number
	readonly m_nOutputControlPoint: number
	readonly m_nInputField: number
	readonly m_nOutputField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_OP_LerpScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOutput: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
}

interface AnimResourceAnimEvent_t {
	readonly type_name: string
	readonly m_nFrame: number
	readonly m_flCycle: number
}

interface FlexRule_t {
	readonly type_name: string
	readonly m_nFlex: number
}

interface FourQuaternions {
	readonly type_name: string
}

interface VSoundStackScript_t {
	readonly type_name: string
}

interface CSkeletalInputAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_hand: number
	readonly m_motionRange: number
	readonly m_bAdditive: boolean
	readonly m_boneMap: CBonePair[]
}

interface SkeletonBoneBbox_t {
	readonly type_name: string
	readonly m_vecCenter: Vector
	readonly m_pad0: number
	readonly m_vecSize: Vector
	readonly m_pad1: number
}

interface RenderInputLayoutField_t {
	readonly type_name: string
	readonly m_pSemanticName: number[]
	readonly m_nSemanticIndex: number
	readonly m_Format: number
	readonly m_nOffset: number
	readonly m_nSlot: number
	readonly m_nSlotType: number
	readonly m_nInstanceStepRate: number
}

interface CAttributeManager {
	readonly type_name: string
	readonly m_Providers: C_BaseEntity[]
	readonly m_Receivers: C_BaseEntity[]
	readonly m_iReapplyProvisionParity: number
	readonly m_hOuter: C_BaseEntity
	readonly m_bPreventLoopback: boolean
	readonly m_ProviderType: number
}

interface Extent {
	readonly type_name: string
	readonly lo: Vector
	readonly hi: Vector
}

interface InfoForResourceTypeMorphSetData_t {
	readonly type_name: string
}

interface sControlGroupElem {
	readonly type_name: string
	readonly m_UnitName: string[]
	readonly m_UnitLabel: string[]
	readonly m_unUnitLabelIndex: number
	readonly m_hEntity: C_BaseEntity
	readonly m_bIsIllusion: boolean
	readonly m_IllusionLabel: string[]
}

interface C_INIT_GlobalScale extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_nScaleControlPointNumber: number
	readonly m_nControlPointNumber: number
	readonly m_bScaleRadius: boolean
	readonly m_bScalePosition: boolean
	readonly m_bScaleVelocity: boolean
}

interface AABB_t {
	readonly type_name: string
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
}

interface CDOTA_ItemStockInfo {
	readonly type_name: string
	readonly iTeamNumber: number
	readonly nItemAbilityID: number
	readonly fStockDuration: number
	readonly fStockTime: number
	readonly iStockCount: number
	readonly iMaxCount: number
	readonly fInitialStockDuration: number
	readonly iPlayerNumber: number
}

interface C_INIT_RandomVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecMin: Vector
	readonly m_vecMax: Vector
}

interface AnimationDecodeDebugDumpElement_t {
	readonly type_name: string
	readonly m_nEntityIndex: number
	readonly m_modelName: string
	readonly m_poseParams: string[]
	readonly m_decodeOps: string[]
	readonly m_internalOps: string[]
	readonly m_decodedAnims: string[]
}

interface C_OP_MovementPlaceOnGround extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOffset: number
	readonly m_flMaxTraceLength: number
	readonly m_flTolerance: number
	readonly m_flTraceOffset: number
	readonly m_flLerpRate: number
	readonly m_CollisionGroupName: string[]
	readonly m_nRefCP1: number
	readonly m_nRefCP2: number
	readonly m_nLerpCP: number
	readonly m_bKill: boolean
	readonly m_bIncludeWater: boolean
	readonly m_bSetNormal: boolean
	readonly m_bScaleOffset: boolean
}

interface CSSDSMsg_LayerBase {
	readonly type_name: string
	readonly m_viewId: SceneViewId_t
	readonly m_ViewName: string
	readonly m_nLayerIndex: number
	readonly m_nLayerId: number
	readonly m_LayerName: string
	readonly m_displayText: string
}

interface CSosGroupActionSchema {
	readonly type_name: string
	readonly m_name: string
	readonly m_actionType: number
	readonly m_actionInstanceType: number
}

interface MaterialResourceData_t {
	readonly type_name: string
stringstring}

interface CNetworkedSequenceOperation {
	readonly type_name: string
	readonly m_flPrevCycle: number
	readonly m_flCycle: number
	readonly m_bSequenceChangeNetworked: boolean
	readonly m_bDiscontinuity: boolean
	readonly m_flPrevCycleFromDiscontinuity: number
	readonly m_flPrevCycleForAnimEventDetection: number
}

interface C_OP_ConstrainDistance extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_fMinDistance: number
	readonly m_fMaxDistance: number
	readonly m_nControlPointNumber: number
	readonly m_nScaleCP: number
	readonly m_CenterOffset: Vector
	readonly m_bGlobalCenter: boolean
}

interface BaseSceneObjectOverride_t {
	readonly type_name: string
	readonly m_nSceneObjectIndex: number
}

interface TextureDesc_t {
	readonly type_name: string
	readonly m_nWidth: number
	readonly m_nHeight: number
	readonly m_nDepth: number
	readonly m_nImageFormat: number
	readonly m_nNumMipLevels: number
	readonly m_nPicmip0Res: number
}

interface CDOTAGameManager {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_pkvHeroes: KeyValues
	readonly m_pkvUnits: KeyValues
	readonly m_pkvAbilities: KeyValues
	readonly m_bCustomGame: boolean
	readonly m_bEventGame: boolean
	readonly m_szAddOnGame: string[]
	readonly m_szAddOnMap: string[]
	readonly m_pkvAddOnHeroes: KeyValues
	readonly m_pkvAddOnUnits: KeyValues
	readonly m_pkvAddOnAbilities: KeyValues
	readonly m_pTutorialLessonKeyValues: KeyValues
	readonly m_pTutorialTipKeyValues: KeyValues
	readonly m_pDivisionKeyValues: KeyValues
	readonly m_pMatchGroupsKeyValues: KeyValues
	readonly m_pEmoticonsKeyValues: KeyValues
	readonly m_pPortraitsLightPreselects: KeyValues
	readonly m_pAnimationStatues: KeyValues
	readonly m_pAddonInfoKeyValues: KeyValues
	readonly m_pBotScriptsDedicatedServer: KeyValues
	readonly m_pkvWardPlacementLocations: KeyValues
	readonly m_pRegionKeyValues: KeyValues
	readonly m_pCountryKeyValues: KeyValues
	readonly m_pSurveyQuestionData: KeyValues
	readonly m_nNumLoadingPlayers: number
	readonly m_iDefeatedParticle: number
	readonly m_StableHeroAvailable: boolean[]
	readonly m_CurrentHeroAvailable: boolean[]
	readonly m_CulledHeroes: boolean[]
	readonly m_BonusHeroes: boolean[]
}

interface C_OP_Noise extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bAdditive: boolean
	readonly m_flNoiseAnimationTimeScale: number
}

interface C_INIT_NormalOffset extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_OffsetMin: Vector
	readonly m_OffsetMax: Vector
	readonly m_nControlPointNumber: number
	readonly m_bLocalCoords: boolean
	readonly m_bNormalize: boolean
}

interface CSosGroupActionLimitSchema extends CSosGroupActionSchema {
	readonly type_name: string
	readonly m_nMaxCount: number
	readonly m_nStopType: number
	readonly m_nSortType: number
}

interface FeWeightedNode_t {
	readonly type_name: string
	readonly nNode: number
	readonly nWeight: number
}

interface SchemaMetaModifyAdd_t {
	readonly type_name: string
	readonly m_pTagValue: void
}

interface CNetworkTransmitComponent {
	readonly type_name: string
	readonly m_nTransmitStateOwnedCounter: number
}

interface C_OP_MovementRigidAttachToCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleCPField: number
	readonly m_bOffsetLocal: boolean
}

interface LightTreeResourceData_t {
	readonly type_name: string
}

interface RnTriangle_t {
	readonly type_name: string
	readonly m_nIndex: number[]
}

interface C_OP_RemapScalarOnceTimed extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bProportional: boolean
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flRemapTime: number
}

interface C_OP_InstantaneousEmitter extends CParticleFunctionEmitter {
	readonly type_name: string
	readonly m_nParticlesToEmit: number
	readonly m_nMinParticlesToEmit: number
	readonly m_flStartTime: number
	readonly m_flStartTimeMax: number
	readonly m_flInitFromKilledParentParticles: number
	readonly m_nMaxEmittedPerFrame: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_nSnapshotControlPoint: number
}

interface C_INIT_MakeShapes extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flMinSize: number
	readonly m_flMaxSize: number
}

interface PerInstanceBakedLightingParamsOverride_t extends BaseSceneObjectOverride_t {
	readonly type_name: string
	readonly m_nSubSceneObject: number
	readonly m_nDrawCallIndex: number
	readonly m_bHasBakedLightingFromVertexStream: boolean
	readonly m_bHasBakedLightingFromLightmap: boolean
	readonly m_bHasBakedLightingBasisInVertex: boolean
	readonly m_bHasPerInstanceBakedLightingData: boolean
	readonly m_nPerVertexLightingOffsetInVertices: number
}

interface CIntAnimParameter extends CAnimParameterBase {
	readonly type_name: string
	readonly m_defaultValue: number
	readonly m_minValue: number
	readonly m_maxValue: number
}

interface C_OP_RadiusDecay extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flMinRadius: number
}

interface C_INIT_RemapNamedModelElementToScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_names: string[]
	readonly m_values: float32[]
	readonly m_bScaleInitialRange: boolean
	readonly m_bModelFromRenderer: boolean
}

interface CDirectPlaybackAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_bFinishEarly: boolean
	readonly m_bResetOnFinish: boolean
}

interface FeAnimStrayRadius_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly flMaxDist: number
	readonly flRelaxationFactor: number
}

interface CRMSG_Manifest_Event {
	readonly type_name: string
	readonly m_nManifestIndex: number
	readonly m_nEvent: number
	readonly m_nSubEvent: number
	readonly m_nTimeUS: number
}

interface C_MultiplayRules extends C_GameRules {
	readonly type_name: string
}

interface ModelReference_t {
	readonly type_name: string
	readonly m_flRelativeProbabilityOfSpawn: number
}

interface C_OP_LockToPointList extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bPlaceAlongPath: boolean
	readonly m_bClosedLoop: boolean
	readonly m_nNumPointsAlongPath: number
}

interface RnCapsuleDesc_t extends RnShapeDesc_t {
	readonly type_name: string
	readonly m_Capsule: RnCapsule_t
}

interface CAnimGraphDebugReplay {
	readonly type_name: string
	readonly m_startIndex: number
	readonly m_writeIndex: number
	readonly m_frameCount: number
}

interface InfoForResourceTypeWorldEnvironmentMaps_t {
	readonly type_name: string
}

interface C_fogplayerparams_t {
	readonly type_name: string
	readonly m_hCtrl: C_BaseEntity
	readonly m_flTransitionTime: number
	readonly m_OldColor: Color
	readonly m_flOldStart: number
	readonly m_flOldEnd: number
	readonly m_flOldMaxDensity: number
	readonly m_flOldHDRColorScale: number
	readonly m_flOldFarZ: number
	readonly m_NewColor: Color
	readonly m_flNewStart: number
	readonly m_flNewEnd: number
	readonly m_flNewMaxDensity: number
	readonly m_flNewHDRColorScale: number
	readonly m_flNewFarZ: number
}

interface CreatureStateData_t {
	readonly type_name: string
	readonly pszName: string
	readonly flAggression: number
	readonly flAvoidance: number
	readonly flSupport: number
	readonly flRoamDistance: number
}

interface CAnimTagBase {
	readonly type_name: string
	readonly m_name: string
	readonly m_tagID: AnimTagID
}

interface InfoForResourceTypeCDOTAPatchNotesList {
	readonly type_name: string
}

interface C_OP_SetRandomControlPointPosition extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_bUseWorldLocation: boolean
	readonly m_bOrient: boolean
	readonly m_nCP1: number
	readonly m_nHeadLocation: number
	readonly m_flReRandomRate: number
	readonly m_vecCPMinPos: Vector
	readonly m_vecCPMaxPos: Vector
}

interface ParticlePreviewBodyGroup_t {
	readonly type_name: string
	readonly m_bodyGroupName: string
	readonly m_nValue: number
}

interface C_OP_RenderSound extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flDurationScale: number
	readonly m_flSndLvlScale: number
	readonly m_flPitchScale: number
	readonly m_flVolumeScale: number
	readonly m_nChannel: number
	readonly m_nCPReference: number
	readonly m_pszSoundName: string[]
}

interface C_OP_RemapCPtoVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_nLocalSpaceCP: number
	readonly m_vInputMin: Vector
	readonly m_vInputMax: Vector
	readonly m_vOutputMin: Vector
	readonly m_vOutputMax: Vector
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_flInterpRate: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bOffset: boolean
	readonly m_bAccelerate: boolean
}

interface C_OP_RemapScalarEndCap extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_INIT_RtEnvCull extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecTestDir: Vector
	readonly m_vecTestNormal: Vector
	readonly m_bUseVelocity: boolean
	readonly m_bCullOnMiss: boolean
	readonly m_bLifeAdjust: boolean
	readonly m_RtEnvName: string[]
}

interface FeWorldCollisionParams_t {
	readonly type_name: string
	readonly flWorldFriction: number
	readonly flGroundFriction: number
	readonly nListBegin: number
	readonly nListEnd: number
}

interface CParticleFloatInput {
	readonly type_name: string
	readonly m_nType: number
	readonly m_nMapType: number
	readonly m_flLiteralValue: number
	readonly m_nControlPoint: number
	readonly m_nVectorComponent: number
	readonly m_flMultFactor: number
	readonly m_flInput0: number
	readonly m_flInput1: number
	readonly m_flOutput0: number
	readonly m_flOutput1: number
	readonly m_Curve: CPiecewiseCurveSchemaWrapper
}

interface CBaseRendererSource2 extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flAnimationRate: number
	readonly m_bFitCycleToLifetime: boolean
	readonly m_bAnimateInFPS: boolean
	readonly m_bPerVertexLighting: boolean
	readonly m_flSelfIllumAmount: number
	readonly m_flDiffuseAmount: number
	readonly m_flSourceAlphaValueToMapToZero: number
	readonly m_flSourceAlphaValueToMapToOne: number
	readonly m_bGammaCorrectVertexColors: boolean
	readonly m_bSaturateColorPreAlphaBlend: boolean
	readonly m_nSequenceCombineMode: number
	readonly m_flAnimationRate2: number
	readonly m_flSequence0RGBWeight: number
	readonly m_flSequence0AlphaWeight: number
	readonly m_flSequence1RGBWeight: number
	readonly m_flSequence1AlphaWeight: number
	readonly m_flAddSelfAmount: number
	readonly m_bAdditive: boolean
	readonly m_bMod2X: boolean
	readonly m_bLightenMode: boolean
	readonly m_bMaxLuminanceBlendingSequence0: boolean
	readonly m_bMaxLuminanceBlendingSequence1: boolean
	readonly m_bRefract: boolean
	readonly m_flRefractAmount: number
	readonly m_nRefractBlurRadius: number
	readonly m_nRefractBlurType: number
	readonly m_stencilTestID: string[]
	readonly m_stencilWriteID: string[]
	readonly m_bWriteStencilOnDepthPass: boolean
	readonly m_bWriteStencilOnDepthFail: boolean
	readonly m_bReverseZBuffering: boolean
	readonly m_bDisableZBuffering: boolean
	readonly m_bParticleFeathering: boolean
	readonly m_flFeatheringMinDist: number
	readonly m_flFeatheringMaxDist: number
	readonly m_flOverbrightFactor: number
	readonly m_bTintByFOW: boolean
	readonly m_bFogParticles: boolean
	readonly m_bTintByGlobalLight: boolean
	readonly m_bMotionVectors: boolean
	readonly m_bBlendFramesSeq0: boolean
	readonly m_nFirstSequenceOffsetForRightEye: number
	readonly m_nHSVShiftControlPoint: number
}

interface EventClientAdvanceTick_t extends EventAdvanceTick_t {
	readonly type_name: string
}

interface FeBandBendLimit_t {
	readonly type_name: string
	readonly flDistMin: number
	readonly flDistMax: number
	readonly nNode: number[]
}

interface C_OP_SpinYaw extends CGeneralSpin {
	readonly type_name: string
}

interface MaterialOverride_t extends BaseSceneObjectOverride_t {
	readonly type_name: string
	readonly m_nSubSceneObject: number
	readonly m_nDrawCallIndex: number
}

interface SheetFrameImage_t {
	readonly type_name: string
	readonly uvCropped: Vector2D[]
	readonly uvUncropped: Vector2D[]
}

interface MaterialParam_t {
	readonly type_name: string
string}

interface OnDiskBufferData_t {
	readonly type_name: string
	readonly m_nElementCount: number
	readonly m_nElementSizeInBytes: number
}

interface InfoForResourceTypeCResourceManifestInternal {
	readonly type_name: string
}

interface C_OP_ClothMovement extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Gravity: Vector
	readonly m_fDrag: number
	readonly m_bTriangulate: boolean
	readonly m_bConstraints: boolean
	readonly m_flAddCurvature: number
	readonly m_flAddSlack: number
	readonly m_flAddNoise: number
	readonly m_nMaxConstraintPasses: number
	readonly m_bLockULCorner: boolean
	readonly m_bLockURCorner: boolean
	readonly m_bLockLLCorner: boolean
	readonly m_bLockLRCorner: boolean
	readonly m_bLockURow: boolean
	readonly m_bLockLRow: boolean
	readonly m_bLockLColumn: boolean
	readonly m_bLockRColumn: boolean
	readonly m_nIterations: number
}

interface C_OP_RemapVectortoCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nOutControlPointNumber: number
	readonly m_nParticleNumber: number
}

interface C_OP_RemapVisibilityScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flRadiusScale: number
}

interface WorldEnvironmentMaps_t {
	readonly type_name: string
}

interface Sheet_t {
	readonly type_name: string
}

interface C_OP_OscillateVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_RateMin: Vector
	readonly m_RateMax: Vector
	readonly m_FrequencyMin: Vector
	readonly m_FrequencyMax: Vector
	readonly m_bProportional: boolean
	readonly m_bProportionalOp: boolean
	readonly m_bOffset: boolean
	readonly m_flStartTime_min: number
	readonly m_flStartTime_max: number
	readonly m_flEndTime_min: number
	readonly m_flEndTime_max: number
	readonly m_flOscMult: number
	readonly m_flOscAdd: number
}

interface CViewAngleKeyFrame {
	readonly type_name: string
	readonly m_vecAngles: QAngle
	readonly m_flTime: number
	readonly m_iFlags: number
}

interface CDOTA_Modifier_Lua extends CDOTA_Buff {
	readonly type_name: string
}

interface C_OP_EndCapTimedDecay extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flDecayTime: number
}

interface CFollowAttachmentAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_boneName: string
	readonly m_attachmentName: string
	readonly m_bMatchTranslation: boolean
	readonly m_bMatchRotation: boolean
}

interface CRootAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
}

interface C_TeamplayRules extends C_MultiplayRules {
	readonly type_name: string
}

interface C_OP_RenderScreenShake extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flDurationScale: number
	readonly m_flRadiusScale: number
	readonly m_flFrequencyScale: number
	readonly m_flAmplitudeScale: number
	readonly m_nFilterCP: number
}

interface C_DOTASpectatorGraphManager {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_nPlayerDataCount: number
	readonly m_SendTeamStatsTimer: CountdownTimer
	readonly m_bTrackingTeamStats: boolean
	readonly m_flStartTime: number
	readonly m_nNextUpdatePlayer: number
	readonly m_rgPlayerGraphData: C_BaseEntity[]
	readonly m_rgRadiantTotalEarnedGold: number[]
	readonly m_rgDireTotalEarnedGold: number[]
	readonly m_rgRadiantTotalEarnedXP: number[]
	readonly m_rgDireTotalEarnedXP: number[]
	readonly m_rgRadiantNetWorth: number[]
	readonly m_rgDireNetWorth: number[]
	readonly m_flTotalEarnedGoldStartTime: number
	readonly m_flTotalEarnedGoldEndTime: number
	readonly m_nGoldGraphVersion: number
	readonly m_rgRadiantWinChance: number[]
	readonly m_TeamStatsUpdateTimer: CountdownTimer
	readonly m_HeroInventorySnapshotTimer: CountdownTimer
	readonly m_vecPlayerSnapshots: sPlayerSnapshot[]
	readonly m_unDataChangedCount: number
}

interface magnetted_objects_t {
	readonly type_name: string
	readonly hEntity: C_BaseEntity
}

interface CHorizontalMotionController {
	readonly type_name: string
}

interface SeqResourceBoneMaskList_t {
	readonly type_name: string
string}

interface PostProcessingVignetteParameters_t {
	readonly type_name: string
	readonly m_flVignetteStrength: number
	readonly m_vCenter: Vector2D
	readonly m_flRadius: number
	readonly m_flRoundness: number
	readonly m_flFeather: number
	readonly m_vColorTint: Vector
}

interface CDOTAMusicProbabilityEntry {
	readonly type_name: string
	readonly m_flProbabilityElements: float32[]
	readonly m_flProbability: number
}

interface CNetworkVelocityVector {
	readonly type_name: string
}

interface C_OP_DifferencePreviousParticle extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bActiveRange: boolean
	readonly m_bSetPreviousParticle: boolean
}

interface CPathStatusCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_optionToCheck: number
	readonly m_bComparisonValue: boolean
}

interface CBaseConstraint extends CBoneConstraintBase {
	readonly type_name: string
	readonly m_name: string
	readonly m_vUpVector: Vector
	readonly m_slaves: CConstraintSlave[]
	readonly m_targets: CConstraintTarget[]
}

interface BaseConstraint_t {
	readonly type_name: string
	readonly m_nConstraintType: number
	readonly m_vUpVector: Vector
	readonly m_nTargetUpBoneHash: number
	readonly m_nUpType: number
	readonly m_bInverse: boolean
}

interface CNavVolumeVector extends CNavVolume {
	readonly type_name: string
	readonly m_bHasBeenPreFiltered: boolean
}

interface DOTAAbilityData_t {
	readonly type_name: string
	readonly m_pszAbilityName: string
	readonly m_pszTextureName: string
	readonly m_pszSharedCooldownName: string
	readonly m_pszKeyOverride: string
	readonly m_pszItemRecipeName: string
	readonly m_pszLinkedAbility: string
	readonly m_pKVData: KeyValues
	readonly m_iAbilityID: number
	readonly m_iAbilityType: number
	readonly m_iAbilityBehavior: number
	readonly m_iAbilityTargetTeam: number
	readonly m_iAbilityTargetType: number
	readonly m_iAbilityTargetFlags: number
	readonly m_iAbilityDamageType: number
	readonly m_iAbilityImmunityType: number
	readonly m_iAbilityDispellableType: number
	readonly m_iFightRecapLevel: number
	readonly m_iAssociatedConsumableItemDef: number
	readonly m_iAssociatedEventID: number
	readonly m_iMaxLevel: number
	readonly m_iItemBaseLevel: number
	readonly m_iItemCost: number
	readonly m_iItemInitialstringges: number
	readonly m_iItemStockMax: number
	readonly m_fItemStockTime: number
	readonly m_pItemShopTagKeys: number
	readonly m_nRecipeResultAbilityID: number
	readonly m_vecItemCombinesInto: number[]
	readonly m_ItemQuality: number
	readonly m_flModifierValue: number
	readonly m_flModifierValueBonus: number
	readonly m_InvalidHeroes: string[]
	readonly m_bHasScepterUpgrade: boolean
	readonly m_nCastRangeBuffer: number
	readonly m_nSpecialAbilities: number
	readonly m_pSpecialAbilities: DOTASpecialAbility_t
	readonly m_pModelName: string
	readonly m_pModelAlternateName: string
	readonly m_pEffectName: string
	readonly m_pPingOverrideText: string
	readonly m_pszRequiredCustomShopName: string
	readonly m_iLevelsBetweenUpgrades: number
	readonly m_iRequiredLevel: number
	readonly m_fAnimationPlaybackRate: number
	readonly m_bIsItem: boolean
	readonly m_bItemIsRecipe: boolean
	readonly m_bItemIsRecipeGenerated: boolean
	readonly m_bItemRequiresSecretShop: boolean
	readonly m_bItemAvailableAtGlobalShop: boolean
	readonly m_bItemAvailableAtSideShop: boolean
	readonly m_bItemAvailableAtCustomShop: boolean
	readonly m_bItemIsPureSupport: boolean
	readonly m_bItemIsPurchasable: boolean
	readonly m_bItemStackable: boolean
	readonly m_bDisplayAdditionalHeroes: boolean
	readonly m_bItemContributesToNetWorthWhenDropped: boolean
	readonly m_bOnCastbar: boolean
	readonly m_bOnLearnbar: boolean
	readonly m_bIsGrantedByScepter: boolean
	readonly m_bIsCastableWhileHidden: boolean
	readonly m_bAnimationIgnoresModelScale: boolean
	readonly m_bIsPlayerSpecificCooldown: boolean
	readonly m_bIsAllowedInBackpack: boolean
	readonly m_bIsObsolete: boolean
	readonly m_bItemRequiresCustomShop: boolean
	readonly m_bShouldBeSuggested: boolean
	readonly m_bShouldBeInitiallySuggested: boolean
}

interface CSpeechBubbleInfo {
	readonly type_name: string
	readonly m_LocalizationStr: string[]
	readonly m_hNPC: C_BaseEntity
	readonly m_flDuration: number
	readonly m_unOffsetX: number
	readonly m_unOffsetY: number
	readonly m_unCount: number
}

interface C_OP_ModelCull extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_bBoundBox: boolean
	readonly m_bCullOutside: boolean
	readonly m_bUseBones: boolean
	readonly m_HitboxSetName: string[]
}

interface CPathParameters {
	readonly type_name: string
	readonly m_nStartControlPointNumber: number
	readonly m_nEndControlPointNumber: number
	readonly m_nBulgeControl: number
	readonly m_flBulge: number
	readonly m_flMidPoint: number
	readonly m_vStartPointOffset: Vector
	readonly m_vMidPointOffset: Vector
	readonly m_vEndOffset: Vector
}

interface CEmptyEntityInstance {
	readonly type_name: string
}

interface CAttachment {
	readonly type_name: string
	readonly m_name: string
	readonly m_influenceNames: string[]
	readonly m_vInfluenceOffsets: Vector[]
	readonly m_influenceWeights: number[]
	readonly m_bInfluenceRootTransform: boolean[]
	readonly m_nInfluences: number
}

interface CNavVolumeSphere extends CNavVolume {
	readonly type_name: string
	readonly m_vCenter: Vector
	readonly m_flRadius: number
}

interface ResponseParams {
	readonly type_name: string
	readonly odds: number
	readonly flags: number
	readonly soundlevel: number
	readonly m_pFollowup: ResponseFollowup
}

interface C_OP_SetControlPointFieldToWater extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nSourceCP: number
	readonly m_nDestCP: number
	readonly m_nCPField: number
}

interface C_INIT_PositionOffset extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_OffsetMin: Vector
	readonly m_OffsetMax: Vector
	readonly m_nControlPointNumber: number
	readonly m_bLocalCoords: boolean
	readonly m_bProportional: boolean
}

interface CPhysSurfacePropertiesPhysics {
	readonly type_name: string
	readonly m_friction: number
	readonly m_elasticity: number
	readonly m_density: number
	readonly m_thickness: number
	readonly m_dampening: number
}

interface EventClientPostOutput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRenderTime: number
	readonly m_flRenderFrameTime: number
	readonly m_flRenderFrameTimeUnbounded: number
}

interface SchemaBaseClassInfoData_t {
	readonly type_name: string
	readonly m_nOffset: number
	readonly m_pClass: CSchemaClassInfo
}

interface NianDamageTaken_t {
	readonly type_name: string
	readonly nDamage: number
	readonly nPlayerID: number
	readonly vPos: Vector
}

interface C_INIT_CreateSpiralSphere extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nOverrideCP: number
	readonly m_nDensity: number
	readonly m_flInitialRadius: number
	readonly m_flInitialSpeedMin: number
	readonly m_flInitialSpeedMax: number
	readonly m_bUseParticleCount: boolean
}

interface RnMesh_t {
	readonly type_name: string
	readonly m_vMin: Vector
	readonly m_vMax: Vector
	readonly m_vOrthographicAreas: Vector
}

interface CAimConstraint extends CBaseConstraint {
	readonly type_name: string
	readonly m_nUpType: number
}

interface FeNodeIntegrator_t {
	readonly type_name: string
	readonly flPointDamping: number
	readonly flAnimationForceAttraction: number
	readonly flAnimationVertexAttraction: number
	readonly flGravity: number
}

interface InGamePredictionData_t {
	readonly type_name: string
	readonly m_nID: number
	readonly m_nValue: number
	readonly m_nRawValue: number
	readonly m_nValueState: number
	readonly m_bValueIsMask: boolean
}

interface sGlaiveInfo {
	readonly type_name: string
	readonly iAttackIndex: number
	readonly iBounceCount: number
	readonly hAlreadyHitList: C_BaseEntity[]
}

interface CParticleFunctionForce extends CParticleFunction {
	readonly type_name: string
}

interface C_INIT_InitialVelocityNoise extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecAbsVal: Vector
	readonly m_vecAbsValInv: Vector
	readonly m_vecOffsetLoc: Vector
	readonly m_flOffset: number
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_flNoiseScale: number
	readonly m_flNoiseScaleLoc: number
	readonly m_nControlPointNumber: number
	readonly m_bLocalSpace: boolean
	readonly m_bIgnoreDt: boolean
}

interface FlexOp_t {
	readonly type_name: string
	readonly m_OpCode: number
	readonly m_Data: number
}

interface IntervalTimer {
	readonly type_name: string
	readonly m_timestamp: number
}

interface ControlPointReference_t {
	readonly type_name: string
	readonly m_controlPointNameString: number
	readonly m_vOffsetFromControlPoint: Vector
	readonly m_bOffsetInLocalSpace: boolean
}

interface C_OP_RestartAfterDuration extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flDurationMin: number
	readonly m_flDurationMax: number
	readonly m_nCP: number
	readonly m_nCPField: number
	readonly m_nChildGroupID: number
	readonly m_bOnlyChildren: boolean
}

interface CSpinUpdateBase extends CParticleFunctionOperator {
	readonly type_name: string
}

interface CBlendCurve {
	readonly type_name: string
	readonly m_vControlPoint1: Vector2D
	readonly m_vControlPoint2: Vector2D
}

interface CovMatrix3 {
	readonly type_name: string
	readonly m_vDiag: Vector
	readonly m_flXY: number
	readonly m_flXZ: number
	readonly m_flYZ: number
}

interface FeFollowNode_t {
	readonly type_name: string
	readonly nParentNode: number
	readonly nChildNode: number
	readonly flWeight: number
}

interface HandInfo_t {
	readonly type_name: string
	readonly m_vPosition: Vector
	readonly m_Angles: QAngle
	readonly m_vFilteredPosition: Vector
	readonly m_FilteredAngles: QAngle
	readonly m_vFilteredVelocity: Vector
	readonly m_FilteredAngularVel: Vector
	readonly m_flTriggerAnalogValue: number
	readonly m_flGripAnalogValue: number
	readonly m_flFinger0: number
	readonly m_flFinger1: number
	readonly m_flFinger2: number
	readonly m_flFinger3: number
	readonly m_flFinger4: number
	readonly m_flTrackpadAnalogValueX: number
	readonly m_flTrackpadAnalogValueY: number
	readonly m_flJoystickAnalogValueX: number
	readonly m_flJoystickAnalogValueY: number
}

interface INextBotComponent extends INextBotEventResponder {
	readonly type_name: string
	readonly m_lastUpdateTime: number
	readonly m_curInterval: number
}

interface IPlayerInfo {
	readonly type_name: string
}

interface CreatureAbilityData_t {
	readonly type_name: string
	readonly hAbility: C_BaseEntity
	readonly bIsDamage: boolean
	readonly bIsDebuff: boolean
	readonly bIsStun: boolean
	readonly bIsAOE: boolean
	readonly bIsLinear: boolean
	readonly bUseOnCreeps: boolean
	readonly bIsHeal: boolean
	readonly bIsBuff: boolean
	readonly bUseSelfishly: boolean
	readonly bCanHelpOthersEscape: boolean
	readonly bUseOnTrees: boolean
	readonly bUseOnStrongestAlly: boolean
	readonly nUseAtHealthPercent: number
	readonly nRadius: number
	readonly nMinimumTargets: number
	readonly nMinimumHP: number
	readonly nMinimumRange: number
	readonly nAbilityType: number
}

interface RnSoftbodyCapsule_t {
	readonly type_name: string
	readonly m_vCenter: Vector[]
	readonly m_flRadius: number
	readonly m_nParticle: number[]
}

interface AnimResourceIKRule_t {
	readonly type_name: string
	readonly index: number
	readonly type: number
	readonly chain: number
	readonly bone: number
	readonly slot: number
	readonly height: number
	readonly radius: number
	readonly floor: number
	readonly pos: Vector
	readonly iStart: number
	readonly start: number
	readonly peak: number
	readonly tail: number
	readonly end: number
	readonly contact: number
	readonly drop: number
	readonly top: number
string}

interface CAnimGraphNetworkedVariables {
	readonly type_name: string
	readonly m_BoolVariables: bool[]
	readonly m_ByteVariables: number[]
	readonly m_IntVariables: number[]
	readonly m_FloatVariables: float32[]
	readonly m_VectorVariables: Vector[]
}

interface IEconItemInterface {
	readonly type_name: string
}

interface CAttributeList {
	readonly type_name: string
	readonly m_Attributes: CEconItemAttribute[]
	readonly m_pManager: CAttributeManager
}

interface C_OP_Callback extends CParticleFunctionRenderer {
	readonly type_name: string
}

interface C_INIT_RandomSecondSequence extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nSequenceMin: number
	readonly m_nSequenceMax: number
}

interface C_INIT_RandomSequence extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nSequenceMin: number
	readonly m_nSequenceMax: number
	readonly m_bShuffle: boolean
	readonly m_bLinear: boolean
}

interface CGeneralRandomRotation extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flDegreesMin: number
	readonly m_flDegreesMax: number
	readonly m_flDegrees: number
	readonly m_flRotationRandExponent: number
	readonly m_bRandomlyFlipDirection: boolean
}

interface RnPlane_t {
	readonly type_name: string
	readonly m_vNormal: Vector
	readonly m_flOffset: number
}

interface InfoForResourceTypeCWorldNode {
	readonly type_name: string
}

interface CSkeletonAnimationController {
	readonly type_name: string
	readonly m_pSkeletonInstance: CSkeletonInstance
}

interface C_OP_RenderFlattenGrass extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flFlattenStrength: number
	readonly m_flRadiusScale: number
}

interface C_INIT_RandomScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flMin: number
	readonly m_flMax: number
	readonly m_flExponent: number
}

interface C_INIT_SetRigidAttachment extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_bLocalSpace: boolean
}

interface CMorphConstraint extends CBaseConstraint {
	readonly type_name: string
	readonly m_bCacheAttempted: boolean
	readonly m_bCacheOk: boolean
	readonly m_sTargetMorph: string
	readonly m_nSlaveChannel: number
	readonly m_flMin: number
	readonly m_flMax: number
}

interface C_OP_RampScalarSpline extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_RateMin: number
	readonly m_RateMax: number
	readonly m_flStartTime_min: number
	readonly m_flStartTime_max: number
	readonly m_flEndTime_min: number
	readonly m_flEndTime_max: number
	readonly m_flBias: number
	readonly m_bProportionalOp: boolean
	readonly m_bEaseOut: boolean
}

interface C_OP_ReinitializeScalarEndCap extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface Dop26_t {
	readonly type_name: string
	readonly m_flSupport: number[]
}

interface CGameRules {
	readonly type_name: string
	readonly m_szQuestName: string[]
	readonly m_nQuestPhase: number
}

interface C_OP_CalculateNormalsForGrid extends CParticleFunctionOperator {
	readonly type_name: string
}

interface cache_ragdoll_t {
	readonly type_name: string
	readonly solidCount: number
	readonly constraintCount: number
}

interface dynpitchvol_base_t {
	readonly type_name: string
	readonly preset: number
	readonly pitchrun: number
	readonly pitchstart: number
	readonly spinup: number
	readonly spindown: number
	readonly volrun: number
	readonly volstart: number
	readonly fadein: number
	readonly fadeout: number
	readonly lfotype: number
	readonly lforate: number
	readonly lfomodpitch: number
	readonly lfomodvol: number
	readonly cspinup: number
	readonly cspincount: number
	readonly pitch: number
	readonly spinupsav: number
	readonly spindownsav: number
	readonly pitchfrac: number
	readonly vol: number
	readonly fadeinsav: number
	readonly fadeoutsav: number
	readonly volfrac: number
	readonly lfofrac: number
	readonly lfomult: number
}

interface C_OP_FadeOut extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flFadeOutTimeMin: number
	readonly m_flFadeOutTimeMax: number
	readonly m_flFadeOutTimeExp: number
	readonly m_flFadeBias: number
	readonly m_bProportional: boolean
	readonly m_bEaseInAndOut: boolean
}

interface C_PlayerState {
	readonly type_name: string
	readonly deadflag: boolean
	readonly hltv: boolean
	readonly v_angle: QAngle
}

interface C_INIT_RemapScalarToVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bScaleInitialRange: boolean
	readonly m_nControlPointNumber: number
	readonly m_bLocalCoords: boolean
	readonly m_flRemapBias: number
}

interface C_OP_ConstrainDistanceToUserSpecifiedPath extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_fMinDistance: number
	readonly m_flMaxDistance: number
	readonly m_flTimeScale: number
	readonly m_bLoopedPath: boolean
}

interface VPhysXDiskShapeHeader_t {
	readonly type_name: string
	readonly m_nType: number
	readonly m_nCollisionAttribute: number
}

interface FourCovMatrices3 {
	readonly type_name: string
	readonly m_vDiag: FourVectors
}

interface C_OP_RemapNamedModelElementEndCap extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_inNames: string[]
	readonly m_outNames: string[]
	readonly m_fallbackNames: string[]
	readonly m_bModelFromRenderer: boolean
}

interface FeFitMatrix_t {
	readonly type_name: string
	readonly bone: CTransform
	readonly vCenter: Vector
	readonly nEnd: number
	readonly nNode: number
	readonly nCtrl: number
	readonly nBeginDynamic: number
}

interface C_OP_RenderDeferredLight extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_bUseAlphaTestWindow: boolean
	readonly m_bUseTexture: boolean
	readonly m_flRadiusScale: number
	readonly m_flAlphaScale: number
	readonly m_flLightDistance: number
	readonly m_flStartFalloff: number
	readonly m_flDistanceFalloff: number
	readonly m_flSpotFoV: number
	readonly m_ColorScale: Color
}

interface CDeferredLightBase {
	readonly type_name: string
	readonly m_LightColor: Color
	readonly m_flIntensity: number
	readonly m_flLightSize: number
	readonly m_flSpotFoV: number
	readonly m_vLightDirection: QAngle
	readonly m_flStartFalloff: number
	readonly m_flDistanceFalloff: number
	readonly m_nFlags: number
	readonly m_ProjectedTextureName: string[]
}

interface C_OP_SetControlPointToHMD extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCP1: number
	readonly m_vecCP1Pos: Vector
	readonly m_bOrientToHMD: boolean
}

interface C_OP_LerpEndCapScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOutput: number
	readonly m_flLerpTime: number
}

interface C_OP_SpringForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flRestLengthU: number
	readonly m_flRestLengthV: number
	readonly m_flSpringConstant: number
	readonly m_flDampingConstant: number
	readonly m_bStiff: boolean
}

interface C_OP_ForceBasedOnDistanceToPlane extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flMinDist: number
	readonly m_vecForceAtMinDist: Vector
	readonly m_flMaxDist: number
	readonly m_vecForceAtMaxDist: Vector
	readonly m_vecPlaneNormal: Vector
	readonly m_nControlPointNumber: number
	readonly m_flExponent: number
}

interface CPathAnimMotor extends CBasePathAnimMotor {
	readonly type_name: string
}

interface CConstraintTarget {
	readonly type_name: string
	readonly m_nBoneHash: number
	readonly m_flWeight: number
	readonly m_vOffset: Vector
	readonly m_bIsAttachment: boolean
	readonly m_sName: string
}

interface CPassengerSeat {
	readonly type_name: string
	readonly m_strSeatName: string
	readonly m_nAttachmentID: number
	readonly m_EntryTransitions: CPassengerSeatTransition[]
	readonly m_ExitTransitions: CPassengerSeatTransition[]
}

interface C_OP_RemapNamedModelSequenceOnceTimed extends C_OP_RemapNamedModelElementOnceTimed {
	readonly type_name: string
}

interface C_OP_ExternalGenericForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flStrength: number
	readonly m_flCurlStrength: number
	readonly m_flLinearStrength: number
	readonly m_flRadialStrength: number
	readonly m_flRotationStrength: number
}

interface C_INIT_RandomLifeTime extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_fLifetimeMin: number
	readonly m_fLifetimeMax: number
	readonly m_fLifetimeRandExponent: number
}

interface C_INIT_SetHitboxToModel extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nForceInModel: number
	readonly m_nDesiredHitbox: number
	readonly m_flHitBoxScale: number
	readonly m_vecDirectionBias: Vector
	readonly m_bMaintainHitbox: boolean
	readonly m_bUseBones: boolean
	readonly m_HitboxSetName: string[]
}

interface EntClassComponentOverride_t {
	readonly type_name: string
	readonly pszBaseComponent: string
	readonly pszOverrideComponent: string
}

interface HeroDeathRecord_t {
	readonly type_name: string
	readonly nKillerPlayerID: number
	readonly nVictimPlayerID: number
	readonly fTime: number
	readonly fTimeRespawn: number
}

interface C_INIT_OffsetVectorToVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
}

interface C_INIT_PositionWarp extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecWarpMin: Vector
	readonly m_vecWarpMax: Vector
	readonly m_nScaleControlPointNumber: number
	readonly m_nControlPointNumber: number
	readonly m_nRadiusComponent: number
	readonly m_flWarpTime: number
	readonly m_flWarpStartTime: number
	readonly m_flPrevPosScale: number
	readonly m_bInvertWarp: boolean
	readonly m_bUseCount: boolean
}

interface CLeanMatrixAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_sequenceName: string
	readonly m_flMaxValue: number
	readonly m_blendSource: number
	readonly m_param: AnimParamID
	readonly m_verticalAxisDirection: Vector
	readonly m_horizontalAxisDirection: Vector
	readonly m_damping: CAnimInputDamping
}

interface CAnimStateList {
	readonly type_name: string
	readonly m_states: CAnimState[]
}

interface IRecipientFilter {
	readonly type_name: string
}

interface C_INIT_CreateSequentialPath extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_fMaxDistance: number
	readonly m_flNumToAssign: number
	readonly m_bLoop: boolean
	readonly m_bCPPairs: boolean
	readonly m_bSaveOffset: boolean
	readonly m_PathParams: CPathParameters
}

interface PermEntityLumpData_t {
	readonly type_name: string
	readonly m_flags: number
}

interface C_OP_StopAfterCPDuration extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_flDuration: number
	readonly m_nCP: number
	readonly m_nCPField: number
	readonly m_bDestroyImmediately: boolean
	readonly m_bPlayEndCap: boolean
}

interface C_OP_ConnectParentParticleToNearest extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nFirstControlPoint: number
	readonly m_nSecondControlPoint: number
}

interface CParameterValue {
	readonly type_name: string
	readonly m_id: AnimParamID
	readonly m_value: CAnimVariant
}

interface EntOutput_t {
	readonly type_name: string
}

interface CParentConstraint extends CBaseConstraint {
	readonly type_name: string
}

interface CGlowOverlay {
	readonly type_name: string
	readonly m_vPos: Vector
	readonly m_bDirectional: boolean
	readonly m_vDirection: Vector
	readonly m_bInSky: boolean
	readonly m_skyObstructionScale: number
	readonly m_Sprites: CGlowSprite[]
	readonly m_nSprites: number
	readonly m_flProxyRadius: number
	readonly m_flHDRColorScale: number
	readonly m_flGlowObstructionScale: number
	readonly m_bCacheGlowObstruction: boolean
	readonly m_bCacheSkyObstruction: boolean
	readonly m_bActivated: number
	readonly m_ListIndex: number
	readonly m_queryHandle: number
}

interface CDOTA_TeamCommander {
	readonly type_name: string
	readonly m_nLastUnitsCollectTick: number
	readonly m_LaneFrontUpdate: CountdownTimer
	readonly m_ulBotScriptUGC: number
	readonly m_rtBotScriptUpdated: number
	readonly m_AvoidanceGridTimer: CountdownTimer
	readonly m_EnemyVisibilityGridTimer: CountdownTimer
	readonly m_LaneStatusTimer: CountdownTimer
	readonly m_ChatThrottleTimer: CountdownTimer
	readonly m_eTeam: number
	readonly m_bLateGame: boolean
	readonly m_LaneLengths: number[]
	readonly m_LaneFrontCreepsAmounts: number[]
	readonly m_LaneFrontTowersAmounts: number[]
	readonly m_AvoidanceGrid: number[]
	readonly m_fNextPotentialLocationTick: number[]
	readonly m_iPotentialLocationBuffer: number[]
	readonly m_PotentialLocationGrid: number[]
	readonly m_hRoamingUnit: C_BaseEntity
	readonly m_RoamTargetLane: number
	readonly m_fRuneDibsDesire: number[]
	readonly m_iRuneTypes: number[]
	readonly m_fLastSeenRuneTime: number[]
	readonly m_Buildings: C_BaseEntity[]
	readonly m_LaneNodes: C_BaseEntity[]
	readonly m_fPushLaneDesire: number[]
	readonly m_fPushLaneRawDesire: number[]
	readonly m_fPushLaneConvenienceDesire: number[]
	readonly m_fDefendLaneDesire: number[]
	readonly m_fDefendLaneUrgencyDesire: number[]
	readonly m_fDefendLanePowerDesire: number[]
	readonly m_fFarmLaneDesire: number[]
	readonly m_iLastSeenRoshanHealth: number
	readonly m_fRoshanDesire: number
	readonly m_hProposedPushUnits: C_BaseEntity[]
	readonly m_hProposedDefendUnits: C_BaseEntity[]
	readonly m_hProposedRoamUnits: C_BaseEntity[]
	readonly m_hProposedRoshanUnits: C_BaseEntity[]
	readonly m_fRoamDesire: number
	readonly m_fRoamOffensivePowerFactor: number
	readonly m_fRoamDistanceFactor: number
	readonly m_fRoamPositionFactor: number
	readonly m_hRoamTarget: C_BaseEntity
	readonly m_vRoamTargetLoc: Vector
	readonly m_fHeroSelectionTimes: number[]
	readonly m_vBaseLocation: Vector
	readonly m_AllUnits: C_BaseEntity[]
	readonly m_AllAlliedUnits: C_BaseEntity[]
	readonly m_AllAlliedHeroes: C_BaseEntity[]
	readonly m_AllAlliedCreeps: C_BaseEntity[]
	readonly m_AllAlliedWards: C_BaseEntity[]
	readonly m_AllAlliedBuildings: C_BaseEntity[]
	readonly m_AllAlliedOther: C_BaseEntity[]
	readonly m_AllEnemyUnits: C_BaseEntity[]
	readonly m_AllEnemyHeroes: C_BaseEntity[]
	readonly m_AllEnemyCreeps: C_BaseEntity[]
	readonly m_AllEnemyWards: C_BaseEntity[]
	readonly m_AllEnemyBuildings: C_BaseEntity[]
	readonly m_AllEnemyOther: C_BaseEntity[]
	readonly m_AllNeutralCreeps: C_BaseEntity[]
	readonly m_ThinkerUnits: C_BaseEntity[]
	readonly m_AllUnitsIncludingDead: C_BaseEntity[]
	readonly m_hCouriers: C_BaseEntity[]
	readonly m_hDisabledBots: C_BaseEntity[]
	readonly m_bCreatedLobbyBots: boolean
	readonly m_fGoodLuckFlavorTextTime: number
	readonly m_fTeamfightFlavorTextTime: number
	readonly m_fCongratulateHeroFlavorTextTime: number
	readonly m_fLastAliveHeroHistorySnapshotTime: number
	readonly m_iAliveHeroHistoryIndex: number
	readonly m_iAliveHeroHistory: number[]
	readonly m_sScriptDirectory: string
	readonly m_nScriptPathAvoidanceUpdateTick: number
	readonly m_fExecutionTime: number[]
	readonly m_iCurExecutionTime: number
}

interface ClientQuickBuyItemState {
	readonly type_name: string
	readonly nItemType: number
	readonly bPurchasable: boolean
}

interface C_OP_RampScalarLinearSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Rate: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
}

interface C_OP_LerpEndCapVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecOutput: Vector
	readonly m_flLerpTime: number
}

interface CSoundEnvelope {
	readonly type_name: string
	readonly m_current: number
	readonly m_target: number
	readonly m_rate: number
	readonly m_forceupdate: boolean
}

interface CNetworkOriginQuantizedVector {
	readonly type_name: string
}

interface C_INIT_InitialVelocityFromHitbox extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flVelocityMin: number
	readonly m_flVelocityMax: number
	readonly m_nControlPointNumber: number
	readonly m_HitboxSetName: string[]
	readonly m_bUseBones: boolean
}

interface RnNode_t {
	readonly type_name: string
	readonly m_vMin: Vector
	readonly m_nChildren: number
	readonly m_vMax: Vector
	readonly m_nTriangleOffset: number
}

interface CVariantDefaultAllocator {
	readonly type_name: string
}

interface TextureHeader_t extends TextureDesc_t {
	readonly type_name: string
	readonly m_nMultisampleType: number
	readonly m_nFlags: number
	readonly m_Reflectivity: Vector4D
	readonly m_nSheetSize: number
	readonly m_fallbackTextureBits: number[]
	readonly m_nPicmip0Res: number
}

interface FeEdgeDesc_t {
	readonly type_name: string
	readonly nEdge: number[]
	readonly nSide: number[]
	readonly nVirtElem: number[]
}

interface InfoForResourceTypeWorldLighting_t {
	readonly type_name: string
}

interface C_INIT_RemapScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bActiveRange: boolean
	readonly m_flRemapBias: number
}

interface CStateMachineAnimNode extends CAnimNodeBase {
	readonly type_name: string
}

interface MaterialParamInt_t extends MaterialParam_t {
	readonly type_name: string
	readonly m_nValue: number
}

interface TransitioningLayer_t {
	readonly type_name: string
	readonly m_op: CNetworkedSequenceOperation
	readonly m_flStartAnimTime: number
	readonly m_flStartWeight: number
	readonly m_flAnimTime: number
	readonly m_nOrder: number
	readonly m_flPlaybackRate: number
	readonly m_flFadeOutDuration: number
}

interface C_OP_RemapDistanceToLineSegmentBase extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCP0: number
	readonly m_nCP1: number
	readonly m_flMinInputValue: number
	readonly m_flMaxInputValue: number
	readonly m_bInfiniteLine: boolean
}

interface C_OP_RotateVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecRotAxisMin: Vector
	readonly m_vecRotAxisMax: Vector
	readonly m_flRotRateMin: number
	readonly m_flRotRateMax: number
	readonly m_bNormalize: boolean
}

interface ModelSkeletonData_t {
	readonly type_name: string
}

interface handposepair_t {
	readonly type_name: string
	readonly m_matHandPoseOffset: matrix3x4_t[]
	readonly m_vExtentOrigin: Vector[]
	readonly m_flHandPoseParams: number[]
	readonly m_poseSequenceName: string
	readonly m_nUseRange: number
	readonly m_bHasExtent: boolean
}

interface CAI_MoveMonitor {
	readonly type_name: string
	readonly m_vMark: Vector
	readonly m_flMarkTolerance: number
}

interface C_INIT_InitFromParentKilled extends CParticleFunctionInitializer {
	readonly type_name: string
}

interface AnimResourceUser_t {
	readonly type_name: string
	readonly m_nType: number
}

interface AnimResourceMovement_t {
	readonly type_name: string
	readonly endframe: number
	readonly motionflags: number
	readonly v0: number
	readonly v1: number
	readonly angle: number
	readonly vector: Vector
	readonly position: Vector
}

interface FeCtrlOffset_t {
	readonly type_name: string
	readonly nCtrlParent: number
	readonly nCtrlChild: number
	readonly vOffset: Vector
}

interface FeTri_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly w1: number
	readonly w2: number
	readonly v1x: number
	readonly v2: Vector2D
}

interface CAnimationLayer {
	readonly type_name: string
	readonly m_op: CNetworkedSequenceOperation
	readonly m_nOrder: number
	readonly m_bLooping: boolean
	readonly m_nNewSequenceParity: number
	readonly m_nFlags: number
	readonly m_bSequenceFinished: boolean
	readonly m_flKillRate: number
	readonly m_flKillDelay: number
	readonly m_flLayerAnimtime: number
	readonly m_flLayerFadeOuttime: number
	readonly m_nActivity: number
	readonly m_nPriority: number
	readonly m_flLastEventCycle: number
	readonly m_flLastAccess: number
}

interface CBaseTrailRenderer extends CBaseRendererSource2 {
	readonly type_name: string
	readonly m_nOrientationType: number
	readonly m_nOrientationControlPoint: number
	readonly m_flMinSize: number
	readonly m_flMaxSize: number
	readonly m_flStartFadeSize: number
	readonly m_flEndFadeSize: number
	readonly m_flDepthBias: number
	readonly m_flRadiusScale: number
	readonly m_bClampV: boolean
	readonly m_flFinalTextureScaleU: number
	readonly m_flFinalTextureScaleV: number
	readonly m_flFinalTextureOffsetU: number
	readonly m_flFinalTextureOffsetV: number
}

interface C_OP_UpdateLightSource extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vColorTint: Color
	readonly m_flBrightnessScale: number
	readonly m_flRadiusScale: number
	readonly m_flMinimumLightingRadius: number
	readonly m_flMaximumLightingRadius: number
	readonly m_flPositionDampingConstant: number
}

interface C_INIT_LifespanFromVelocity extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecComponentScale: Vector
	readonly m_flTraceOffset: number
	readonly m_flMaxTraceLength: number
	readonly m_flTraceTolerance: number
	readonly m_nMaxPlanes: number
	readonly m_CollisionGroupName: string[]
	readonly m_bIncludeWater: boolean
}

interface CSSDSMsg_ViewRender {
	readonly type_name: string
	readonly m_viewId: SceneViewId_t
	readonly m_ViewName: string
}

interface CDOTA_ReconnectInfo {
	readonly type_name: string
	readonly m_playerSteamId: number
	readonly m_iTeam: number
	readonly m_iUnitControlled: C_BaseEntity
	readonly m_bWantsRandomHero: boolean
}

interface CLocalNPCObstructionsCache {
	readonly type_name: string
	readonly m_nLastUpdatedTick: number
	readonly m_flRadius: number
	readonly m_hCachedNPCs: CDOTA_BaseNPC[]
}

interface IDamageHandler {
	readonly type_name: string
}

interface FeFitWeight_t {
	readonly type_name: string
	readonly flWeight: number
	readonly nNode: number
	readonly nDummy: number
}

interface C_DOTAGamerules extends C_TeamplayRules {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_iMiscHeroPickCounter: number
	readonly m_hEndGameCinematicEntity: C_BaseEntity
	readonly m_hOverlayHealthBarUnit: C_BaseEntity
	readonly m_nOverlayHealthBarType: number
	readonly m_bIsInCinematicMode: boolean
	readonly m_bIsInClientSideCinematicMode: boolean
	readonly m_bFreeCourierMode: boolean
	readonly m_nStartingGold: number
	readonly m_nGoldPerTick: number
	readonly m_flGoldTickTime: number
	readonly m_bItemWhiteListChanged: boolean
	readonly m_unFanfareGoodGuys: number
	readonly m_unFanfareBadGuys: number
	readonly m_iMapType: number
	readonly m_nServerGameState: number
	readonly m_nServerHeroPickState: number
	readonly m_nGameState: number
	readonly m_nHeroPickState: number
	readonly m_flStateTransitionTime: number
	readonly m_flOverride_dota_hero_selection_time: number
	readonly m_flOverride_dota_pregame_time: number
	readonly m_flOverride_dota_postgame_time: number
	readonly m_flOverride_dota_strategy_time: number
	readonly m_flOverride_dota_team_showcase_duration: number
	readonly m_flOverride_dota_rune_spawn_time: number
	readonly m_iGameMode: number
	readonly m_hGameModeEntity: C_BaseEntity
	readonly m_hCustomHeroPickRulesEntity: C_BaseEntity
	readonly m_flHeroPickStateTransitionTime: number
	readonly m_iPlayerIDsInControl: number
	readonly m_bSameHeroSelectionEnabled: boolean
	readonly m_bUseCustomHeroXPValue: boolean
	readonly m_bUseBaseGoldBountyOnHeroes: boolean
	readonly m_bUseUniversalShopMode: boolean
	readonly m_bHideKillMessageHeaders: boolean
	readonly m_flHeroMinimapIconScale: number
	readonly m_flCreepMinimapIconScale: number
	readonly m_bCreepSpawningEnabled: boolean
	readonly m_flRuneMinimapIconScale: number
	readonly m_CustomVictoryMessage: string[]
	readonly m_flCustomGameEndDelay: number
	readonly m_flCustomGameSetupAutoLaunchDelay: number
	readonly m_flCustomGameSetupTimeout: number
	readonly m_flCustomVictoryMessageDuration: number
	readonly m_flHeroSelectPenaltyTime: number
	readonly m_bCustomGameSetupAutoLaunchEnabled: boolean
	readonly m_bCustomGameTeamSelectionLocked: boolean
	readonly m_bCustomGameEnablePickRules: boolean
	readonly m_bCustomGameAllowHeroPickMusic: boolean
	readonly m_bCustomGameAllowMusicAtGameStart: boolean
	readonly m_bCustomGameAllowBattleMusic: boolean
	readonly m_iCMModePickBanOrder: number
	readonly m_iCDModePickBanOrder: number
	readonly m_iPauseTeam: number
	readonly m_nGGTeam: number
	readonly m_flGGEndsAtTime: number
	readonly m_bWhiteListEnabled: boolean
	readonly m_bItemWhiteList: number[]
	readonly m_nLastHitUIMode: number
	readonly m_bHUDTimerTutorialMode: boolean
	readonly m_HeroPickMiscTimer: CountdownTimer
	readonly m_ExtraTimeTimer: CountdownTimer
	readonly m_fExtraTimeRemaining: number[]
	readonly m_bRDFirstThink: boolean
	readonly m_RDMessageSent: boolean[]
	readonly m_bHeroRespawnEnabled: boolean
	readonly m_bIsRandomingEnabled: boolean
	readonly m_iCaptainPlayerIDs: number[]
	readonly m_BannedHeroes: number[]
	readonly m_SelectedHeroes: number[]
	readonly m_iActiveTeam: number
	readonly m_iStartingTeam: number
	readonly m_iPenaltyLevelRadiant: number
	readonly m_iPenaltyLevelDire: number
	readonly m_bTier3TowerDestroyed: boolean
	readonly m_nSeriesType: number
	readonly m_nRadiantSeriesWins: number
	readonly m_nDireSeriesWins: number
	readonly m_vecAvailableHerosPerPlayerID: CHeroesPerPlayer[]
	readonly m_vecLockedHerosByPlayerID: CHeroesPerPlayer[]
	readonly m_CustomGameForceSelectHero: number[]
	readonly m_flGoldTime: number
	readonly m_flXPTime: number
	readonly m_flCreepSpawntime: number
	readonly m_flAnnounceStartTime: number
	readonly m_iGoodTomeCount: number
	readonly m_iBadTomeCount: number
	readonly m_flPreGameStartTime: number
	readonly m_flGameStartTime: number
	readonly m_flGameEndTime: number
	readonly m_flGameLoadTime: number
	readonly m_iCustomGameScore: number[]
	readonly m_nCustomGameDifficulty: number
	readonly m_bEnemyModifiersEnabled: boolean
	readonly m_iWaves: number
	readonly m_iCreepUpgradeState: number
	readonly m_fGoodGlyphCooldown: number
	readonly m_fBadGlyphCooldown: number
	readonly m_flGlyphCooldowns: number[]
	readonly m_fGoodRadarCooldown: number
	readonly m_fBadRadarCooldown: number
	readonly m_flRadarCooldowns: number[]
	readonly m_bIsNightstalkerNight: boolean
	readonly m_bIsTemporaryNight: boolean
	readonly m_bIsTemporaryDay: boolean
	readonly m_nRiverType: number
	readonly m_flGoldRedistributeTime: number
	readonly m_nGoldToRedistribute: number[]
	readonly m_flNextPreGameThink: number
	readonly m_flNextAllDraftGoldThink: number
	readonly m_flTimeEnteredState: number
	readonly m_unRiverAccountID: number
	readonly m_ulRiverItemID: number
	readonly m_vecItemStockInfo: CDOTA_ItemStockInfo[]
	readonly m_AssassinMiniGameNetData: DOTA_AssassinMinigameNetworkState
	readonly m_nGameWinner: number
	readonly m_unMatchID64: number
	readonly m_bMatchSignoutComplete: boolean
	readonly m_hSideShop1: C_BaseEntity
	readonly m_hSideShop2: C_BaseEntity
	readonly m_hSecretShop1: C_BaseEntity
	readonly m_hSecretShop2: C_BaseEntity
	readonly m_hTeamFountains: C_BaseEntity[]
	readonly m_hTeamForts: C_BaseEntity[]
	readonly m_hTeamShops: C_BaseEntity[]
	readonly m_hAnnouncerGood: C_BaseEntity
	readonly m_hAnnouncerBad: C_BaseEntity
	readonly m_hAnnouncerSpectator: C_BaseEntity
	readonly m_hAnnouncerGood_KillingSpree: C_BaseEntity
	readonly m_hAnnouncerBad_KillingSpree: C_BaseEntity
	readonly m_hAnnouncerSpectator_KillingSpree: C_BaseEntity
	readonly m_fGameTime: number
	readonly m_fTimeOfDay: number
	readonly m_iNetTimeOfDay: number
	readonly m_nLoadedPlayers: number
	readonly m_nExpectedPlayers: number
	readonly m_iMinimapDebugGridState: number
	readonly m_iFoWFrameNumber: number
	readonly m_bIsStableMode: boolean
	readonly m_bGamePaused: boolean
	readonly m_fPauseRawTime: number
	readonly m_fPauseCurTime: number
	readonly m_fUnpauseRawTime: number
	readonly m_fUnpauseCurTime: number
	readonly m_nCustomGameFowTeamCount: number
	readonly m_bUseAlternateABRules: boolean
	readonly m_bLobbyIsAssociatedWithGame: boolean
	readonly m_BotDebugTimer: CountdownTimer
	readonly m_BotDebugPushLane: number[]
	readonly m_BotDebugDefendLane: number[]
	readonly m_BotDebugFarmLane: number[]
	readonly m_BotDebugRoam: number[]
	readonly m_hBotDebugRoamTarget: C_BaseEntity[]
	readonly m_BotDebugRoshan: number[]
	readonly m_nRoshanRespawnPhase: number
	readonly m_flRoshanRespawnPhaseEndTime: number
	readonly m_AbilityDraftAbilities: CDOTA_AbilityDraftAbilityState[]
	readonly m_bAbilityDraftCurrentPlayerHasPicked: boolean
	readonly m_nAbilityDraftPlayerTracker: number
	readonly m_nAbilityDraftRoundNumber: number
	readonly m_nAbilityDraftAdvanceSteps: number
	readonly m_nAbilityDraftPhase: number
	readonly m_nAbilityDraftHeroesChosen: number[]
	readonly m_vecARDMHeroes: KeyValues[]
	readonly m_nARDMHeroesPrecached: number
	readonly m_fLastARDMPrecache: number
	readonly m_nAllDraftPhase: number
	readonly m_bAllDraftRadiantFirst: boolean
	readonly m_bAllowOverrideVPK: boolean
	readonly m_nARDMHeroesRemaining: number[]
	readonly m_BAbilityDraftHeroesChosenChanged: boolean
	readonly m_bUpdateHeroStatues: boolean
	readonly m_vecPlayerMMR: number[]
	readonly m_lobbyType: number
	readonly m_lobbyLeagueID: number
	readonly m_lobbyGameName: string[]
	readonly m_vecHeroStatueLiked: CHeroStatueLiked[]
	readonly m_CustomGameTeamMaxPlayers: number[]
	readonly m_iMutations: number[]
	readonly m_vecIngameEvents: C_IngameEvent_Base[]
	readonly m_nPrimaryIngameEventIndex: number
	readonly m_hObsoleteIngameEvent: C_BaseEntity
	readonly m_NeutralSpawnBoxes: AABB_t[]
}

interface CEntityIOOutput {
	readonly type_name: string
}

interface CPlayerInfo extends IBotController, IPlayerInfo {
	readonly type_name: string
	readonly m_pParent: CBasePlayer
}

interface ViewLockData_t {
	readonly type_name: string
	readonly flLockInterval: number
	readonly bLocked: boolean
	readonly flUnlockTime: number
	readonly flUnlockBlendInterval: number
}

interface C_INIT_CreateWithinSphere extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_fRadiusMin: number
	readonly m_fRadiusMax: number
	readonly m_vecDistanceBias: Vector
	readonly m_vecDistanceBiasAbs: Vector
	readonly m_nControlPointNumber: number
	readonly m_nScaleCP: number
	readonly m_fSpeedMin: number
	readonly m_fSpeedMax: number
	readonly m_fSpeedRandExp: number
	readonly m_bLocalCoords: boolean
	readonly m_bUseHighestEndCP: boolean
	readonly m_flEndCPGrowthTime: number
	readonly m_LocalCoordinateSystemSpeedMin: Vector
	readonly m_LocalCoordinateSystemSpeedMax: Vector
}

interface CPointConstraint extends CBaseConstraint {
	readonly type_name: string
}

interface PlayerResourceBroadcasterData_t {
	readonly type_name: string
	readonly m_iszBroadcasterChannelDescription: string
	readonly m_iszBroadcasterChannelCountryCode: string
	readonly m_iszBroadcasterChannelLanguageCode: string
}

interface CInteractionManager {
	readonly type_name: string
	readonly m_nActiveInteraction: number
	readonly m_matHoldTransform: matrix3x4_t
	readonly m_hSelf: C_BaseEntity
	readonly m_hPlayer: C_BaseEntity
	readonly m_hInteractionTarget: C_BaseEntity
	readonly m_mInteractionTransformInit: matrix3x4_t
	readonly m_mInteractionTransformTarget: matrix3x4_t
	readonly m_flInteractionLerp: number
	readonly m_bSelfInteractionRequirementMet: boolean[]
	readonly m_bInteractionsDisabled: boolean[]
	readonly m_bAllInteractionsDisabled: boolean
	readonly m_vecPreventionEntities: prevent_interaction_t[]
}

interface C_INIT_SequenceFromCP extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bKillUnused: boolean
	readonly m_bRadiusScale: boolean
	readonly m_nCP: number
	readonly m_vecOffset: Vector
}

interface CBoneMaskAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_weightListName: string
	readonly m_child1ID: AnimNodeID
	readonly m_child2ID: AnimNodeID
	readonly m_blendSpace: number
	readonly m_bUseBlendScale: boolean
	readonly m_blendValueSource: number
	readonly m_blendParameter: AnimParamID
	readonly m_timingBehavior: number
	readonly m_flTimingBlend: number
	readonly m_flRootMotionBlend: number
	readonly m_bResetChild1: boolean
	readonly m_bResetChild2: boolean
}

interface AnimResourceIKRuleStallFrame_t {
	readonly type_name: string
	readonly chain: number
	readonly slot: number
	readonly start: number
	readonly peak: number
	readonly tail: number
	readonly end: number
}

interface EventServerAdvanceTick_t extends EventAdvanceTick_t {
	readonly type_name: string
}

interface EventSimpleLoopFrameUpdate_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRealTime: number
	readonly m_flFrameTime: number
}

interface FeBoxRigid_t {
	readonly type_name: string
	readonly nNode: number
	readonly nCollisionMask: number
	readonly vSize: Vector
	readonly flStickiness: number
	readonly flReserved: number[]
	readonly tmFrame: matrix3x4a_t
}

interface TimedEvent {
	readonly type_name: string
	readonly m_TimeBetweenEvents: number
	readonly m_fNextEvent: number
}

interface C_INIT_RandomNamedModelMeshGroup extends C_INIT_RandomNamedModelElement {
	readonly type_name: string
}

interface CPhysSurfacePropertiesAudio {
	readonly type_name: string
	readonly m_reflectivity: number
	readonly m_hardnessFactor: number
	readonly m_roughnessFactor: number
	readonly m_roughThreshold: number
	readonly m_hardThreshold: number
	readonly m_hardVelocityThreshold: number
}

interface FeSimdNodeBase_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly nNodeX0: number[]
	readonly nNodeX1: number[]
	readonly nNodeY0: number[]
	readonly nNodeY1: number[]
	readonly nDummy: number[]
}

interface VelocitySampler {
	readonly type_name: string
	readonly m_prevSample: Vector
	readonly m_fPrevSampleTime: number
	readonly m_fIdealSampleRate: number
}

interface CNavVolumeCalculatedVector extends CNavVolume {
	readonly type_name: string
}

interface C_OP_RemapNamedModelBodyPartOnceTimed extends C_OP_RemapNamedModelElementOnceTimed {
	readonly type_name: string
}

interface AnimationResourceData_t {
	readonly type_name: string
	readonly m_nMaxUniqueFrameIndex: number
}

interface PermModelExtPart_t {
	readonly type_name: string
	readonly m_Transform: CTransform
	readonly m_nParent: number
}

interface CRMSG_System_Event {
	readonly type_name: string
	readonly m_nEvent: number
	readonly m_nSubEvent: number
	readonly m_nTimeUS: number
	readonly m_nFrameNumber: number
	readonly m_nObjectId: number
}

interface SeqResourceTransition_t {
	readonly type_name: string
	readonly m_flFadeInTime: number
	readonly m_flFadeOutTime: number
}

interface SheetSequence_t {
	readonly type_name: string
	readonly m_nId: number
	readonly m_bClamp: boolean
	readonly m_bAlphaCrop: boolean
	readonly m_bNoColor: boolean
	readonly m_bNoAlpha: boolean
	readonly m_flTotalTime: number
}

interface SequenceFloatParam_t {
	readonly type_name: string
	readonly m_value: number
}

interface CHeadLookParams {
	readonly type_name: string
	readonly m_LookPriority: number
	readonly m_flLookDuration: number
	readonly m_pReplyWhenAimed: INextBotReply
	readonly m_pReasonStr: string
	readonly m_bWaitForSteady: boolean
	readonly m_flEaseInTime: number
}

interface CFlashlightEffect {
	readonly type_name: string
	readonly m_bIsOn: boolean
	readonly m_bMuzzleFlashEnabled: boolean
	readonly m_flMuzzleFlashBrightness: number
	readonly m_vecMuzzleFlashOrigin: Vector
	readonly m_flDT: number
	readonly m_flFov: number
	readonly m_flFarZ: number
	readonly m_flLinearAtten: number
	readonly m_bCastsShadows: boolean
	readonly m_flCurrentPullBackDist: number
	readonly m_textureName: string[]
}

interface CLookAtAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_target: number
	readonly m_param: AnimParamID
	readonly m_weightParam: AnimParamID
	readonly m_lookatChainName: string
	readonly m_attachmentName: string
	readonly m_flYawLimit: number
	readonly m_flPitchLimit: number
	readonly m_bResetBase: boolean
	readonly m_bUseHysteresis: boolean
	readonly m_flHysteresisInnerAngle: number
	readonly m_flHysteresisOuterAngle: number
	readonly m_damping: CAnimInputDamping
}

interface EventSetTime_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_nClientOutputFrames: number
	readonly m_flRealTime: number
	readonly m_flRenderTime: number
	readonly m_flRenderFrameTime: number
	readonly m_flRenderFrameTimeUnbounded: number
	readonly m_flRenderFrameTimeUnscaled: number
	readonly m_flTickRemainder: number
}

interface FeSphereRigid_t {
	readonly type_name: string
	readonly nNode: number
	readonly nCollisionMask: number
	readonly vCenter: Vector
	readonly flRadius: number
	readonly flStickiness: number
}

interface InfoForResourceTypeCVPhysXSurfacePropertiesList {
	readonly type_name: string
}

interface SeqResourceSynthAnimDesc_t {
	readonly type_name: string
	readonly m_flags: SeqResourceSeqDesc_t_Flag_t
	readonly m_transition: SeqResourceTransition_t
	readonly m_nLocalBaseReference: number
	readonly m_nLocalBoneMask: number
}

interface OldFeEdge_t {
	readonly type_name: string
	readonly m_flK: number[]
	readonly invA: number
	readonly t: number
	readonly flThetaRelaxed: number
	readonly flThetaFactor: number
	readonly c01: number
	readonly c02: number
	readonly c03: number
	readonly c04: number
	readonly flAxialModelDist: number
	readonly flAxialModelWeights: number[]
	readonly m_nNode: number[]
}

interface constraint_breakableparams_t {
	readonly type_name: string
	readonly strength: number
	readonly forceLimit: number
	readonly torqueLimit: number
	readonly bodyMassScale: number[]
	readonly isActive: boolean
}

interface IIntention extends INextBotComponent, IContextualQuery {
	readonly type_name: string
}

interface C_OP_MaxVelocity extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flMaxVelocity: number
	readonly m_nOverrideCP: number
	readonly m_nOverrideCPField: number
}

interface C_OP_OscillateVectorSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Rate: Vector
	readonly m_Frequency: Vector
	readonly m_flOscMult: number
	readonly m_flOscAdd: number
	readonly m_bOffset: boolean
}

interface CLookPitchCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface EventSplitScreenStateChanged_t {
	readonly type_name: string
}

interface CPhysicsComponent {
	readonly type_name: string
}

interface MaterialParamBuffer_t extends MaterialParam_t {
	readonly type_name: string
}

interface EventPostDataUpdate_t {
	readonly type_name: string
	readonly m_nCount: number
}

interface CModelState {
	readonly type_name: string
	readonly m_ModelName: string
	readonly m_MeshGroupMask: number
	readonly m_nIdealMotionType: number
	readonly m_nForceLOD: number
	readonly m_bIsJiggleBonesEnabled: boolean
	readonly m_nClothUpdateFlags: number
}

interface CTakeDamageInfo {
	readonly type_name: string
	readonly m_vecDamageForce: Vector
	readonly m_vecDamagePosition: Vector
	readonly m_vecReportedPosition: Vector
	readonly m_vecDamageDirection: Vector
	readonly m_hInflictor: C_BaseEntity
	readonly m_hAttacker: C_BaseEntity
	readonly m_hWeapon: C_BaseEntity
	readonly m_flDamage: number
	readonly m_flMaxDamage: number
	readonly m_flBaseDamage: number
	readonly m_bitsDamageType: number
	readonly m_iDamageCustom: number
	readonly m_iAmmoType: number
	readonly m_flRadius: number
	readonly m_bCanHeadshot: boolean
	readonly m_flOriginalDamage: number
	readonly m_nDamageTaken: number
	readonly m_iRecord: number
	readonly m_flStabilityDamage: number
	readonly m_bitsDotaDamageType: number
	readonly m_nDotaDamageCategory: number
	readonly m_bAllowFriendlyFire: boolean
	readonly m_bCanBeBlocked: boolean
}

interface C_OP_VelocityMatchingForce extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flDirScale: number
	readonly m_flSpdScale: number
	readonly m_nCPBroadcast: number
}

interface CSSDSMsg_ViewTargetList {
	readonly type_name: string
	readonly m_viewId: SceneViewId_t
	readonly m_ViewName: string
	readonly m_Targets: CSSDSMsg_ViewTarget[]
}

interface FeSimdAnimStrayRadius_t {
	readonly type_name: string
	readonly nNode: number[]
}

interface C_OP_RenderBlobs extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_cubeWidth: number
	readonly m_cutoffRadius: number
	readonly m_renderRadius: number
	readonly m_nScaleCP: number
}

interface CIKLockAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_IkChains: string[]
	readonly m_bDebug: boolean
}

interface AnimationDecodeDebugDump_t {
	readonly type_name: string
	readonly m_processingType: number
	readonly m_elems: AnimationDecodeDebugDumpElement_t[]
}

interface RenderSkeletonBone_t {
	readonly type_name: string
	readonly m_boneName: string
	readonly m_parentName: string
	readonly m_invBindPose: matrix3x4_t
	readonly m_bbox: SkeletonBoneBounds_t
	readonly m_flSphereRadius: number
}

interface FeSpringIntegrator_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly flSpringRestLength: number
	readonly flSpringConstant: number
	readonly flSpringDamping: number
	readonly flNodeWeight0: number
}

interface ResponseFollowup {
	readonly type_name: string
	readonly followup_concept: string
	readonly followup_contexts: string
	readonly followup_delay: number
	readonly followup_target: string
	readonly followup_entityiotarget: string
	readonly followup_entityioinput: string
	readonly followup_entityiodelay: number
	readonly bFired: boolean
}

interface CDotaEntityFilterFlags {
	readonly type_name: string
	readonly m_bInvertFilter: boolean
	readonly m_bEveryUnit: boolean
	readonly m_nTeamNumber: number
	readonly m_UnitName: string
	readonly m_bIsAncient: boolean
	readonly m_bIsNeutralUnitType: boolean
	readonly m_bIsSummoned: boolean
	readonly m_bIsHero: boolean
	readonly m_bIsRealHero: boolean
	readonly m_bIsTower: boolean
	readonly m_bIsPhantom: boolean
	readonly m_bIsIllusion: boolean
	readonly m_bIsCreep: boolean
	readonly m_bIsLaneCreep: boolean
}

interface C_OP_ControlpointLight extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_nControlPoint1: number
	readonly m_nControlPoint2: number
	readonly m_nControlPoint3: number
	readonly m_nControlPoint4: number
	readonly m_vecCPOffset1: Vector
	readonly m_vecCPOffset2: Vector
	readonly m_vecCPOffset3: Vector
	readonly m_vecCPOffset4: Vector
	readonly m_LightFiftyDist1: number
	readonly m_LightZeroDist1: number
	readonly m_LightFiftyDist2: number
	readonly m_LightZeroDist2: number
	readonly m_LightFiftyDist3: number
	readonly m_LightZeroDist3: number
	readonly m_LightFiftyDist4: number
	readonly m_LightZeroDist4: number
	readonly m_LightColor1: Color
	readonly m_LightColor2: Color
	readonly m_LightColor3: Color
	readonly m_LightColor4: Color
	readonly m_bLightType1: boolean
	readonly m_bLightType2: boolean
	readonly m_bLightType3: boolean
	readonly m_bLightType4: boolean
	readonly m_bLightDynamic1: boolean
	readonly m_bLightDynamic2: boolean
	readonly m_bLightDynamic3: boolean
	readonly m_bLightDynamic4: boolean
	readonly m_bUseNormal: boolean
	readonly m_bUseHLambert: boolean
	readonly m_bClampLowerRange: boolean
	readonly m_bClampUpperRange: boolean
}

interface CEntityComponentHelper {
	readonly type_name: string
	readonly m_flags: number
	readonly m_pInfo: EntComponentInfo_t
	readonly m_nPriority: number
	readonly m_pNext: CEntityComponentHelper
}

interface FeCollisionPlane_t {
	readonly type_name: string
	readonly nCtrlParent: number
	readonly nChildNode: number
	readonly m_Plane: RnPlane_t
	readonly flStickiness: number
}

interface C_TeamplayRoundBasedRules extends C_TeamplayRules {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_flLastRoundStateChangeTime: number
	readonly m_bOldInWaitingForPlayers: boolean
	readonly m_bOldInOvertime: boolean
	readonly m_bOldInSetup: boolean
	readonly m_iRoundState: number
	readonly m_bInOvertime: boolean
	readonly m_bInSetup: boolean
	readonly m_bSwitchedTeamsThisRound: boolean
	readonly m_iWinningTeam: number
	readonly m_iWinReason: number
	readonly m_bInWaitingForPlayers: boolean
	readonly m_bAwaitingReadyRestart: boolean
	readonly m_flRestartRoundTime: number
	readonly m_flMapResetTime: number
	readonly m_flNextRespawnWave: number[]
	readonly m_bTeamReady: boolean[]
	readonly m_bStopWatch: boolean
	readonly m_TeamRespawnWaveTimes: number[]
	readonly m_flStartBalancingTeamsAt: number
	readonly m_flNextBalanceTeamsTime: number
	readonly m_bPrintedUnbalanceWarning: boolean
	readonly m_flFoundUnbalancedTeamsTime: number
	readonly m_flStopWatchTotalTime: number
	readonly m_iLastCapPointChanged: number
}

interface CEconItemView extends IEconItemInterface {
	readonly type_name: string
	readonly m_iItemDefinitionIndex: item_definition_index_t
	readonly m_iEntityQuality: number
	readonly m_iEntityLevel: number
	readonly m_iItemID: itemid_t
	readonly m_iAccountID: number
	readonly m_iInventoryPosition: number
	readonly m_bInitialized: boolean
	readonly m_nOverrideStyle: style_index_t
	readonly m_bIsStoreItem: boolean
	readonly m_bIsTradeItem: boolean
	readonly m_bHasComputedAttachedParticles: boolean
	readonly m_bHasAttachedParticles: boolean
	readonly m_iEntityQuantity: number
	readonly m_unClientFlags: number
	readonly m_unOverrideOrigin: number
	readonly m_pszGrayedOutReason: string
	readonly m_AttributeList: CAttributeList
}

interface CVerticalMotionController {
	readonly type_name: string
}

interface CMultiplayRules extends CGameRules {
	readonly type_name: string
	readonly m_flIntermissionEndTime: number
}

interface AnimationRetargetElementData_t {
	readonly type_name: string
	readonly m_nElementType: number
	readonly m_nGroupType: number
	readonly m_nChainType: number
	readonly m_nChainIndex: number
	readonly m_nChainInvIndex: number
	readonly m_nBoneIndex: number
	readonly m_transform: matrix3x4_t
	readonly m_invTransform: matrix3x4_t
	readonly m_flDistance: number
	readonly m_vecMin: Vector
	readonly m_vecMax: Vector
	readonly m_flMass: number
}

interface CFourWheelVehiclePhysics {
	readonly type_name: string
	readonly m_pOuter: C_BaseEntity
	readonly m_pOuterServerVehicle: CFourWheelServerVehicle
	readonly m_controls: vehicle_controlparams_t
	readonly m_nSpeed: number
	readonly m_nLastSpeed: number
	readonly m_nRPM: number
	readonly m_fLastBoost: number
	readonly m_nBoostTimeLeft: number
	readonly m_bHasBoost: boolean
	readonly m_maxThrottle: number
	readonly m_flMaxRevThrottle: number
	readonly m_flMaxSpeed: number
	readonly m_actionSpeed: number
	readonly m_wheelCount: number
	readonly m_wheelPosition: Vector[]
	readonly m_wheelRotation: QAngle[]
	readonly m_wheelBaseHeight: number[]
	readonly m_wheelTotalHeight: number[]
	readonly m_poseParameters: number[]
	readonly m_actionValue: number
	readonly m_actionScale: number
	readonly m_debugRadius: number
	readonly m_throttleRate: number
	readonly m_throttleStartTime: number
	readonly m_throttleActiveTime: number
	readonly m_turboTimer: number
	readonly m_flVehicleVolume: number
	readonly m_bIsOn: boolean
	readonly m_bLastThrottle: boolean
	readonly m_bLastBoost: boolean
	readonly m_bLastSkid: boolean
}

interface C_OP_SetControlPointToPlayer extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCP1: number
	readonly m_vecCP1Pos: Vector
	readonly m_bOrientToEyes: boolean
}

interface C_OP_RampScalarLinear extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_RateMin: number
	readonly m_RateMax: number
	readonly m_flStartTime_min: number
	readonly m_flStartTime_max: number
	readonly m_flEndTime_min: number
	readonly m_flEndTime_max: number
	readonly m_bProportionalOp: boolean
}

interface C_OP_FadeAndKillForTracers extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flStartFadeInTime: number
	readonly m_flEndFadeInTime: number
	readonly m_flStartFadeOutTime: number
	readonly m_flEndFadeOutTime: number
	readonly m_flStartAlpha: number
	readonly m_flEndAlpha: number
}

interface C_OP_CodeDrivenEmitter extends CParticleFunctionEmitter {
	readonly type_name: string
}

interface C_INIT_RemapNamedModelSequenceToScalar extends C_INIT_RemapNamedModelElementToScalar {
	readonly type_name: string
}

interface C_INIT_RemapQAnglesToRotation extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCP: number
}

interface C_INIT_ChaoticAttractor extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flAParm: number
	readonly m_flBParm: number
	readonly m_flCParm: number
	readonly m_flDParm: number
	readonly m_flScale: number
	readonly m_flSpeedMin: number
	readonly m_flSpeedMax: number
	readonly m_nBaseCP: number
	readonly m_bUniformSpeed: boolean
}

interface EventClientPreSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface EventClientSceneSystemThreadStateChange_t {
	readonly type_name: string
	readonly m_bThreadsActive: boolean
}

interface CJiggleBones {
	readonly type_name: string
}

interface SchemaFieldMetadataOverrideData_t {
	readonly type_name: string
	readonly m_bRemoveAll: boolean
}

interface ViewSmoothingData_t {
	readonly type_name: string
	readonly pVehicle: CBaseAnimating
	readonly bClampEyeAngles: boolean
	readonly flPitchCurveZero: number
	readonly flPitchCurveLinear: number
	readonly flRollCurveZero: number
	readonly flRollCurveLinear: number
	readonly flFOV: number
	readonly pitchLockData: ViewLockData_t
	readonly rollLockData: ViewLockData_t
	readonly bDampenEyePosition: boolean
	readonly bRunningEnterExit: boolean
	readonly bWasRunningAnim: boolean
	readonly flEnterExitStartTime: number
	readonly flEnterExitDuration: number
	readonly vecAnglesSaved: QAngle
	readonly vecOriginSaved: Vector
	readonly vecAngleDiffSaved: QAngle
	readonly vecAngleDiffMin: QAngle
}

interface AnimationKeyResourceData_t {
	readonly type_name: string
	readonly m_nChannelElements: number
}

interface IClientAlphaProperty {
	readonly type_name: string
}

interface C_OP_RenderTreeShake extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flPeakStrength: number
	readonly m_flRadius: number
	readonly m_flShakeDuration: number
	readonly m_flTransitionTime: number
	readonly m_flTwistAmount: number
	readonly m_flRadialAmount: number
	readonly m_flControlPointOrientationAmount: number
	readonly m_nControlPointForLinearDirection: number
}

interface C_OP_RemapVelocityToVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_bNormalize: boolean
}

interface CBonePair {
	readonly type_name: string
	readonly m_modelBone: string
	readonly m_inputBone: number
	readonly m_bMatchPosition: boolean
	readonly m_bMathOrientation: boolean
}

interface MaterialParamFloat_t extends MaterialParam_t {
	readonly type_name: string
	readonly m_flValue: number
}

interface CEntityComponent {
	readonly type_name: string
}

interface PermModelData_t {
	readonly type_name: string
	readonly m_modelInfo: PermModelInfo_t
	readonly m_nDefaultMeshGroupMask: number
	readonly m_modelSkeleton: ModelSkeletonData_t
}

interface EventServerSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface SchemaClassInfoData_t {
	readonly type_name: string
	readonly m_nSizeOf: number
	readonly m_nAlignOf: number
	readonly m_Metadata: SchemaMetadataSetData_t
}

interface C_EconItemView extends IEconItemInterface {
	readonly type_name: string
	readonly m_iItemDefinitionIndex: item_definition_index_t
	readonly m_iEntityQuality: number
	readonly m_iEntityLevel: number
	readonly m_iItemID: itemid_t
	readonly m_iAccountID: number
	readonly m_iInventoryPosition: number
	readonly m_bInitialized: boolean
	readonly m_nOverrideStyle: style_index_t
	readonly m_bIsStoreItem: boolean
	readonly m_bIsTradeItem: boolean
	readonly m_bHasComputedAttachedParticles: boolean
	readonly m_bHasAttachedParticles: boolean
	readonly m_iEntityQuantity: number
	readonly m_unClientFlags: number
	readonly m_unOverrideOrigin: number
	readonly m_pszGrayedOutReason: string
	readonly m_AttributeList: CAttributeList
}

interface VSoundStack_t {
	readonly type_name: string
stringstring}

interface InfoForResourceTypeCPanoramaStyle {
	readonly type_name: string
}

interface C_OP_OrientTo2dDirection extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flRotOffset: number
	readonly m_flSpinStrength: number
}

interface C_OP_DistanceToCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_nStartCP: number
	readonly m_bLOS: boolean
	readonly m_CollisionGroupName: string[]
	readonly m_flMaxTraceLength: number
	readonly m_flLOSScale: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bActiveRange: boolean
}

interface C_OP_PercentageBetweenCPLerpCPs extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_nOutputStartCP: number
	readonly m_nOutputStartField: number
	readonly m_nOutputEndCP: number
	readonly m_nOutputEndField: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bActiveRange: boolean
	readonly m_bRadialCheck: boolean
}

interface AnimResourceLocalHierarchy_t {
	readonly type_name: string
	readonly m_nStartFrame: number
	readonly m_nPeakFrame: number
	readonly m_nTailFrame: number
	readonly m_nEndFrame: number
}

interface SceneObjectData_t {
	readonly type_name: string
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_translucencyType: number
	readonly m_vTintColor: Vector4D
}

interface C_OP_MovementMaintainOffset extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecOffset: Vector
	readonly m_nCP: number
	readonly m_bRadiusScale: boolean
}

interface C_OP_SnapshotRigidSkinToBones extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bTransformNormals: boolean
	readonly m_nControlPointNumber: number
}

interface C_OP_BoxConstraint extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_vecMin: Vector
	readonly m_vecMax: Vector
	readonly m_nCP: number
}

interface AnimResourceSequenceParams_t {
	readonly type_name: string
	readonly m_flFadeInTime: number
	readonly m_flFadeOutTime: number
}

interface AnimResourceDecoder_t {
	readonly type_name: string
	readonly m_nVersion: number
	readonly m_nType: number
}

interface InfoForResourceTypeCPanoramaDynamicImages {
	readonly type_name: string
}

interface sPlayerSnapshot {
	readonly type_name: string
	readonly m_nItemAbilityID: number[]
	readonly m_fGameTime: number
	readonly unKills: number
	readonly unDeaths: number
	readonly unAssists: number
	readonly unLevel: number
}

interface TimedHeroStats_t {
	readonly type_name: string
	readonly m_nTime: number
	readonly m_nKills: number
	readonly m_nDeaths: number
	readonly m_nAssists: number
	readonly m_nNetWorth: number
	readonly m_nLastHits: number
	readonly m_nDenies: number
}

interface audioparams_t {
	readonly type_name: string
	readonly localSound: Vector[]
	readonly soundscapeIndex: number
	readonly localBits: number
	readonly soundscapeEntityListIndex: number
}

interface C_OP_SetControlPointFromObjectScale extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_nCPOutput: number
}

interface AnimResourceFrameSegment_t {
	readonly type_name: string
	readonly m_nUniqueFrameIndex: number
	readonly m_nLocalElementMasks: number
	readonly m_nLocalChannel: number
}

interface WorldBuilderParams_t {
	readonly type_name: string
	readonly m_nSizeBytesPerVoxel: number
	readonly m_flMinDrawVolumeSize: number
	readonly m_flMinDistToCamera: number
	readonly m_flMinAtlasDist: number
	readonly m_flMinSimplifiedDist: number
	readonly m_flHorzFOV: number
	readonly m_flHalfScreenWidth: number
	readonly m_nAtlasTextureSizeX: number
	readonly m_nAtlasTextureSizeY: number
	readonly m_nUniqueTextureSizeX: number
	readonly m_nUniqueTextureSizeY: number
	readonly m_nCompressedAtlasSize: number
	readonly m_flGutterSize: number
	readonly m_flUVMapThreshold: number
	readonly m_vWorldUnitsPerTile: Vector
	readonly m_nMaxTexScaleSlots: number
	readonly m_bWrapInAtlas: boolean
	readonly m_bBuildBakedLighting: boolean
	readonly m_padding: number[]
}

interface VPhysXDiskMesh2_t extends VPhysXDiskShapeHeader_t {
	readonly type_name: string
	readonly m_flSkinWidth: number
	readonly m_flMaxVelocity: number
	readonly m_nReserved2: number[]
}

interface C_OP_RemapNamedModelMeshGroupOnceTimed extends C_OP_RemapNamedModelElementOnceTimed {
	readonly type_name: string
}

interface C_OP_FadeIn extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flFadeInTimeMin: number
	readonly m_flFadeInTimeMax: number
	readonly m_flFadeInTimeExp: number
	readonly m_bProportional: boolean
}

interface AnimResourceBoneDifference_t {
	readonly type_name: string
	readonly m_posError: Vector
	readonly m_bHasRotation: boolean
	readonly m_bHasMovement: boolean
}

interface COrientConstraint extends CBaseConstraint {
	readonly type_name: string
}

interface FourVectors2D {
	readonly type_name: string
}

interface FeRodConstraint_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly flMaxDist: number
	readonly flMinDist: number
	readonly flWeight0: number
	readonly flRelaxationFactor: number
}

interface InfoForResourceTypeAnimationGroupResourceData_t {
	readonly type_name: string
}

interface C_OP_RemapAverageScalarValuetoCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nOutControlPointNumber: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_INIT_AddVectorToVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecScale: Vector
	readonly m_vOffsetMin: Vector
	readonly m_vOffsetMax: Vector
}

interface CSosGroupBranchPattern {
	readonly type_name: string
	readonly m_bMatchEventName: boolean
	readonly m_bMatchEventSubString: boolean
	readonly m_bMatchEntIndex: boolean
	readonly m_bMatchOpvar: boolean
}

interface C_OP_RemapSpeed extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bIgnoreDelta: boolean
}

interface CTaskStatusAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_identifierString: string
}

interface SchemaClassFieldData_t {
	readonly type_name: string
	readonly m_nSingleInheritanceOffset: number
	readonly m_Metadata: SchemaMetadataSetData_t
}

interface IVehicle {
	readonly type_name: string
}

interface CRR_Response {
	readonly type_name: string
	readonly m_Type: number
	readonly m_szResponseName: string[]
	readonly m_szMatchingRule: string[]
	readonly m_Params: ResponseParams
	readonly m_fMatchScore: number
	readonly m_szSpeakerContext: string
	readonly m_szWorldContext: string
	readonly m_Followup: ResponseFollowup
	readonly m_pchCriteriaNames: CUtlSymbol[]
	readonly m_pchCriteriaValues: string[]
}

interface AnimationSnapshotBase_t {
	readonly type_name: string
	readonly m_flRealTime: number
	readonly m_rootToWorld: matrix3x4a_t
	readonly m_bBonesInWorldSpace: boolean
	readonly m_boneSetupMask: number[]
	readonly m_boneTransforms: matrix3x4a_t[]
	readonly m_flexControllers: float32[]
	readonly m_SnapshotType: number
	readonly m_bHasDecodeDump: boolean
	readonly m_DecodeDump: AnimationDecodeDebugDumpElement_t
}

interface MaterialParamTexture_t extends MaterialParam_t {
	readonly type_name: string
}

interface CTiltTwistConstraint extends CBaseConstraint {
	readonly type_name: string
	readonly m_nTargetAxis: number
	readonly m_nSlaveAxis: number
}

interface InfoForResourceTypeCPanoramaScript {
	readonly type_name: string
}

interface CGlobalLightBase {
	readonly type_name: string
	readonly m_bSpotLight: boolean
	readonly m_SpotLightOrigin: Vector
	readonly m_SpotLightAngles: QAngle
	readonly m_ShadowDirection: Vector
	readonly m_AmbientDirection: Vector
	readonly m_SpecularDirection: Vector
	readonly m_InspectorSpecularDirection: Vector
	readonly m_flSpecularPower: number
	readonly m_flSpecularIndependence: number
	readonly m_SpecularColor: Color
	readonly m_bStartDisabled: boolean
	readonly m_bEnabled: boolean
	readonly m_LightColor: Color
	readonly m_AmbientColor1: Color
	readonly m_AmbientColor2: Color
	readonly m_AmbientColor3: Color
	readonly m_flSunDistance: number
	readonly m_flFOV: number
	readonly m_flNearZ: number
	readonly m_flFarZ: number
	readonly m_bEnableShadows: boolean
	readonly m_bOldEnableShadows: boolean
	readonly m_bBackgroundClearNotRequired: boolean
	readonly m_flCloudScale: number
	readonly m_flCloud1Speed: number
	readonly m_flCloud1Direction: number
	readonly m_flCloud2Speed: number
	readonly m_flCloud2Direction: number
	readonly m_flAmbientScale1: number
	readonly m_flAmbientScale2: number
	readonly m_flGroundScale: number
	readonly m_flLightScale: number
	readonly m_flFoWDarkness: number
	readonly m_bEnableSeparateSkyboxFog: boolean
	readonly m_vFowColor: Vector
	readonly m_ViewOrigin: Vector
	readonly m_ViewAngles: QAngle
	readonly m_flViewFoV: number
	readonly m_WorldPoints: Vector[]
	readonly m_vFogOffsetLayer0: Vector2D
	readonly m_vFogOffsetLayer1: Vector2D
	readonly m_hEnvWind: C_BaseEntity
	readonly m_hEnvSky: C_BaseEntity
	readonly m_fSmoothedAmount: number
	readonly m_fSlowSmoothedAmount: number
}

interface CPassengerInfo {
	readonly type_name: string
	readonly m_nRole: number
	readonly m_nSeat: number
	readonly m_strRoleName: string
	readonly m_strSeatName: string
	readonly m_hPassenger: C_BaseEntity
}

interface CSchemaMetadataEntry extends SchemaMetadataEntryData_t {
	readonly type_name: string
}

interface AIHullFlags_t {
	readonly type_name: string
	readonly m_bHull_Human: boolean
	readonly m_bHull_SmallCentered: boolean
	readonly m_bHull_WideHuman: boolean
	readonly m_bHull_Tiny: boolean
	readonly m_bHull_Medium: boolean
	readonly m_bHull_TinyCentered: boolean
	readonly m_bHull_Large: boolean
	readonly m_bHull_LargeCentered: boolean
	readonly m_bHull_MediumTall: boolean
}

interface C_INIT_RemapSpeedToScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bPerParticle: boolean
}

interface CSchemaEnumInfo extends SchemaEnumInfoData_t {
	readonly type_name: string
}

interface ParticleChildrenInfo_t {
	readonly type_name: string
	readonly m_flDelay: number
	readonly m_bEndCap: boolean
	readonly m_bDisableChild: boolean
}

interface C_OP_HSVShiftToCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nColorCP: number
	readonly m_nColorGemEnableCP: number
	readonly m_nOutputCP: number
	readonly m_DefaultHSVColor: Color
}

interface C_OP_SetCPOrientationToDirection extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nInputControlPoint: number
	readonly m_nOutputControlPoint: number
}

interface CSceneObjectExtraData_t {
	readonly type_name: string
	readonly m_flExtraShaderData: float32[]
	readonly m_nCurrentMeshGroupMask: number
	readonly m_vLightingOrigin: Vector
	readonly m_flDepthSortBias: number
	readonly m_nVisibleToPlayer: number[]
	readonly m_nAlphaFade: number
	readonly m_nViewProducerIndex: number
	readonly m_nCurrentLOD: number
	readonly m_nCubeMapPrecomputedHandshake: number
	readonly m_nLightProbeVolumePrecomputedHandshake: number
}

interface CActivityValueList {
	readonly type_name: string
}

interface CClientAlphaProperty extends IClientAlphaProperty {
	readonly type_name: string
	readonly m_nRenderFX: number
	readonly m_nRenderMode: number
	readonly m_bAlphaOverride: boolean
	readonly m_bShadowAlphaOverride: boolean
	readonly m_nDistanceFadeMode: boolean
	readonly m_nReserved: number
	readonly m_nAlpha: number
	readonly m_nDesyncOffset: number
	readonly m_nReserved2: number
	readonly m_nDistFadeStart: number
	readonly m_nDistFadeEnd: number
	readonly m_flFadeScale: number
	readonly m_flRenderFxStartTime: number
	readonly m_flRenderFxDuration: number
}

interface C_OP_SetControlPointsToModelParticles extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_HitboxSetName: string[]
	readonly m_AttachmentName: string[]
	readonly m_nFirstControlPoint: number
	readonly m_nNumControlPoints: number
	readonly m_nFirstSourcePoint: number
	readonly m_bSkin: boolean
	readonly m_bAttachment: boolean
}

interface C_OP_GlobalLight extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_bClampLowerRange: boolean
	readonly m_bClampUpperRange: boolean
}

interface CSceneObject {
	readonly type_name: string
	readonly m_pDesc: ISceneObjectDesc
	readonly m_pRefData: CSceneObjectReference_t
	readonly m_flStartFadeDistanceSquared: number
	readonly m_flFarCullDistanceSquared: number
	readonly m_nObjectTypeFlags: number
	readonly m_nGameRenderCounter: number
	readonly m_nMeshGroupMaskSmall: number
	readonly m_nDebugLevel: number
	readonly m_nSizeCullBloat: number
	readonly m_nBoundsType: boolean
	readonly m_nID: number
	readonly m_nNumTransformBlocks: number
	readonly m_nObjectClass: number
	readonly m_transform: matrix3x4a_t
	readonly m_pPVS: CPVSData
	readonly m_nOriginalRenderableFlags: number
	readonly m_nRenderableFlags: number
}

interface C_DOTAGameManager {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_pkvHeroes: KeyValues
	readonly m_pkvUnits: KeyValues
	readonly m_pkvAbilities: KeyValues
	readonly m_bCustomGame: boolean
	readonly m_bEventGame: boolean
	readonly m_szAddOnGame: string[]
	readonly m_szAddOnMap: string[]
	readonly m_pkvAddOnHeroes: KeyValues
	readonly m_pkvAddOnUnits: KeyValues
	readonly m_pkvAddOnAbilities: KeyValues
	readonly m_pTutorialLessonKeyValues: KeyValues
	readonly m_pTutorialTipKeyValues: KeyValues
	readonly m_pDivisionKeyValues: KeyValues
	readonly m_pMatchGroupsKeyValues: KeyValues
	readonly m_pEmoticonsKeyValues: KeyValues
	readonly m_pPortraitsLightPreselects: KeyValues
	readonly m_pAnimationStatues: KeyValues
	readonly m_pAddonInfoKeyValues: KeyValues
	readonly m_pBotScriptsDedicatedServer: KeyValues
	readonly m_pkvWardPlacementLocations: KeyValues
	readonly m_pRegionKeyValues: KeyValues
	readonly m_pCountryKeyValues: KeyValues
	readonly m_pSurveyQuestionData: KeyValues
	readonly m_nNumLoadingPlayers: number
	readonly m_iDefeatedParticle: number
	readonly m_bLoadedPortraits: boolean[]
	readonly m_pControlGroupsKeyValues: KeyValues
	readonly m_StableHeroAvailable: boolean[]
	readonly m_CurrentHeroAvailable: boolean[]
	readonly m_CulledHeroes: boolean[]
	readonly m_BonusHeroes: boolean[]
}

interface ResponseContext_t {
	readonly type_name: string
	readonly m_iszName: string
	readonly m_iszValue: string
	readonly m_fExpirationTime: number
}

interface C_OP_RemapScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_INIT_RemapParticleCountToNamedModelMeshGroupScalar extends C_INIT_RemapParticleCountToNamedModelElementScalar {
	readonly type_name: string
}

interface TonemapParameters_t {
	readonly type_name: string
	readonly m_flAutoExposureMin: number
	readonly m_flAutoExposureMax: number
	readonly m_flTonemapPercentTarget: number
	readonly m_flTonemapPercentBrightPixels: number
	readonly m_flTonemapMinAvgLum: number
	readonly m_flBloomScale: number
	readonly m_flBloomStartValue: number
	readonly m_flRate: number
	readonly m_flAccelerateExposureDown: number
}

interface C_OP_SetParentControlPointsToChildCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nChildGroupID: number
	readonly m_nChildControlPoint: number
	readonly m_nNumControlPoints: number
	readonly m_nFirstSourcePoint: number
	readonly m_bSetOrientation: boolean
}

interface AnimationRetargetData_t {
	readonly type_name: string
	readonly m_bEnableRetarget: number
	readonly m_nRetargetStyle: number
}

interface EventClientPollNetworking_t {
	readonly type_name: string
	readonly m_nTickCount: number
}

interface C_OP_LagCompensation extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nDesiredVelocityCP: number
	readonly m_nLatencyCP: number
	readonly m_nLatencyCPField: number
	readonly m_nDesiredVelocityCPField: number
}

interface CMoveHeadingCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface prevent_interaction_t {
	readonly type_name: string
	readonly m_hEntity: C_BaseEntity
	readonly m_flUntilTime: number
}

interface C_OP_SetToCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_vecOffset: Vector
	readonly m_bOffsetLocal: boolean
}

interface WeaponSoundData_t {
	readonly type_name: string
	readonly m_Type: number
	readonly m_Sound: string
}

interface C_OP_SetControlPointOrientation extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_bUseWorldLocation: boolean
	readonly m_bRandomize: boolean
	readonly m_bSetOnce: boolean
	readonly m_nCP: number
	readonly m_nHeadLocation: number
	readonly m_vecRotation: QAngle
	readonly m_vecRotationB: QAngle
}

interface C_OP_NormalizeVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
}

interface CDampedPathAnimMotor extends CBasePathAnimMotor {
	readonly type_name: string
	readonly m_flAnticipationTime: number
	readonly m_anticipationPosParam: AnimParamID
	readonly m_anticipationHeadingParam: AnimParamID
	readonly m_flSpringConstant: number
	readonly m_flMinSpringTension: number
	readonly m_flMaxSpringTension: number
}

interface AnimResourceDataChannel_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_nType: number
}

interface C_INIT_InitialRepulsionVelocity extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_CollisionGroupName: string[]
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
	readonly m_nControlPointNumber: number
	readonly m_bPerParticle: boolean
	readonly m_bTranslate: boolean
	readonly m_bProportional: boolean
	readonly m_flTraceLength: number
	readonly m_bPerParticleTR: boolean
	readonly m_bInherit: boolean
	readonly m_nChildCP: number
	readonly m_nChildGroupID: number
}

interface SeqResourceMultiFetch_t_Flag_t {
	readonly type_name: string
	readonly m_bRealtime: boolean
	readonly m_bCylepose: boolean
	readonly m_b0D: boolean
	readonly m_b1D: boolean
	readonly m_b2D: boolean
	readonly m_b2D_TRI: boolean
}

interface EventClientPauseSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface CFireOverlay extends CGlowOverlay {
	readonly type_name: string
	readonly m_pOwner: C_FireSmoke
	readonly m_vBaseColors: Vector[]
	readonly m_flScale: number
	readonly m_nGUID: number
}

interface CThrustController {
	readonly type_name: string
	readonly m_thrustVector: Vector
	readonly m_torqueVector: Vector
	readonly m_thrust: number
}

interface C_OP_RemapControlPointDirectionToVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_nControlPointNumber: number
}

interface C_INIT_RemapInitialDirectionToCPToVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flScale: number
	readonly m_flOffsetRot: number
	readonly m_vecOffsetAxis: Vector
	readonly m_bNormalize: boolean
}

interface CPhysSurfaceProperties {
	readonly type_name: string
	readonly m_name: string
	readonly m_nameHash: number
	readonly m_baseNameHash: number
	readonly m_bHidden: boolean
	readonly m_description: string
	readonly m_physics: CPhysSurfacePropertiesPhysics
	readonly m_audioSounds: CPhysSurfacePropertiesSoundNames
	readonly m_audioParams: CPhysSurfacePropertiesAudio
}

interface FeTaperedCapsuleRigid_t {
	readonly type_name: string
	readonly nNode: number
	readonly nCollisionMask: number
	readonly vCenter: Vector[]
	readonly flRadius: number[]
	readonly flStickiness: number
}

interface CDOTA_Modifier_Lua_Vertical_Motion extends CDOTA_Modifier_Lua, CVerticalMotionController {
	readonly type_name: string
}

interface CTurnHelperAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_facingTarget: number
	readonly m_turnStartTime: number
	readonly m_turnDuration: number
	readonly m_bMatchChildDuration: boolean
	readonly m_bClampDurationToChild: boolean
	readonly m_bUseManualTurnOffset: boolean
	readonly m_manualTurnOffset: number
}

interface CActivityValues {
	readonly type_name: string
	readonly m_activityName: string
}

interface PermRenderMeshData_t {
	readonly type_name: string
}

interface ConstraintSlave_t {
	readonly type_name: string
	readonly m_nBoneHash: number
	readonly m_flWeight: number
	readonly m_vBasePosition: Vector
}

interface C_OP_SetCPtoVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCPInput: number
}

interface C_OP_MovementRotateParticleAroundAxis extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecRotAxis: Vector
	readonly m_flRotRate: number
	readonly m_nCP: number
	readonly m_bLocalSpace: boolean
}

interface C_INIT_CreateOnModel extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nForceInModel: number
	readonly m_nDesiredHitbox: number
	readonly m_nHitboxValueFromControlPointIndex: number
	readonly m_flHitBoxScale: number
	readonly m_flBoneVelocity: number
	readonly m_flMaxBoneVelocity: number
	readonly m_vecDirectionBias: Vector
	readonly m_HitboxSetName: string[]
	readonly m_bLocalCoords: boolean
	readonly m_bUseBones: boolean
}

interface CSolveIKChainAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_IkChains: string[]
}

interface AnimationRetargetChainData_t {
	readonly type_name: string
	readonly m_nGroupType: number
	readonly m_nChainType: number
}

interface CHitBox {
	readonly type_name: string
	readonly m_name: string
	readonly m_sSurfaceProperty: string
	readonly m_sBoneName: string
	readonly m_nBoneNameHash: number
	readonly m_nGroupId: number
	readonly m_cRenderColor: Color
	readonly m_nHitBoxIndex: number
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_bTranslationOnly: boolean
	readonly m_bVisible: boolean
	readonly m_bSelected: boolean
}

interface CRecipientFilter extends IRecipientFilter {
	readonly type_name: string
	readonly m_nBufType: number
	readonly m_bInitMessage: boolean
	readonly m_Recipients: C_BaseEntity[]
	readonly m_bUsingPredictionRules: boolean
	readonly m_bIgnorePredictionCull: boolean
}

interface InfoForResourceTypeAnimationResourceData_t {
	readonly type_name: string
}

interface ClusteredDistributionParams_t {
	readonly type_name: string
	readonly m_flClusterCoverageFraction: number
	readonly m_flClusterArea: number
}

interface C_OP_RampScalarSplineSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_Rate: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bEaseOut: boolean
}

interface C_EconItemAttribute {
	readonly type_name: string
	readonly m_iAttributeDefinitionIndex: number
	readonly m_flValue: number
}

interface C_CHintMessageQueue {
	readonly type_name: string
	readonly m_tmMessageEnd: number
	readonly m_messages: CHintMessage[]
	readonly m_pPlayer: C_BasePlayer
}

interface CTeamplayRules extends CMultiplayRules {
	readonly type_name: string
	readonly m_DisableDeathMessages: boolean
	readonly m_DisableDeathPenalty: boolean
	readonly m_teamLimit: boolean
	readonly m_szTeamList: string[]
	readonly m_bSwitchTeams: boolean
	readonly m_bScrambleTeams: boolean
}

interface AnimResourceFrameBlockAnim_t {
	readonly type_name: string
	readonly m_nStartFrame: number
	readonly m_nEndFrame: number
}

interface RenderSkeletonData_t {
	readonly type_name: string
	readonly m_nBoneCount: number
	readonly m_nBoneWeightCount: number
	readonly m_nFlags: number
}

interface FeQuad_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly flSlack: number
	readonly vShape: Vector4D[]
}

interface dota_minimap_boundary extends CEmptyEntityInstance {
	readonly type_name: string
}

interface vehicle_gear_t {
	readonly type_name: string
	readonly flMinSpeed: number
	readonly flMaxSpeed: number
	readonly flSpeedApproachFactor: number
}

interface C_INIT_VelocityFromNormal extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_fSpeedMin: number
	readonly m_fSpeedMax: number
	readonly m_bIgnoreDt: boolean
}

interface CSosGroupMatchPattern extends CSosGroupBranchPattern {
	readonly type_name: string
	readonly m_matchSoundEventName: string
	readonly m_matchSoundEventSubString: string
	readonly m_flEntIndex: number
	readonly m_flOpvar: number
}

interface InfoForResourceTypeCDotaItemDefinitionResource {
	readonly type_name: string
}

interface C_OP_SetControlPointsToParticle extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nChildGroupID: number
	readonly m_nFirstControlPoint: number
	readonly m_nNumControlPoints: number
	readonly m_nFirstSourcePoint: number
	readonly m_bSetOrientation: boolean
}

interface CSound {
	readonly type_name: string
	readonly m_hOwner: C_BaseEntity
	readonly m_hTarget: C_BaseEntity
	readonly m_iVolume: number
	readonly m_flOcclusionScale: number
	readonly m_iType: number
	readonly m_iNextAudible: number
	readonly m_flExpireTime: number
	readonly m_iNext: number
	readonly m_bNoExpirationTime: boolean
	readonly m_ownerChannelIndex: number
	readonly m_vecOrigin: Vector
	readonly m_bHasOwner: boolean
}

interface CSoundParameters {
	readonly type_name: string
	readonly channel: number
	readonly volume: number
	readonly pitch: number
	readonly pitchlow: number
	readonly pitchhigh: number
	readonly soundlevel: number
	readonly play_to_owner_only: boolean
	readonly m_nSpecialWaveFlags: number
	readonly count: number
	readonly soundname: string
	readonly delay_msec: number
	readonly m_pOperatorsKV: KeyValues
	readonly m_nRandomSeed: number
	readonly gameData: KeyValues
}

interface C_OP_NormalLock extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
}

interface CSSDSEndFrameViewInfo {
	readonly type_name: string
	readonly m_nViewId: number
	readonly m_ViewName: string
}

interface CSchemaFieldMetadataOverride extends SchemaFieldMetadataOverrideData_t {
	readonly type_name: string
}

interface CDOTA_Modifier_Lua_Horizontal_Motion extends CDOTA_Modifier_Lua, CHorizontalMotionController {
	readonly type_name: string
}

interface CTimeline extends IntervalTimer {
	readonly type_name: string
	readonly m_flValues: number[]
	readonly m_nValueCounts: number[]
	readonly m_nBucketCount: number
	readonly m_flInterval: number
	readonly m_flFinalValue: number
	readonly m_nCompressionType: number
	readonly m_bStopped: boolean
}

interface C_OP_TurbulenceForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flNoiseCoordScale0: number
	readonly m_flNoiseCoordScale1: number
	readonly m_flNoiseCoordScale2: number
	readonly m_flNoiseCoordScale3: number
	readonly m_vecNoiseAmount0: Vector
	readonly m_vecNoiseAmount1: Vector
	readonly m_vecNoiseAmount2: Vector
	readonly m_vecNoiseAmount3: Vector
}

interface InfoForResourceTypeVSound_t {
	readonly type_name: string
}

interface CLightInfoBase {
	readonly type_name: string
	readonly m_origin2D: Vector2D
	readonly m_Color: Color[]
	readonly m_LightScale: number[]
	readonly m_AmbientColor: Color[]
	readonly m_AmbientScale: number[]
	readonly m_ShadowColor: Color[]
	readonly m_ShadowSecondaryColor: Color[]
	readonly m_ShadowScale: number[]
	readonly m_ShadowGroundScale: number[]
	readonly m_SpecularColor: Color[]
	readonly m_flSpecularPower: number[]
	readonly m_flSpecularIndependence: number[]
	readonly m_SpecularDirection: Vector[]
	readonly m_InspectorSpecularDirection: Vector[]
	readonly m_LightDirection: Vector[]
	readonly m_AmbientDirection: Vector[]
	readonly m_FogColor: Color[]
	readonly m_FogStart: number[]
	readonly m_FogEnd: number[]
	readonly m_HeightFogValue: number[]
	readonly m_HeightFogColor: Color[]
	readonly m_FoWDarkness: number[]
	readonly m_FoWColorR: number[]
	readonly m_FoWColorG: number[]
	readonly m_FoWColorB: number[]
	readonly m_InspectorViewFogColor: Color[]
	readonly m_windAngle: QAngle
	readonly m_flWindAmount: number[]
	readonly m_flMinWind: number
	readonly m_flMaxWind: number
	readonly m_flMinGust: number
	readonly m_flMaxGust: number
	readonly m_flMinGustDelay: number
	readonly m_flMaxGustDelay: number
	readonly m_flGustDuration: number
	readonly m_flGustDirChange: number
	readonly m_skyboxAngle: QAngle[]
	readonly m_vSkyboxTintColor: Color[]
	readonly m_nSkyboxFogType: number
	readonly m_flSkyboxAngularFogMaxEnd: number
	readonly m_flSkyboxAngularFogMaxStart: number
	readonly m_flSkyboxAngularFogMinStart: number
	readonly m_flSkyboxAngularFogMinEnd: number
	readonly m_vAngularParams: Vector4D
	readonly m_vHeightFogColor: Color[]
	readonly m_flFogMaxZ: number
	readonly m_flFogDensity: number[]
	readonly m_flFogFalloff: number
	readonly m_flFogLayer0Rotation: number
	readonly m_flFogLayer0Scale: number
	readonly m_flFoglayer0ScrollU: number[]
	readonly m_flFoglayer0ScrollV: number[]
	readonly m_flFogLayer1Rotation: number
	readonly m_flFogLayer1Scale: number
	readonly m_flFoglayer1ScrollU: number[]
	readonly m_flFoglayer1ScrollV: number[]
	readonly m_flFogExclusionInnerRadius: number
	readonly m_flFogExclusionHeightBias: number
	readonly m_flCausticSpeedScale: number
	readonly m_flCausticAmplitudeScale: number
	readonly m_flColorWarpBlendToFull: number
	readonly m_fInnerRadius: number
	readonly m_fOuterRadius: number
	readonly m_flLightning_specular_pow_scale_min: number
	readonly m_flLightning_specular_pow_scale_max: number
	readonly m_lightningColor: Color
	readonly m_flLightningIntensityMin: number
	readonly m_flLightningIntensityMax: number
	readonly m_flLightningElevation: number
	readonly m_flLightningSpecularIntensity: number
	readonly m_flFarZOverride: number
	readonly m_flAmbientShadowAmount: number
	readonly m_nWeatherType: number
	readonly m_WeatherEffect: string
	readonly m_flLightning_period_min: number
	readonly m_flLightning_period_max: number
	readonly m_flLightning_duration_min: number
	readonly m_flLightning_duration_max: number
	readonly m_flLightning_fluctuation_min: number
	readonly m_flLightning_fluctuation_max: number
	readonly m_pszLightningSound: string[]
	readonly m_flNextLightningStartTime: number
	readonly m_flNextLightningEndTime: number
	readonly m_flLightningFluctuationTimeStart: number
	readonly m_flLightningFluctuationTimeEnd: number
	readonly m_flLightningNumFluctuations: number
	readonly m_flNextLightningSoundTime: number
	readonly m_bPlayLightingSound: boolean
	readonly m_flLightningEventMagnitude: number
	readonly m_flLightningScale: number
	readonly m_flLightningFluctuation: number
	readonly m_flLightningAngle: number
	readonly m_flLightningEventPercentage: number
}

interface HeroPickRecord_t {
	readonly type_name: string
	readonly eType: number
	readonly nHeroID: number
	readonly nTeam: number
}

interface IParticleSystemDefinition {
	readonly type_name: string
}

interface C_OP_RenderPoints extends CParticleFunctionRenderer {
	readonly type_name: string
}

interface C_OP_ScreenForceFromPlayerView extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flAccel: number
}

interface RnHull_t {
	readonly type_name: string
	readonly m_vCentroid: Vector
	readonly m_flMaxAngularRadius: number
	readonly m_vOrthographicAreas: Vector
	readonly m_MassProperties: matrix3x4_t
	readonly m_flVolume: number
	readonly m_flMaxMotionRadius: number
	readonly m_flMinMotionThickness: number
	readonly m_Bounds: AABB_t
	readonly m_nFlags: number
}

interface EventClientFrameSimulate_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRealTime: number
	readonly m_flFrameTime: number
}

interface C_CommandContext {
	readonly type_name: string
	readonly needsprocessing: boolean
	readonly command_number: number
}

interface CModifierParams {
	readonly type_name: string
	readonly ability: C_BaseEntity
	readonly fDamage: number
	readonly fOriginalDamage: number
	readonly nActivity: number
	readonly bTooltip: boolean
	readonly nTooltipParam: number
	readonly bIgnoreInvis: boolean
	readonly bNoCooldown: boolean
	readonly bReincarnate: boolean
	readonly bDoNotConsume: boolean
	readonly fDistance: number
	readonly fGain: number
	readonly fAttackTimeRemaining: number
	readonly m_nIssuerPlayerIndex: number
	readonly inflictor: C_BaseEntity
	readonly nDamageType: number
	readonly nDamageflags: number
	readonly nDamageCategory: number
	readonly iFailType: number
	readonly iRecord: number
	readonly pOrb: CDOTA_Orb
	readonly pOrb2: CDOTA_Orb
	readonly nCost: number
	readonly nOrdertype: number
	readonly vOldLoc: Vector
	readonly vNewLoc: Vector
	readonly bCraniumBasherTested: boolean
	readonly bMKBTested: boolean
	readonly bHeartRegenApplied: boolean
	readonly bDiffusalApplied: boolean
	readonly bChainLightningConsidered: boolean
	readonly bSuppressDamage: boolean
	readonly bRangedAttack: boolean
	readonly bProcessProcs: boolean
	readonly bProjectileIsFromIllusion: boolean
	readonly nPlayerids_stick: number
	readonly hattacker: C_BaseEntity
	readonly htarget: C_BaseEntity
	readonly hunit: C_BaseEntity
	readonly pAddedBuff: CDOTA_Buff
}

interface CDOTASubChallengeInfo {
	readonly type_name: string
	readonly nType: number
	readonly nTier: number
	readonly nSlotID: number
	readonly nProgress: number
	readonly nCompletionThreshold: number
	readonly nPlayerID: number
	readonly nQueryIndex: number
	readonly nEventID: number
	readonly nSequenceID: number
	readonly nRequiredHero: number
	readonly nCompleted: number
}

interface C_INIT_MoveBetweenPoints extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flSpeedMin: number
	readonly m_flSpeedMax: number
	readonly m_flEndSpread: number
	readonly m_flStartOffset: number
	readonly m_flEndOffset: number
	readonly m_nEndControlPointNumber: number
	readonly m_bTrailBias: boolean
}

interface AnimResourceAnimDesc_t {
	readonly type_name: string
	readonly m_flags: AnimResourceAnimDesc_t_Flag_t
	readonly fps: number
	readonly framestalltime: number
	readonly m_vecRootMin: Vector
	readonly m_vecRootMax: Vector
	readonly m_sequenceParams: AnimResourceSequenceParams_t
}

interface ConstraintTarget_t {
	readonly type_name: string
	readonly m_nBoneHash: number
	readonly m_flWeight: number
	readonly m_vOffset: Vector
	readonly m_bIsAttachment: boolean
}

interface dynpitchvol_t extends dynpitchvol_base_t {
	readonly type_name: string
}

interface C_OP_CurlNoiseForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_useCurl: boolean
	readonly m_vecNoiseFreq: Vector
	readonly m_vecNoiseScale: Vector
	readonly m_vecOffsetRate: Vector
}

interface C_OP_SpinUpdate extends CSpinUpdateBase {
	readonly type_name: string
}

interface CAnimParameterList {
	readonly type_name: string
}

interface C_DOTA_CombatLogQueryProgress {
	readonly type_name: string
	readonly m_nPlayerID: number
	readonly m_nQueryID: number
	readonly m_nQueryRank: number
	readonly m_nMultiQueryID: number
	readonly m_szRankIdentifier: string[]
}

interface CStopwatchBase extends CSimpleSimTimer {
	readonly type_name: string
	readonly m_fIsRunning: boolean
}

interface VPhysicsCollisionAttribute_t {
	readonly type_name: string
	readonly m_nInteractsAs: number
	readonly m_nInteractsWith: number
	readonly m_nInteractsExclude: number
	readonly m_nEntityId: number
	readonly m_nHierarchyId: number
	readonly m_nCollisionGroup: number
	readonly m_nCollisionFunctionMask: number
}

interface IBody extends INextBotComponent {
	readonly type_name: string
}

interface CSequenceTransitioner2 {
	readonly type_name: string
	readonly m_currentOp: CNetworkedSequenceOperation
	readonly m_flCurrentPlaybackRate: number
	readonly m_flCurrentAnimTime: number
	readonly m_transitioningLayers: TransitioningLayer_t[]
	readonly m_pOwner: CBaseAnimatingController
}

interface C_OP_RemapDistanceToLineSegmentToVector extends C_OP_RemapDistanceToLineSegmentBase {
	readonly type_name: string
	readonly m_vMinOutputValue: Vector
	readonly m_vMaxOutputValue: Vector
}

interface CParticleAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_particleSystemName: string
	readonly m_configName: string
	readonly m_bStopWhenTagEnds: boolean
	readonly m_bTagEndStopIsInstant: boolean
}

interface CCompressorGroup {
	readonly type_name: string
	readonly m_nTotalElementCount: number
	readonly m_szChannelClass: string[]
	readonly m_szVariableName: string[]
	readonly m_nType: fieldtype_t[]
	readonly m_nFlags: number[]
	readonly m_szGrouping: string[]
	readonly m_nCompressorIndex: number[]
	readonly m_nElementMask: number[]
}

interface CRenderBufferBinding {
	readonly type_name: string
	readonly m_hBuffer: number
	readonly m_nBindOffsetBytes: number
}

interface CBasePortraitData {
	readonly type_name: string
	readonly m_bHasSetupView: boolean
	readonly m_flRotation: number
}

interface C_OP_AlphaDecay extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flMinAlpha: number
}

interface C_OP_ExternalWindForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_vecScale: Vector
}

interface CAnimReplayFrame {
	readonly type_name: string
	readonly m_instanceData: CUtlBinaryBlock
	readonly m_poseRecipeInstanceData: CUtlBinaryBlock
	readonly m_localToWorldTransform: CTransform
	readonly m_waypoints: CAnimReplayWayPoint[]
	readonly m_timeStamp: number
}

interface CChoreoAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
}

interface CCopyRecipientFilter extends IRecipientFilter {
	readonly type_name: string
	readonly m_Flags: number
	readonly m_Recipients: C_BaseEntity[]
}

interface CRandSimTimer extends CSimpleSimTimer {
	readonly type_name: string
	readonly m_minInterval: number
	readonly m_maxInterval: number
}

interface C_OP_RenderText extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_OutlineColor: Color
	readonly m_DefaultText: string
}

interface CChoiceNodeChild {
	readonly type_name: string
	readonly m_nodeID: AnimNodeID
	readonly m_name: string
	readonly m_weight: number
}

interface CDOTA_Orb {
	readonly type_name: string
	readonly m_hCaster: C_BaseEntity
	readonly m_hAbility: C_BaseEntity
}

interface sSharedCooldownInfo {
	readonly type_name: string
	readonly cooldownName: string
	readonly cooldownLength: number
	readonly cooldownTime: number
}

interface C_INIT_InheritVelocity extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flVelocityScale: number
}

interface CSosSoundEventGroupSchema {
	readonly type_name: string
	readonly m_name: string
	readonly m_nType: number
	readonly m_bIsBlocking: boolean
	readonly m_nBlockMaxCount: number
	readonly m_bInvertMatch: boolean
	readonly m_matchPattern: CSosGroupMatchPattern
	readonly m_branchPattern: CSosGroupBranchPattern
	readonly m_vActions: CSosGroupActionSchema[]
}

interface BundleData_t {
	readonly type_name: string
	readonly m_flULeftSrc: number
	readonly m_flVTopSrc: number
}

interface C_OP_ClampScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_OP_TwistAroundAxis extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_fForceAmount: number
	readonly m_TwistAxis: Vector
	readonly m_bLocalSpace: boolean
	readonly m_nControlPointNumber: number
}

interface VSoundEvent_t {
	readonly type_name: string
stringstringstring}

interface RnHalfEdge_t {
	readonly type_name: string
	readonly m_nNext: number
	readonly m_nTwin: number
	readonly m_nOrigin: number
	readonly m_nFace: number
}

interface CVRHandAttachmentInput {
	readonly type_name: string
	readonly m_nButtons: number
	readonly m_afButtonPressed: number
	readonly m_afButtonReleased: number
	readonly m_flTriggerAnalogValue: number
	readonly m_flGripAnalogValue: number
	readonly m_flFinger0: number
	readonly m_flFinger1: number
	readonly m_flFinger2: number
	readonly m_flFinger3: number
	readonly m_flFinger4: number
	readonly m_flTrackpadAnalogValueX: number
	readonly m_flTrackpadAnalogValueY: number
	readonly m_flJoystickAnalogValueX: number
	readonly m_flJoystickAnalogValueY: number
	readonly m_pHand: CPropVRHand
}

interface CPlayerLocalData {
	readonly type_name: string
	readonly m_NetworkVar_PathIndex: ChangeAccessorFieldPathIndex_t
	readonly m_stringeaBits: number[]
	readonly m_stringeaPortalBits: number[]
	readonly m_nStepside: number
	readonly m_nOldButtons: number
	readonly m_iHideHUD: number
	readonly m_flFOVRate: number
	readonly m_vecOverViewpoint: Vector
	readonly m_bDucked: boolean
	readonly m_bDucking: boolean
	readonly m_bInDuckJump: boolean
	readonly m_nDuckTimeMsecs: number
	readonly m_nDuckJumpTimeMsecs: number
	readonly m_nJumpTimeMsecs: number
	readonly m_flFallVelocity: number
	readonly m_bDrawViewmodel: boolean
	readonly m_bWearingSuit: boolean
	readonly m_bPoisoned: boolean
	readonly m_flStepSize: number
	readonly m_bAllowAutoMovement: boolean
	readonly m_bSlowMovement: boolean
	readonly m_bAutoAimTarget: boolean
	readonly m_skybox3d: sky3dparams_t
	readonly m_audio: audioparams_t
	readonly m_fog: fogparams_t
}

interface CSceneEventInfo {
	readonly type_name: string
	readonly m_bStarted: boolean
	readonly m_iLayer: number
	readonly m_iPriority: number
	readonly m_bIsGesture: boolean
	readonly m_flWeight: number
	readonly m_hTarget: C_BaseEntity
	readonly m_bIsMoving: boolean
	readonly m_bHasArrived: boolean
	readonly m_flInitialYaw: number
	readonly m_flTargetYaw: number
	readonly m_flFacingYaw: number
	readonly m_nType: number
	readonly m_flNext: number
	readonly m_bClientSide: boolean
	readonly m_bShouldRemove: boolean
}

interface C_OP_ClampVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecOutputMin: Vector
	readonly m_vecOutputMax: Vector
}

interface EventClientProcessNetworking_t {
	readonly type_name: string
}

interface PlayerSeatAssignment_t {
	readonly type_name: string
	readonly unAccountID: number
	readonly unSeat: number
	readonly unReversedSeat: number
	readonly unTeamID: number
}

interface InfoForResourceTypeCPanoramaLayout {
	readonly type_name: string
}

interface C_OP_LockToSavedSequentialPath extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flFadeStart: number
	readonly m_flFadeEnd: number
	readonly m_bCPPairs: boolean
	readonly m_PathParams: CPathParameters
}

interface C_INIT_RemapInitialVisibilityScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface TimedKillEvent_t {
	readonly type_name: string
	readonly m_nKillTime: number
	readonly m_flKillValue: number
	readonly m_nPlayerID: number
}

interface CPhysicsShake {
	readonly type_name: string
	readonly m_force: Vector
}

interface C_OP_RenderLights extends C_OP_RenderPoints {
	readonly type_name: string
	readonly m_flAnimationRate: number
	readonly m_bFitCycleToLifetime: boolean
	readonly m_bAnimateInFPS: boolean
	readonly m_flMinSize: number
	readonly m_flMaxSize: number
	readonly m_flStartFadeSize: number
	readonly m_flEndFadeSize: number
}

interface CTimeCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface C_OP_RemapNamedModelSequenceEndCap extends C_OP_RemapNamedModelElementEndCap {
	readonly type_name: string
}

interface EventClientProcessGameInput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRealTime: number
	readonly m_flFrameTime: number
}

interface VsInputSignatureElement_t {
	readonly type_name: string
	readonly m_pName: string[]
	readonly m_pSemantic: string[]
	readonly m_pD3DSemanticName: string[]
	readonly m_nD3DSemanticIndex: number
}

interface CDOTA_Modifier_Lua_Motion_Both extends CDOTA_Modifier_Lua, CVerticalMotionController, CHorizontalMotionController {
	readonly type_name: string
}

interface C_OP_EnableChildrenFromParentParticleCount extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nChildGroupID: number
	readonly m_nFirstChild: number
	readonly m_nNumChildrenToEnable: number
}

interface C_INIT_RandomRotationSpeed extends CGeneralRandomRotation {
	readonly type_name: string
}

interface VertexPositionColor_t {
	readonly type_name: string
	readonly m_vPosition: Vector
}

interface CFailableAchievement extends CBaseAchievement {
	readonly type_name: string
	readonly m_bActivated: boolean
	readonly m_bFailed: boolean
}

interface C_OP_CalculateVectorAttribute extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vStartValue: Vector
	readonly m_flInputScale1: number
	readonly m_flInputScale2: number
	readonly m_nControlPointInput1: ControlPointReference_t
	readonly m_flControlPointScale1: number
	readonly m_nControlPointInput2: ControlPointReference_t
	readonly m_flControlPointScale2: number
	readonly m_vFinalOutputScale: Vector
}

interface C_OP_SetCPOrientationToPointAtCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nInputCP: number
	readonly m_nOutputCP: number
}

interface SceneObject_t {
	readonly type_name: string
	readonly m_nObjectID: number
	readonly m_vTransform: Vector4D[]
	readonly m_flFadeStartDistance: number
	readonly m_flFadeEndDistance: number
	readonly m_vTintColor: Vector4D
	readonly m_nObjectTypeFlags: number
	readonly m_vLightingOrigin: Vector
	readonly m_nLightGroup: number
	readonly m_nOverlayRenderOrder: number
	readonly m_nCubeMapPrecomputedHandshake: number
	readonly m_nLightProbeVolumePrecomputedHandshake: number
}

interface CSSDSMsg_ViewTarget {
	readonly type_name: string
	readonly m_Name: string
	readonly m_TextureId: number
	readonly m_nWidth: number
	readonly m_nHeight: number
	readonly m_nRequestedWidth: number
	readonly m_nRequestedHeight: number
	readonly m_nNumMipLevels: number
	readonly m_nDepth: number
	readonly m_nMultisampleNumSamples: number
	readonly m_nFormat: number
}

interface PostProcessingBloomParameters_t {
	readonly type_name: string
	readonly m_blendMode: number
	readonly m_flBloomStrength: number
	readonly m_flScreenBloomStrength: number
	readonly m_flBlurBloomStrength: number
	readonly m_flBloomThreshold: number
	readonly m_flBloomThresholdWidth: number
	readonly m_flSkyboxBloomStrength: number
	readonly m_flBloomStartValue: number
	readonly m_flBlurWeight: number[]
	readonly m_vBlurTint: Vector[]
	readonly m_bHDRMode: boolean
}

interface HitBox_t {
	readonly type_name: string
	readonly m_nGroupId: number
	readonly m_nBoneNameHash: number
	readonly m_cRenderColor: number[]
	readonly m_nHitBoxIndex: number
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_bVisible: boolean
}

interface CDOTA_Bot {
	readonly type_name: string
	readonly m_iLifesteal: number
	readonly m_iBlock: number
	readonly m_bForceIdle: boolean
	readonly m_bForceCreepAttack: boolean
	readonly m_fExecutionTime: number[]
	readonly m_iCurExecutionTime: number
	readonly m_iPlayerID: number
	readonly m_hUnit: C_BaseEntity
	readonly m_pTeamCommander: CDOTA_TeamCommander
	readonly m_iUnitType: number
	readonly m_fAggressionFactor: number
	readonly m_bHuman: boolean
	readonly m_bLiquidate: boolean
	readonly m_bDoNotPurchase: boolean
	readonly m_iDifficulty: number
	readonly m_bIsFullScriptTakeover: boolean
	readonly m_CurrentLane: number
	readonly m_MostRecentLane: number
	readonly m_AssignedLane: number
	readonly m_TargetLane: number
	readonly m_ForcedLane: number
	readonly m_fCurrentLaneAmount: number
	readonly m_fEstimatedUnitDamage: number
	readonly m_fEstimatedMaxUnitDamage: number
	readonly m_fEstimatedBuildingDamage: number
	readonly m_bWantsToCast: boolean
	readonly m_iWantsToCastFrame: number
	readonly m_bWantsToAttack: boolean
	readonly m_iWantsToAttackFrame: number
	readonly m_UpdateCurrentLaneTimer: CountdownTimer
	readonly m_UpdateModeTimer: CountdownTimer
	readonly m_ModeThinkTimer: CountdownTimer
	readonly m_InteralRatingsTimer: CountdownTimer
	readonly m_BuybackDelayTimer: CountdownTimer
	readonly m_CourierUsageTimer: CountdownTimer
	readonly m_AbilityMutedTimer: CountdownTimer
	readonly m_AbilityMutedCheckTimer: CountdownTimer
	readonly m_HitByTowerTime: number
	readonly m_HitByHeroTime: number[]
	readonly m_HitByCreepTime: number
	readonly m_nEstimatedDamageUpdatedTick: number
	readonly m_nNearbyUnitsUpdatedTick: number
	readonly m_NearbyTrees: number[]
	readonly m_nNearbyEnemyCreeps: number
	readonly m_nAttackingCreeps: number
	readonly m_nAttackingTowers: number
	readonly m_nAttackingHeroes: number
	readonly m_fLastSeen: number
	readonly m_nFailedPaths: number
	readonly m_hTarget: C_BaseEntity
	readonly m_vTargetLoc: Vector
	readonly m_fTargetLastSeen: number
	readonly m_hTargetLastHitCreep: C_BaseEntity
	readonly m_bWasInvisible: boolean
	readonly m_bKnownInvisible: boolean
	readonly m_vLastSeenLoc: Vector
	readonly m_vRequestedBlinkLoc: Vector
	readonly m_fRequestedBlinkStart: number
	readonly m_fRequestedBlinkExpire: number
	readonly m_hMinions: C_BaseEntity[]
	readonly m_Build: CDOTABaseAbility[]
	readonly m_fModeDesires: number[]
	readonly m_iPreviousBotModeType: number
	readonly m_fPendingActionExecuteTime: number
	readonly m_bPendingActionBypass: boolean
	readonly m_nForceAbility: number
}

interface C_OP_EndCapDecay extends CParticleFunctionOperator {
	readonly type_name: string
}

interface VirtualVolumeTexData_t {
	readonly type_name: string
	readonly m_vBoundsMin: Vector
	readonly m_vBoundsMax: Vector
	readonly m_vPlaneX: Vector4D
	readonly m_vPlaneY: Vector4D
	readonly m_vPlaneZ: Vector4D
	readonly m_vPlaneEndDistancesXYZ: Vector
	readonly m_nVirtualResX: number
	readonly m_nVirtualResY: number
	readonly m_nVirtualResZ: number
	readonly m_nPageDataTotalSize: number
}

interface RnSphereDesc_t extends RnShapeDesc_t {
	readonly type_name: string
	readonly m_Sphere: RnSphere_t
}

interface CBoneConstraintPoseSpaceMorph extends CBoneConstraintBase {
	readonly type_name: string
	readonly m_sBoneName: string
	readonly m_sAttachmentName: string
	readonly m_outputMorph: string[]
}

interface C_INIT_RemapCPtoScalar extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_nField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bScaleInitialRange: boolean
	readonly m_flRemapBias: number
}

interface CSSDSMsg_PreLayer extends CSSDSMsg_LayerBase {
	readonly type_name: string
}

interface IServerVehicle extends IVehicle {
	readonly type_name: string
}

interface RnSoftbodyParticle_t {
	readonly type_name: string
	readonly m_flMassInv: number
}

interface CPassengerSeatTransition {
	readonly type_name: string
	readonly m_strAnimationName: string
	readonly m_nPriority: number
}

interface CHeroStatueLiked {
	readonly type_name: string
	readonly m_iPlayerIDLiker: number
	readonly m_iPlayerIDLiked: number
}

interface CEffectScriptElement {
	readonly type_name: string
	readonly m_szEffectName: string[]
	readonly m_bTrailActive: boolean
	readonly m_pSprite: C_BaseEntity
	readonly m_iType: number
	readonly m_iRenderType: number
	readonly m_iR: number
	readonly m_iG: number
	readonly m_iB: number
	readonly m_iA: number
	readonly m_szAttachment: string[]
	readonly m_szMaterial: string[]
	readonly m_flScale: number
	readonly m_flFadeTime: number
	readonly m_flTextureRes: number
	readonly m_bStopFollowOnKill: boolean
	readonly m_bActive: boolean
}

interface EventFrameBoundary_t {
	readonly type_name: string
	readonly m_flFrameTime: number
}

interface InfoForResourceTypeCRenderMesh {
	readonly type_name: string
}

interface vehiclesounds_t {
	readonly type_name: string
	readonly pGears: vehicle_gear_t[]
	readonly crashSounds: vehicle_crashsound_t[]
	readonly iszSound: string[]
	readonly iszStateSounds: string[]
	readonly minStateTime: number[]
}

interface CSimTimer extends CSimpleSimTimer {
	readonly type_name: string
	readonly m_interval: number
}

interface CHeroesPerPlayer {
	readonly type_name: string
	readonly m_vecHeroIDs: number[]
}

interface C_INIT_RemapParticleCountToNamedModelBodyPartScalar extends C_INIT_RemapParticleCountToNamedModelElementScalar {
	readonly type_name: string
}

interface BakedLightingInfo_t {
	readonly type_name: string
	readonly m_nPerVertexLightingDataPlainRGBMWidth: number
	readonly m_nPerVertexLightingDataPlainRGBMHeight: number
	readonly m_nPerVertexLightingDataPlainRGBMDepth: number
	readonly m_nLightmapVersionNumber: number
	readonly m_bHasLightmaps: boolean
}

interface BoneOverride_t extends BaseSceneObjectOverride_t {
	readonly type_name: string
}

interface WeightedSuggestion_t {
	readonly type_name: string
	readonly nSuggestion: number
	readonly fWeight: number
}

interface CAI_ExpresserWithFollowup extends CAI_Expresser {
	readonly type_name: string
	readonly m_pPostponedFollowup: ResponseFollowup
}

interface EventPostAdvanceTick_t extends EventSimulate_t {
	readonly type_name: string
	readonly m_nCurrentTick: number
	readonly m_nTotalTicksThisFrame: number
	readonly m_nTotalTicks: number
}

interface IPhysicsPlayerController {
	readonly type_name: string
}

interface C_OP_RemapSpeedtoCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nInControlPointNumber: number
	readonly m_nOutControlPointNumber: number
	readonly m_nField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_OP_WindForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_vForce: Vector
}

interface AnimationGroupResourceData_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_decodeKey: AnimationKeyResourceData_t
	readonly m_retarget: AnimationRetargetData_t
}

interface EventServerPostAdvanceTick_t extends EventPostAdvanceTick_t {
	readonly type_name: string
}

interface EventClientPreOutput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRenderTime: number
	readonly m_flRenderFrameTime: number
	readonly m_flRenderFrameTimeUnbounded: number
}

interface CSchemaEnumeratorInfo extends SchemaEnumeratorInfoData_t {
	readonly type_name: string
}

interface C_OP_DampenToCP extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flRange: number
	readonly m_flScale: number
}

interface C_OP_PositionLock extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flStartTime_min: number
	readonly m_flStartTime_max: number
	readonly m_flStartTime_exp: number
	readonly m_flEndTime_min: number
	readonly m_flEndTime_max: number
	readonly m_flEndTime_exp: number
	readonly m_flRange: number
	readonly m_flJumpThreshold: number
	readonly m_flPrevPosScale: number
	readonly m_bLockRot: boolean
}

interface RnSoftbodySpring_t {
	readonly type_name: string
	readonly m_nParticle: number[]
	readonly m_flLength: number
}

interface RnHullDesc_t extends RnShapeDesc_t {
	readonly type_name: string
	readonly m_Hull: RnHull_t
}

interface SeqResourceAutoLayerFlag_t {
	readonly type_name: string
	readonly m_bPost: boolean
	readonly m_bSpline: boolean
	readonly m_bXFade: boolean
	readonly m_bNoBlend: boolean
	readonly m_bLocal: boolean
	readonly m_bPose: boolean
	readonly m_bFetchFrame: boolean
	readonly m_bSubtract: boolean
}

interface FeNodeReverseOffset_t {
	readonly type_name: string
	readonly nBoneCtrl: number
	readonly nTargetNode: number
	readonly vOffset: Vector
}

interface C_OP_RemapCPtoScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_nField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_flInterpRate: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
}

interface C_OP_Spin extends CGeneralSpin {
	readonly type_name: string
}

interface EventClientSendInput_t {
	readonly type_name: string
}

interface C_SpeechBubbleInfo {
	readonly type_name: string
	readonly m_LocalizationStr: string[]
	readonly m_hNPC: C_BaseEntity
	readonly m_flDuration: number
	readonly m_unOffsetX: number
	readonly m_unOffsetY: number
	readonly m_unCount: number
}

interface CDOTA_CreepKillInfo {
	readonly type_name: string
	readonly m_flTimeOfDeath: number
	readonly m_flDeathFlightDuration: number
	readonly m_vWsKillDirection: Vector
	readonly m_vWsKillOrigin: Vector
}

interface C_INIT_CreateFromCPs extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nIncrement: number
	readonly m_nMinCP: number
	readonly m_nMaxCP: number
}

interface FeCollisionSphere_t {
	readonly type_name: string
	readonly nCtrlParent: number
	readonly nChildNode: number
	readonly m_flRFactor: number
	readonly m_vOrigin: Vector
	readonly flStickiness: number
}

interface CBaseAnimatingController extends CSkeletonAnimationController {
	readonly type_name: string
	readonly m_baseLayer: CNetworkedSequenceOperation
	readonly m_animGraphNetworkedVars: CAnimGraphNetworkedVariables
	readonly m_bSequenceFinished: boolean
	readonly m_flGroundSpeed: number
	readonly m_flLastEventCycle: number
	readonly m_flLastEventAnimTime: number
	readonly m_flPrevAnimTime: number
	readonly m_flPoseParameter: number[]
	readonly m_bClientSideAnimation: boolean
	readonly m_bNetworkedAnimationInputsChanged: boolean
	readonly m_nNewSequenceParity: number
	readonly m_nResetEventsParity: number
	readonly m_flIKGroundContactTime: number
	readonly m_flIKGroundMinHeight: number
	readonly m_flIKGroundMaxHeight: number
	readonly m_flIkZAdjustAmount: number
	readonly m_SequenceTransitioner: CSequenceTransitioner2
}

interface RenderBufferBinding_t {
	readonly type_name: string
	readonly m_hBuffer: number
	readonly m_nBindOffsetBytes: number
}

interface EntityIOConnectionData_t {
	readonly type_name: string
	readonly m_targetType: number
	readonly m_flDelay: number
	readonly m_nTimesToFire: number
}

interface C_HorizontalMotionController {
	readonly type_name: string
}

interface CNetworkViewOffsetVector {
	readonly type_name: string
}

interface CGlowProperty {
	readonly type_name: string
	readonly m_fGlowColor: Vector
	readonly m_iGlowTeam: number
	readonly m_iGlowType: number
	readonly m_nGlowRange: number
	readonly m_nGlowRangeMin: number
	readonly m_glowColorOverride: Color
	readonly m_bFlashing: boolean
	readonly m_bGlowing: boolean
}

interface C_OP_RemapDistanceToLineSegmentToScalar extends C_OP_RemapDistanceToLineSegmentBase {
	readonly type_name: string
	readonly m_flMinOutputValue: number
	readonly m_flMaxOutputValue: number
}

interface InfoForResourceTypeSequenceGroupResourceData_t {
	readonly type_name: string
}

interface CSchemaMetaModifyAdd extends SchemaMetaModifyAdd_t {
	readonly type_name: string
}

interface hudtextparms_t {
	readonly type_name: string
	readonly color1: Color
	readonly color2: Color
	readonly effect: number
	readonly channel: number
	readonly x: number
	readonly y: number
	readonly fadeinTime: number
	readonly fadeoutTime: number
	readonly holdTime: number
	readonly fxTime: number
}

interface C_OP_SetControlPointToCenter extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCP1: number
	readonly m_vecCP1Pos: Vector
}

interface C_INIT_CreationNoise extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bAbsVal: boolean
	readonly m_bAbsValInv: boolean
	readonly m_flOffset: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flNoiseScale: number
	readonly m_flNoiseScaleLoc: number
	readonly m_vecOffsetLoc: Vector
	readonly m_flWorldTimeScale: number
}

interface CAddAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_baseChildID: AnimNodeID
	readonly m_additiveChildID: AnimNodeID
	readonly m_timingBehavior: number
	readonly m_flTimingBlend: number
	readonly m_bResetBase: boolean
	readonly m_bResetAdditive: boolean
	readonly m_bApplyChannelsSeparately: boolean
}

interface CSchemaClassField extends SchemaClassFieldData_t {
	readonly type_name: string
}

interface C_DotaTree {
	readonly type_name: string
	readonly m_nOccluderIndex: number
}

interface GameFileWeaponInfo_t extends FileWeaponInfo_t {
	readonly type_name: string
}

interface ParticlePreviewState_t {
	readonly type_name: string
	readonly m_previewModel: string
	readonly m_nModSpecificData: number
	readonly m_groundType: number
	readonly m_sequenceName: string
	readonly m_nFireParticleOnSequenceFrame: number
	readonly m_hitboxSetName: string
	readonly m_materialGroupName: string
	readonly m_vecBodyGroups: ParticlePreviewBodyGroup_t[]
	readonly m_stencilWriteName: string
	readonly m_flPlaybackSpeed: number
	readonly m_flParticleSimulationRate: number
	readonly m_bShouldDrawHitboxes: boolean
	readonly m_bShouldDrawAttachments: boolean
	readonly m_bShouldDrawAttachmentNames: boolean
	readonly m_bShouldDrawControlPointAxes: boolean
	readonly m_bAnimationNonLooping: boolean
}

interface C_OP_SetControlPointPositions extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_bUseWorldLocation: boolean
	readonly m_bOrient: boolean
	readonly m_bSetOnce: boolean
	readonly m_nCP1: number
	readonly m_nCP2: number
	readonly m_nCP3: number
	readonly m_nCP4: number
	readonly m_vecCP1Pos: Vector
	readonly m_vecCP2Pos: Vector
	readonly m_vecCP3Pos: Vector
	readonly m_vecCP4Pos: Vector
	readonly m_nHeadLocation: number
}

interface CWayPointHelperAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_flStartCycle: number
	readonly m_flEndCycle: number
	readonly m_bOnlyGoals: boolean
	readonly m_bPreventOvershoot: boolean
	readonly m_bPreventUndershoot: boolean
}

interface SeqResourceMultiFetch_t {
	readonly type_name: string
	readonly m_flags: SeqResourceMultiFetch_t_Flag_t
	readonly m_nGroupSize: number[]
	readonly m_nLocalPose: number[]
	readonly m_nLocalCyclePoseParameter: number
	readonly m_bCalculatePoseParameters: boolean
}

interface CRMSG_Entity_Info {
	readonly type_name: string
	readonly m_nEHandle: number
	readonly m_pEntityName: string[]
	readonly m_pEntityClass: string[]
}

interface CDOTASpectatorGraphManager {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_nPlayerDataCount: number
	readonly m_SendTeamStatsTimer: CountdownTimer
	readonly m_bTrackingTeamStats: boolean
	readonly m_flStartTime: number
	readonly m_nNextUpdatePlayer: number
	readonly m_rgPlayerGraphData: C_BaseEntity[]
	readonly m_rgRadiantTotalEarnedGold: number[]
	readonly m_rgDireTotalEarnedGold: number[]
	readonly m_rgRadiantTotalEarnedXP: number[]
	readonly m_rgDireTotalEarnedXP: number[]
	readonly m_rgRadiantNetWorth: number[]
	readonly m_rgDireNetWorth: number[]
	readonly m_flTotalEarnedGoldStartTime: number
	readonly m_flTotalEarnedGoldEndTime: number
	readonly m_nGoldGraphVersion: number
	readonly m_rgRadiantWinChance: number[]
	readonly m_TeamStatsUpdateTimer: CountdownTimer
	readonly m_HeroInventorySnapshotTimer: CountdownTimer
	readonly m_vecPlayerSnapshots: sPlayerSnapshot[]
	readonly m_event_dota_player_killed: number
	readonly m_event_server_pre_shutdown: number
	readonly m_event_dota_player_pick_hero: number
}

interface C_OP_SetFloat extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_InputValue: CParticleFloatInput
}

interface C_OP_DistanceCull extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPoint: number
	readonly m_vecPointOffset: Vector
	readonly m_flDistance: number
	readonly m_bCullInside: boolean
}

interface C_INIT_VelocityRadialRandom extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_fSpeedMin: number
	readonly m_fSpeedMax: number
	readonly m_vecLocalCoordinateSystemSpeedScale: Vector
	readonly m_bIgnoreDelta: boolean
}

interface CAnimStateTransition {
	readonly type_name: string
	readonly m_blendDuration: number
	readonly m_destState: AnimStateID
	readonly m_bReset: boolean
	readonly m_resetCycleOption: number
	readonly m_flFixedCycleValue: number
	readonly m_blendCurve: CBlendCurve
}

interface FeCtrlOsOffset_t {
	readonly type_name: string
	readonly nCtrlParent: number
	readonly nCtrlChild: number
}

interface C_CSequenceTransitioner2 {
	readonly type_name: string
	readonly m_currentOp: CNetworkedSequenceOperation
	readonly m_flCurrentPlaybackRate: number
	readonly m_flCurrentAnimTime: number
	readonly m_transitioningLayers: TransitioningLayer_t[]
	readonly m_pOwner: C_BaseAnimatingController
}

interface ModelBoneFlexDriver_t {
	readonly type_name: string
	readonly m_boneNameToken: number
}

interface EventAppShutdown_t {
	readonly type_name: string
	readonly m_nDummy0: number
}

interface FeSimdSpringIntegrator_t {
	readonly type_name: string
	readonly nNode: number[]
}

interface C_ViewSmoothingData_t {
	readonly type_name: string
	readonly pVehicle: C_BaseAnimating
	readonly bClampEyeAngles: boolean
	readonly flPitchCurveZero: number
	readonly flPitchCurveLinear: number
	readonly flRollCurveZero: number
	readonly flRollCurveLinear: number
	readonly flFOV: number
	readonly pitchLockData: ViewLockData_t
	readonly rollLockData: ViewLockData_t
	readonly bDampenEyePosition: boolean
	readonly bRunningEnterExit: boolean
	readonly bWasRunningAnim: boolean
	readonly flEnterExitStartTime: number
	readonly flEnterExitDuration: number
	readonly vecAnglesSaved: QAngle
	readonly vecOriginSaved: Vector
	readonly vecAngleDiffSaved: QAngle
	readonly vecAngleDiffMin: QAngle
}

interface CHintMessage {
	readonly type_name: string
	readonly m_hintString: string
	readonly m_args: string[]
	readonly m_duration: number
}

interface WeaponTextureData_t {
	readonly type_name: string
	readonly m_Name: string
	readonly m_Sprite: string
	readonly m_Font: string
	readonly m_x: number
	readonly m_y: number
	readonly m_width: number
	readonly m_height: number
	readonly m_FontCharacter: number
}

interface C_OP_LocalAccelerationForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_nScaleCP: number
	readonly m_vecAccel: Vector
}

interface CAnimReplayWayPoint {
	readonly type_name: string
	readonly m_vPosition: Vector
	readonly m_flFacing: number
}

interface SeqResourceS1SeqDesc_t {
	readonly type_name: string
	readonly m_flags: SeqResourceSeqDesc_t_Flag_t
	readonly m_fetch: SeqResourceMultiFetch_t
	readonly m_nLocalWeightlist: number
	readonly m_transition: SeqResourceTransition_t
string}

interface CRCMD_SetProfileMode {
	readonly type_name: string
	readonly m_bEnableProfiling: boolean
}

interface CUnitOrders {
	readonly type_name: string
	readonly m_nUnits: C_BaseEntity[]
	readonly m_vPosition: Vector
	readonly m_nIssuerPlayerIndex: number
	readonly m_nOrderSequenceNumber: number
	readonly m_nOrderType: number
	readonly m_nTargetIndex: C_BaseEntity
	readonly m_nAbilityIndex: C_BaseEntity
	readonly m_bQueue: boolean
}

interface InfoForResourceTypeVMapResourceData_t {
	readonly type_name: string
}

interface SimpleConstraintSoundProfile {
	readonly type_name: string
	readonly eKeypoints: number
	readonly m_keyPoints: number[]
	readonly m_reversalSoundThresholds: number[]
}

interface CPassengerRole {
	readonly type_name: string
	readonly m_strName: string
	readonly m_PassengerSeats: CPassengerSeat[]
}

interface CNavVolumeAll extends CNavVolumeVector {
	readonly type_name: string
}

interface C_INIT_RemapNamedModelBodyPartToScalar extends C_INIT_RemapNamedModelElementToScalar {
	readonly type_name: string
}

interface CEnumAnimParameter extends CAnimParameterBase {
	readonly type_name: string
	readonly m_defaultValue: number
	readonly m_enumOptions: string[]
}

interface ragdollelement_t {
	readonly type_name: string
	readonly originParentSpace: Vector
	readonly parentIndex: number
	readonly m_flRadius: number
}

interface C_OP_RampCPLinearRandom extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nOutControlPointNumber: number
	readonly m_vecRateMin: Vector
	readonly m_vecRateMax: Vector
}

interface CClothSettingsAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_flStiffness: number
	readonly m_flEaseIn: number
	readonly m_flEaseOut: number
}

interface SeqResourceAutoLayer_t {
	readonly type_name: string
	readonly m_nLocalReference: number
	readonly m_nLocalPose: number
	readonly m_flags: SeqResourceAutoLayerFlag_t
	readonly m_start: number
	readonly m_peak: number
	readonly m_tail: number
	readonly m_end: number
}

interface AnimationSnapshot_t extends AnimationSnapshotBase_t {
	readonly type_name: string
	readonly m_nEntIndex: number
	readonly m_modelName: string
}

interface VPhysXCollisionAttributes_t {
	readonly type_name: string
	readonly m_CollisionGroup: number
string}

interface C_OP_OscillateScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_RateMin: number
	readonly m_RateMax: number
	readonly m_FrequencyMin: number
	readonly m_FrequencyMax: number
	readonly m_bProportional: boolean
	readonly m_bProportionalOp: boolean
	readonly m_flStartTime_min: number
	readonly m_flStartTime_max: number
	readonly m_flEndTime_min: number
	readonly m_flEndTime_max: number
	readonly m_flOscMult: number
	readonly m_flOscAdd: number
}

interface CMultiplayer_Expresser extends CAI_ExpresserWithFollowup {
	readonly type_name: string
	readonly m_bAllowMultipleScenes: boolean
}

interface VPhysXShapeCompoundHeader2_t extends VPhysXDiskShapeHeader_t {
	readonly type_name: string
}

interface SheetSequenceFrame_t {
	readonly type_name: string
	readonly m_flDisplayTime: number
}

interface InfoForResourceTypeIParticleSystemDefinition {
	readonly type_name: string
}

interface C_INIT_PointList extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bPlaceAlongPath: boolean
	readonly m_bClosedLoop: boolean
	readonly m_nNumPointsAlongPath: number
}

interface C_SunGlowOverlay extends CGlowOverlay {
	readonly type_name: string
	readonly m_bModulateByDot: boolean
}

interface ragdoll_t {
	readonly type_name: string
	readonly list: ragdollelement_t[]
	readonly boneIndex: number[]
	readonly allowStretch: boolean
	readonly unused: boolean
}

interface C_OP_AttractToControlPoint extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_vecComponentScale: Vector
	readonly m_fForceAmount: number
	readonly m_fFalloffPower: number
	readonly m_nControlPointNumber: number
	readonly m_nScaleCP: number
	readonly m_nScaleCPField: number
	readonly m_bScaleLocal: boolean
	readonly m_bRemapPullForceToLife: boolean
	readonly m_fForceAmountMin: number
	readonly m_fLifespanScaleExp: number
}

interface C_INIT_CreateInEpitrochoid extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nComponent1: number
	readonly m_nComponent2: number
	readonly m_nControlPointNumber: number
	readonly m_nScaleCP: number
	readonly m_flParticleDensity: number
	readonly m_flOffset: number
	readonly m_flRadius1: number
	readonly m_flRadius2: number
	readonly m_bUseCount: boolean
	readonly m_bUseLocalCoords: boolean
	readonly m_bOffsetExistingPos: boolean
}

interface CCycleCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface CBoneConstraintPoseSpaceBone extends CBaseConstraint {
	readonly type_name: string
}

interface EventServerPostSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface C_INIT_RemapParticleCountToNamedModelSequenceScalar extends C_INIT_RemapParticleCountToNamedModelElementScalar {
	readonly type_name: string
}

interface C_OP_PlanarConstraint extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_PointOnPlane: Vector
	readonly m_PlaneNormal: Vector
	readonly m_nControlPointNumber: number
	readonly m_bGlobalOrigin: boolean
	readonly m_bGlobalNormal: boolean
}

interface C_OP_FadeAndKill extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flStartFadeInTime: number
	readonly m_flEndFadeInTime: number
	readonly m_flStartFadeOutTime: number
	readonly m_flEndFadeOutTime: number
	readonly m_flStartAlpha: number
	readonly m_flEndAlpha: number
	readonly m_bForcePreserveParticleOrder: boolean
}

interface CMoverAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_bApplyMovement: boolean
	readonly m_bOrientMovement: boolean
	readonly m_bAdditive: boolean
	readonly m_bTurnToFace: boolean
	readonly m_flTurnToFaceOffset: number
	readonly m_facingTarget: number
	readonly m_damping: CAnimInputDamping
}

interface CSceneObjectData {
	readonly type_name: string
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_drawCalls: CMaterialDrawDescriptor[]
	readonly m_vTintColor: Vector4D
}

interface FeTreeChildren_t {
	readonly type_name: string
	readonly nChild: number[]
}

interface CNavVolumeSphericalShell extends CNavVolumeSphere {
	readonly type_name: string
	readonly m_flRadiusInner: number
}

interface C_INIT_RandomRadius extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flRadiusMin: number
	readonly m_flRadiusMax: number
	readonly m_flRadiusRandExponent: number
}

interface C_INIT_RandomVectorComponent extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flMin: number
	readonly m_flMax: number
	readonly m_nComponent: number
}

interface CSceneObjectReference_t {
	readonly type_name: string
	readonly m_vecAABBMins: VectorAligned
	readonly m_vecAABBMaxes: VectorAligned
	readonly m_nRenderableFlags: number
	readonly m_pObject: CSceneObject
}

interface CPostGraphIKTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_flBlendAmount: number
}

interface CBlendAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_children: CBlendNodeChild[]
	readonly m_blendValueSource: number
	readonly m_param: AnimParamID
	readonly m_blendKeyType: number
	readonly m_bLockBlendOnReset: boolean
	readonly m_bSyncCycles: boolean
	readonly m_bLoop: boolean
	readonly m_damping: CAnimInputDamping
}

interface AnimResourceIKChain_t {
	readonly type_name: string
string}

interface SlideMaterialList_t {
	readonly type_name: string
	readonly szSlideKeyword: string[]
	readonly iSlideIndex: number[]
}

interface C_OP_RemapNamedModelBodyPartEndCap extends C_OP_RemapNamedModelElementEndCap {
	readonly type_name: string
}

interface C_INIT_RandomAlphaWindowThreshold extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flMin: number
	readonly m_flMax: number
	readonly m_flExponent: number
}

interface C_INIT_VelocityRandom extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_fSpeedMin: number
	readonly m_fSpeedMax: number
	readonly m_LocalCoordinateSystemSpeedMin: Vector
	readonly m_LocalCoordinateSystemSpeedMax: Vector
	readonly m_bIgnoreDT: boolean
}

interface AnimResourceIKTargetInfo_t {
	readonly type_name: string
	readonly m_nType: number
	readonly m_nPosChannel: number
	readonly m_nPosElement: number
	readonly m_nQuatChannel: number
	readonly m_nQuatElement: number
}

interface CCollisionProperty {
	readonly type_name: string
	readonly m_collisionAttribute: VPhysicsCollisionAttribute_t
	readonly m_vecMins: Vector
	readonly m_vecMaxs: Vector
	readonly m_usSolidFlags: number
	readonly m_nSolidType: number
	readonly m_triggerBloat: number
	readonly m_nSurroundType: number
	readonly m_CollisionGroup: number
	readonly m_bHitboxEnabled: boolean
	readonly m_flRadius: number
	readonly m_vecSpecifiedSurroundingMins: Vector
	readonly m_vecSpecifiedSurroundingMaxs: Vector
	readonly m_vecSurroundingMaxs: Vector
	readonly m_vecSurroundingMins: Vector
	readonly m_vCapsuleCenter1: Vector
	readonly m_vCapsuleCenter2: Vector
	readonly m_flCapsuleRadius: number
}

interface CHintMessageQueue {
	readonly type_name: string
	readonly m_tmMessageEnd: number
	readonly m_messages: CHintMessage[]
	readonly m_pPlayer: CBasePlayer
}

interface C_BaseAnimatingController extends CSkeletonAnimationController {
	readonly type_name: string
	readonly m_baseLayer: CNetworkedSequenceOperation
	readonly m_animGraphNetworkedVars: CAnimGraphNetworkedVariables
	readonly m_bSequenceFinished: boolean
	readonly m_flGroundSpeed: number
	readonly m_flLastEventCycle: number
	readonly m_flLastEventAnimTime: number
	readonly m_flPrevAnimTime: number
	readonly m_flPoseParameter: number[]
	readonly m_bClientSideAnimation: boolean
	readonly m_bNetworkedAnimationInputsChanged: boolean
	readonly m_nPrevNewSequenceParity: number
	readonly m_nPrevResetEventsParity: number
	readonly m_nNewSequenceParity: number
	readonly m_nResetEventsParity: number
	readonly m_flIKGroundContactTime: number
	readonly m_flIKGroundMinHeight: number
	readonly m_flIKGroundMaxHeight: number
	readonly m_flIkZAdjustAmount: number
	readonly m_SequenceTransitioner: C_CSequenceTransitioner2
	readonly m_ClientSideAnimationListHandle: number
}

interface CSoundPatch {
	readonly type_name: string
	readonly m_pitch: CSoundEnvelope
	readonly m_volume: CSoundEnvelope
	readonly m_shutdownTime: number
	readonly m_flLastTime: number
	readonly m_iszSoundScriptName: string
	readonly m_hEnt: C_BaseEntity
	readonly m_entityChannel: number
	readonly m_soundEntityIndex: C_BaseEntity
	readonly m_soundOrigin: Vector
	readonly m_flags: number
	readonly m_baseFlags: number
	readonly m_isPlaying: number
	readonly m_Filter: CCopyRecipientFilter
	readonly m_flCloseCaptionDuration: number
	readonly m_iszClassName: string
}

interface CParameterAnimCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_paramID: AnimParamID
	readonly m_comparisonValue: CAnimVariant
}

interface CAnimState {
	readonly type_name: string
	readonly m_tags: AnimTagID[]
	readonly m_tagBehaviors: number[]
	readonly m_name: string
	readonly m_childNodeID: AnimNodeID
	readonly m_stateID: AnimStateID
	readonly m_position: Vector2D
	readonly m_bIsStartState: boolean
	readonly m_bIsEndtState: boolean
	readonly m_bIsPassthrough: boolean
	readonly m_bIsRootMotionExclusive: boolean
}

interface CChoiceAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_children: CChoiceNodeChild[]
	readonly m_seed: number
	readonly m_choiceMethod: number
	readonly m_choiceChangeMethod: number
	readonly m_blendTime: number
	readonly m_bResetChosen: boolean
}

interface C_OP_RemapNamedModelMeshGroupEndCap extends C_OP_RemapNamedModelElementEndCap {
	readonly type_name: string
}

interface C_INIT_NormalAlignToCP extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
}

interface WorldLighting_t {
	readonly type_name: string
	readonly m_globalIlluminationMethod: number
}

interface CFootFallAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_foot: number
}

interface EventClientOutput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRenderTime: number
	readonly m_flRealTime: number
}

interface FeSoftParent_t {
	readonly type_name: string
	readonly nParent: number
	readonly flAlpha: number
}

interface CRMSG_Manifest_New {
	readonly type_name: string
	readonly m_nManifestIndex: number
	readonly m_nTimeUS: number
	readonly m_pManifestDebugName: string[]
}

interface CSchemaClassInfo extends SchemaClassInfoData_t {
	readonly type_name: string
}

interface C_OP_RemapBoundingVolumetoCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nOutControlPointNumber: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_OP_SnapshotSkinToBones extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_bTransformNormals: boolean
	readonly m_nControlPointNumber: number
	readonly m_flLifeTimeFadeStart: number
	readonly m_flLifeTimeFadeEnd: number
	readonly m_flJumpThreshold: number
	readonly m_flPrevPosScale: number
}

interface C_INIT_RandomNamedModelBodyPart extends C_INIT_RandomNamedModelElement {
	readonly type_name: string
}

interface EventClientProcessInput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRealTime: number
	readonly m_flFrameTime: number
}

interface CFeNamedJiggleBone {
	readonly type_name: string
	readonly m_strParentBone: string
	readonly m_transform: CTransform
	readonly m_nJiggleParent: number
	readonly m_jiggleBone: CFeJiggleBone
}

interface InfoForResourceTypePRTMatrixData_t {
	readonly type_name: string
}

interface PlayerResourcePlayerData_t {
	readonly type_name: string
	readonly m_bIsValid: boolean
	readonly m_iszPlayerName: string
	readonly m_iPlayerTeam: number
	readonly m_bFullyJoinedServer: boolean
	readonly m_bFakeClient: boolean
	readonly m_bIsBroadcaster: boolean
	readonly m_iBroadcasterChannel: number
	readonly m_iBroadcasterChannelSlot: number
	readonly m_bIsBroadcasterChannelCameraman: boolean
	readonly m_iConnectionState: number
	readonly m_iPlayerSteamID: number
	readonly m_eCoachTeam: number
	readonly m_eLiveSpectatorTeam: number
	readonly m_bIsPlusSubscriber: boolean
}

interface C_OP_RenderRopes extends CBaseRendererSource2 {
	readonly type_name: string
	readonly m_bEnableFadingAndClamping: boolean
	readonly m_flMinSize: number
	readonly m_flMaxSize: number
	readonly m_flStartFadeSize: number
	readonly m_flEndFadeSize: number
	readonly m_flRadiusTaper: number
	readonly m_nMinTesselation: number
	readonly m_nMaxTesselation: number
	readonly m_flTessScale: number
	readonly m_flTextureVWorldSize: number
	readonly m_flTextureVScrollRate: number
	readonly m_flTextureVOffset: number
	readonly m_nTextureVParamsCP: number
	readonly m_flFinalTextureScaleU: number
	readonly m_flFinalTextureScaleV: number
	readonly m_flFinalTextureOffsetU: number
	readonly m_flFinalTextureOffsetV: number
	readonly m_bClampV: boolean
	readonly m_nScaleCP1: number
	readonly m_nScaleCP2: number
	readonly m_flScaleVSizeByControlPointDistance: number
	readonly m_flScaleVScrollByControlPointDistance: number
	readonly m_flScaleVOffsetByControlPointDistance: number
	readonly m_bUseScalarForTextureCoordinate: boolean
	readonly m_flScalarAttributeTextureCoordScale: number
	readonly m_nOrientationType: number
	readonly m_bDrawAsOpaque: boolean
	readonly m_bGenerateNormals: boolean
	readonly m_bReverseOrder: boolean
	readonly m_flRadiusScale: number
	readonly m_bClosedLoop: boolean
	readonly m_flDepthBias: number
}

interface C_INIT_RadiusFromCPObject extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPoint: number
}

interface C_INIT_SequenceLifeTime extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flFramerate: number
}

interface CSequenceFinishedAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_sequenceName: string
}

interface CEnvWindShared {
	readonly type_name: string
	readonly m_flStartTime: number
	readonly m_iWindSeed: number
	readonly m_iMinWind: number
	readonly m_iMaxWind: number
	readonly m_windRadius: number
	readonly m_iMinGust: number
	readonly m_iMaxGust: number
	readonly m_flMinGustDelay: number
	readonly m_flMaxGustDelay: number
	readonly m_flGustDuration: number
	readonly m_iGustDirChange: number
	readonly m_location: Vector
	readonly m_iszGustSound: number
	readonly m_iWindDir: number
	readonly m_flWindSpeed: number
	readonly m_currentWindVector: Vector
	readonly m_CurrentSwayVector: Vector
	readonly m_PrevSwayVector: Vector
	readonly m_iInitialWindDir: number
	readonly m_flInitialWindSpeed: number
	readonly m_OnGustStart: CEntityIOOutput
	readonly m_OnGustEnd: CEntityIOOutput
	readonly m_flVariationTime: number
	readonly m_flSwayTime: number
	readonly m_flSimTime: number
	readonly m_flSwitchTime: number
	readonly m_flAveWindSpeed: number
	readonly m_bGusting: boolean
	readonly m_flWindAngleVariation: number
	readonly m_flWindSpeedVariation: number
	readonly m_iEntIndex: C_BaseEntity
}

interface CRMSG_Resource_Event {
	readonly type_name: string
	readonly m_nResourceId: number
	readonly m_nEvent: number
	readonly m_nSubEvent: number
	readonly m_nTimeUS: number
	readonly m_nManifestIndex: number
}

interface C_OP_RenderAsModels extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_ModelList: ModelReference_t[]
	readonly m_flModelScale: number
	readonly m_bFitToModelSize: boolean
	readonly m_bNonUniformScaling: boolean
	readonly m_nSizeCullBloat: number
}

interface C_OP_InterpolateRadius extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_flStartScale: number
	readonly m_flEndScale: number
	readonly m_bEaseInAndOut: boolean
	readonly m_flBias: number
}

interface C_INIT_PositionPlaceOnGround extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flOffset: number
	readonly m_flMaxTraceLength: number
	readonly m_CollisionGroupName: string[]
	readonly m_bKill: boolean
	readonly m_bIncludeWater: boolean
	readonly m_bSetNormal: boolean
	readonly m_bSetPXYZOnly: boolean
	readonly m_bTraceAlongNormal: boolean
	readonly m_flOffsetByRadiusFactor: number
}

interface AnimResourceIKLink_t {
	readonly type_name: string
	readonly bone: number
	readonly kneeDir: Vector
}

interface AnimResourceActivity_t {
	readonly type_name: string
	readonly m_nActivity: number
	readonly m_nFlags: number
	readonly m_nWeight: number
}

interface AnimResourceUserDifference_t {
	readonly type_name: string
	readonly m_nType: number
}

interface IHandleEntity {
	readonly type_name: string
}

interface CAnnouncerDescriptor {
	readonly type_name: string
	readonly m_Replacement: string
	readonly m_bUseDefaultAnnouncer: boolean
	readonly m_nAnnouncerItemDef: item_definition_index_t
	readonly m_pAnnouncerItem: CEconItemView
	readonly m_bItemOwnedByLocalPlayer: boolean
}

interface C_PlayerLocalData {
	readonly type_name: string
	readonly m_NetworkVar_PathIndex: ChangeAccessorFieldPathIndex_t
	readonly m_stringeaBits: number[]
	readonly m_stringeaPortalBits: number[]
	readonly m_nStepside: number
	readonly m_nOldButtons: number
	readonly m_flFOVRate: number
	readonly m_iHideHUD: number
	readonly m_nDuckTimeMsecs: number
	readonly m_nDuckJumpTimeMsecs: number
	readonly m_nJumpTimeMsecs: number
	readonly m_flFallVelocity: number
	readonly m_flStepSize: number
	readonly m_bDucked: boolean
	readonly m_bDucking: boolean
	readonly m_bInDuckJump: boolean
	readonly m_bDrawViewmodel: boolean
	readonly m_bWearingSuit: boolean
	readonly m_bPoisoned: boolean
	readonly m_bAllowAutoMovement: boolean
	readonly m_bSlowMovement: boolean
	readonly m_bAutoAimTarget: boolean
	readonly m_skybox3d: sky3dparams_t
	readonly m_audio: audioparams_t
	readonly m_bInLanding: boolean
	readonly m_flLandingTime: number
	readonly m_vecClientBaseVelocity: Vector
}

interface C_OP_RenderClothForce extends CParticleFunctionRenderer {
	readonly type_name: string
}

interface C_OP_RenderSprites extends CBaseRendererSource2 {
	readonly type_name: string
	readonly m_nSequenceOverride: number
	readonly m_nOrientationType: number
	readonly m_nOrientationControlPoint: number
	readonly m_flMinSize: number
	readonly m_flMaxSize: number
	readonly m_flAlphaAdjustWithSizeAdjust: number
	readonly m_flStartFadeSize: number
	readonly m_flEndFadeSize: number
	readonly m_flStartFadeDot: number
	readonly m_flEndFadeDot: number
	readonly m_flDepthBias: number
	readonly m_flFinalTextureScaleU: number
	readonly m_flFinalTextureScaleV: number
	readonly m_flFinalTextureOffsetU: number
	readonly m_flFinalTextureOffsetV: number
	readonly m_flCenterXOffset: number
	readonly m_flCenterYOffset: number
	readonly m_flZoomAmount0: number
	readonly m_flZoomAmount1: number
	readonly m_bDistanceAlpha: boolean
	readonly m_bSoftEdges: boolean
	readonly m_flEdgeSoftnessStart: number
	readonly m_flEdgeSoftnessEnd: number
	readonly m_bOutline: boolean
	readonly m_OutlineColor: Color
	readonly m_nOutlineAlpha: number
	readonly m_flOutlineStart0: number
	readonly m_flOutlineStart1: number
	readonly m_flOutlineEnd0: number
	readonly m_flOutlineEnd1: number
	readonly m_bUseYawWithNormalAligned: boolean
	readonly m_bNormalMap: boolean
	readonly m_flBumpStrength: number
}

interface C_OP_TimeVaryingForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flStartLerpTime: number
	readonly m_StartingForce: Vector
	readonly m_flEndLerpTime: number
	readonly m_EndingForce: Vector
}

interface ConceptHistory_t {
	readonly type_name: string
	readonly timeSpoken: number
	readonly m_response: CRR_Response
}

interface C_OP_RemapModelVolumetoCP extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nInControlPointNumber: number
	readonly m_nOutControlPointNumber: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
}

interface C_OP_RemapDirectionToCPToVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_flScale: number
	readonly m_flOffsetRot: number
	readonly m_vecOffsetAxis: Vector
	readonly m_bNormalize: boolean
}

interface VPhysics2ShapeDef_t {
	readonly type_name: string
}

interface CResponseQueue {
	readonly type_name: string
	readonly m_ExpresserTargets: CAI_Expresser[]
}

interface TempViewerInfo_t {
	readonly type_name: string
	readonly m_nGridX: number
	readonly m_nGridY: number
	readonly m_nRadius: number
	readonly m_nViewerType: number
	readonly m_bObstructedVision: boolean
	readonly m_bValid: boolean
	readonly m_bDirty: boolean
	readonly flEndTime: number
	readonly nFoWID: number
	readonly hOwner: C_BaseEntity
}

interface CBaseAnimatingOverlayController extends CBaseAnimatingController {
	readonly type_name: string
	readonly m_AnimOverlay: CAnimationLayer[]
}

interface C_OP_WorldCollideConstraint extends CParticleFunctionConstraint {
	readonly type_name: string
}

interface C_OP_ColorInterpolate extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_ColorFade: Color
	readonly m_flFadeStartTime: number
	readonly m_flFadeEndTime: number
	readonly m_bEaseInOut: boolean
}

interface WorldNode_t {
	readonly type_name: string
	readonly m_nodeLightingInfo: BakedLightingInfo_t
}

interface CNeuralNetAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_weightsFile: string
	readonly m_testInputFile: string
	readonly m_boneMapFile: string
	readonly m_sensorRangeFile: string
}

interface ItemDropData_t {
	readonly type_name: string
	readonly sItemNames: string[]
	readonly flChance: number
	readonly nReqLevel: number
	readonly bMustBeChampion: boolean
}

interface CNetworkedIKContext {
	readonly type_name: string
	readonly m_ProceduralTargetContexts: CNetworkedIKProceduralTargetContext[]
}

interface IParticleCollection {
	readonly type_name: string
}

interface C_INIT_CodeDriven extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bPosition: boolean
	readonly m_bPrevPosition: boolean
	readonly m_bRadius: boolean
	readonly m_bRotation: boolean
	readonly m_bColor: boolean
	readonly m_bAlpha: boolean
	readonly m_bSequence: boolean
	readonly m_bSequence1: boolean
}

interface InfoForResourceTypeWorld_t {
	readonly type_name: string
}

interface InfoForResourceTypeCEntityLump {
	readonly type_name: string
}

interface CParticleProperty {
	readonly type_name: string
}

interface VertexPositionNormal_t {
	readonly type_name: string
	readonly m_vPosition: Vector
	readonly m_vNormal: Vector
}

interface CTwoBoneIKAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_ikChainName: string
	readonly m_attachmentName: string
	readonly m_bMatchTargetOrientation: boolean
}

interface MaterialParamVector_t extends MaterialParam_t {
	readonly type_name: string
	readonly m_value: Vector4D
}

interface C_OP_RenderFogSprites extends C_OP_RenderSprites {
	readonly type_name: string
}

interface C_OP_SetSingleControlPointPosition extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_bUseWorldLocation: boolean
	readonly m_bSetOnce: boolean
	readonly m_nCP1: number
	readonly m_vecCP1Pos: Vector
	readonly m_nHeadLocation: number
}

interface CMoveSpeedCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface CConstraintSlave {
	readonly type_name: string
	readonly m_nBoneHash: number
	readonly m_flWeight: number
	readonly m_vBasePosition: Vector
	readonly m_sName: string
}

interface C_CEnvWindShared {
	readonly type_name: string
	readonly m_flStartTime: number
	readonly m_iWindSeed: number
	readonly m_iMinWind: number
	readonly m_iMaxWind: number
	readonly m_windRadius: number
	readonly m_iMinGust: number
	readonly m_iMaxGust: number
	readonly m_flMinGustDelay: number
	readonly m_flMaxGustDelay: number
	readonly m_flGustDuration: number
	readonly m_iGustDirChange: number
	readonly m_location: Vector
	readonly m_iszGustSound: number
	readonly m_iWindDir: number
	readonly m_flWindSpeed: number
	readonly m_currentWindVector: Vector
	readonly m_CurrentSwayVector: Vector
	readonly m_PrevSwayVector: Vector
	readonly m_iInitialWindDir: number
	readonly m_flInitialWindSpeed: number
	readonly m_flVariationTime: number
	readonly m_flSwayTime: number
	readonly m_flSimTime: number
	readonly m_flSwitchTime: number
	readonly m_flAveWindSpeed: number
	readonly m_bGusting: boolean
	readonly m_flWindAngleVariation: number
	readonly m_flWindSpeedVariation: number
	readonly m_iEntIndex: C_BaseEntity
}

interface CCommentarySystem {
	readonly type_name: string
	readonly m_afPlayersLastButtons: number
	readonly m_iCommentaryNodeCount: number
	readonly m_bCommentaryConvarsChanging: boolean
	readonly m_iClearPressedButtons: number
	readonly m_bCommentaryEnabledMidGame: boolean
	readonly m_flNextTeleportTime: number
	readonly m_iTeleportStage: number
	readonly m_bCheatState: boolean
	readonly m_bIsFirstSpawnGroupToLoad: boolean
	readonly m_pkvSavedModifications: KeyValues
	readonly m_hSpawnedEntities: C_BaseEntity[]
	readonly m_hCurrentNode: C_BaseEntity
	readonly m_hActiveCommentaryNode: C_BaseEntity
	readonly m_hLastCommentaryNode: C_BaseEntity
}

interface CSchemaBaseClassInfo extends SchemaBaseClassInfoData_t {
	readonly type_name: string
}

interface CPlayerState {
	readonly type_name: string
	readonly deadflag: boolean
	readonly hltv: boolean
	readonly v_angle: QAngle
	readonly netname: string
	readonly fixangle: number
	readonly anglechange: QAngle
	readonly frags: number
	readonly deaths: number
}

interface C_OP_VelocityDecay extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flMinVelocity: number
}

interface C_OP_LerpVector extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_vecOutput: Vector
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bScaleInitialRange: boolean
}

interface C_INIT_RemapCPOrientationToRotations extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_vecRotation: Vector
	readonly m_bUseQuat: boolean
	readonly m_bWriteNormal: boolean
}

interface VPhysXRange_t {
	readonly type_name: string
	readonly m_flMin: number
	readonly m_flMax: number
}

interface CSchemaSystemInternalRegistration {
	readonly type_name: string
	readonly m_Vector2D: Vector2D
	readonly m_Vector: Vector
	readonly m_VectorAligned: VectorAligned
	readonly m_QAngle: QAngle
	readonly m_RadianEuler: RadianEuler
	readonly m_DegreeEuler: DegreeEuler
	readonly m_matrix3x4_t: matrix3x4_t
	readonly m_matrix3x4a_t: matrix3x4a_t
	readonly m_Color: Color
	readonly m_Vector4D: Vector4D
	readonly m_CTransform: CTransform
	readonly m_pKeyValues: KeyValues
	readonly m_CUtlBinaryBlock: CUtlBinaryBlock
	readonly m_string: string
	readonly m_CUtlSymbol: CUtlSymbol
	readonly m_ClassIntrospectionHandle_t: CSchemaClassInfo
	readonly m_EnumIntrospectionHandle_t: CSchemaEnumInfo
}

interface sPendingTreeRemoval {
	readonly type_name: string
	readonly nTeam: number
	readonly nIndex: number
	readonly fTimestamp: number
}

interface CollisionGroupContext_t {
	readonly type_name: string
	readonly m_nCollisionGroupNumber: number
}

interface AnimResourceEncodeDifference_t {
	readonly type_name: string
}

interface InfoForResourceTypeCVoxelVisibility {
	readonly type_name: string
}

interface CRandStopwatch extends CStopwatchBase {
	readonly type_name: string
	readonly m_minInterval: number
	readonly m_maxInterval: number
}

interface C_OP_RenderModels extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_ActivityName: string[]
	readonly m_EconSlotName: string[]
	readonly m_ModelList: ModelReference_t[]
	readonly m_bIgnoreNormal: boolean
	readonly m_bOrientZ: boolean
	readonly m_bScaleAnimationRate: boolean
	readonly m_bResetAnimOnStop: boolean
	readonly m_bManualAnimFrame: boolean
	readonly m_nSkin: number
	readonly m_nLOD: number
	readonly m_bOverrideTranslucentMaterials: boolean
	readonly m_nSkinCP: number
	readonly m_nModelCP: number
	readonly m_nModelScaleCP: number
	readonly m_flAnimationRate: number
	readonly m_bAnimated: boolean
	readonly m_bForceDrawInterlevedWithSiblings: boolean
	readonly m_bOriginalModel: boolean
	readonly m_bSuppressTint: boolean
	readonly m_bUseRawMeshGroup: boolean
	readonly m_bDisableShadows: boolean
	readonly m_szRenderAttribute: string[]
}

interface SosEditItemInfo_t {
	readonly type_name: string
	readonly itemType: number
	readonly itemName: string
	readonly itemTypeName: string
	readonly itemKVString: string
	readonly itemPos: Vector2D
}

interface CFacingHeadingCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_comparisonValue: number
}

interface CAnimNodeList {
	readonly type_name: string
	readonly m_nodes: CAnimNodeBase[]
}

interface EventClientPollInput_t {
	readonly type_name: string
	readonly m_LoopState: EngineLoopState_t
	readonly m_flRealTime: number
}

interface FeFitInfluence_t {
	readonly type_name: string
	readonly nVertexNode: number
	readonly flWeight: number
	readonly nMatrixNode: number
}

interface CGameSceneNode {
	readonly type_name: string
	readonly m_mNodeToWorld: matrix3x4a_t
	readonly m_pOwner: CEntityInstance
	readonly m_pParent: CGameSceneNode
	readonly m_pChild: CGameSceneNode
	readonly m_pNextSibling: CGameSceneNode
	readonly m_hParent: CGameSceneNodeHandle
	readonly m_vecOrigin: CNetworkOriginCellCoordQuantizedVector
	readonly m_angRotation: QAngle
	readonly m_flScale: number
	readonly m_vecAbsOrigin: Vector
	readonly m_angAbsRotation: QAngle
	readonly m_flAbsScale: number
	readonly m_nParentAttachmentOrBone: number
	readonly m_bDormant: boolean
	readonly m_bForceParentToBeNetworked: boolean
	readonly m_bDirtyHierarchy: boolean
	readonly m_bDirtyBoneMergeInfo: boolean
	readonly m_bNetworkedPositionChanged: boolean
	readonly m_bNetworkedAnglesChanged: boolean
	readonly m_bNetworkedScaleChanged: boolean
	readonly m_bWillBeCallingPostDataUpdate: boolean
	readonly m_bNotifyBoneTransformsChanged: boolean
	readonly m_nLatchAbsOrigin: number
	readonly m_bDirtyBoneMergeBoneToRoot: boolean
	readonly m_nHierarchicalDepth: number
	readonly m_nHierarchyType: number
	readonly m_nDoNotSetAnimTimeInInvalidatePhysicsCount: number
	readonly m_flZOffset: number
	readonly m_vRenderOrigin: Vector
}

interface C_OP_ConstantForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_nMinCol: number
	readonly m_nMaxCol: number
	readonly m_nMinRow: number
	readonly m_nMaxRow: number
	readonly m_vForce: Vector
	readonly m_flBlendValue: number
}

interface C_INIT_RandomYaw extends CGeneralRandomRotation {
	readonly type_name: string
}

interface FeSimdQuad_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly vShape: FourVectors[]
}

interface C_SingleplayRules extends C_GameRules {
	readonly type_name: string
}

interface EventClientPostAdvanceTick_t extends EventPostAdvanceTick_t {
	readonly type_name: string
}

interface GameChatLogEntry_t {
	readonly type_name: string
	readonly m_nTeam: number
	readonly m_nPlayerID: number
	readonly m_sText: string
	readonly m_unGameTime: number
}

interface CBaseServerVehicle extends IServerVehicle {
	readonly type_name: string
	readonly m_PassengerInfo: CPassengerInfo[]
	readonly m_PassengerRoles: CPassengerRole[]
	readonly m_pVehicle: C_BaseEntity
	readonly m_nNPCButtons: number
	readonly m_nPrevNPCButtons: number
	readonly m_flTurnDegrees: number
	readonly m_bParsedAnimations: boolean
	readonly m_bUseLegacyExitChecks: boolean
	readonly m_iCurrentExitAnim: number
	readonly m_vecCurrentExitEndPoint: Vector
	readonly m_savedViewOffset: Vector
	readonly m_hExitBlocker: C_BaseEntity
	readonly m_chPreviousTextureType: string
	readonly m_vehicleSounds: vehiclesounds_t
	readonly m_flVehicleVolume: number
	readonly m_iSoundGear: number
	readonly m_flSpeedPercentage: number
	readonly m_soundState: number
	readonly m_soundStateStartTime: number
	readonly m_lastSpeed: number
}

interface CStopwatch extends CStopwatchBase {
	readonly type_name: string
	readonly m_interval: number
}

interface C_OP_WorldTraceConstraint extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_vecCpOffset: Vector
	readonly m_nCollisionMode: number
	readonly m_flBounceAmount: number
	readonly m_flSlideAmount: number
	readonly m_flRadiusScale: number
	readonly m_flRandomDirScale: number
	readonly m_flCpMovementTolerance: number
	readonly m_flTraceTolerance: number
	readonly m_flMinSpeed: number
	readonly m_bDecayBounce: boolean
	readonly m_bKillonContact: boolean
	readonly m_bConfirmCollision: boolean
	readonly m_CollisionGroupName: string[]
	readonly m_bBrushOnly: boolean
}

interface VPhysXBodyPart_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_flMass: number
	readonly m_rnShape: VPhysics2ShapeDef_t
	readonly m_nCollisionAttributeIndex: number
	readonly m_nReserved: number
	readonly m_flInertiaScale: number
	readonly m_flLinearDamping: number
	readonly m_flAngularDamping: number
	readonly m_bOverrideMassCenter: boolean
	readonly m_vMassCenterOverride: Vector
}

interface CPortraitData extends CBasePortraitData {
	readonly type_name: string
	readonly m_RenderList: C_BaseEntity[]
	readonly m_hHero: C_BaseEntity
}

interface CDecalInfo {
	readonly type_name: string
	readonly m_flSpecExp: number
	readonly m_flAnimationScale: number
	readonly m_flAnimationLifeSpan: number
	readonly m_flPlaceTime: number
	readonly m_flFadeStartTime: number
	readonly m_flFadeDuration: number
	readonly m_nVBSlot: number
	readonly m_nBoneIndex: number
	readonly m_pNext: CDecalInfo
	readonly m_pPrev: CDecalInfo
	readonly m_nDecalMaterialIndex: number
}

interface INextBotReply {
	readonly type_name: string
}

interface ParticleControlPointConfiguration_t {
	readonly type_name: string
	readonly m_name: string
	readonly m_drivers: ParticleControlPointDriver_t[]
	readonly m_previewState: ParticlePreviewState_t
}

interface C_INIT_CreateFromPlaneCache extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecOffsetMin: Vector
	readonly m_vecOffsetMax: Vector
	readonly m_bUseNormal: boolean
}

interface SequenceGroupResourceData_t {
	readonly type_name: string
	readonly m_nFlags: number
}

interface SeqResourcePoseParamDesc_t {
	readonly type_name: string
	readonly m_flStart: number
	readonly m_flEnd: number
	readonly m_flLoop: number
	readonly m_bLooping: boolean
}

interface InfoForResourceTypeCModel {
	readonly type_name: string
}

interface CRMSG_Resource_ExtReference {
	readonly type_name: string
	readonly m_nReferencerResourceId: number
	readonly m_nReferredToResourceId: number
	readonly m_nManifestIndex: number
}

interface PointDefinition_t {
	readonly type_name: string
	readonly m_nControlPoint: number
	readonly m_bLocalCoords: boolean
	readonly m_vOffset: Vector
}

interface C_OP_ConstrainLineLength extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_flMinDistance: number
	readonly m_flMaxDistance: number
}

interface EntInput_t {
	readonly type_name: string
}

interface CRenderablePortraitData extends CBasePortraitData {
	readonly type_name: string
	readonly m_nCurrentHeroID: number
	readonly m_hCallbackHandler: C_BaseEntity
	readonly m_bHasHero: boolean
	readonly m_bRotateBackgroundWithHero: boolean
	readonly m_bTransparentBG: boolean
	readonly m_bUseModelForParticles: boolean
	readonly m_hPortraitHero: C_BaseEntity
}

interface C_OP_DriveCPFromGlobalSoundFloat extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nOutputControlPoint: number
	readonly m_nOutputField: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_StackName: string
	readonly m_OperatorName: string
	readonly m_FieldName: string
}

interface CSchemaMetadataSet extends SchemaMetadataSetData_t {
	readonly type_name: string
}

interface ConstraintSoundInfo {
	readonly type_name: string
	readonly m_vSampler: VelocitySampler
	readonly m_soundProfile: SimpleConstraintSoundProfile
	readonly m_forwardAxis: Vector
	readonly m_iszTravelSoundFwd: string
	readonly m_iszTravelSoundBack: string
	readonly m_bPlayTravelSound: boolean
	readonly m_iszReversalSounds: string[]
	readonly m_bPlayReversalSound: boolean
}

interface IHasAttributes {
	readonly type_name: string
}

interface CFinishedCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_bIsFinished: boolean
}

interface RemnantData_t {
	readonly type_name: string
	readonly m_hRemnant: C_BaseEntity
	readonly m_nProjectileHandle: number
}

interface CParticleSystemDefinition extends IParticleSystemDefinition {
	readonly type_name: string
	readonly m_nBehaviorVersion: number
	readonly m_PreEmissionOperators: CParticleFunctionPreEmission[]
	readonly m_Emitters: CParticleFunctionEmitter[]
	readonly m_Initializers: CParticleFunctionInitializer[]
	readonly m_Operators: CParticleFunctionOperator[]
	readonly m_ForceGenerators: CParticleFunctionForce[]
	readonly m_Constraints: CParticleFunctionConstraint[]
	readonly m_Renderers: CParticleFunctionRenderer[]
	readonly m_Children: ParticleChildrenInfo_t[]
	readonly m_nFirstMultipleOverride_BackwardCompat: number
	readonly m_nInitialParticles: number
	readonly m_nMaxParticles: number
	readonly m_BoundingBoxMin: Vector
	readonly m_BoundingBoxMax: Vector
	readonly m_nSnapshotControlPoint: number
	readonly m_pszTargetLayerID: string
	readonly m_nTopology: number
	readonly m_pszCullReplacementName: string
	readonly m_flCullRadius: number
	readonly m_flCullFillCost: number
	readonly m_nCullControlPoint: number
	readonly m_nFallbackMaxCount: number
	readonly m_ConstantColor: Color
	readonly m_ConstantNormal: Vector
	readonly m_flConstantRadius: number
	readonly m_flConstantRotation: number
	readonly m_flConstantRotationSpeed: number
	readonly m_flConstantLifespan: number
	readonly m_nConstantSequenceNumber: number
	readonly m_nConstantSequenceNumber1: number
	readonly m_nGroupID: number
	readonly m_flMaximumTimeStep: number
	readonly m_flMaximumSimTime: number
	readonly m_flMinimumSimTime: number
	readonly m_flMinimumTimeStep: number
	readonly m_nMinimumFrames: number
	readonly m_nMinCPULevel: number
	readonly m_nMinGPULevel: number
	readonly m_bViewModelEffect: boolean
	readonly m_bScreenSpaceEffect: boolean
	readonly m_controlPointConfigurations: ParticleControlPointConfiguration_t[]
	readonly m_flNoDrawTimeToGoToSleep: number
	readonly m_flMaxDrawDistance: number
	readonly m_flStartFadeDistance: number
	readonly m_nSkipRenderControlPoint: number
	readonly m_nAllowRenderControlPoint: number
	readonly m_nAggregationMinAvailableParticles: number
	readonly m_flAggregateRadius: number
	readonly m_flStopSimulationAfterTime: number
	readonly m_bShouldSort: boolean
	readonly m_bShouldBatch: boolean
	readonly m_flDepthSortBias: number
	readonly m_bShouldHitboxesFallbackToRenderBounds: boolean
}

interface C_OP_LockToBone extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_flLifeTimeFadeStart: number
	readonly m_flLifeTimeFadeEnd: number
	readonly m_flJumpThreshold: number
	readonly m_flPrevPosScale: number
	readonly m_HitboxSetName: string[]
	readonly m_bRigid: boolean
	readonly m_bUseBones: boolean
}

interface EventClientSimulate_t extends EventSimulate_t {
	readonly type_name: string
}

interface CEntityIdentity {
	readonly type_name: string
	readonly m_pEntity: C_BaseEntity
	readonly m_nameStringableIndex: number
	readonly m_name: string
	readonly m_designerName: string
	readonly m_flags: number
	readonly m_fDataObjectTypes: number
	readonly m_PathIndex: ChangeAccessorFieldPathIndex_t
	readonly m_pPrev: CEntityIdentity
	readonly m_pNext: CEntityIdentity
	readonly m_pPrevByClass: CEntityIdentity
	readonly m_pNextByClass: CEntityIdentity
	readonly m_pId: V_uuid_t
}

interface WorldEnvironmentMap_t {
	readonly type_name: string
	readonly m_matLocalToWorld: matrix3x4_t
	readonly m_bSkyRelight: boolean
	readonly m_flInfluenceRadius: number
	readonly m_BoxProjection: AABB_t
}

interface CDOTA_AttackRecord {
	readonly type_name: string
	readonly m_hSource: C_BaseEntity
	readonly m_hInflictor: C_BaseEntity
	readonly m_hTarget: C_BaseEntity
	readonly m_hProjectileSource: C_BaseEntity
	readonly m_flDamage: number
	readonly m_flOriginalDamage: number
	readonly m_flDamagePhysical: number
	readonly m_flDamagePhysical_IllusionDisplay: number
	readonly m_flDamageMagical: number
	readonly m_flDamageComposite: number
	readonly m_flDamagePure: number
	readonly m_iRecord: number
	readonly m_iDamageCategory: number
	readonly m_iFailType: number
	readonly m_iDamageType: number
	readonly m_iFlags: number
	readonly m_animation: number
	readonly m_pOrb: CDOTA_Orb
	readonly m_pOrb2: CDOTA_Orb
	readonly m_bAttack: boolean
	readonly m_bRangedAttack: boolean
	readonly m_bDirectionalRangedAttack: boolean
	readonly m_bFakeAttack: boolean
	readonly m_bNeverMiss: boolean
	readonly m_bTriggeredAttack: boolean
	readonly m_bNoCooldown: boolean
	readonly m_bProcessProcs: boolean
	readonly m_bUseProjectile: boolean
	readonly m_bUseCastAttackOrb: boolean
	readonly m_bAutoCastAttack: boolean
	readonly m_bIgnoreObstructions: boolean
	readonly m_nBashSource: number
	readonly m_flAttackHeight: number
	readonly m_flCriticalBonus: number
	readonly m_flCriticalDamage: number
	readonly m_flCriticalDisplay: number
	readonly m_iProjectileSpeed: number
	readonly m_vForceDirectionOverride: Vector
	readonly m_vTargetLoc: Vector
	readonly m_vBlockLoc: Vector
	readonly m_iszAutoAttackRangedParticle: string
	readonly m_iCustomFXIndex: number
}

interface PointDefinitionWithTimeValues_t extends PointDefinition_t {
	readonly type_name: string
	readonly m_flTimeDuration: number
}

interface CTwistConstraint extends CBaseConstraint {
	readonly type_name: string
	readonly m_bInverse: boolean
}

interface DOTASpecialAbility_t {
	readonly type_name: string
	readonly m_pszName: string
	readonly m_pszValue: string
	readonly m_pszLevelKey: string
	readonly m_pszSpecialBonusAbility: string
	readonly m_pszSpecialBonusField: string
	readonly m_FieldType: number
	readonly m_nCount: number
	readonly m_bSpellDamageField: boolean
	readonly m_eSpecialBonusOperation: number
}

interface sSpiritDef {
	readonly type_name: string
	readonly pSpirit: CDOTA_BaseNPC
	readonly nSpiritFXIndex: number
	readonly nSpiritState: number
}

interface CNewParticleEffect extends IParticleEffect {
	readonly type_name: string
	readonly m_pNext: CNewParticleEffect
	readonly m_pPrev: CNewParticleEffect
	readonly m_pParticles: IParticleCollection
	readonly m_pDebugName: string
	readonly m_bDontRemove: boolean
	readonly m_bRemove: boolean
	readonly m_bNeedsBBoxUpdate: boolean
	readonly m_bIsFirstFrame: boolean
	readonly m_bAutoUpdateBBox: boolean
	readonly m_bAllocated: boolean
	readonly m_bSimulate: boolean
	readonly m_bShouldPerformCullCheck: boolean
	readonly m_bForceNoDraw: boolean
	readonly m_bDisableAggregation: boolean
	readonly m_bShouldSimulateDuringGamePaused: boolean
	readonly m_bShouldCheckFoW: boolean
	readonly m_vSortOrigin: Vector
	readonly m_hOwner: PARTICLE_EHANDLE__
	readonly m_pOwningParticleProperty: CParticleProperty
	readonly m_LastMin: Vector
	readonly m_LastMax: Vector
	readonly m_nSplitScreenUser: CSplitScreenSlot
	readonly m_vecAggregationCenter: Vector
	readonly m_RefCount: number
}

interface C_INIT_RandomRotation extends CGeneralRandomRotation {
	readonly type_name: string
}

interface CAnimTagSpan {
	readonly type_name: string
	readonly m_id: AnimTagID
	readonly m_fStartCycle: number
	readonly m_fDuration: number
}

interface CFloatAnimParameter extends CAnimParameterBase {
	readonly type_name: string
	readonly m_fDefaultValue: number
	readonly m_fMinValue: number
	readonly m_fMaxValue: number
	readonly m_bInterpolate: boolean
}

interface CFeIndexedJiggleBone {
	readonly type_name: string
	readonly m_nNode: number
	readonly m_nJiggleParent: number
	readonly m_jiggleBone: CFeJiggleBone
}

interface RnBlendVertex_t {
	readonly type_name: string
	readonly m_nWeight0: number
	readonly m_nIndex0: number
	readonly m_nWeight1: number
	readonly m_nIndex1: number
	readonly m_nWeight2: number
	readonly m_nIndex2: number
	readonly m_nFlags: number
	readonly m_nTargetIndex: number
}

interface CDirectionalBlendAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_animNamePrefix: string
	readonly m_blendValueSource: number
	readonly m_param: AnimParamID
	readonly m_bLoop: boolean
	readonly m_bLockBlendOnReset: boolean
	readonly m_playbackSpeed: number
	readonly m_damping: CAnimInputDamping
}

interface CBoolAnimParameter extends CAnimParameterBase {
	readonly type_name: string
	readonly m_bDefaultValue: boolean
}

interface SeqResourceCmdSeqDesc_t {
	readonly type_name: string
	readonly m_flags: SeqResourceSeqDesc_t_Flag_t
	readonly m_transition: SeqResourceTransition_t
	readonly m_nFrameRangeSequence: number
	readonly m_nFrameCount: number
	readonly m_flFPS: number
	readonly m_nSubCycles: number
	readonly m_numLocalResults: number
}

interface MaterialParamString_t extends MaterialParam_t {
	readonly type_name: string
string}

interface CHitBoxSetList {
	readonly type_name: string
	readonly m_HitBoxSets: CHitBoxSet[]
}

interface VsInputSignature_t {
	readonly type_name: string
	readonly m_elems: VsInputSignatureElement_t[]
}

interface InfoForResourceTypeCPostProcessingResource {
	readonly type_name: string
}

interface SchemaStaticFieldData_t {
	readonly type_name: string
	readonly m_pInstance: void
	readonly m_Metadata: SchemaMetadataSetData_t
}

interface C_OP_FadeInSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flFadeInTime: number
}

interface C_INIT_CreateWithinBox extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_vecMin: Vector
	readonly m_vecMax: Vector
	readonly m_nControlPointNumber: number
	readonly m_bLocalSpace: boolean
}

interface InfoOverlayData_t {
	readonly type_name: string
	readonly m_transform: matrix3x4_t
	readonly m_flWidth: number
	readonly m_flHeight: number
	readonly m_flDepth: number
	readonly m_vUVStart: Vector2D
	readonly m_vUVEnd: Vector2D
	readonly m_nRenderOrder: number
	readonly m_vTintColor: Vector4D
	readonly m_nSequenceOverride: number
}

interface C_OP_RenderScreenVelocityRotate extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_flRotateRateDegrees: number
	readonly m_flForwardDegrees: number
}

interface C_INIT_RandomNamedModelSequence extends C_INIT_RandomNamedModelElement {
	readonly type_name: string
}

interface C_INIT_RemapCPtoVector extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_vInputMin: Vector
	readonly m_vInputMax: Vector
	readonly m_vOutputMin: Vector
	readonly m_vOutputMax: Vector
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bOffset: boolean
	readonly m_bAccelerate: boolean
	readonly m_nLocalSpaceCP: number
	readonly m_flRemapBias: number
}

interface C_INIT_RandomModelSequence extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_ActivityName: string[]
}

interface CVoxelVisibility {
	readonly type_name: string
	readonly m_blockOffset: number[]
	readonly m_clusters: voxel_vis_cluster_t[]
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_flGridSize: number
	readonly m_nNodeCount: number
	readonly m_nRegionCount: number
	readonly m_nPVSCompression: number
	readonly m_nTreeSize: number
	readonly m_nPVSSizeCompressed: number
}

interface SelectedEditItemInfo_t {
	readonly type_name: string
	readonly m_EditItems: SosEditItemInfo_t[]
}

interface CAnimationGraph {
	readonly type_name: string
	readonly m_motorList: CAnimMotorList
	readonly m_rootNodeID: AnimNodeID
}

interface C_LightGlowOverlay extends CGlowOverlay {
	readonly type_name: string
	readonly m_vecOrigin: Vector
	readonly m_vecDirection: Vector
	readonly m_nMinDist: number
	readonly m_nMaxDist: number
	readonly m_nOuterMaxDist: number
	readonly m_bOneSided: boolean
	readonly m_bModulateByDot: boolean
}

interface IControlPointEditorData {
	readonly type_name: string
}

interface CSSDSMsg_PostLayer extends CSSDSMsg_LayerBase {
	readonly type_name: string
}

interface CSequenceAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_sequenceName: string
	readonly m_playbackSpeed: number
	readonly m_bLoop: boolean
}

interface VPhysXConstraint2_t {
	readonly type_name: string
	readonly m_nFlags: number
	readonly m_nParent: number
	readonly m_nChild: number
	readonly m_params: VPhysXConstraintParams_t
}

interface CAttributeContainer extends CAttributeManager {
	readonly type_name: string
	readonly m_Item: CEconItemView
}

interface C_OP_LockPoints extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nMinCol: number
	readonly m_nMaxCol: number
	readonly m_nMinRow: number
	readonly m_nMaxRow: number
	readonly m_nControlPoint: number
	readonly m_flBlendValue: number
}

interface C_OP_RemapCPtoVelocity extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCPInput: number
	readonly m_bScaleCurrent: boolean
}

interface IrradVolume_t {
	readonly type_name: string
	readonly m_transform: VMatrix
	readonly m_flFadeMinDist: number
	readonly m_flFadeMaxDist: number
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_nFlags: number
	readonly m_nSortKey: number
	readonly m_nPlanes: number
	readonly m_planes: Vector4D[]
}

interface CBlendNodeChild {
	readonly type_name: string
	readonly m_nodeID: AnimNodeID
	readonly m_name: string
	readonly m_blendValue: number
}

interface EventPreDataUpdate_t {
	readonly type_name: string
	readonly m_nEntityIndex: number
}

interface Relationship_t {
	readonly type_name: string
	readonly entity: C_BaseEntity
	readonly classType: number
	readonly faction: number
	readonly disposition: number
	readonly priority: number
}

interface C_OP_RenderTrails extends CBaseTrailRenderer {
	readonly type_name: string
	readonly m_bEnableFadingAndClamping: boolean
	readonly m_flMaxLength: number
	readonly m_flMinLength: number
	readonly m_bIgnoreDT: boolean
	readonly m_flConstrainRadiusToLengthRatio: number
	readonly m_flLengthScale: number
	readonly m_flRadiusTaper: number
	readonly m_flLengthFadeInTime: number
	readonly m_vEndTrailTintFactor: Vector4D
	readonly m_flForwardShift: number
	readonly m_bFlipUVBasedOnPitchYaw: boolean
	readonly m_bUseTopology: boolean
}

interface World_t {
	readonly type_name: string
	readonly m_builderParams: WorldBuilderParams_t
	readonly m_worldLightingInfo: BakedLightingInfo_t
}

interface CVectorAnimParameter extends CAnimParameterBase {
	readonly type_name: string
	readonly m_defaultValue: Vector
	readonly m_bInterpolate: boolean
}

interface InfoForResourceTypeVBitmapFontRuntimeData_t {
	readonly type_name: string
}

interface TimedBalanceRecord_t {
	readonly type_name: string
	readonly m_nNetWorthDelta: number
	readonly m_nExperienceDelta: number
	readonly m_flBalanceMetric: number
	readonly m_nBonusGoldRadiant: number
	readonly m_nBonusGoldDire: number
}

interface C_OP_DistanceBetweenCPs extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_flMaxTraceLength: number
	readonly m_flLOSScale: number
	readonly m_CollisionGroupName: string[]
	readonly m_bLOS: boolean
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
}

interface AnimResourceBone_t {
	readonly type_name: string
	readonly m_parent: number
	readonly m_pos: Vector
	readonly m_flags: number
}

interface CHitBoxSet {
	readonly type_name: string
	readonly m_name: string
	readonly m_nNameHash: number
	readonly m_HitBoxes: CHitBox[]
	readonly m_SourceFilename: string
}

interface C_INIT_StatusEffect extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nDetail2Combo: number
	readonly m_flDetail2Rotation: number
	readonly m_flDetail2Scale: number
	readonly m_flDetail2BlendFactor: number
	readonly m_flColorWarpIntensity: number
	readonly m_flDiffuseWarpBlendToFull: number
	readonly m_flEnvMapIntensity: number
	readonly m_flAmbientScale: number
	readonly m_specularColor: Color
	readonly m_flSpecularScale: number
	readonly m_flSpecularExponent: number
	readonly m_flSpecularExponentBlendToFull: number
	readonly m_flSpecularBlendToFull: number
	readonly m_rimLightColor: Color
	readonly m_flRimLightScale: number
	readonly m_flReflectionsTintByBaseBlendToNone: number
	readonly m_flMetalnessBlendToFull: number
	readonly m_flSelfIllumBlendToFull: number
}

interface CControlValueCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_sourceControlValue: number
	readonly m_comparisonValueType: number
	readonly m_comparisonFixedValue: number
	readonly m_comparisonControlValue: number
	readonly m_comparisonParamID: AnimParamID
}

interface PostProcessingResource_t {
	readonly type_name: string
	readonly m_bHasTonemapParams: boolean
	readonly m_toneMapParams: PostProcessingTonemapParameters_t
	readonly m_bHasBloomParams: boolean
	readonly m_bloomParams: PostProcessingBloomParameters_t
	readonly m_bHasVignetteParams: boolean
	readonly m_vignetteParams: PostProcessingVignetteParameters_t
	readonly m_nColorCorrectionVolumeDim: number
}

interface FeSimdTri_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly v2: FourVectors2D
}

interface CHeadlightEffect extends CFlashlightEffect {
	readonly type_name: string
}

interface CDOTA_CombatLogQueryProgress {
	readonly type_name: string
	readonly m_nPlayerID: number
	readonly m_nQueryID: number
	readonly m_nQueryRank: number
	readonly m_nMultiQueryID: number
	readonly m_szRankIdentifier: string[]
}

interface sSpiritInfo {
	readonly type_name: string
	readonly vTargetLoc: Vector
	readonly hTarget: C_BaseEntity
	readonly bHit: boolean
	readonly iHealAmount: number
	readonly nFXAmbientIndex: number
}

interface C_OP_SetControlPointRotation extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_vecRotAxis: Vector
	readonly m_flRotRate: number
	readonly m_nCP: number
	readonly m_nLocalCP: number
}

interface AttachmentData_t {
	readonly type_name: string
	readonly m_vInfluenceOffsets: Vector[]
	readonly m_influenceWeights: number[]
	readonly m_nFlags: number[]
	readonly m_nInfluences: number
}

interface CRMSG_Resource_NewId {
	readonly type_name: string
	readonly m_nResourceId: number
	readonly m_ResourceName: string[]
	readonly m_nTimeUS: number
}

interface PRTMatrixData_t {
	readonly type_name: string
	readonly m_nTransmitters: number
	readonly m_nReceivers: number
	readonly m_nTextureWidth: number
	readonly m_nTextureHeight: number
	readonly m_nTextureDepth: number
	readonly m_nPrimaryRelightDataOffset: number
	readonly m_nPrimaryRelightDataSize: number
	readonly m_nPrimaryRelightDataSizeUncompressed: number
	readonly m_nSecondaryRelightDataOffset: number
	readonly m_nSecondaryRelightDataSize: number
	readonly m_nSecondaryRelightDataSizeUncompressed: number
	readonly m_nPrimarySkyRelightDataOffset: number
	readonly m_nPrimarySkyRelightDataSize: number
	readonly m_nPrimarySkyRelightDataSizeUncompressed: number
	readonly m_nSecondarySkyRelightDataOffset: number
	readonly m_nSecondarySkyRelightDataSize: number
	readonly m_nSecondarySkyRelightDataSizeUncompressed: number
	readonly m_nTransmitterPositionsOffset: number
	readonly m_nTransmitterPositionsSize: number
	readonly m_nTransmitterPositionsSizeUncompressed: number
	readonly m_nReceiverPositionsOffset: number
	readonly m_nReceiverPositionsSize: number
	readonly m_nReceiverPositionsSizeUncompressed: number
	readonly m_nTransmitterMaterialsOffset: number
	readonly m_nTransmitterMaterialsSize: number
	readonly m_nTransmitterMaterialsSizeUncompressed: number
	readonly m_nReceiverIndicesOffset: number
	readonly m_nReceiverIndicesSize: number
	readonly m_nReceiverIndicesSizeUncompressed: number
}

interface CPVSData {
	readonly type_name: string
	readonly m_pNext: CPVSData
	readonly m_nPVSMasks: number
	readonly m_nPVSFlags: number
}

interface CSingleplayRules extends CGameRules {
	readonly type_name: string
}

interface C_OP_PercentageBetweenCPs extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bActiveRange: boolean
	readonly m_bRadialCheck: boolean
}

interface NodeData_t {
	readonly type_name: string
	readonly m_Flags: number
	readonly m_nParent: number
	readonly m_vOrigin: Vector
	readonly m_vMinBounds: Vector
	readonly m_vMaxBounds: Vector
	readonly m_flMinimumDistance: number
string}

interface CSpeedScaleAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_param: AnimParamID
}

interface CStringAnimTag extends CAnimTagBase {
	readonly type_name: string
}

interface CMaterialDrawDescriptor {
	readonly type_name: string
	readonly m_nPrimitiveType: number
	readonly m_nBaseVertex: number
	readonly m_nVertexCount: number
	readonly m_nStartIndex: number
	readonly m_nIndexCount: number
	readonly m_nStartInstance: number
	readonly m_nInstanceCount: number
	readonly m_flUvDensity: number
	readonly m_vTintColor: Vector
	readonly m_indexBuffer: CRenderBufferBinding
}

interface ExtraVertexStreamOverride_t extends BaseSceneObjectOverride_t {
	readonly type_name: string
	readonly m_nSubSceneObject: number
	readonly m_nDrawCallIndex: number
	readonly m_nAdditionalMeshDrawPrimitiveFlags: number
	readonly m_extraBufferBinding: RenderBufferBinding_t
}

interface EventServerProcessNetworking_t extends EventSimulate_t {
	readonly type_name: string
}

interface CInterpolatedValue {
	readonly type_name: string
	readonly m_flStartTime: number
	readonly m_flEndTime: number
	readonly m_flStartValue: number
	readonly m_flEndValue: number
	readonly m_nInterpType: number
}

interface CMotorController {
	readonly type_name: string
	readonly m_speed: number
	readonly m_maxTorque: number
	readonly m_axis: Vector
	readonly m_inertiaFactor: number
}

interface CPathHelperAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_flStoppingRadius: number
	readonly m_flStoppingSpeedScale: number
}

interface CLocomotionBase extends INextBotComponent {
	readonly type_name: string
}

interface C_OP_RemapParticleCountOnScalarEndCap extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nInputMin: number
	readonly m_nInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bBackwards: boolean
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
}

interface CGroundIKAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_IkChains: string[]
	readonly m_bApplyTilt: boolean
	readonly m_bDebug: boolean
}

interface NextBotGroundLocomotion extends CLocomotionBase {
	readonly type_name: string
	readonly m_vVelocity: Vector
	readonly m_vPriorPos: Vector
	readonly m_vLastValidPos: Vector
	readonly m_vAcceleration: Vector
	readonly m_flDesiredSpeed: number
	readonly m_flActualSpeed: number
	readonly m_flMaxRunSpeed: number
	readonly m_flForwardLean: number
	readonly m_flSideLean: number
	readonly m_desiredLean: QAngle
	readonly m_bIsJumping: boolean
	readonly m_bIsJumpingAcrossGap: boolean
	readonly m_hGround: C_BaseEntity
	readonly m_vGroundNormal: Vector
	readonly m_vGroundSampleLastPos: Vector
	readonly m_bIsClimbingUpToLedge: boolean
	readonly m_vLedgeJumpGoalPos: Vector
	readonly m_bIsUsingFullFeetTrace: boolean
	readonly m_inhibitObstacleAvoidanceTimer: CountdownTimer
	readonly m_vMoveVector: Vector
	readonly m_flMoveYaw: number
	readonly m_vAccumApproachVectors: Vector
	readonly m_flAccumApproachWeights: number
	readonly m_bRecomputePostureOnCollision: boolean
	readonly m_ignorePhysicsPropTimer: CountdownTimer
	readonly m_hIgnorePhysicsProp: C_BaseEntity
	readonly m_actJump: number
	readonly m_actJumpAcrossGap: number
}

interface CNavVolumeMarkupVolume extends CNavVolume {
	readonly type_name: string
}

interface C_OP_RandomForce extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_MinForce: Vector
	readonly m_MaxForce: Vector
}

interface EntityKeyValueData_t {
	readonly type_name: string
}

interface C_OP_SetControlPointToImpactPoint extends CParticleFunctionPreEmission {
	readonly type_name: string
	readonly m_nCPOut: number
	readonly m_nCPIn: number
	readonly m_flUpdateRate: number
	readonly m_flTraceLength: number
	readonly m_flOffset: number
	readonly m_vecTraceDir: Vector
	readonly m_CollisionGroupName: string[]
	readonly m_bSetToEndpoint: boolean
}

interface CPostGraphIKChainBlendTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_ChainName: string
	readonly m_flBlendAmountOnEnter: number
	readonly m_flBlendAmountOnExit: number
}

interface CTagCondition extends CAnimStateConditionBase {
	readonly type_name: string
	readonly m_tagID: AnimTagID
	readonly m_comparisonValue: boolean
}

interface VPhysXDiskCapsule_t extends VPhysXDiskShapeHeader_t {
	readonly type_name: string
	readonly m_vEnds: Vector[]
	readonly m_flRadius: number
}

interface FeTaperedCapsuleStretch_t {
	readonly type_name: string
	readonly nNode: number[]
	readonly nCollisionMask: number
	readonly nDummy: number
	readonly flRadius: number[]
	readonly flStickiness: number
}

interface CDOTAGamerules extends CTeamplayRules {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_iMiscHeroPickCounter: number
	readonly m_hEndGameCinematicEntity: C_BaseEntity
	readonly m_EndGameCinematicTimer: CountdownTimer
	readonly m_hOverlayHealthBarUnit: C_BaseEntity
	readonly m_nOverlayHealthBarType: number
	readonly m_bIsInCinematicMode: boolean
	readonly m_bIsInClientSideCinematicMode: boolean
	readonly m_bFreeCourierMode: boolean
	readonly m_nStartingGold: number
	readonly m_nGoldPerTick: number
	readonly m_flGoldTickTime: number
	readonly m_unFanfareGoodGuys: number
	readonly m_unFanfareBadGuys: number
	readonly m_flFanfareTime: number
	readonly m_iFOWDefeatedTempViewer: number
	readonly m_nGameState: number
	readonly m_nHeroPickState: number
	readonly m_flStateTransitionTime: number
	readonly m_flOverride_dota_hero_selection_time: number
	readonly m_flOverride_dota_pregame_time: number
	readonly m_flOverride_dota_postgame_time: number
	readonly m_flOverride_dota_strategy_time: number
	readonly m_flOverride_dota_team_showcase_duration: number
	readonly m_flOverride_dota_rune_spawn_time: number
	readonly m_flOverride_dota_tree_regrow_time: number
	readonly m_iGameMode: number
	readonly m_hGameModeEntity: C_BaseEntity
	readonly m_hCustomHeroPickRulesEntity: C_BaseEntity
	readonly m_flHeroPickStateTransitionTime: number
	readonly m_iPlayerIDsInControl: number
	readonly m_bSameHeroSelectionEnabled: boolean
	readonly m_bUseCustomHeroXPValue: boolean
	readonly m_bUseBaseGoldBountyOnHeroes: boolean
	readonly m_bUseUniversalShopMode: boolean
	readonly m_bHideKillMessageHeaders: boolean
	readonly m_flHeroMinimapIconScale: number
	readonly m_flCreepMinimapIconScale: number
	readonly m_bCreepSpawningEnabled: boolean
	readonly m_flRuneMinimapIconScale: number
	readonly m_CustomVictoryMessage: string[]
	readonly m_flCustomGameEndDelay: number
	readonly m_flCustomGameSetupAutoLaunchDelay: number
	readonly m_flCustomGameSetupTimeout: number
	readonly m_flCustomVictoryMessageDuration: number
	readonly m_flHeroSelectPenaltyTime: number
	readonly m_bCustomGameSetupAutoLaunchEnabled: boolean
	readonly m_bCustomGameTeamSelectionLocked: boolean
	readonly m_bCustomGameEnablePickRules: boolean
	readonly m_bCustomGameAllowHeroPickMusic: boolean
	readonly m_bCustomGameAllowMusicAtGameStart: boolean
	readonly m_bCustomGameAllowBattleMusic: boolean
	readonly m_iCMModePickBanOrder: number
	readonly m_iCDModePickBanOrder: number
	readonly m_iPauseTeam: number
	readonly m_nGGTeam: number
	readonly m_flGGEndsAtTime: number
	readonly m_bWhiteListEnabled: boolean
	readonly m_bItemWhiteList: number[]
	readonly m_nLastHitUIMode: number
	readonly m_bHUDTimerTutorialMode: boolean
	readonly m_HeroPickMiscTimer: CountdownTimer
	readonly m_ExtraTimeTimer: CountdownTimer
	readonly m_fExtraTimeRemaining: number[]
	readonly m_bRDFirstThink: boolean
	readonly m_RDMessageSent: boolean[]
	readonly m_bHeroRespawnEnabled: boolean
	readonly m_bIsRandomingEnabled: boolean
	readonly m_HeroPickPhaseBitfield: number[]
	readonly m_bHasSwapped: boolean[]
	readonly m_iCaptainPlayerIDs: number[]
	readonly m_BannedHeroes: number[]
	readonly m_SelectedHeroes: number[]
	readonly m_iActiveTeam: number
	readonly m_iStartingTeam: number
	readonly m_iPenaltyLevelRadiant: number
	readonly m_iPenaltyLevelDire: number
	readonly m_bTier3TowerDestroyed: boolean
	readonly m_nSeriesType: number
	readonly m_nRadiantSeriesWins: number
	readonly m_nDireSeriesWins: number
	readonly m_vecAvailableHerosPerPlayerID: CHeroesPerPlayer[]
	readonly m_vecLockedHerosByPlayerID: CHeroesPerPlayer[]
	readonly m_CustomGameForceSelectHero: number[]
	readonly m_flGoldTime: number
	readonly m_flXPTime: number
	readonly m_flCreepSpawntime: number
	readonly m_flAnnounceStartTime: number
	readonly m_iGoodTomeCount: number
	readonly m_iBadTomeCount: number
	readonly m_flPreGameStartTime: number
	readonly m_flGameStartTime: number
	readonly m_flGameEndTime: number
	readonly m_flGameLoadTime: number
	readonly m_iCustomGameScore: number[]
	readonly m_nCustomGameDifficulty: number
	readonly m_bEnemyModifiersEnabled: boolean
	readonly m_iWaves: number
	readonly m_iCreepUpgradeState: number
	readonly m_fGoodGlyphCooldown: number
	readonly m_fBadGlyphCooldown: number
	readonly m_flGlyphCooldowns: number[]
	readonly m_fGoodRadarCooldown: number
	readonly m_fBadRadarCooldown: number
	readonly m_flRadarCooldowns: number[]
	readonly m_bIsNightstalkerNight: boolean
	readonly m_bIsTemporaryNight: boolean
	readonly m_bIsTemporaryDay: boolean
	readonly m_nRiverType: number
	readonly m_flGoldRedistributeTime: number
	readonly m_nGoldToRedistribute: number[]
	readonly m_flNextPreGameThink: number
	readonly m_flNextAllDraftGoldThink: number
	readonly m_flTimeEnteredState: number
	readonly m_unRiverAccountID: number
	readonly m_ulRiverItemID: number
	readonly m_vecItemStockInfo: CDOTA_ItemStockInfo[]
	readonly m_AssassinMiniGameNetData: DOTA_AssassinMinigameNetworkState
	readonly m_nGameWinner: number
	readonly m_unMatchID64: number
	readonly m_bMatchSignoutComplete: boolean
	readonly m_hSideShop1: C_BaseEntity
	readonly m_hSideShop2: C_BaseEntity
	readonly m_hSecretShop1: C_BaseEntity
	readonly m_hSecretShop2: C_BaseEntity
	readonly m_hTeamFountains: C_BaseEntity[]
	readonly m_hTeamForts: C_BaseEntity[]
	readonly m_hTeamShops: C_BaseEntity[]
	readonly m_hAnnouncerGood: C_BaseEntity
	readonly m_hAnnouncerBad: C_BaseEntity
	readonly m_hAnnouncerSpectator: C_BaseEntity
	readonly m_hAnnouncerGood_KillingSpree: C_BaseEntity
	readonly m_hAnnouncerBad_KillingSpree: C_BaseEntity
	readonly m_hAnnouncerSpectator_KillingSpree: C_BaseEntity
	readonly m_fGameTime: number
	readonly m_fTimeOfDay: number
	readonly m_iNetTimeOfDay: number
	readonly m_nLoadedPlayers: number
	readonly m_nExpectedPlayers: number
	readonly m_iMinimapDebugGridState: number
	readonly m_iFoWFrameNumber: number
	readonly m_bIsStableMode: boolean
	readonly m_bGamePaused: boolean
	readonly m_fPauseRawTime: number
	readonly m_fPauseCurTime: number
	readonly m_fUnpauseRawTime: number
	readonly m_fUnpauseCurTime: number
	readonly m_bGameTimeFrozen: boolean
	readonly m_pKVEventMatchMetadata: KeyValues
	readonly m_pKVEventSignout: KeyValues
	readonly m_nCustomGameFowTeamCount: number
	readonly m_bUseAlternateABRules: boolean
	readonly m_bLobbyIsAssociatedWithGame: boolean
	readonly m_BotDebugTimer: CountdownTimer
	readonly m_BotDebugPushLane: number[]
	readonly m_BotDebugDefendLane: number[]
	readonly m_BotDebugFarmLane: number[]
	readonly m_BotDebugRoam: number[]
	readonly m_hBotDebugRoamTarget: C_BaseEntity[]
	readonly m_BotDebugRoshan: number[]
	readonly m_nRoshanRespawnPhase: number
	readonly m_flRoshanRespawnPhaseEndTime: number
	readonly m_AbilityDraftAbilities: CDOTA_AbilityDraftAbilityState[]
	readonly m_bAbilityDraftCurrentPlayerHasPicked: boolean
	readonly m_nAbilityDraftPlayerTracker: number
	readonly m_nAbilityDraftRoundNumber: number
	readonly m_nAbilityDraftAdvanceSteps: number
	readonly m_nAbilityDraftPhase: number
	readonly m_nAbilityDraftHeroesChosen: number[]
	readonly m_vecARDMHeroes: KeyValues[]
	readonly m_nARDMHeroesPrecached: number
	readonly m_fLastARDMPrecache: number
	readonly m_nAllDraftPhase: number
	readonly m_bAllDraftRadiantFirst: boolean
	readonly m_bAllowOverrideVPK: boolean
	readonly m_nARDMHeroesRemaining: number[]
	readonly m_hGlobalPetList: CDOTA_BaseNPC_Pet[]
	readonly m_vecHeroPickRecord: HeroPickRecord_t[]
	readonly m_vecHeroDeathRecord: HeroDeathRecord_t[]
	readonly m_BadResultPositionTriggers: C_BaseEntity[]
	readonly m_RoshanPositionTriggers: C_BaseEntity[]
	readonly m_hRuneSpawners: C_BaseEntity[]
	readonly m_hBountyRuneSpawners: C_BaseEntity[]
	readonly m_hNeutralSpawners: C_BaseEntity[]
	readonly m_hAncientSpawners: C_BaseEntity[]
	readonly m_iPreviousRune1: number
	readonly m_iPreviousRune2: number
	readonly m_iAllStarMatchReady: number
	readonly m_fNextPowerupRuneSpawnTime: number
	readonly m_fNextBountyRuneSpawnTime: number
	readonly m_fNextBountyRunePrepTime: number
	readonly m_bFirstPowerupRune: boolean
	readonly m_bFirstBountyRune: boolean
	readonly m_bBountyRuneLocation_1: boolean
	readonly m_bBountyRuneLocation_2: boolean
	readonly m_bBountyRuneLocation_3: boolean
	readonly m_bBountyRuneLocation_4: boolean
	readonly m_fNextSnapshotTime: number
	readonly m_hRoshanSpawner: C_BaseEntity
	readonly m_iPreviousSpectators: number
	readonly m_bTeammateEvaluationMatch: boolean
	readonly m_rgAssignedPlayerID: number[]
	readonly m_nMaxSpectators: number
	readonly m_hDroppedItems: C_BaseEntity[]
	readonly m_hWards: C_BaseEntity[]
	readonly m_hGameEvents: C_BaseEntity
	readonly m_Towers: C_BaseEntity[]
	readonly m_TeamTowers: CDOTA_BaseNPC_Tower[]
	readonly m_TeamTowerPositions: Vector[]
	readonly m_TeamTowerLevels: number[]
	readonly m_TeamTowerLanes: number[]
	readonly m_TeamBarracks: CDOTA_BaseNPC_Building[]
	readonly m_TeamShrines: CDOTA_BaseNPC_Building[]
	readonly m_TempDayTimer: CountdownTimer
	readonly m_TempNightTimer: CountdownTimer
	readonly m_NightstalkerNightTimer: CountdownTimer
	readonly m_TempRiverTimer: CountdownTimer
	readonly m_bUseLenientAFK: boolean[]
	readonly m_bFirstBlood: boolean
	readonly m_nFirstBloodTime: number
	readonly m_CheckIdleTimer: CountdownTimer
	readonly m_nAnnounceHeroPickRadiantPlayerID: number
	readonly m_nAnnounceHeroPickDirePlayerID: number
	readonly m_nRecordBalanceTime: number
	readonly m_pszLastUsedAbility: string[]
	readonly m_pszLastUsedActiveAbility: string[]
	readonly m_reconnectinfos: CDOTA_ReconnectInfo[]
	readonly m_hEnemyCreepsInBase: C_BaseEntity[]
	readonly m_bTeamHasAbandonedPlayer: boolean[]
	readonly m_bLobbyHasLeaverDetected: boolean
	readonly m_bGameIsForcedSafeToLeave: boolean
	readonly m_bLobbyHasDicardMatchResults: boolean
	readonly m_nTeamRoshanKills: number[]
	readonly m_iGameEndReason: number
	readonly m_flPauseTime: number
	readonly m_pausingPlayerId: number
	readonly m_unpausingPlayerId: number
	readonly m_nPausesRemaining: number[]
	readonly m_nLastPauseTime: number[]
	readonly m_bNotifiedPlayerLeaverStatus: boolean[]
	readonly m_bUploadedReplay: boolean
	readonly m_flLobbyWaitTime: number
	readonly m_bGameWasLoaded: boolean
	readonly m_nLoadPauseFrameCount: number
	readonly m_flStateFallbackTransitionTime: number
	readonly m_timerFinishReplay: CountdownTimer
	readonly m_vecChatLog: GameChatLogEntry_t[]
	readonly m_bFatalErrorAbortGame: boolean
	readonly m_bFillEmptySlotsWithBots: boolean
	readonly m_dotaMapSpawnGroup: number
	readonly m_lobbyType: number
	readonly m_lobbyLeagueID: number
	readonly m_lobbyGameName: string[]
	readonly m_vecHeroStatueLiked: CHeroStatueLiked[]
	readonly m_CustomGameTeamMaxPlayers: number[]
	readonly m_iMutations: number[]
	readonly m_vecIngameEvents: CIngameEvent_Base[]
	readonly m_nPrimaryIngameEventIndex: number
	readonly m_NeutralSpawnBoxes: AABB_t[]
	readonly m_flLastItemSuggestionRequestTime: number[]
}

interface C_OP_RenderGrid extends CParticleFunctionRenderer {
	readonly type_name: string
}

interface C_INIT_RandomTrailLength extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_flMinLength: number
	readonly m_flMaxLength: number
	readonly m_flLengthRandExponent: number
}

interface C_OP_ConstrainDistanceToPath extends CParticleFunctionConstraint {
	readonly type_name: string
	readonly m_fMinDistance: number
	readonly m_flMaxDistance0: number
	readonly m_flMaxDistanceMid: number
	readonly m_flMaxDistance1: number
	readonly m_PathParameters: CPathParameters
	readonly m_flTravelTime: number
}

interface EntComponentInfo_t {
	readonly type_name: string
	readonly m_id: V_uuid_t
	readonly m_pName: string
	readonly m_pCPPClassname: string
	readonly m_pNetworkDataReferencedDescription: string
	readonly m_pNetworkDataReferencedPtrPropDescription: string
	readonly m_nRuntimeIndex: number
	readonly m_nFlags: number
	readonly m_pBaseClassComponentHelper: CEntityComponentHelper
}

interface sLoadoutItem {
	readonly type_name: string
	readonly name: string
	readonly iFlags: number
	readonly bPurchased: boolean
}

interface CRagdoll extends IRagdoll {
	readonly type_name: string
	readonly m_ragdoll: ragdoll_t
	readonly m_mins: Vector
	readonly m_maxs: Vector
	readonly m_origin: Vector
	readonly m_lastUpdate: number
	readonly m_allAsleep: boolean
	readonly m_vecLastOrigin: Vector
	readonly m_flLastOriginChangeTime: number
	readonly m_flAwakeTime: number
}

interface C_INIT_CreateAlongPath extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_fMaxDistance: number
	readonly m_PathParams: CPathParameters
	readonly m_bUseRandomCPs: boolean
	readonly m_vEndOffset: Vector
	readonly m_bSaveOffset: boolean
}

interface CAudioAnimTag extends CAnimTagBase {
	readonly type_name: string
	readonly m_clipName: string
}

interface CRenderMesh {
	readonly type_name: string
	readonly m_constraints: CBaseConstraint[]
	readonly m_skeleton: CRenderSkeleton
}

interface CSchemaStaticField extends SchemaStaticFieldData_t {
	readonly type_name: string
}

interface constraint_hingeparams_t {
	readonly type_name: string
	readonly worldPosition: Vector
	readonly worldAxisDirection: Vector
	readonly hingeAxis: constraint_axislimit_t
	readonly constraint: constraint_breakableparams_t
}

interface MaterialDrawDescriptor_t {
	readonly type_name: string
	readonly m_nBaseVertex: number
	readonly m_nVertexCount: number
	readonly m_nStartIndex: number
	readonly m_nIndexCount: number
	readonly m_nStartInstance: number
	readonly m_nInstanceCount: number
	readonly m_flUvDensity: number
	readonly m_nPrimitiveType: number
	readonly m_bAlphaBlendedMaterial: number
	readonly m_nFlags: number
	readonly m_padding: number
	readonly m_hInputLayoutHandle: number[]
	readonly m_indexBuffer: RenderBufferBinding_t
}

interface C_BaseAnimatingOverlayController extends C_BaseAnimatingController {
	readonly type_name: string
	readonly m_AnimOverlay: CAnimationLayer[]
}

interface C_OP_RenderStandardLight extends CParticleFunctionRenderer {
	readonly type_name: string
	readonly m_nLightType: number
	readonly m_Color: Color
	readonly m_flIntensity: number
	readonly m_bCastShadows: boolean
	readonly m_flTheta: number
	readonly m_flPhi: number
	readonly m_flRadiusMultiplier: number
	readonly m_flFalloffLinearity: number
	readonly m_bRenderDiffuse: boolean
	readonly m_bRenderSpecular: boolean
	readonly m_lightCookie: string
}

interface C_OP_CPOffsetToPercentageBetweenCPs extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flInputBias: number
	readonly m_nStartCP: number
	readonly m_nEndCP: number
	readonly m_nOffsetCP: number
	readonly m_nOuputCP: number
	readonly m_nInputCP: number
	readonly m_bRadialCheck: boolean
	readonly m_bScaleOffset: boolean
	readonly m_vecOffset: Vector
}

interface C_OP_ColorInterpolateRandom extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_ColorFadeMin: Color
	readonly m_ColorFadeMax: Color
	readonly m_flFadeStartTime: number
	readonly m_flFadeEndTime: number
	readonly m_bEaseInOut: boolean
}

interface C_OP_ParentVortices extends CParticleFunctionForce {
	readonly type_name: string
	readonly m_flForceScale: number
	readonly m_vecTwistAxis: Vector
	readonly m_bFlipBasedOnYaw: boolean
}

interface C_OP_MaintainEmitter extends CParticleFunctionEmitter {
	readonly type_name: string
	readonly m_nParticlesToMaintain: number
	readonly m_flStartTime: number
	readonly m_nScaleControlPoint: number
	readonly m_nScaleControlPointField: number
	readonly m_flEmissionRate: number
	readonly m_nSnapshotControlPoint: number
}

interface SeqResourceCmdLayer_t {
	readonly type_name: string
	readonly m_cmd: number
	readonly m_nLocalReference: number
	readonly m_nLocalBonemask: number
	readonly m_nDstResult: number
	readonly m_nSrcResult: number
	readonly m_bSpline: boolean
	readonly m_flVar1: number
	readonly m_flVar2: number
	readonly m_nLineNumber: number
}

interface CSkeletonInstance extends CGameSceneNode {
	readonly type_name: string
	readonly m_modelState: CModelState
	readonly m_bIsRenderingEnabled: boolean
	readonly m_bIsAnimationEnabled: boolean
	readonly m_bDisableSolidCollisionsForHierarchy: boolean
	readonly m_bDirtyMotionType: boolean
	readonly m_bIsGeneratingLatchedParentSpaceState: boolean
	readonly m_nHitboxSet: number
	readonly m_bEnableIK: boolean
	readonly m_flIkMasterBlendValueCache: number
	readonly m_NetworkedIKContext: CNetworkedIKContext
}

interface CFourWheelServerVehicle extends CBaseServerVehicle {
	readonly type_name: string
	readonly m_ViewSmoothing: ViewSmoothingData_t
}

interface C_OP_RemapCPOrientationToRotations extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCP: number
	readonly m_vecRotation: Vector
	readonly m_bUseQuat: boolean
	readonly m_bWriteNormal: boolean
}

interface voxel_vis_cluster_t {
	readonly type_name: string
	readonly m_nBlockIndex: number
	readonly m_nOffsetIntoBlock: number
}

interface CSosSoundEventGroupListSchema {
	readonly type_name: string
	readonly m_groupList: CSosSoundEventGroupSchema[]
}

interface SeqResourcePoseSetting_t {
	readonly type_name: string
	readonly m_flValue: number
	readonly m_bX: boolean
	readonly m_bY: boolean
	readonly m_bZ: boolean
	readonly m_eType: number
}

interface InfoForResourceTypeCNameListEvents {
	readonly type_name: string
}

interface InfoForResourceTypeIMaterial2 {
	readonly type_name: string
}

interface c_vehicleview_t {
	readonly type_name: string
	readonly bClampEyeAngles: boolean
	readonly flPitchCurveZero: number
	readonly flPitchCurveLinear: number
	readonly flRollCurveZero: number
	readonly flRollCurveLinear: number
	readonly flFOV: number
	readonly flYawMin: number
	readonly flYawMax: number
	readonly flPitchMin: number
	readonly flPitchMax: number
}

interface C_INIT_CreateGrid extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPoint00: number
	readonly m_vLocalOffset00: Vector
	readonly m_nControlPoint01: number
	readonly m_vLocalOffset01: Vector
	readonly m_nControlPoint10: number
	readonly m_vLocalOffset10: Vector
	readonly m_nControlPoint11: number
	readonly m_vLocalOffset11: Vector
	readonly m_nNumCols: number
	readonly m_nNumRows: number
	readonly m_bHorizontalInterleaved: boolean
}

interface AnimResourceMorphDifference_t {
	readonly type_name: string
string}

interface FeSimdFitMatrices_t {
	readonly type_name: string
	readonly vCenter: FourVectors
	readonly nEnd: number[]
	readonly nCtrl: number[]
	readonly AqqInv: FourCovMatrices3
}

interface CNavVolumeBreadthFirstSearch extends CNavVolumeCalculatedVector {
	readonly type_name: string
	readonly m_vStartPos: Vector
	readonly m_flSearchDist: number
}

interface C_OP_RemapDotProductToScalar extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nInputCP1: number
	readonly m_nInputCP2: number
	readonly m_flInputMin: number
	readonly m_flInputMax: number
	readonly m_flOutputMin: number
	readonly m_flOutputMax: number
	readonly m_bUseParticleVelocity: boolean
	readonly m_bScaleInitialRange: boolean
	readonly m_bScaleCurrent: boolean
	readonly m_bActiveRange: boolean
}

interface C_OP_SetPerChildControlPoint extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nChildGroupID: number
	readonly m_nFirstControlPoint: number
	readonly m_nNumControlPoints: number
	readonly m_nParticleIncrement: number
	readonly m_nFirstSourcePoint: number
	readonly m_bSetOrientation: boolean
	readonly m_bNumBasedOnParticleCount: boolean
}

interface CDOTA_ActionRunner {
	readonly type_name: string
	readonly m_pEventContext: CModifierParams
	readonly m_pCaster: CDOTA_BaseNPC
}

interface C_OP_MaintainSequentialPath extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_fMaxDistance: number
	readonly m_flNumToAssign: number
	readonly m_flCohesionStrength: number
	readonly m_flTolerance: number
	readonly m_bLoop: boolean
	readonly m_bUseParticleCount: boolean
	readonly m_PathParams: CPathParameters
}

interface CAimMatrixAnimNode extends CAnimNodeBase {
	readonly type_name: string
	readonly m_childID: AnimNodeID
	readonly m_sequenceName: string
	readonly m_fAngleIncrement: number
	readonly m_target: number
	readonly m_param: AnimParamID
	readonly m_attachmentName: string
	readonly m_blendMode: number
	readonly m_boneMaskName: string
	readonly m_bResetBase: boolean
	readonly m_damping: CAnimInputDamping
}

interface InfoForResourceTypeProcessingGraphInstance_t {
	readonly type_name: string
}

interface C_CSequenceTransitioner {
	readonly type_name: string
	readonly m_animationQueue: CAnimationLayer[]
	readonly m_bIsInSimulation: boolean
	readonly m_flSimOrRenderTime: number
	readonly m_flInterpolatedTime: number
}

interface C_OP_Decay extends CParticleFunctionOperator {
	readonly type_name: string
}

interface CSpotlightTraceCacheEntry {
	readonly type_name: string
	readonly m_origin: Vector
	readonly m_radius: number
}

interface PlayerResourcePlayerEventData_t {
	readonly type_name: string
	readonly m_iEventID: number
	readonly m_iEventPoints: number
	readonly m_iEventPremiumPoints: number
	readonly m_iEventWagerTokensRemaining: number
	readonly m_iEventWagerTokensMax: number
	readonly m_iEventEffectsMask: number
	readonly m_iEventRanks: number
	readonly m_iRankWagersAvailable: number
	readonly m_iRankWagersMax: number
	readonly m_bIsEventOwned: boolean
	readonly m_iFavoriteTeam: number
	readonly m_iFavoriteTeamQuality: number
}

interface vehicle_crashsound_t {
	readonly type_name: string
	readonly flMinSpeed: number
	readonly flMinDeltaSpeed: number
	readonly gearLimit: number
	readonly iszCrashSound: string
}

interface locksound_t {
	readonly type_name: string
	readonly sLockedSound: string
	readonly sLockedSentence: string
	readonly sUnlockedSound: string
	readonly sUnlockedSentence: string
	readonly iLockedSentence: number
	readonly iUnlockedSentence: number
	readonly flwaitSound: number
	readonly flwaitSentence: number
	readonly bEOFLocked: number
	readonly bEOFUnlocked: number
}

interface C_INIT_ColorLitPerParticle extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_ColorMin: Color
	readonly m_ColorMax: Color
	readonly m_TintMin: Color
	readonly m_TintMax: Color
	readonly m_flTintPerc: number
	readonly m_nTintBlendMode: number
	readonly m_flLightAmplification: number
}

interface C_INIT_CreatePhyllotaxis extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nScaleCP: number
	readonly m_nComponent: number
	readonly m_fRadCentCore: number
	readonly m_fRadPerPoint: number
	readonly m_fRadPerPointTo: number
	readonly m_fpointAngle: number
	readonly m_fsizeOverall: number
	readonly m_fRadBias: number
	readonly m_fMinRad: number
	readonly m_fDistBias: number
	readonly m_bUseLocalCoords: boolean
	readonly m_bUseWithContEmit: boolean
	readonly m_bUseOrigRadius: boolean
}

interface AnimResourceEncodedFrames_t {
	readonly type_name: string
	readonly m_nFrames: number
	readonly m_nFramesPerBlock: number
	readonly m_usageDifferences: AnimResourceEncodeDifference_t
}

interface C_OP_TeleportBeam extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_nCPPosition: number
	readonly m_nCPVelocity: number
	readonly m_nCPMisc: number
	readonly m_nCPColor: number
	readonly m_nCPInvalidColor: number
	readonly m_nCPExtraArcData: number
	readonly m_vGravity: Vector
	readonly m_flArcMaxDuration: number
	readonly m_flSegmentBreak: number
	readonly m_flArcSpeed: number
	readonly m_flAlpha: number
}

interface C_OP_FadeOutSimple extends CParticleFunctionOperator {
	readonly type_name: string
	readonly m_flFadeOutTime: number
}

interface C_INIT_SetHitboxToClosest extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nDesiredHitbox: number
	readonly m_flHitBoxScale: number
	readonly m_HitboxSetName: string[]
	readonly m_bUseBones: boolean
}

interface C_INIT_CreateOnModelAtHeight extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_bUseBones: boolean
	readonly m_bForceZ: boolean
	readonly m_nControlPointNumber: number
	readonly m_nHeightCP: number
	readonly m_bUseWaterHeight: boolean
	readonly m_flDesiredHeight: number
	readonly m_flHitBoxScale: number
	readonly m_HitboxSetName: string[]
}

interface C_INIT_RingWave extends CParticleFunctionInitializer {
	readonly type_name: string
	readonly m_nControlPointNumber: number
	readonly m_nOverrideCP: number
	readonly m_nOverrideCP2: number
	readonly m_flParticlesPerOrbit: number
	readonly m_flInitialRadius: number
	readonly m_flThickness: number
	readonly m_flInitialSpeedMin: number
	readonly m_flInitialSpeedMax: number
	readonly m_flRoll: number
	readonly m_flPitch: number
	readonly m_flYaw: number
	readonly m_bEvenDistribution: boolean
	readonly m_bXYVelocityOnly: boolean
}

interface VPhysXJoint_t {
	readonly type_name: string
	readonly m_nType: number
	readonly m_nBody1: number
	readonly m_nBody2: number
	readonly m_nFlags: number
	readonly m_Frame1: CTransform
	readonly m_Frame2: CTransform
	readonly m_bEnableCollision: boolean
	readonly m_bEnableLinearLimit: boolean
	readonly m_LinearLimit: VPhysXRange_t
	readonly m_bEnableLinearMotor: boolean
	readonly m_vLinearTargetVelocity: Vector
	readonly m_flMaxForce: number
	readonly m_bEnableSwingLimit: boolean
	readonly m_SwingLimit: VPhysXRange_t
	readonly m_bEnableTwistLimit: boolean
	readonly m_TwistLimit: VPhysXRange_t
	readonly m_bEnableAngularMotor: boolean
	readonly m_vAngularTargetVelocity: Vector
	readonly m_flMaxTorque: number
	readonly m_flLinearFrequency: number
	readonly m_flLinearDampingRatio: number
	readonly m_flAngularFrequency: number
	readonly m_flAngularDampingRatio: number
}

interface CDOTA_Tree extends CObstructionObject {
	readonly type_name: string
	readonly m_bStanding: boolean
	readonly m_bSpecialTree: boolean
	readonly m_nOccluderIndex: number
}

interface C_INIT_RemapNamedModelMeshGroupToScalar extends C_INIT_RemapNamedModelElementToScalar {
	readonly type_name: string
}

interface RnMeshDesc_t extends RnShapeDesc_t {
	readonly type_name: string
	readonly m_Mesh: RnMesh_t
}

interface CEntityInstance extends IHandleEntity {
	readonly type_name: string
	readonly m_iszPrivateVScripts: string
	readonly m_pEntity: CEntityIdentity
	readonly m_CScriptComponent: CScriptComponent
}

interface C_GameEntity extends CEntityInstance {
	readonly type_name: string
}

interface C_BaseEntity extends C_GameEntity {
	readonly type_name: string
	readonly m_bIsValid: boolean
	readonly m_iID: number
	readonly m_vecForward: Vector
	readonly m_CBodyComponent: CBodyComponent
	readonly m_NetworkTransmitComponent: CNetworkTransmitComponent
	readonly m_pDummyPhysicsComponent: CPhysicsComponent
	readonly touchStamp: number
	readonly m_nLastThinkTick: number
	readonly m_pGameSceneNode: CGameSceneNode
	readonly m_pCollision: CCollisionProperty
	readonly m_iMaxHealth: number
	readonly m_iHealth: number
	readonly m_lifeState: number
	readonly m_takedamage: number
	readonly m_ubInterpolationFrame: number
	readonly m_hSceneObjectController: C_BaseEntity
	readonly m_nNoInterpolationTick: number
	readonly m_flProxyRandomValue: number
	readonly m_iEFlags: number
	readonly m_nWaterType: number
	readonly m_bInterpolateEvenWithNoModel: boolean
	readonly m_bPredictionEligible: boolean
	readonly m_vecNetworkOrigin: Vector
	readonly m_angNetworkAngles: QAngle
	readonly m_nSimulationTick: number
	readonly m_iCurrentThinkContext: number
	readonly m_aThinkFunctions: thinkfunc_t[]
	readonly m_flAnimTime: number
	readonly m_flSimulationTime: number
	readonly m_nSceneObjectOverrideFlags: number
	readonly m_bHasSuccessfullyInterpolated: boolean
	readonly m_bHasAddedVarsToInterpolation: boolean
	readonly m_bRenderEvenWhenNotSuccessfullyInterpolated: boolean
	readonly m_nInterpolationLatchDirtyFlags: number[]
	readonly m_ListEntry: number[]
	readonly m_flCreateTime: number
	readonly m_flSpeed: number
	readonly m_EntClientFlags: number
	readonly m_bClientSideRagdoll: boolean
	readonly m_iTeamNum: number
	readonly m_spawnflags: number
	readonly m_nNextThinkTick: number
	readonly m_fFlags: number
	readonly m_vecAbsVelocity: Vector
	readonly m_vecVelocity: CNetworkVelocityVector
	readonly m_vecBaseVelocity: Vector
	readonly m_hEffectEntity: C_BaseEntity
	readonly m_hOwnerEntity: C_BaseEntity
	readonly m_MoveCollide: number
	readonly m_MoveType: number
	readonly m_Gender: number
	readonly m_nWaterLevel: number
	readonly m_fEffects: number
	readonly m_hGroundEntity: C_BaseEntity
	readonly m_flFriction: number
	readonly m_flElasticity: number
	readonly m_bSimulatedEveryTick: boolean
	readonly m_bAnimatedEveryTick: boolean
	readonly m_nMinCPULevel: number
	readonly m_nMaxCPULevel: number
	readonly m_nMinGPULevel: number
	readonly m_nMaxGPULevel: number
	readonly m_flNavIgnoreUntilTime: number
	readonly m_iTextureFrameIndex: number
	readonly m_flFirstReceivedTime: number
	readonly m_flLastMessageTime: number
	readonly m_hThink: number
	readonly m_fBBoxVisFlags: number
	readonly m_bIsValidIKAttachment: boolean
	readonly m_bPredictable: boolean
	readonly m_bRenderWithViewModels: boolean
	readonly m_nSplitUserPlayerPredictionSlot: CSplitScreenSlot
	readonly m_hOldMoveParent: C_BaseEntity
	readonly m_Particles: CParticleProperty
	readonly m_vecPredictedScriptFloats: float32[]
	readonly m_vecPredictedScriptFloatIDs: number[]
	readonly m_nNextScriptVarRecordID: number
	readonly m_vecAngVelocity: QAngle
	readonly m_flGroundChangeTime: number
	readonly m_flGravity: number
	readonly m_DataChangeEventRef: number
	readonly m_nCreationTick: number
	readonly m_flDeferredBlobShadowRadius: number
	readonly m_bIsDOTANPC: boolean
	readonly m_bIsNPC: boolean
	readonly m_bAnimTimeChanged: boolean
	readonly m_bSimulationTimeChanged: boolean
	readonly m_bIsBlurred: boolean

	IsInRange(ent: C_BaseEntity, range: number): boolean
	IsEnemy(ent: C_BaseEntity): boolean
	DistTo(ent: C_BaseEntity): number
	InFront(dist: number): Vector
	FindRotationAngle(vec: Vector): number
}

interface C_DOTABaseAbility extends C_BaseEntity {
	readonly type_name: string
	readonly m_sAbilityName: string
	readonly m_fCastPoint: number
	readonly m_bAltCastState: boolean
	readonly m_iEnemyLevel: number
	readonly m_iMaxLevel: number
	readonly m_bCanLearn: boolean
	readonly m_flUpgradeBlend: number
	readonly m_bRefCountsModifiers: boolean
	readonly m_bHidden: boolean
	readonly m_bOldHidden: boolean
	readonly m_bActivated: boolean
	readonly m_bOldActivated: boolean
	readonly m_iDirtyButtons: number
	readonly m_bPerformDirtyParity: boolean
	readonly m_iLevel: number
	readonly m_bAbilityLevelDirty: boolean
	readonly m_bToggleState: boolean
	readonly m_bInAbilityPhase: boolean
	readonly m_fCooldown: number
	readonly m_iCastRange: number
	readonly m_flCooldownLength: number
	readonly m_iManaCost: number
	readonly m_bAutoCastState: boolean
	readonly m_flChannelStartTime: number
	readonly m_flCastStartTime: number
	readonly m_bInIndefiniteCooldown: boolean
	readonly m_bFrozenCooldown: boolean
	readonly m_flOverrideCastPoint: number
	readonly m_bStolen: boolean
	readonly m_bReplicated: boolean
	readonly m_flLastCastClickTime: number

	GetSpecialValue(special_name: string, level?: number): number
	IsManaEnough(owner: C_DOTA_BaseNPC): boolean
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ember_Spirit_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_bCombinable: boolean
	readonly m_bPermanent: boolean
	readonly m_bStackable: boolean
	readonly m_bRecipe: boolean
	readonly m_iSharability: number
	readonly m_bDroppable: boolean
	readonly m_bPurchasable: boolean
	readonly m_bSellable: boolean
	readonly m_bInitiallySellable: boolean
	readonly m_bForceUnsellable: boolean
	readonly m_bRequiresstringges: boolean
	readonly m_bDisplaystringges: boolean
	readonly m_bHidestringges: boolean
	readonly m_bKillable: boolean
	readonly m_bDisassemblable: boolean
	readonly m_bAlertable: boolean
	readonly m_iInitialstringges: number
	readonly m_bCastOnPickup: boolean
	readonly m_iCurrentstringges: number
	readonly m_iSecondarystringges: number
	readonly m_bCombineLocked: boolean
	readonly m_flPurchaseTime: number
	readonly m_flAssembledTime: number
	readonly m_bPurchasedWhileDead: boolean
	readonly m_bCanBeUsedOutOfInventory: boolean
	readonly m_bItemEnabled: boolean
	readonly m_flEnableTime: number
	readonly m_bDisplayOwnership: boolean
	readonly m_hOldOwnerEntity: C_BaseEntity
	readonly m_iOldstringges: number
	readonly m_iPlayerOwnerID: number
	readonly m_vecPreGameTransferPlayerIDs: number[]
}

interface C_DOTA_Ability_Riki_BlinkStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Mirana_Arrow extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vStartPos: Vector
	readonly m_nFXIndex: number
	readonly hAlreadyHitList: C_BaseEntity[]
}

interface C_DOTA_Ability_Special_Bonus_Unique_Witch_Doctor_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Juggernaut_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseModelEntity extends C_BaseEntity {
	readonly type_name: string
	readonly m_CRenderComponent: CRenderComponent
	readonly m_iViewerID: number
	readonly m_iTeamVisibilityBitmask: number
	readonly m_nLastAddDecal: number
	readonly m_nRenderMode: number
	readonly m_bVisibilityDirtyFlag: boolean
	readonly m_nRenderFX: number
	readonly m_bAllowFadeInView: boolean
	readonly m_clrRender: Color
	readonly m_Collision: CCollisionProperty
	readonly m_Glow: CGlowProperty
	readonly m_flGlowBackfaceMult: number
	readonly m_fadeMinDist: number
	readonly m_fadeMaxDist: number
	readonly m_flFadeScale: number
	readonly m_nAddDecal: number
	readonly m_vDecalPosition: Vector
	readonly m_vDecalForwardAxis: Vector
	readonly m_flDecalRadius: number
	readonly m_vecViewOffset: CNetworkViewOffsetVector
	readonly m_pClientAlphaProperty: CClientAlphaProperty
	readonly m_ClientOverrideTint: Color
	readonly m_bUseClientOverrideTint: boolean
}

interface CDOTA_Item_RefresherOrb_Shard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Reaver extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_TemplarAssassin_SelfTrap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lina_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Terrorblade_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CHitboxComponent extends CEntityComponent {
	readonly type_name: string
}

interface CBodyComponent extends CEntityComponent {
	readonly type_name: string
	readonly m_pSceneNode: CGameSceneNode
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface CDOTA_Item_Recipe_Octarine_Core extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Quarterstaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Leshrac_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spectre extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseAnimating extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_CHitboxComponent: CHitboxComponent
	readonly m_vecForce: Vector
	readonly m_nForceBone: number
	readonly m_bShouldAnimateDuringGameplayPause: boolean
	readonly m_bDontSimulateClientAnimGraph: boolean
	readonly m_nMuzzleFlashParity: number
	readonly m_pClientsideRagdoll: C_BaseAnimating
	readonly m_bInitModelEffects: boolean
	readonly m_builtRagdoll: boolean
	readonly m_bIsStaticProp: boolean
	readonly m_nOldMuzzleFlashParity: number
	readonly m_iEjectBrassAttachment: number
	readonly m_bSuppressAnimEventSounds: boolean
}

interface C_DOTA_Ability_PhantomAssassin_Blur extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lich_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enchantress_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bristleback extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slardar_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_80 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_700 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Guts extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_Spring_Early extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseAnimatingOverlay extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseFlex extends C_BaseAnimatingOverlay {
	readonly type_name: string
	readonly m_viewtarget: Vector
	readonly m_flexWeight: float32[]
	readonly m_blinktoggle: boolean
	readonly m_nLastFlexUpdateFrameCount: number
	readonly m_CachedViewTarget: Vector
	readonly m_iBlink: number
	readonly m_iMouthAttachment: number
	readonly m_iEyeAttachment: number
	readonly m_blinktime: number
	readonly m_bResetFlexWeightsOnModelChange: boolean
	readonly m_prevblinktoggle: boolean
	readonly m_iEyeLidUpDownPP: number
	readonly m_iEyeLidLeftRightPP: number
	readonly m_flMinEyeUpDown: number
	readonly m_flMaxEyeUpDown: number
	readonly m_flMinEyeLeftRight: number
	readonly m_flMaxEyeLeftRight: number
}

interface C_DOTA_Ability_Life_Stealer_Open_Wounds extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Dazzle_Shallow_Grave extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Leap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_ShadowShaman_MassSerpentWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseCombatCharacter extends C_BaseFlex {
	readonly type_name: string
	readonly m_flNextAttack: number
	readonly m_iAmmo: number[]
	readonly m_hMyWeapons: C_BaseCombatWeapon[]
	readonly m_hActiveWeapon: C_BaseEntity
	readonly m_hMyWearables: C_EconWearable[]
	readonly m_bloodColor: number
	readonly m_leftFootAttachment: number
	readonly m_rightFootAttachment: number
	readonly m_nWaterWakeMode: number
	readonly m_flWaterWorldZ: number
	readonly m_flWaterNextTraceTime: number
	readonly m_flFieldOfView: number
	readonly m_footstepTimer: CountdownTimer
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pangolier_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Crystal_Maiden_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Arc_Warden_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Corruption_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CBodyComponentSkeletonInstance extends CBodyComponent {
	readonly type_name: string
	readonly m_skeletonInstance: CSkeletonInstance
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface C_DOTA_Item_RingOfHealth extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_Supernova extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_SunRayStop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_EarthSpirit_BoulderSmash extends C_DOTABaseAbility {
	readonly type_name: string
	readonly speed: number
	readonly rock_damage: number
	readonly radius: number
	readonly rock_search_aoe: number
	readonly unit_distance: number
	readonly rock_distance: number
	readonly stun_duration: number
	readonly m_nProjectileID: number
	readonly m_hCursorTarget: C_BaseEntity
	readonly m_bUsedStone: boolean
	readonly m_hTarget: C_BaseEntity
	readonly m_bTargetStone: boolean
}

interface C_DOTA_Ability_Huskar_Inner_Vitality extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necrolyte_Sadist_Stop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Centaur_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Drow_Ranger_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Axe_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Undying_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lifestealer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Techies_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_CraniumBasher extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Animation_Attack extends C_DOTABaseAbility {
	readonly type_name: string
	readonly animation_time: number
}

interface C_DOTA_Ability_Windrunner_Shackleshot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly shackle_count: number
	readonly m_vArrowStartPos: Vector
	readonly m_hTarget: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Kunkka_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_NullTalisman extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Bloodseeker_Rupture extends C_DOTABaseAbility {
	readonly type_name: string
	readonly max_stringges_scepter: number
	readonly stringge_restore_time_scepter: number
}

interface C_DOTA_Ability_Axe_BerserkersCall extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Creature_Ice_Breath extends C_DOTABaseAbility {
	readonly type_name: string
	readonly speed: number
	readonly projectile_count: number
	readonly rotation_angle: number
	readonly damage: number
	readonly radius: number
	readonly slow_duration: number
	readonly ctTimer: CountdownTimer
	readonly m_vecStartRot: Vector
	readonly m_vecEndRot: Vector
}

interface C_DOTA_Ability_Corspselord_Revive extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Abaddon_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_1000 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_NextBotCombaCharacter extends C_BaseCombatCharacter {
	readonly type_name: string
	readonly m_shadowTimer: CountdownTimer
	readonly m_shadowType: number
	readonly m_forcedShadowType: number
	readonly m_bForceShadowType: boolean
	readonly m_bInFrustum: boolean
	readonly m_nInFrustumFrame: number
	readonly m_flFrustumDistanceSqr: number
	readonly m_nLod: number
}

interface C_DOTA_Item_DemonEdge extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_PhaseBoots extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_SunRayToggleMoveEmpty extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Timbersaw extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Drow_Ranger_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Batrider_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_140 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_LightInfo extends C_BaseEntity, CLightInfoBase {
	readonly type_name: string
}

interface C_BaseClientUIEntity extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_bEnabled: boolean
	readonly m_DialogXMLName: string
	readonly m_PanelClassName: string
	readonly m_PanelID: string
}

interface C_DOTA_Item_Ethereal_Blade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Skywrath_Mage_Ancient_Seal extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_ModifierManager {
	readonly type_name: string
	readonly m_hModifierParent: C_BaseEntity
	readonly m_vecBuffs: CDOTA_Buff[]
	readonly m_nHasTruesightForTeam: number
	readonly m_nHasTruesightForTeamValid: number
	readonly m_nProvidesFOWPositionForTeam: number
	readonly m_nProvidesFOWPositionForTeamValid: number
	readonly m_iBuffIndex: number
	readonly m_iLockRefCount: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Alchemist extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_SpotlightEnd extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_flLightScale: number
	readonly m_Radius: number
}

interface C_DOTA_Item_Infused_Raindrop extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Ethereal_Blade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_OblivionStaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Death_Prophet_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointCamera extends C_BaseEntity {
	readonly type_name: string
	readonly m_bIsValid: boolean
	readonly m_iID: number
	readonly m_FOV: number
	readonly m_Resolution: number
	readonly m_bFogEnable: boolean
	readonly m_FogColor: Color
	readonly m_flFogStart: number
	readonly m_flFogEnd: number
	readonly m_flFogMaxDensity: number
	readonly m_bActive: boolean
	readonly m_bUseScreenAspectRatio: boolean
	readonly m_flAspectRatio: number
	readonly m_bNoSky: boolean
	readonly m_fBrightness: number
	readonly m_flZFar: number
	readonly m_flZNear: number
	readonly m_flOverrideShadowFarZ: number
	readonly m_TargetFOV: number
	readonly m_DegreesPerSecond: number
	readonly m_bIsOn: boolean
	readonly m_pNext: C_PointCamera
}

interface C_DOTA_Item_Recipe_AeonDisk extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_CraniumBasher extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Hidden2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ogre_Magi_Fireblast extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nMostRecentMulticastCount: number
}

interface C_DOTA_Ability_Necrolyte_Heartstopper_Aura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Axe extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FoWRevealerEntity extends C_BaseEntity {
	readonly type_name: string
	readonly m_unViewerTeam: number
	readonly m_nVisionRange: number
}

interface C_FlexCycler extends C_BaseFlex {
	readonly type_name: string
	readonly m_flextime: number
	readonly m_flextarget: number[]
	readonly m_blinktime: number
	readonly m_looktime: number
	readonly m_lookTarget: Vector
	readonly m_speaktime: number
	readonly m_istalking: number
	readonly m_phoneme: number
	readonly m_iszSentence: string
	readonly m_sentence: number
}

interface C_LightEntity extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_CLightComponent: CLightComponent
}

interface C_DOTA_Item_Recipe_SangeAndYasha extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Radiance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Bracer extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_QuadrupleTap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_UnitInventory {
	readonly type_name: string
	readonly m_SharedCooldownList: sSharedCooldownInfo[]
	readonly m_hItems: C_BaseEntity[]
	readonly m_bItemQueried: boolean[]
	readonly m_iParity: number
	readonly m_hInventoryParent: C_BaseEntity
	readonly m_bIsActive: boolean
	readonly m_bStashEnabled: boolean
	readonly m_hTransientCastItem: C_BaseEntity
	readonly m_bSendChangedMsg: boolean
}

interface C_DOTA_Ability_Axe_BattleHunger extends C_DOTABaseAbility {
	readonly type_name: string
	readonly damage_per_second: number
}

interface C_DOTA_Ability_Lua extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_GreaterClarity extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dazzle_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Drow_Ranger_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_300 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvWind extends C_BaseEntity {
	readonly type_name: string
	readonly m_EnvWindShared: C_CEnvWindShared
}

interface C_DOTA_Item_VitalityBooster extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_BladesOfAttack extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ArcWarden_TempestDouble extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hDoubles: C_BaseEntity
}

interface C_DOTA_Ability_Invoker_AttributeBonus extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Gyrocopter_Homing_Missile extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_QueenOfPain_Blink extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Razor_StaticLink extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iLinkIndex: number
	readonly m_ViewerTimer: CountdownTimer
	readonly vision_radius: number
	readonly vision_duration: number
}

interface C_DOTA_Item_DataDriven extends C_DOTA_Item {
	readonly type_name: string
	readonly m_bProcsMagicStick: boolean
	readonly m_bIsSharedWithTeammates: boolean
	readonly m_bCastFilterRejectCaster: boolean
	readonly m_fAnimationPlaybackRate: number
	readonly m_fAOERadius: number
	readonly m_CastAnimation: number
	readonly m_ModifierKVDescriptions: KeyValues[]
	readonly m_pOnChannelFinishKV: KeyValues
	readonly m_pOnChannelSucceededKV: KeyValues
	readonly m_pOnChannelInterruptedKV: KeyValues
	readonly m_pOnOwnerSpawnedKV: KeyValues
	readonly m_pOnOwnerDiedKV: KeyValues
	readonly m_pOnProjectileHitUnitKV: KeyValues
	readonly m_pOnProjectileFinishKV: KeyValues
	readonly m_pOnSpellStartKV: KeyValues
	readonly m_pOnAbilityPhaseStartKV: KeyValues
	readonly m_pOnToggleOnKV: KeyValues
	readonly m_pOnToggleOffKV: KeyValues
	readonly m_pOnEquipKV: KeyValues
	readonly m_pOnUnequipKV: KeyValues
	readonly m_pOnCreatedKV: KeyValues
}

interface C_DOTA_Ability_Special_Bonus_Unique_Underlord_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAGameManagerProxy extends C_BaseEntity {
	readonly type_name: string
	readonly m_pGameManager: C_DOTAGameManager
}

interface C_GameRulesProxy extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Diffusal_Blade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Crimson_Guard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_BlindingLight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Tome_Of_Knowledge extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Techies_RemoteMines extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_hRMine: C_BaseEntity
}

interface C_DOTA_Ability_LoneDruid_SpiritBear_Demolish extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Spectre_Haunt extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Leshrac_Diabolic_Edict extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC extends C_NextBotCombaCharacter {
	readonly type_name: string
	readonly m_bIsHero: boolean
	readonly m_bIsTower: boolean
	readonly m_bIsConsideredHero: boolean
	readonly m_bIsBuilding: boolean
	readonly m_bIsFort: boolean
	readonly m_bIsBarracks: boolean
	readonly m_bIsCreep: boolean
	readonly m_bIsCourier: boolean
	readonly m_bIsShop: boolean
	readonly m_bIsLaneCreep: boolean
	readonly m_bIsShrine: boolean
	readonly m_bIsWard: boolean
	readonly m_bIsRoshan: boolean
	readonly m_bIsTechiesRemoteMine: boolean
	readonly m_bIsStunned: boolean
	readonly m_bIsInvisible: boolean
	readonly m_bIsInvulnerable: boolean
	readonly m_bIsAttackImmune: boolean
	readonly m_bIsMagicImmune: boolean
	readonly m_bIsInFadeTime: boolean
	readonly m_bIsDeniable: boolean
	readonly m_bIsVisible: boolean
	readonly m_bIsVisibleForEnemies: boolean
	readonly m_bIsTrueSightedForEnemies: boolean
	readonly m_bIsControllableByAnyPlayer: boolean
	readonly m_bHasAttackCapability: boolean
	readonly m_bHasMoveCapability: boolean
	readonly m_bIsRangedAttacker: boolean
	readonly m_fAttackSpeed: number
	readonly m_fIncreasedAttackSpeed: number
	readonly m_fSecondsPerAttack: number
	readonly m_fAttackSpeedValue: number
	readonly m_fIdealSpeed: number
	readonly m_fAttackRange: number
	readonly m_fEffectiveInvisibilityLevel: number
	readonly m_fMagicMultiplier: number
	readonly m_bIsPhantom: boolean
	readonly m_iUnitType: number
	readonly m_bSelectionRingVisible: boolean
	readonly m_iCurrentLevel: number
	readonly m_bIsAncient: boolean
	readonly m_bStolenScepter: boolean
	readonly m_bIsNeutralUnitType: boolean
	readonly m_bSelectOnSpawn: boolean
	readonly m_bIgnoreAddSummonedToSelection: boolean
	readonly m_bConsideredHero: boolean
	readonly m_bUsesConstantGesture: boolean
	readonly m_bUseHeroAbilityNumbers: boolean
	readonly m_bHasSharedAbilities: boolean
	readonly m_bIsSummoned: boolean
	readonly m_bCanBeDominated: boolean
	readonly m_bHasUpgradeableAbilities: boolean
	readonly m_flHealthThinkRegen: number
	readonly m_iIsControllableByPlayer64: number
	readonly m_nHealthBarOffsetOverride: number
	readonly m_bCanRespawn: boolean
	readonly m_iAttackRange: number
	readonly m_iCombatClass: number
	readonly m_iCombatClassAttack: number
	readonly m_iCombatClassDefend: number
	readonly m_colorGemColor: Color
	readonly m_bHasColorGem: boolean
	readonly m_iMoveSpeed: number
	readonly m_flBaseAttackTime: number
	readonly m_iUnitNameIndex: number
	readonly m_iHealthBarOffset: number
	readonly m_iHealthBarHighlightColor: Color
	readonly m_flMana: number
	readonly m_flMaxMana: number
	readonly m_flManaThinkRegen: number
	readonly m_iBKBstringgesUsed: number
	readonly m_iBotDebugData: number
	readonly m_bIsIllusion: boolean
	readonly m_bHasClientSeenIllusionModifier: boolean
	readonly m_hAbilities: C_BaseEntity[]
	readonly m_flInvisibilityLevel: number
	readonly m_flHullRadius: number
	readonly m_flCollisionPadding: number
	readonly m_flRingRadius: number
	readonly m_flProjectileCollisionSize: number
	readonly m_iszUnitName: string
	readonly m_iszParticleFolder: string
	readonly m_iszSoundSet: string
	readonly m_iszSelectionGroup: string
	readonly m_iszVoiceFile: string
	readonly m_iszGameSoundsFile: string
	readonly m_iszVoiceBackgroundSound: string
	readonly m_iszIdleSoundLoop: string
	readonly m_szUnitLabel: string
	readonly m_nUnitLabelIndex: number
	readonly m_strAnimationModifier: string
	readonly m_TerrainSpecificFootstepEffect: string
	readonly m_bUseCustomTerrainWeatherEffect: boolean
	readonly m_bResourcesLoaded: boolean
	readonly m_flTauntCooldown: number
	readonly m_iCurShop: number
	readonly m_szCurShopEntName: string
	readonly m_iDayTimeVisionRange: number
	readonly m_iNightTimeVisionRange: number
	readonly m_iDamageMin: number
	readonly m_iDamageMax: number
	readonly m_iDamageBonus: number
	readonly m_iTaggedAsVisibleByTeam: number
	readonly m_ModifierManager: CDOTA_ModifierManager
	readonly m_Inventory: C_DOTA_UnitInventory
	readonly m_nUnitState64: number
	readonly m_nUnitDebuffState: number
	readonly m_bHasInventory: boolean
	readonly m_iAcquisitionRange: number
	readonly m_FoWViewID: number
	readonly m_iPrevHealthPct: number
	readonly m_iPrevLifeState: number
	readonly m_iPrevTeam: number
	readonly m_bPrevProvidesVision: boolean
	readonly m_nPrevControllableMask: number
	readonly m_TagTime: CountdownTimer
	readonly m_ClickedTime: CountdownTimer
	readonly m_IdleRunTransitionTimer: CountdownTimer
	readonly m_bAnimationTransitionActive: boolean
	readonly m_nAnimationTransitionPoseParameters: number[]
	readonly m_flTimeSinceLastAbilityNag: number
	readonly m_iAttackCapabilities: number
	readonly m_iSpecialAbility: number
	readonly m_iMoveCapabilities: number
	readonly m_nPlayerOwnerID: number
	readonly m_iszMinimapIcon: string
	readonly m_flMinimapIconSize: number
	readonly m_bMinimapDisableTint: boolean
	readonly m_colorHeroGlow: Color
	readonly m_iNearShopMask: number
	readonly m_nPoseParameterTurn: number
	readonly m_flLean: number
	readonly m_anglediff: number
	readonly m_bInfoKeyActive: boolean
	readonly m_bNewUpdateAssetModifiersNetworked: boolean
	readonly m_bSuppressGlow: boolean
	readonly m_bWasSinking: boolean
	readonly m_flRangeDisplayDist: number
	readonly m_szDefaultIdle: string
	readonly m_damagetimer: CountdownTimer
	readonly m_vRenderOrigin: Vector
	readonly m_fZDelta: number
	readonly m_flDeathTime: number
	readonly m_bBaseStatsChanged: boolean
	readonly m_bNeedsSoundEmitterRefresh: boolean
	readonly m_flPhysicalArmorValue: number
	readonly m_flMagicalResistanceValue: number
	readonly m_nPrevSequenceParity: number
	readonly m_flPrevInvisLevel: number
	readonly m_iPrevSequence: number
	readonly m_pLastWeatherEffectName: string
	readonly m_VoiceBackgroundSoundTimer: CountdownTimer
	readonly m_bIsWaitingToSpawn: boolean
	readonly m_nTotalDamageTaken: number
	readonly m_flManaRegen: number
	readonly m_flHealthRegen: number
	readonly m_bIsMoving: boolean
	readonly m_fRevealRadius: number
	readonly m_bCombinerMaterialOverrideListChanged: boolean
	readonly m_nBaseModelMeshCount: number
	readonly m_nArcanaLevel: number
	readonly m_nDefaultArcanaLevel: number
	readonly m_defaultColorGemColor: Color
	readonly m_bHasBuiltWearableSpawnList: boolean
	readonly m_NetworkActivity: number
	readonly m_PrevNetworkActivity: number
	readonly m_NetworkSequenceIndex: number
	readonly m_bShouldDoFlyHeightVisual: boolean
	readonly m_flStartSequenceCycle: number
	readonly m_ActivityModifiers: CUtlSymbol[]
	readonly m_hBackgroundSceneEnt: C_BaseEntity
	readonly m_hSpeakingSceneEnt: C_BaseEntity
	readonly m_hOldWearables: C_EconWearable[]
	readonly m_CustomHealthLabel: string[]
	readonly m_CustomHealthLabelColor: Color
	readonly m_nWearableDefIndex: item_definition_index_t
	readonly m_gibTintColor: Color
	readonly m_bForceMaterialCombine: boolean
	readonly m_bShouldDrawParticlesWhileHidden: boolean
	readonly m_bIsClientThinkPending: boolean
	readonly m_bActivityModifiersDirty: boolean

	/**
	 * @param flag_num must be 0 < flag_num < 64
	 */
	IsUnitStateFlagSet(flag_num: number): boolean
	GetAbilityByName(name: string): C_DOTABaseAbility
	GetAbility(slot: number): C_DOTABaseAbility
	GetItemByName(name: string): C_DOTA_Item
	GetItemByNameInBackpack(name: string): C_DOTA_Item
	GetItemInSlot(slot: number): C_DOTA_Item
	GetBuffByName(name: string): CDOTA_Buff

	AbsorbedDamage(damage_type: DAMAGE_TYPES): number
	WillIgnore(damage_type: DAMAGE_TYPES): boolean
	CalculateDamage(damage: number, damage_type: DAMAGE_TYPES): number
	CalculateDamageByHand(from: C_DOTA_BaseNPC_Hero): number

	IsControllableByPlayer(playerID: number): boolean
	HasAttackCapability(capability: DOTAUnitAttackCapability_t): boolean
	HasMoveCapability(capability: DOTAUnitAttackCapability_t): boolean
}

interface C_DOTA_Ability_Nevermore_Shadowraze extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_nFXIndexB: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lycan_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_GenericFlexCycler extends C_FlexCycler {
	readonly type_name: string
	readonly m_nTestMode: number
	readonly m_nTestIndex: number
	readonly m_poseParameterName: string
	readonly m_bDoClientSideAnimation: boolean
	readonly m_layerSequence: string[]
	readonly m_nLayerIndex: number[]
	readonly m_nBoneOverrideIndex: number
	readonly m_flLastSimTime: number
}

interface C_DOTA_BaseNPC_Additive extends C_DOTA_BaseNPC {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_MeteorHammer extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Dagon extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_RobeOfMagi extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Special_Bonus_Unique_Grimstroke_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Elder_Titan_NaturalOrder_Spirit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Hero extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_bIsIllusion: boolean
	readonly m_iCurrentXP: number
	readonly m_iAbilityPoints: number
	readonly m_flRespawnTime: number
	readonly m_flRespawnTimePenalty: number
	readonly m_flStrength: number
	readonly m_flAgility: number
	readonly m_flIntellect: number
	readonly m_flStrengthTotal: number
	readonly m_flAgilityTotal: number
	readonly m_flIntellectTotal: number
	readonly m_iRecentDamage: number
	readonly m_fPainFactor: number
	readonly m_fTargetPainFactor: number
	readonly m_bLifeState: boolean
	readonly m_nFXStunIndex: number
	readonly m_nFXSilenceIndex: number
	readonly m_nFXDeathIndex: number
	readonly m_iPlayerID: number
	readonly m_hReplicatingOtherHeroModel: C_BaseEntity
	readonly m_bReincarnating: boolean
	readonly m_bCustomKillEffect: boolean
	readonly m_flSpawnedAt: number
	readonly m_iPrimaryAttribute: number
	readonly m_nLastDrawnHealth: number
	readonly m_flHurtAmount: number
	readonly m_flLastHurtTime: number
	readonly m_flHurtDecayRate: number
	readonly m_flLastHealTime: number
	readonly m_flLastTreeShakeTime: number
	readonly m_CenterOnHeroCooldownTimer: CountdownTimer
	readonly m_nCurrentCombinedModelIndex: number
	readonly m_nPendingCombinedModelIndex: number
	readonly m_iHeroID: number
	readonly m_flCheckLegacyItemsAt: number
	readonly m_bDisplayAdditionalHeroes: boolean
	readonly m_hEconConsumableAbility: C_BaseEntity
	readonly m_vecAttachedParticleIndeces: number[]
	readonly m_hPets: C_BaseEntity[]
	readonly m_bBuybackDisabled: boolean
	readonly m_bWasFrozen: boolean
	readonly m_bUpdateClientsideWearables: boolean
	readonly m_bForceBuildCombinedModel: boolean
	readonly m_bRecombineForMaterialsOnly: boolean
	readonly m_bBuildingCombinedModel: boolean
	readonly m_bInReloadEvent: boolean
	readonly m_bStoreOldVisibility: boolean
	readonly m_bResetVisibility: boolean
	readonly m_bStoredVisibility: boolean
}

interface C_DOTA_Ability_Undying_Tombstone extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vZombies: C_BaseEntity[]
	readonly hTombstone: C_BaseEntity
	readonly radius: number
	readonly duration: number
}

interface C_DOTA_Ability_Meepo_Geostrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Obsidian_Destroyer_SanityEclipse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Roar extends C_DOTABaseAbility {
	readonly type_name: string
	readonly base_projectiles: number
	readonly max_projectiles: number
	readonly projectile_step: number
	readonly base_speed: number
	readonly speed_step: number
	readonly initial_radius: number
	readonly end_radius: number
	readonly damage: number
	readonly base_interval: number
	readonly interval_step: number
	readonly m_nCastCount: number
	readonly m_nProjectiles: number
	readonly m_nWaveCount: number
	readonly m_ctTimer: CountdownTimer
	readonly m_flTiming: number
	readonly m_bScriptRoar: boolean
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Juggernaut extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_70 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Night_Vision_600 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointEntity extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Item_DustofAppearance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Legion_Commander extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_unDuelsWon: number
}

interface C_DOTA_Ability_TemplarAssassin_Refraction extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_ScourgeWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_WitchDoctor_DeathWard extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iDamage: number
	readonly m_iBounceRadius: number
	readonly m_iBounces: number
	readonly m_iProjectileSpeed: number
	readonly m_hWard: C_BaseEntity
	readonly m_fWardExpireTime: number
	readonly m_nFXIndex: number
	readonly m_iAttackIndex: number
	readonly m_BounceInfo: sBounceInfo[]
}

interface C_DOTA_Ability_Razor_PlasmaField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_AncientApparition_ColdFeet extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nyx_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FuncBrush extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Veil_Of_Discord extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Tiny_TossTree extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tinker_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BodyComponentBaseAnimating extends CBodyComponentSkeletonInstance {
	readonly type_name: string
	readonly m_animationController: C_BaseAnimatingController
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface C_DOTA_Ability_Oracle_FortunesEnd extends C_DOTABaseAbility {
	readonly type_name: string
	readonly damage: number
	readonly radius: number
	readonly bolt_speed: number
	readonly maximum_purge_duration: number
	readonly minimum_purge_duration: number
	readonly m_flStartTime: number
	readonly m_flDuration: number
	readonly m_bAbsorbed: boolean
	readonly m_hTarget: C_BaseEntity
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Enchantress_Impetus extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_TargetDummy extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_flDamageTaken: number
	readonly m_flLastHit: number
	readonly m_flStartDamageTime: number
	readonly m_flLastDamageTime: number
	readonly m_bIsMoving: boolean
}

interface C_DOTA_Ability_Tornado_Tempest extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_CentaurKhan_EnduranceAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Winter_Wyvern_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Silencer_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Kaya extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_ShadowAmulet extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_NPC_Observer_Ward extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_iDuration: number
	readonly m_pVisionRangeFX: CNewParticleEffect
	readonly m_nPreviewViewer: number
}

interface C_DOTA_Item_EnergyBooster extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Oracle_PurifyingFlames extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_bTargetIsAlly: boolean
}

interface C_DOTA_Unit_Hero_Visage extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_FadeBolt extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lich_FrostArmor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Sven extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Juggernaut_BladeFury extends C_DOTABaseAbility {
	readonly type_name: string
	readonly blade_fury_damage: number
}

interface C_DOTA_Ability_Juggernaut_HealingWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_Base extends C_BaseEntity {
	readonly type_name: string
	readonly m_bInitialized: boolean
	readonly m_CompendiumChallengeEventID: number[]
	readonly m_CompendiumChallengeSequenceID: number[]
	readonly m_CompendiumChallengeCoinReward: number[]
	readonly m_CompendiumChallengeCoinSplash: number[]
	readonly m_CompendiumChallengePointReward: number[]
	readonly m_CompendiumChallengeCompleted: boolean[]
	readonly m_CompendiumChallengeFailed: boolean[]
	readonly m_CompendiumChallengeProgress: number[]
	readonly m_QueryIDForProgress: number[]
	readonly m_SubChallenges: CDOTASubChallengeInfo[]
	readonly m_CompendiumCoinWager: number[]
	readonly m_CompendiumTokenWagerItemID: itemid_t[]
	readonly m_CompendiumTokenWagerAmount: number[]
	readonly m_CompendiumCoinWagerResults: number[]
	readonly m_CompendiumRankWagers: number[]
	readonly m_flWagerTimer: number
	readonly m_flWagerEndTime: number
	readonly m_CompendiumChallengeInfo: CDOTA_PlayerChallengeInfo[]
	readonly m_PlayerQueryIDs: C_DOTA_CombatLogQueryProgress[]
	readonly m_ProgressForQueryID: number[]
	readonly m_GoalForQueryID: number[]
	readonly m_PlayerQuestRankPreviouslyCompleted: number[]
	readonly m_PlayerQuestRankCompleted: number[]
	readonly m_QueryIndexForProgress: number[]
}

interface C_DOTA_Ability_Healing_Campfire extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Death_Prophet_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTABaseGameMode extends C_BaseEntity {
	readonly type_name: string
	readonly m_nCustomGameForceHeroSelectionId: number
	readonly m_bAlwaysShowPlayerInventory: boolean
	readonly m_bGoldSoundDisabled: boolean
	readonly m_bRecommendedItemsDisabled: boolean
	readonly m_bStickyItemDisabled: boolean
	readonly m_bStashPurchasingDisabled: boolean
	readonly m_bFogOfWarDisabled: boolean
	readonly m_bUseUnseenFOW: boolean
	readonly m_bUseCustomBuybackCost: boolean
	readonly m_bUseCustomBuybackCooldown: boolean
	readonly m_bBuybackEnabled: boolean
	readonly m_flCameraDistanceOverride: number
	readonly m_nCameraSmoothCountOverride: number
	readonly m_hOverrideSelectionEntity: C_BaseEntity
	readonly m_bTopBarTeamValuesOverride: boolean
	readonly m_bTopBarTeamValuesVisible: boolean
	readonly m_nTeamGoodGuysTopBarValue: number
	readonly m_nTeamBadGuysTopBarValue: number
	readonly m_bAlwaysShowPlayerNames: boolean
	readonly m_bUseCustomHeroLevels: boolean
	readonly m_nCustomXPRequiredToReachNextLevel: number[]
	readonly m_bTowerBackdoorProtectionEnabled: boolean
	readonly m_bBotThinkingEnabled: boolean
	readonly m_bAnnouncerDisabled: boolean
	readonly m_bKillingSpreeAnnouncerDisabled: boolean
	readonly m_flFixedRespawnTime: number
	readonly m_flBuybackCostScale: number
	readonly m_flRespawnTimeScale: number
	readonly m_bLoseGoldOnDeath: boolean
	readonly m_bKillableTombstones: boolean
	readonly m_nHUDVisibilityBits: number
	readonly m_flMinimumAttackSpeed: number
	readonly m_flMaximumAttackSpeed: number
	readonly m_bIsDaynightCycleDisabled: boolean
	readonly m_bAreWeatherEffectsDisabled: boolean
	readonly m_bDisableHudFlip: boolean
	readonly m_bEnableFriendlyBuildingMoveTo: boolean
	readonly m_bIsDeathOverlayDisabled: boolean
	readonly m_bIsHudCombatEventsDisabled: boolean
	readonly m_sCustomTerrainWeatherEffect: string
	readonly m_flStrengthDamage: number
	readonly m_flStrengthHP: number
	readonly m_flStrengthHPRegenPercent: number
	readonly m_flAgilityDamage: number
	readonly m_flAgilityArmor: number
	readonly m_flAgilityAttackSpeed: number
	readonly m_flAgilityMovementSpeedPercent: number
	readonly m_flIntelligenceDamage: number
	readonly m_flIntelligenceMana: number
	readonly m_flIntelligenceManaRegenPercent: number
	readonly m_flIntelligenceSpellAmpPercent: number
	readonly m_flStrengthMagicResistancePercent: number
	readonly m_flDraftingHeroPickSelectTimeOverride: number
	readonly m_flDraftingBanningTimeOverride: number
	readonly m_bPauseEnabled: boolean
	readonly m_flCustomScanCooldown: number
	readonly m_bDefaultRuneSpawnLogic: boolean
	readonly m_nHUDVisibilityBitsPrevious: number
}

interface C_PortraitCallbackHandler extends C_BaseEntity {
	readonly type_name: string
	readonly m_pOwner: CRenderablePortraitData
}

interface C_LightGlow extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nHorizontalSize: number
	readonly m_nVerticalSize: number
	readonly m_nMinDist: number
	readonly m_nMaxDist: number
	readonly m_nOuterMaxDist: number
	readonly m_flGlowProxySize: number
	readonly m_flHDRColorScale: number
	readonly m_Glow: C_LightGlowOverlay
}

interface CDOTA_Item_Recipe_DragonLance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_NightStalker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Ursa_Overpower extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_MorphReplicate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_flOldHealthPct: number
	readonly m_flOldManaPct: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Timbersaw_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Meepo_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_600 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Creep extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_flAim: number
}

interface C_DOTA_Item_SangeAndYasha extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_UltimateOrb extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Nyx_Assassin_Impale extends C_DOTABaseAbility {
	readonly type_name: string
	readonly width: number
	readonly duration: number
	readonly length: number
	readonly speed: number
}

interface C_DOTA_Unit_Hero_Furion extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Tail_Swipe extends C_DOTA_Ability_Animation_Attack {
	readonly type_name: string
}

interface C_DotaSubquestBase extends C_BaseEntity {
	readonly type_name: string
	readonly m_pszSubquestText: string[]
	readonly m_bHidden: boolean
	readonly m_bCompleted: boolean
	readonly m_bShowProgressBar: boolean
	readonly m_nProgressBarHueShift: number
	readonly m_pnTextReplaceValuesCDotaSubquestBase: number[]
	readonly m_pszTextReplaceString: string[]
	readonly m_nTextReplaceValueVersion: number
	readonly m_bWasCompleted: boolean
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_GlobalLight extends C_BaseEntity, CGlobalLightBase {
	readonly type_name: string
	readonly m_WindClothForceHandle: number
}

interface C_ClientRagdoll extends C_BaseAnimating {
	readonly type_name: string
	readonly m_bFadeOut: boolean
	readonly m_bImportant: boolean
	readonly m_flEffectTime: number
	readonly m_gibDespawnTime: number
	readonly m_iCurrentFriction: number
	readonly m_iMinFriction: number
	readonly m_iMaxFriction: number
	readonly m_flFrictionModTime: number
	readonly m_flFrictionTime: number
	readonly m_iFrictionAnimState: number
	readonly m_bReleaseRagdoll: boolean
	readonly m_iEyeAttachment: number
	readonly m_bFadingOut: boolean
	readonly m_flScaleEnd: number[]
	readonly m_flScaleTimeStart: number[]
	readonly m_flScaleTimeEnd: number[]
	readonly m_bForceShadowCastType: boolean
	readonly m_forcedShadowCastType: number
}

interface C_DOTA_Item_Recipe_Mekansm extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_Howl extends C_DOTABaseAbility {
	readonly type_name: string
	readonly howl_duration: number
}

interface C_DOTA_Ability_SpiritBreaker_GreaterBash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Mirana_MoonlightShadow extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_KoboldTaskmaster_SpeedAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Viper_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Creature extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_bIsCurrentlyChanneling: boolean
	readonly m_flChannelCycle: number
}

interface C_DOTA_Item_Recipe_Buckler extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Tango_Single extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkWillow_Terrorize extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Legion_Commander_OverwhelmingOdds extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Wex extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Kunkka_Tidebringer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_125 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EconEntity extends C_BaseFlex, IHasAttributes {
	readonly type_name: string
	readonly m_flFlexDelayTime: number
	readonly m_flFlexDelayedWeight: float32
	readonly m_AttributeManager: CAttributeContainer
	readonly m_bClientside: boolean
	readonly m_nDisableMode: number
	readonly m_bParticleSystemsCreated: boolean
	readonly m_bForceDestroyAttachedParticlesImmediately: boolean
	readonly m_hViewmodelAttachment: C_BaseEntity
	readonly m_iOldTeam: number
	readonly m_bAttachmentDirty: boolean
	readonly m_nUnloadedModelIndex: number
	readonly m_iNumOwnerValidationRetries: number
	readonly m_iOldStyle: style_index_t
	readonly m_hOldProvidee: C_BaseEntity
}

interface C_DOTA_Item_Courier extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Desolator extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Special_Bonus_Unique_Grimstroke_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_TI8 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Immunity extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Mana_Break_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Corruption_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CBodyComponentPoint extends CBodyComponent {
	readonly type_name: string
	readonly m_sceneNode: CGameSceneNode
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface C_DOTA_Item_Iron_Talon extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_MysticStaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_TrueForm_Druid extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Enchantress_Untouchable extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_FacelessVoid_Chronosphere extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lycan_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Magnus_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_16 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Ancient_Janggo extends C_DOTA_Item {
	readonly type_name: string
	readonly radius: number
}

interface CDOTA_Item_SentryWard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_TranquilBoots extends C_DOTA_Item {
	readonly type_name: string
	readonly break_count: number
	readonly m_DamageList: float32[]
}

interface CDOTA_Ability_Nyx_Assassin_Unburrow extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Treant_EyesInTheForest extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_SavageRoar extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Chen_TestOfFaith extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Earthshaker_EchoSlam extends C_DOTABaseAbility {
	readonly type_name: string
	readonly echo_slam_damage_range: number
	readonly echo_slam_echo_search_range: number
	readonly echo_slam_echo_range: number
	readonly echo_slam_echo_damage: number
	readonly echo_slam_initial_damage: number
}

interface CDOTA_Ability_BigThunderLizard_Wardrums extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earthshaker extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Furion_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ogre_Magi_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Building extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_nAmbientFXIndex: number
	readonly m_nTPFXIndex: number
	readonly m_nStatusFXIndex: number
	readonly m_angInitialAngles: QAngle
	readonly m_fHeroStatueCycle: number
	readonly m_iHeroStatueStatusEffectIndex: number
	readonly m_bHeroStatue: boolean
	readonly m_bBattleCup: boolean
	readonly m_HeroStatueInscription: string[]
	readonly m_iHeroStatueOwnerPlayerID: number
	readonly m_ParticleTintColor: Color
}

interface C_DOTA_Item_Recipe_OrchidMalevolence extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Slark_DarkPact extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Visage_Stone_Form_Self_Cast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Jakiro_IcePath extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Huskar extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Venomancer_PlagueWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_Waveform extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
}

interface C_DOTA_Ability_Earthshaker_EnchantTotem extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Battlefury extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_KeeperOfTheLight extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_Invoker_InvokedBase extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nQuasLevel: number
	readonly m_nWexLevel: number
	readonly m_nExortLevel: number
}

interface C_DOTA_Ability_Venomancer_VenomousGale extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Outworld_Devourer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_GladiatorsUnite extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Winter_Wyvern_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Techies_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Team extends C_BaseEntity {
	readonly type_name: string
	readonly m_aPlayers: C_BasePlayer[]
	readonly m_iScore: number
	readonly m_iRoundsWon: number
	readonly m_szTeamname: string[]
	readonly m_iDeaths: number
	readonly m_iPing: number
	readonly m_iPacketloss: number
}

interface C_DOTA_BaseNPC_Warlock_Golem extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_Burst extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_MudGolem_HurlBoulder extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sven_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Alchemist_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseToggle extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Item_MonkeyKingBar extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_Spring extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vPos: Vector
	readonly m_fStartChannelTime: number
	readonly m_hThinker: C_BaseEntity
	readonly m_nFxIndex: number
	readonly m_nRefCount: number
}

interface C_DOTA_Ability_EarthSpirit_Magnetize extends C_DOTABaseAbility {
	readonly type_name: string
	readonly cast_radius: number
	readonly rock_explosion_radius: number
	readonly damage_duration: number
}

interface C_DOTA_Unit_Hero_Shredder extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Venomancer_PoisonNova extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Venomancer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Terrorblade_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Broodmother_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Arcane_Ring extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Slark extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_Recall extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Zuus_ThundergodsWrath extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Evasion_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_InfoPlayerStartDota extends C_PointEntity {
	readonly type_name: string
	readonly m_bDisabled: boolean
}

interface CDOTA_Item_GlimmerCape extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_EmptyBottle extends C_DOTA_Item {
	readonly type_name: string
	readonly m_iStoredRuneType: number
	readonly m_fStoredRuneTime: number
}

interface C_DOTA_Unit_Hero_MonkeyKing extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly mb_MonkeyHasArcana: boolean
	readonly m_nTreeDisguise: number
	readonly m_nPerchedTree: number
	readonly m_hTreeDisguiseEnt: C_BaseEntity
}

interface CDOTA_Ability_AbyssalUnderlord_Cancel_DarkRift extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Rubick extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_Life_Stealer_Empty3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lion_Impale extends C_DOTABaseAbility {
	readonly type_name: string
	readonly width: number
	readonly duration: number
	readonly speed: number
	readonly length_buffer: number
	readonly range: number
}

interface C_DOTA_Ability_Tidehunter_Ravage extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hEntsHit: C_BaseEntity[]
	readonly m_bAwardedKillEater: boolean
	readonly duration: number
}

interface C_DOTA_Ability_ForestTrollHighPriest_Heal extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Neutral_SpellImmunity extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Huskar_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phoenix_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Weaver_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spirit_Breaker_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Meepo_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Batrider_Firefly extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Rattletrap_PowerCogs extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_TemplarAssassin_Trap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Riki_Permanent_Invisibility extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_GraniteGolem_Bash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slark extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_DivineRapier extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ArcWarden_MagneticField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_NPC_Treant_EyesInTheForest extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_DragonKnight extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_CrystalMaiden_CrystalNova extends C_DOTABaseAbility {
	readonly type_name: string
	readonly nova_damage: number
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_RefresherOrb extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_ArcWarden extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nTalkFXIndex: number
	readonly m_nFXDeath: number
	readonly m_nTempestFX: number
}

interface C_DOTA_Ability_Rattletrap_BatteryAssault extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Dazzle_Poison_Touch extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Firework_Mine extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_BlueDragonspawnSorcerer_Evasion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Puck_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_800 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_RuneSpawner extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nRuneType: number
	readonly m_flLastSpawnTime: number
}

interface C_BaseButton extends C_BaseToggle {
	readonly type_name: string
	readonly m_glowEntity: C_BaseEntity
	readonly m_usable: boolean
	readonly m_szDisplayText: string
}

interface C_DOTA_Item_Recipe_Blade_Mail extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_MantaStyle extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Lion_ManaDrain extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_Victims: C_BaseEntity[]
}

interface C_DOTA_Ability_Tiny_Grow extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Zuus_LightningBolt extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Undying_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Courier_AutoDeliver extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CInfoParticleTarget extends C_PointEntity {
	readonly type_name: string
}

interface C_DOTA_Item_RiverPainter extends C_DOTA_Item {
	readonly type_name: string
	readonly m_iRiverPaintColor: number
}

interface C_DOTA_Ability_Pangolier_Swashbuckle extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_bIsBasePointSet: boolean
	readonly m_bIsMidQuickcast: boolean
	readonly m_vBasePoint: Vector
	readonly m_nFXTarget: number
	readonly dash_speed: number
	readonly start_radius: number
	readonly end_radius: number
	readonly range: number
	readonly damage: number
}

interface C_DOTA_Ability_Skywrath_Mage_Mystic_Flare extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lina_LagunaBlade extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_White_Purification extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sven extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Zeus_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointClientUIWorldPanel extends C_BaseClientUIEntity {
	readonly type_name: string
	readonly m_bForceRecreateNextUpdate: boolean
	readonly m_bMoveViewToPlayerNextThink: boolean
	readonly m_bCheckCSSClasses: boolean
	readonly m_matAnchorDelta: matrix3x4_t
	readonly m_pOffScreenIndicator: CPointOffScreenIndicatorUi
	readonly m_bIgnoreInput: boolean
	readonly m_bFollowPlayerAcrossTeleport: boolean
	readonly m_flWidth: number
	readonly m_flHeight: number
	readonly m_flDPI: number
	readonly m_flInteractDistance: number
	readonly m_flDepthOffset: number
	readonly m_unOwnerContext: number
	readonly m_unHorizontalAlign: number
	readonly m_unVerticalAlign: number
	readonly m_unOrientation: number
	readonly m_bAllowInteractionFromAllSceneWorlds: boolean
	readonly m_vecCSSClasses: string[]
	readonly m_bOpaque: boolean
	readonly m_bNoDepth: boolean
	readonly m_bRenderBackface: boolean
	readonly m_bUseOffScreenIndicator: boolean
	readonly m_bExcludeFromSaveGames: boolean
	readonly m_bGrabbable: boolean
}

interface C_DOTA_Item_Recipe_Spirit_Vessel extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Vanguard extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Centaur_Return extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Life_Stealer_Assimilate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hLastAssimilation: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clinkz_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Shop extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
	readonly m_ShopType: number
	readonly m_nShopFX: number
	readonly m_vShopFXOrigin: Vector
	readonly m_flLastSpeech: number
}

interface C_Breakable extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Ability_Necronomicon_Archer_AoE extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_LesserCritical extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Bristleback_Warpath extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_EnragedWildkin_ToughnessAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Drow_Ranger_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseTeamObjectiveResource extends C_BaseEntity {
	readonly type_name: string
	readonly m_iTimerToShowInHUD: number
	readonly m_iStopWatchTimer: number
	readonly m_iNumControlPoints: number
	readonly m_iPrevNumControlPoints: number
	readonly m_bPlayingMiniRounds: boolean
	readonly m_bControlPointsReset: boolean
	readonly m_bOldControlPointsReset: boolean
	readonly m_iUpdateCapHudParity: number
	readonly m_iOldUpdateCapHudParity: number
	readonly m_vCPPositions: Vector[]
	readonly m_bCPIsVisible: boolean[]
	readonly m_flLazyCapPerc: number[]
	readonly m_flOldLazyCapPerc: number[]
	readonly m_iTeamIcons: number[]
	readonly m_iTeamOverlays: number[]
	readonly m_iTeamReqCappers: number[]
	readonly m_flTeamCapTime: number[]
	readonly m_iPreviousPoints: number[]
	readonly m_bTeamCanCap: boolean[]
	readonly m_iTeamBaseIcons: number[]
	readonly m_iBaseControlPoints: number[]
	readonly m_bInMiniRound: boolean[]
	readonly m_iWarnOnCap: number[]
	readonly m_iszWarnSound: string[]
	readonly m_flPathDistance: number[]
	readonly m_iNumTeamMembers: number[]
	readonly m_iCappingTeam: number[]
	readonly m_iTeamInZone: number[]
	readonly m_bBlocked: boolean[]
	readonly m_iOwner: number[]
	readonly m_pszCapLayoutInHUD: string[]
	readonly m_flCapTimeLeft: number[]
	readonly m_flCapLastThinkTime: number[]
	readonly m_bWarnedOnFinalCap: boolean[]
	readonly m_flLastCapWarningTime: number[]
}

interface C_DOTATeam extends C_Team {
	readonly type_name: string
	readonly m_iHeroKills: number
	readonly m_iTowerKills: number
	readonly m_iBarracksKills: number
	readonly m_unTournamentTeamID: number
	readonly m_ulTeamLogo: number
	readonly m_ulTeamBaseLogo: number
	readonly m_ulTeamBannerLogo: number
	readonly m_bTeamComplete: boolean
	readonly m_bTeamIsHomeTeam: boolean
	readonly m_CustomHealthbarColor: Color
	readonly m_szTag: string[]
}

interface C_ButtonTimed extends C_BaseButton {
	readonly type_name: string
	readonly m_sUseString: string
	readonly m_sUseSubString: string
}

interface C_DOTA_Unit_Hero_Viper extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Guardian_Greaves extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Ward_Dispenser extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_ChaosMeteor extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
	readonly area_of_effect: number
	readonly damage_interval: number
	readonly vision_distance: number
	readonly end_vision_duration: number
	readonly main_damage: number
	readonly burn_duration: number
	readonly burn_dps: number
}

interface C_DOTA_Ability_PhantomLancer_Juxtapose extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_DotaPlus extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTASpectatorGraphManagerProxy extends C_BaseEntity {
	readonly type_name: string
	readonly m_pGraphManager: C_DOTASpectatorGraphManager
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lina_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Nyx_Assassin extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Brewmaster_PrimalEarth extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_nFXEarthAmbient1: number
	readonly m_nFXEarthAmbient2: number
}

interface C_DOTA_Ability_Luna_LucentBeam extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Sniper_Shrapnel extends C_DOTABaseAbility {
	readonly type_name: string
	readonly stringge_restore_time: number
	readonly max_stringges: number
}

interface C_DOTA_Item_Lua extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Terrorblade extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Assassin extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Moonshard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Soul_Booster extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_SheepStick extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Spirits extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_SpiritDefs: sSpiritDef[]
	readonly m_nWispDirection: number
}

interface C_DOTA_Ability_Invoker_Tornado extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
	readonly vision_distance: number
	readonly end_vision_duration: number
	readonly lift_duration: number
	readonly base_damage: number
	readonly quas_damage: number
	readonly wex_damage: number
}

interface C_DOTA_Ability_NightStalker_Void extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AlphaWolf_CriticalStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DisplacementVisibility extends C_BaseEntity {
	readonly type_name: string
	readonly m_HiddenDisplacement: number
}

interface C_DOTA_Unit_Hero_Meepo extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_bIsClone: boolean
	readonly m_nWhichMeepo: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Luna_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_LightOrthoEntity extends C_LightEntity {
	readonly type_name: string
}

interface C_DOTA_Item_StaffOfWizardry extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_RingOfProtection extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Techies_LandMines extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_IlluminateEnd extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Undying_Decay extends C_DOTABaseAbility {
	readonly type_name: string
	readonly decay_damage: number
	readonly radius: number
	readonly decay_duration: number
	readonly str_steal: number
	readonly str_steal_scepter: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Night_Stalker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Trap_Ward extends C_DOTA_BaseNPC_Creature {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Barracks extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface C_ModelPointEntity extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_BeamSpotLight extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_bSpotlightOn: boolean
	readonly m_bHasDynamicLight: boolean
	readonly m_bNoFog: boolean
	readonly m_flSpotlightMaxLength: number
	readonly m_flSpotlightGoalWidth: number
	readonly m_flHDRColorScale: number
	readonly m_flRotationSpeed: number
	readonly m_nRotationAxis: number
	readonly m_vSpotlightTargetPos: Vector
	readonly m_vSpotlightCurrentPos: Vector
	readonly m_vSpotlightAngles: QAngle
	readonly m_flSpotlightCurLength: number
	readonly m_flLightScale: number
	readonly m_lastTime: number
}

interface C_TonemapController2 extends C_BaseEntity {
	readonly type_name: string
	readonly m_flAutoExposureMin: number
	readonly m_flAutoExposureMax: number
	readonly m_flTonemapPercentTarget: number
	readonly m_flTonemapPercentBrightPixels: number
	readonly m_flTonemapMinAvgLum: number
	readonly m_flRate: number
	readonly m_flAccelerateExposureDown: number
	readonly m_flBloomStrength: number
	readonly m_flBloomStartValue: number
}

interface CDOTA_Item_Recipe_ForceStaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Spirits_Out extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Viper_ViperStrike extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Unit_Hero_Earthshaker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Nevermore extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Razor_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Abaddon extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_Chakram extends C_DOTABaseAbility {
	readonly type_name: string
	readonly radius: number
	readonly speed: number
	readonly pass_slow_duration: number
	readonly pass_damage: number
	readonly m_vEndLocation: Vector
	readonly m_fZCoord: number
	readonly m_bIsReturning: boolean
	readonly m_nFXIndex: number
	readonly m_nFXIndexB: number
	readonly m_nFXIndexC: number
	readonly m_nProjectileIndex: number
	readonly m_hThinker: C_BaseEntity
	readonly m_hReturnHits: C_BaseEntity[]
}

interface C_DOTA_Ability_Invoker_SunStrike extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Ability_DoomBringer_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Pudge extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Spirit_Vessel extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_HelmOfTheDominator extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_Transform extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_SpiritFormIlluminate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hThinker: C_BaseEntity
	readonly max_channel_time: number
	readonly damage_per_second: number
	readonly m_fPower: number
	readonly m_fStartTime: number
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Treant_Overgrowth extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Necrophos_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dazzle_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CScriptComponent extends CEntityComponent {
	readonly type_name: string
	readonly m_scriptClassName: string
}

interface C_DOTA_Item_Recipe_Mjollnir extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Radiance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_WhirlingDeath extends C_DOTABaseAbility {
	readonly type_name: string
	readonly whirling_radius: number
	readonly whirling_damage: number
	readonly whirling_tick: number
	readonly duration: number
}

interface C_DOTA_Ability_Medusa_ManaShield extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lion_FingerOfDeath extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Greevil_Miniboss_Green_Overgrowth extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Riki_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Razor_EyeOfTheStorm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvLightProbeVolume extends C_BaseEntity {
	readonly type_name: string
	readonly m_vBoxMins: Vector
	readonly m_vBoxMaxs: Vector
	readonly m_LightGroups: string
	readonly m_bStatic: boolean
	readonly m_nHandshake: number
	readonly m_nIndoorOutdoorLevel: number
	readonly m_bStartDisabled: boolean
	readonly m_bEnabled: boolean
}

interface C_DOTA_Item_Blade_Mail extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_AbyssalBlade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_FurArmy extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hThinker: C_BaseEntity
	readonly m_nFXIndex: number
	readonly num_first_soldiers: number
	readonly num_second_soldiers: number
	readonly m_bCreateMonkeys: boolean
	readonly m_flNextCreationTime: number
	readonly m_vecSoldiers: C_BaseEntity[]
}

interface C_DOTA_Ability_Medusa_MysticSnake extends C_DOTABaseAbility {
	readonly type_name: string
	readonly radius: number
	readonly snake_jumps: number
	readonly snake_damage: number
	readonly snake_mana_steal: number
	readonly snake_scale: number
	readonly initial_speed: number
	readonly return_speed: number
	readonly jump_delay: number
	readonly m_iCurJumpCount: number
	readonly m_iTotalMana: number
	readonly m_flDamage: number
	readonly m_flMana: number
	readonly m_hHitEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_Nyx_Assassin_SpikedCarapace extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Alchemist extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Sven_GreatCleave extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dragon_Knight_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slardar extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_PrimalSplit extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hPrimary: C_BaseEntity
	readonly m_hSecondary: C_BaseEntity
	readonly m_hTertiary: C_BaseEntity
}

interface C_DOTA_Ability_Necronomicon_Warrior_Sight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necronomicon_Warrior_ManaBurn extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Tusk extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_Alchemist_AcidSpray extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_FacelessVoid extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_AdaptiveStrike_Agi extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Tusk_Sigil extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_angInitialAngles: QAngle
}

interface C_IngameEvent_WM2017 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_350 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DataNonSpectator extends C_BaseEntity {
	readonly type_name: string
	readonly m_vecDataTeam: DataTeamPlayer_t[]
	readonly m_bWorldTreeState: number[]
	readonly m_vDesiredWardPlacement: Vector2D[]
	readonly m_nEnemyStartingPosition: number[]
	readonly m_nTotalEventPoints: number
	readonly m_nCaptainInspectedHeroID: number
	readonly m_flSuggestedWardWeights: number[]
	readonly m_nSuggestedWardIndexes: number[]
	readonly m_iSuggestedLanes: number[]
	readonly m_iSuggestedLaneWeights: number[]
	readonly m_bSuggestedLaneRoam: boolean[]
	readonly m_bSuggestedLaneJungle: boolean[]
}

interface C_TeamRoundTimer extends C_BaseEntity {
	readonly type_name: string
	readonly m_bTimerPaused: boolean
	readonly m_flTimeRemaining: number
	readonly m_flTimerEndTime: number
	readonly m_bIsDisabled: boolean
	readonly m_bShowInHUD: boolean
	readonly m_nTimerLength: number
	readonly m_nTimerInitialLength: number
	readonly m_nTimerMaxLength: number
	readonly m_bAutoCountdown: boolean
	readonly m_nSetupTimeLength: number
	readonly m_nState: number
	readonly m_bStartPaused: boolean
	readonly m_bInCaptureWatchState: boolean
	readonly m_flTotalTime: number
	readonly m_bStopWatchTimer: boolean
	readonly m_bFireFinished: boolean
	readonly m_bFire5MinRemain: boolean
	readonly m_bFire4MinRemain: boolean
	readonly m_bFire3MinRemain: boolean
	readonly m_bFire2MinRemain: boolean
	readonly m_bFire1MinRemain: boolean
	readonly m_bFire30SecRemain: boolean
	readonly m_bFire10SecRemain: boolean
	readonly m_bFire5SecRemain: boolean
	readonly m_bFire4SecRemain: boolean
	readonly m_bFire3SecRemain: boolean
	readonly m_bFire2SecRemain: boolean
	readonly m_bFire1SecRemain: boolean
	readonly m_nOldTimerLength: number
	readonly m_nOldTimerState: number
}

interface C_DOTA_Item_Cyclone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Naga_Siren_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_90 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Diffusal_Blade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_VoidStone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkWillow_LeyConduit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SkeletonKing_HellfireBlast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Oracle extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spectre_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_225 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FoWBlockerEntity extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Vanguard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_AntiMage_Blink extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clockwerk_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bane_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Medusa_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_300 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_FillerAbility extends C_DOTABaseAbility {
	readonly type_name: string
}

interface DataTeamPlayer_t {
	readonly type_name: string
	readonly m_iReliableGold: number
	readonly m_iUnreliableGold: number
	readonly m_iStartingPosition: number
	readonly m_iTotalEarnedGold: number
	readonly m_iTotalEarnedXP: number
	readonly m_iSharedGold: number
	readonly m_iHeroKillGold: number
	readonly m_iCreepKillGold: number
	readonly m_iIncomeGold: number
	readonly m_iNetWorth: number
	readonly m_iDenyCount: number
	readonly m_iLastHitCount: number
	readonly m_iLastHitStreak: number
	readonly m_iLastHitMultikill: number
	readonly m_iNearbyCreepDeathCount: number
	readonly m_iClaimedDenyCount: number
	readonly m_iClaimedMissCount: number
	readonly m_iMissCount: number
	readonly m_nPossibleHeroSelection: number
	readonly m_iMetaLevel: number
	readonly m_iMetaExperience: number
	readonly m_iMetaExperienceAwarded: number
	readonly m_flBuybackCooldownTime: number
	readonly m_flBuybackGoldLimitTime: number
	readonly m_flBuybackCostTime: number
	readonly m_flCustomBuybackCooldown: number
	readonly m_fStuns: number
	readonly m_fHealing: number
	readonly m_iTowerKills: number
	readonly m_iRoshanKills: number
	readonly m_hCameraTarget: C_BaseEntity
	readonly m_hOverrideSelectionEntity: C_BaseEntity
	readonly m_iObserverWardsPlaced: number
	readonly m_iSentryWardsPlaced: number
	readonly m_iCreepsStacked: number
	readonly m_iCampsStacked: number
	readonly m_iRunePickups: number
	readonly m_iGoldSpentOnSupport: number
	readonly m_iHeroDamage: number
	readonly m_iWardsPurchased: number
	readonly m_iWardsDestroyed: number
	readonly m_PreGameInventory: C_DOTA_UnitInventory
	readonly m_nKillsPerOpposingTeamMember: number[]
	readonly m_iSuggestedAbilities: number[]
	readonly m_fSuggestedAbilityWeights: number[]
	readonly m_iSuggestedPregameItems: number[]
	readonly m_iSuggestedItemSequences: number[]
	readonly m_iSuggestedWeightedItems: WeightedSuggestion_t[]
	readonly m_iSuggestedHeroes: number[]
	readonly m_flSuggestedHeroesWeights: number[]
	readonly m_iCommandsIssued: number
	readonly m_iGoldSpentOnConsumables: number
	readonly m_iGoldSpentOnItems: number
	readonly m_iGoldSpentOnBuybacks: number
	readonly m_iGoldLostToDeath: number
}

interface C_EnvProjectedTexture extends C_ModelPointEntity, CProjectedTextureBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Visage_SummonFamiliars extends C_DOTABaseAbility {
	readonly type_name: string
	readonly szUnitName: string[]
	readonly m_hExistingUnits: C_BaseEntity[]
}

interface C_DOTA_PhantomAssassin_Gravestone extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_nVictimPlayerID: number
}

interface C_DOTA_Unit_Hero_CrystalMaiden extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_iParticleMouthIndex: number
	readonly m_iParticleHandRIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Underlord_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ember_Spirit_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CPointOffScreenIndicatorUi extends C_PointClientUIWorldPanel {
	readonly type_name: string
	readonly m_bBeenEnabled: boolean
	readonly m_bHide: boolean
	readonly m_flSeenTargetTime: number
	readonly m_pTargetPanel: C_PointClientUIWorldPanel
}

interface CBodyComponentBaseModelEntity extends CBodyComponentSkeletonInstance {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface C_DOTA_Ability_TrollWarlord_Whirling_Axes_Melee extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hAxes: C_BaseEntity[]
	readonly m_nAxeIdx: number
}

interface C_DOTA_Ability_DrowRanger_FrostArrows extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_Omnislash extends C_DOTABaseAbility {
	readonly type_name: string
	readonly image_travel_speed: number
	readonly image_radius: number
	readonly jugg_travel_speed: number
	readonly juggcounter: number
	readonly range: number
	readonly m_bFirstProjectileFinished: boolean
	readonly m_vCastDir: Vector
	readonly m_vPos: Vector
	readonly m_vJuggStartLocation: Vector
	readonly m_flRange: number
	readonly m_hEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_Special_Bonus_Unique_Storm_Spirit_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Legion_Commander extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_275 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_RotatableBuilding extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_nAmbientFXIndex: number
	readonly m_nTPFXIndex: number
	readonly m_nStatusFXIndex: number
	readonly m_angInitialAngles: QAngle
	readonly m_fHeroStatueCycle: number
	readonly m_iHeroStatueStatusEffectIndex: number
	readonly m_bHeroStatue: boolean
	readonly m_bBattleCup: boolean
	readonly m_HeroStatueInscription: string[]
	readonly m_iHeroStatueOwnerPlayerID: number
	readonly m_ParticleTintColor: Color
}

interface C_BaseAttributableItem extends C_EconEntity {
	readonly type_name: string
}

interface C_SkyCamera extends C_BaseEntity {
	readonly type_name: string
	readonly m_skyboxData: sky3dparams_t
	readonly m_bUseAngles: boolean
	readonly m_pNext: C_SkyCamera
}

interface C_EnvClock extends C_BaseEntity {
	readonly type_name: string
	readonly m_hHourHand: C_BaseEntity
	readonly m_hMinuteHand: C_BaseEntity
	readonly m_hSecondHand: C_BaseEntity
	readonly m_flStartGameTime: number
	readonly m_flStartClockSeconds: number
}

interface C_DOTA_Item_Recipe_Satanic extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_ChaosKnight extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkSeer_WallOfReplica extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_GnollAssassin_EnvenomedWeapon extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sniper_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Fountain extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface C_EntityDissolve extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_flStartTime: number
	readonly m_flFadeInStart: number
	readonly m_flFadeInLength: number
	readonly m_flFadeOutModelStart: number
	readonly m_flFadeOutModelLength: number
	readonly m_flFadeOutStart: number
	readonly m_flFadeOutLength: number
	readonly m_flNextSparkTime: number
	readonly m_nDissolveType: number
	readonly m_vDissolverOrigin: Vector
	readonly m_nMagnitude: number
	readonly m_bCoreExplode: boolean
	readonly m_bLinkedToServerEnt: boolean
}

interface C_World extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Ability_Legion_Commander_Duel extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Omniknight extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_StormSpirit_Overload extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_FM2016 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_BigThunderLizard_Slam extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Centaur_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_300 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_PlayerResource extends C_BaseEntity {
	readonly type_name: string
	readonly m_bWasDataUpdateCreated: boolean
	readonly m_vecPlayerTeamData: PlayerResourcePlayerTeamData_t[]
	readonly m_vecPlayerData: PlayerResourcePlayerData_t[]
	readonly m_vecBrodcasterData: PlayerResourceBroadcasterData_t[]
	readonly m_vecEventsForDisplay: number[]
	readonly m_nPrimaryEventIndex: number
	readonly m_iEstimatedMatchDurationRadiant: number[]
	readonly m_iEstimatedMatchDurationDire: number[]
	readonly m_nObsoleteEventIDAssociatedWithEventData: number
	readonly m_playerIDToPlayer: C_BaseEntity[]
	readonly m_iszName: string[]
	readonly m_iszHTMLSafeName: string[]
	readonly m_iszFilteredHTMLSafeName: string[]
	readonly m_bDirtySuggestedItems: boolean
	readonly m_bDirtyEstimatedMatchDuration: boolean
	readonly m_bDirtySelection: boolean
	readonly m_bHasWorldTreesChanged: boolean
	readonly m_bSwapWillingness: boolean[]
	readonly m_hTeamCouriers: C_DOTA_Unit_Courier[]
	readonly m_hPlayerCouriers: C_DOTA_Unit_Courier[]
	readonly m_vecOnstageHomeTeams: number[]
	readonly m_pPlayerIDToOnstageSlot: PlayerSeatAssignment_t[]
	readonly m_vecOnstagePlayerSeats: PlayerSeatAssignment_t[]
	readonly m_nEventNPCReplaced: number
	readonly m_nEventPlayerInfo: number
	readonly m_bWorldTreeStateCached: number[]
}

interface C_DOTA_Item_Physical extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hItem: C_BaseEntity
	readonly m_hOldItem: C_BaseEntity
	readonly m_bShowingTooltip: boolean
}

interface CDOTA_Ability_Grimstroke_DarkArtistry extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vCastDir: Vector
	readonly m_fStartTime: number
	readonly m_fTotalTime: number
	readonly m_nProjectileID: number
	readonly m_vProjectileDir: Vector
	readonly m_nFXIndex: number
	readonly m_nFXIndexB: number
	readonly m_nTargetsHit: number
	readonly m_nHeroesHit: number
	readonly m_nVisibleHeroesHit: number
	readonly m_fDmgMultiplierTalent: number
	readonly slow_duration: number
	readonly start_radius: number
	readonly end_radius: number
	readonly damage: number
	readonly bonus_damage_per_target: number
	readonly vision_duration: number
}

interface CDOTA_Ability_Winter_Wyvern_Splinter_Blast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Techies_StasisTrap extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_hTrap: C_BaseEntity
}

interface C_DOTA_Ability_Huskar_Life_Break extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_vProjectileLocation: Vector
	readonly m_hTarget: C_BaseEntity
	readonly m_bInterrupted: boolean
}

interface C_DOTA_Ability_DragonKnight_DragonBlood extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_ReturnStashItems extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necrolyte_Death_Pulse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_RuneSpawner_Bounty extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nRuneType: number
	readonly m_flLastSpawnTime: number
}

interface C_BaseTrigger extends C_BaseToggle {
	readonly type_name: string
	readonly m_bClientSidePredicted: boolean
}

interface C_DOTA_Item_Necronomicon extends C_DOTA_Item {
	readonly type_name: string
	readonly m_hWarrior: C_BaseEntity
	readonly m_hArcher: C_BaseEntity
}

interface C_DOTA_Item_QuellingBlade extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Grimstroke_SpiritWalk extends C_DOTABaseAbility {
	readonly type_name: string
	readonly buff_duration: number
}

interface C_DOTA_Ability_Gyrocopter_Flak_Cannon extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Morphling_Hybrid extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Earthshaker_Aftershock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AntiMage_ManaVoid extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Omniknight_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earthshaker_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_9 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_ShadowShaman extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CServerOnlyModelEntity extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_SummonWolves_CriticalStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Gyrocopter_Call_Down extends C_DOTABaseAbility {
	readonly type_name: string
	readonly range_scepter: number
}

interface C_DOTA_Ability_DeathProphet_Silence extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Roshan_Devotion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_TransferItems_ToOtherPlayer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bloodseeker_Thirst extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_SandKing extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_175 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_VR_TrackedController extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nControllerIndex: number
	readonly m_bAimingTeleport: boolean
	readonly m_nTeleportBeamFXIndex: number
	readonly m_bSwitchedScale: boolean
	readonly m_nInteractBeamFXIndex: number
	readonly m_bVirtualMouseDown: boolean
	readonly m_bDraggingTerrain: boolean
	readonly m_vDragControllerStart: Vector
	readonly m_vDragAnchorStart: Vector
	readonly m_bMenuButtonPressed: boolean
	readonly m_bScaleButtonPressed: boolean
	readonly m_nFXMenuButtonIndex: number
	readonly m_nFXTeamBannerIndex: number
	readonly m_nFXteleporterButtonIndex: number
}

interface C_DOTA_BaseNPC_Tower extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
	readonly m_iRangeFX: number
	readonly m_hTowerAttackTarget: C_BaseEntity
}

interface C_FuncRotating extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_BaseFire extends C_BaseEntity {
	readonly type_name: string
	readonly m_flScale: number
	readonly m_flStartScale: number
	readonly m_flScaleTime: number
	readonly m_nFlags: number
}

interface C_DOTA_Item_Recipe_RingOfAquila extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spirit_Breaker_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Shivas_Guard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_WraithBand extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Ogre_Magi_Ignite extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_nMostRecentMulticastCount: number
}

interface C_DOTA_Ability_Furion_Teleportation extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndexStart: number
	readonly m_nFXIndexEnd: number
	readonly m_nFXIndexEndTeam: number
}

interface C_DOTA_Ability_Nianstringge extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Juggernaut extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_unOmniKills: number
}

interface C_DOTA_Ability_Bane_NightmareEnd extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Sight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tidehunter_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Lancer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_45 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_WaterBullet extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_Item_Yasha extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_GreaterCritical extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Techies_Suicide extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_unSuicideKills: number
}

interface C_DOTA_Ability_Silencer_GlaivesOfWisdom extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Rattletrap_Hookshot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_vProjectileVelocity: Vector
	readonly m_bRetract: boolean
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_NeutralSpawner extends C_PointEntity {
	readonly type_name: string
	readonly m_Type: number
}

interface C_DOTA_Item_MeteorHammer extends C_DOTA_Item {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_nFXIndexB: number
}

interface CDOTA_Ability_Necronomicon_Archer_Purge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Alchemist_UnstableConcoction extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Blue_ColdFeet extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AncientGolem_Rockslide extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bane_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_BackdoorProtectionInBase extends C_DOTABaseAbility {
	readonly type_name: string
}

interface PlayerResourcePlayerTeamData_t {
	readonly type_name: string
	readonly m_nSelectedHeroID: number
	readonly m_iKills: number
	readonly m_iAssists: number
	readonly m_iDeaths: number
	readonly m_iStreak: number
	readonly m_iLevel: number
	readonly m_iRespawnSeconds: number
	readonly m_iLastBuybackTime: number
	readonly m_hSelectedHero: C_BaseEntity
	readonly m_bAFK: boolean
	readonly m_nSuggestedHeroes: number[]
	readonly m_bBanSuggestedHeroes: boolean[]
	readonly m_bVoiceChatBanned: boolean
	readonly m_iTimedRewardDrops: number
	readonly m_iTimedRewardDropOrigins: number
	readonly m_iTimedRewardCrates: number
	readonly m_iTimedRewardEvents: number
	readonly m_unCompendiumLevel: number
	readonly m_bCanRepick: boolean
	readonly m_bCanEarnRewards: boolean
	readonly m_bHasRandomed: boolean
	readonly m_nRandomedHeroID: number
	readonly m_bBattleBonusActive: boolean
	readonly m_iBattleBonusRate: number
	readonly m_iCustomBuybackCost: number
	readonly m_CustomPlayerColor: Color
	readonly m_bQualifiesForPAContractReward: boolean
	readonly m_bHasPredictedVictory: boolean
	readonly m_UnitShareMasks: number
	readonly m_iTeamSlot: number
	readonly m_iBattleCupWinStreak: number
	readonly m_iBattleCupWinDate: number
	readonly m_iBattleCupSkillLevel: number
	readonly m_iBattleCupTeamID: number
	readonly m_iBattleCupTournamentID: number
	readonly m_iBattleCupDivision: number
	readonly m_flTeamFightParticipation: number
	readonly m_iFirstBloodClaimed: number
	readonly m_iFirstBloodGiven: number
	readonly m_unPickOrder: number
	readonly m_iAvailableSalutes: number
	readonly m_flTimeOfLastSaluteSent: number
	readonly m_vecPlayerEventData: PlayerResourcePlayerEventData_t[]
	readonly m_unSelectedHeroBadgeXP: number
	readonly m_iObsoleteEventPoints: number
	readonly m_iObsoleteEventPremiumPoints: number
	readonly m_iObsoleteEventWagerTokensRemaining: number
	readonly m_iObsoleteEventWagerTokensMax: number
	readonly m_iObsoleteEventEffectsMask: number
	readonly m_iObsoleteEventRanks: number
	readonly m_bObsoleteIsEventOwned: boolean
	readonly m_iObsoleteRankWagersAvailable: number
	readonly m_iObsoleteRankWagersMax: number
}

interface CDOTA_Item_ObserverWard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_NPC_Techies_Minefield_Sign extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface CDOTA_Ability_Techies_RemoteMines_SelfDetonate extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ogre_Magi_Multicast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_ChaosKnight_Reality_Rift extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_flPercentage: number
	readonly m_FXIndex: number[]
}

interface C_DOTA_Unit_LoopingSound extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_nPrevLoopingSoundParity: number
	readonly m_pszNetworkedSoundLoop: string[]
	readonly m_nLoopingSoundParity: number
}

interface C_DOTA_Ability_TemplarAssassin_PsiBlades extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Puck extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Brewmaster_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Flying_Courier extends C_DOTA_Item {
	readonly type_name: string
	readonly m_fNextThinkTime: number
}

interface C_DOTA_Item_BlinkDagger extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_BountyHunter extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Windrunner_Windrun extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lycan_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_125 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_SceneEntity extends C_PointEntity {
	readonly type_name: string
	readonly m_bIsPlayingBack: boolean
	readonly m_bPaused: boolean
	readonly m_bMultiplayer: boolean
	readonly m_bAutogenerated: boolean
	readonly m_flForceClientTime: number
	readonly m_nSceneStringIndex: number
	readonly m_bClientOnly: boolean
	readonly m_hOwner: C_BaseEntity
	readonly m_hActorList: C_BaseFlex[]
	readonly m_bWasPlaying: boolean
	readonly m_flCurrentTime: number
}

interface CDOTA_Item_RiverPainter5 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Item_EchoSabre extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_SpiritBreaker_EmpoweringHaste extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Weaver_TimeLapse extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nNPCSpawnedID: number
}

interface C_DOTA_Unit_Hero_Life_Stealer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_bHadScepter: boolean
}

interface CDOTA_Unit_Announcer extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_currentAnnouncer: CAnnouncerDescriptor
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Alchemist_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Storm_Spirit_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Bloodstone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_UltimateScepter extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_SunRayToggleMove extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Winter_Wyvern_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Lancer_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_TrueStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Clinkz extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Batrider_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Assassin_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_BladeOfAlacrity extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_SpiritFormIlluminateEnd extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_WindWalk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pugna_Decrepify extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Creep_Talking extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Soul_Booster extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ArcWarden_Flux extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Techies extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_bLastDeathFromSuicide: boolean
}

interface C_DOTA_Ability_Dazzle_Weave extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Zuus_ThundergodsVengeance extends C_DOTA_Ability_Zuus_ThundergodsWrath {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_175 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Slippers extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Terrorblade_Metamorphosis extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Magnataur_ReversePolarity extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_vPullLocation: Vector
}

interface C_DOTA_Ability_Brewmaster_Cyclone extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_TakeStashItems extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Necrolyte extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_SatyrTrickster_Purge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Razor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Assault_Cuirass extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Hyperstone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_NagaSiren_RipTide extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Omniknight_Purification extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Roshan extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_iLastHealthPercent: number
	readonly m_nFXIndex: number
	readonly m_hAttackingHeroes: C_BaseEntity[]
	readonly m_bGoldenRoshan: boolean
}

interface C_DOTA_Ability_WitchDoctor_Maledict extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Kunkka_Torrent extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Blue_IceVortex extends C_DOTABaseAbility {
	readonly type_name: string
	readonly vision_aoe: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dragon_Knight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FuncCombineBarrier extends C_FuncBrush {
	readonly type_name: string
	readonly m_nAmbientEffect: number
	readonly m_EffectName: string
	readonly m_eBarriersize: number
	readonly m_eBarrierState: number
}

interface C_DOTA_Item_Buckler extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Medusa_SplitShot extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DoomBringer_ScorchedEarth extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_WitchDoctor_VoodooRestoration extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_Morph_Str extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_TempTree extends C_BaseAnimating {
	readonly type_name: string
	readonly m_fExpireTime: number
	readonly m_vecTreeCircleCenter: Vector
}

interface C_DOTA_Ability_Special_Bonus_Unique_Skywrath_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Magnus_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BinaryObject extends C_BaseAnimating {
	readonly type_name: string
	readonly m_bActive: boolean
	readonly m_nBinaryID: number
}

interface C_Fish extends C_BaseAnimating {
	readonly type_name: string
	readonly m_pos: Vector
	readonly m_vel: Vector
	readonly m_angles: QAngle
	readonly m_localLifeState: number
	readonly m_deathDepth: number
	readonly m_deathAngle: number
	readonly m_buoyancy: number
	readonly m_wiggleTimer: CountdownTimer
	readonly m_wigglePhase: number
	readonly m_wiggleRate: number
	readonly m_actualPos: Vector
	readonly m_actualAngles: QAngle
	readonly m_poolOrigin: Vector
	readonly m_waterLevel: number
	readonly m_gotUpdate: boolean
	readonly m_x: number
	readonly m_y: number
	readonly m_z: number
	readonly m_angle: number
	readonly m_errorHistory: number[]
	readonly m_errorHistoryIndex: number
	readonly m_errorHistoryCount: number
	readonly m_averageError: number
}

interface C_DOTA_Unit_Hero_DarkWillow extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nyx_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Techies_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_275 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AttributeBonus extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_CaptureCallbackHandler extends C_BaseEntity {
	readonly type_name: string
}

interface C_TestTraceline extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Necronomicon extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Pangolier extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Elder_Titan_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CLogicalEntity extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Black_King_Bar extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkSeer_Surge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Kunkka_GhostShip extends C_DOTABaseAbility {
	readonly type_name: string
	readonly buff_duration: number
	readonly stun_duration: number
	readonly ghostship_width: number
	readonly ghostship_width_scepter: number
	readonly m_vFinalDestination: Vector
	readonly m_vStartingPoint: Vector
}

interface C_DOTA_Ability_Special_Bonus_Unique_DarkWillow_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lich_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lich_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Kunkka extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_RopeKeyframe extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nLinksTouchingSomething: number
	readonly m_bApplyWind: boolean
	readonly m_fPrevLockedPoints: number
	readonly m_iForcePointMoveCounter: number
	readonly m_bPrevEndPointPos: boolean[]
	readonly m_vPrevEndPointPos: Vector[]
	readonly m_flCurScroll: number
	readonly m_flScrollSpeed: number
	readonly m_RopeFlags: number
	readonly m_LightValues: Vector[]
	readonly m_nSegments: number
	readonly m_hStartPoint: C_BaseEntity
	readonly m_hEndPoint: C_BaseEntity
	readonly m_iStartAttachment: number
	readonly m_iEndAttachment: number
	readonly m_Subdiv: number
	readonly m_RopeLength: number
	readonly m_Slack: number
	readonly m_TextureScale: number
	readonly m_fLockedPoints: number
	readonly m_nChangeCount: number
	readonly m_Width: number
	readonly m_TextureHeight: number
	readonly m_vecImpulse: Vector
	readonly m_vecPreviousImpulse: Vector
	readonly m_flCurrentGustTimer: number
	readonly m_flCurrentGustLifetime: number
	readonly m_flTimeToNextGust: number
	readonly m_vWindDir: Vector
	readonly m_vColorMod: Vector
	readonly m_vCachedEndPointAttachmentPos: Vector[]
	readonly m_vCachedEndPointAttachmentAngle: QAngle[]
	readonly m_bConstrainBetweenEndpoints: boolean
	readonly m_bEndPointAttachmentPositionsDirty: boolean
	readonly m_bEndPointAttachmentAnglesDirty: boolean
	readonly m_bNewDataThisFrame: boolean
	readonly m_bPhysicsInitted: boolean
}

interface CBaseProp extends C_BaseAnimating {
	readonly type_name: string
	readonly m_HandPoses: handposepair_t[]
}

interface C_DOTA_Unit_Undying_Tombstone extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Furion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Flask extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Ogre_Magi extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_SpiritBear extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_bLevelChanged: boolean
	readonly m_hBear: C_BaseEntity
	readonly m_hPreBear: C_BaseEntity
}

interface C_DOTA_Ability_PhantomAssassin_Stifling_Dagger extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Sniper_Headshot extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_ShootFirework extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Shaman_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Ring_Of_Basilius extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_DispelMagic extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Life_Stealer_AssimilateEject extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_DrowRanger extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_IngameEvent_DotaPrime extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_BreakableProp extends CBaseProp {
	readonly type_name: string
	readonly m_OnBreak: CEntityIOOutput
	readonly m_OnTakeDamage: CEntityIOOutput
	readonly m_impactEnergyScale: number
	readonly m_iMinHealthDmg: number
	readonly m_iPhysicsMode: number
	readonly m_flPressureDelay: number
	readonly m_hBreaker: C_BaseEntity
	readonly m_PerformanceMode: number
	readonly m_flDmgModBullet: number
	readonly m_flDmgModClub: number
	readonly m_flDmgModExplosive: number
	readonly m_flDmgModFire: number
	readonly m_iszPhysicsDamageTableName: string
	readonly m_iszBreakableModel: string
	readonly m_iBreakableSkin: number
	readonly m_iBreakableCount: number
	readonly m_iMaxBreakableSize: number
	readonly m_iszBasePropData: string
	readonly m_iInteractions: number
	readonly m_explodeDamage: number
	readonly m_explodeRadius: number
	readonly m_nCarryTypeOverride: number
	readonly m_flPreventDamageBeforeTime: number
	readonly m_iNumBreakableChunks: number
	readonly m_hPhysicsAttacker: C_BaseEntity
	readonly m_flLastPhysicsInfluenceTime: number
	readonly m_bBlockLOSSetByPropData: boolean
	readonly m_bIsWalkableSetByPropData: boolean
	readonly m_flDefaultFadeScale: number
	readonly m_explosionType: number
	readonly m_explosionDelay: number
	readonly m_explosionBuildupSound: string
	readonly m_hLastAttacker: C_BaseEntity
	readonly m_hFlareEnt: C_BaseEntity
	readonly m_noGhostCollision: boolean
	readonly m_flClothScale: number
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_120 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_HoldoutTower extends C_DOTA_BaseNPC_Tower {
	readonly type_name: string
	readonly m_iTowerType: number
}

interface C_DOTA_Item_Recipe_Arcane_Ring extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Winter_Wyvern_Arctic_Burn extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_BurnedTargets: C_BaseEntity[]
}

interface C_DOTA_Unit_Hero_LoneDruid extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Shadow_Demon_Demonic_Purge extends C_DOTABaseAbility {
	readonly type_name: string
	readonly max_stringges: number
	readonly stringge_restore_time: number
}

interface C_DOTA_Ability_Brewmaster_PermanentImmolation extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Broodmother_IncapacitatingBite extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_VengefulSpirit_Magic_Missile extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phoenix_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Furion_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Assassin_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_HandOfMidas extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Windrunner extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nTargetAngle: number
	readonly m_iPoseParameterAim: number
}

interface C_DOTA_Ability_Tiny_Avalanche extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vTargetLoc: Vector
}

interface C_DOTA_Ability_Zuus_Cloud extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Yellow_Surge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ogre_Magi_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Tombstone extends C_DOTA_Item {
	readonly type_name: string
	readonly m_flTimer: number
	readonly m_nFXIndex: number
	readonly m_nFXIndex2: number
}

interface C_PortraitWorldUnit extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_bSuppressIntroEffects: boolean
	readonly m_bIsAlternateLoadout: boolean
	readonly m_bSpawnBackgroundModels: boolean
	readonly m_bDeferredPortrait: boolean
	readonly m_bShowParticleAssetModifiers: boolean
	readonly m_bIgnorePortraitInfo: boolean
	readonly m_bFlyingCourier: boolean
	readonly m_nEffigyStatusEffect: number
	readonly m_effigySequenceName: string
	readonly m_flStartingAnimationCycle: number
	readonly m_flRareLoadoutAnimChance: number
	readonly m_activityModifier: string
	readonly m_environment: number
	readonly m_nStartupBehavior: number
	readonly m_cameraName: string
	readonly m_nPortraitParticle: number
	readonly m_nCourierType: number
}

interface C_DOTA_BaseNPC_Creep_Lane extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Healer extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
	readonly m_iRangeFX: number
}

interface C_EconWearable extends C_EconEntity {
	readonly type_name: string
}

interface CDOTA_Ability_Tusk_IceShards_Stop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DeathProphet_Exorcism_Spirit extends C_BaseAnimating {
	readonly type_name: string
}

interface CDOTA_Ability_Beastmaster_CallOfTheWild extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Weaver_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Skywrath_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sniper_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Disruptor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTABaseCustomHeroPickRules extends C_BaseEntity {
	readonly type_name: string
}

interface C_TriggerCamera extends C_BaseEntity {
	readonly type_name: string
}

interface C_PostProcessingVolume extends C_BaseTrigger {
	readonly type_name: string
	readonly m_flFadeTime: number
	readonly m_bMaster: boolean
}

interface C_DOTA_Ability_EarthSpirit_StoneCaller extends C_DOTABaseAbility {
	readonly type_name: string
	readonly max_stringges: number
	readonly stringge_restore_time: number
}

interface C_DOTA_Unit_Hero_Bristleback extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Silencer_GlobalSilence extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_IceWall extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Tidehunter_AnchorSmash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_MudGolem_CloakAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_BlackDragon_DragonhideAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pudge_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DeathProphet_Exorcism extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_SpiritInfos: sSpiritInfo[]
}

interface C_DOTA_PortraitEntity extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_iPortraitParticle: number
	readonly m_PortraitActivity: number
	readonly m_nMouthFX: number
	readonly m_nMouthControlPoint: number
	readonly m_CustomActivityModifiers: CUtlSymbol[]
	readonly m_bIsSimulationActive: boolean
	readonly m_bNeedsModelInit: boolean
	readonly m_bNeedsPortraitRefresh: boolean
	readonly m_hAppearanceFromNPC: C_BaseEntity
	readonly m_PetIdleTimer: CountdownTimer
}

interface C_DOTA_Item_Recipe_Black_King_Bar extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_BootsOfTravel extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_DarkWillow_Creature extends C_DOTA_BaseNPC {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_EarthSpirit extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Spirits_In extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_NagaSiren_SongOfTheSiren_Cancel extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Omniknight_Degen_Aura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DragonKnight_ElderDragonForm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Dive extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Silencer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Techies extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvDeferredLight extends C_ModelPointEntity, CDeferredLightBase {
	readonly type_name: string
}

interface C_DynamicProp extends C_BreakableProp {
	readonly type_name: string
	readonly m_pOutputAnimBegun: CEntityIOOutput
	readonly m_pOutputAnimOver: CEntityIOOutput
	readonly m_pOutputAnimLoopCycleOver: CEntityIOOutput
	readonly m_iszDefaultAnim: string
	readonly m_iTransitionDirection: number
	readonly m_bAnimateOnServer: boolean
	readonly m_bRandomizeCycle: boolean
	readonly m_bHoldAnimation: boolean
	readonly m_bRandomAnimator: boolean
	readonly m_flNextRandAnim: number
	readonly m_flMinRandAnimTime: number
	readonly m_flMaxRandAnimTime: number
	readonly m_bStartDisabled: boolean
	readonly m_bUpdateAttachedChildren: boolean
	readonly m_bScriptedMovement: boolean
	readonly m_bUseHitboxesForRenderBox: boolean
	readonly m_bCreateNonSolid: boolean
	readonly m_bIsOverrideProp: boolean
	readonly m_iInitialGlowState: number
	readonly m_nGlowRange: number
	readonly m_nGlowRangeMin: number
	readonly m_glowColor: Color
	readonly m_iCachedFrameCount: number
	readonly m_vecCachedRenderMins: Vector
	readonly m_vecCachedRenderMaxs: Vector
}

interface C_DOTA_Item_RiverPainter2 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Ability_Ogre_Magi_Bloodlust extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_Rabid extends C_DOTABaseAbility {
	readonly type_name: string
	readonly rabid_duration: number
}

interface C_DOTA_Ability_Invoker_EMP extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nevermore_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Faceless_Void_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FireSmoke extends C_BaseFire {
	readonly type_name: string
	readonly m_nFlameModelIndex: number
	readonly m_nFlameFromAboveModelIndex: number
	readonly m_flScaleRegister: number
	readonly m_flScaleStart: number
	readonly m_flScaleEnd: number
	readonly m_flScaleTimeStart: number
	readonly m_flScaleTimeEnd: number
	readonly m_flChildFlameSpread: number
	readonly m_flClipPerc: number
	readonly m_bClipTested: boolean
	readonly m_bFadingOut: boolean
	readonly m_tParticleSpawn: TimedEvent
	readonly m_pFireOverlay: CFireOverlay
}

interface C_DOTA_Item_MaskOfMadness extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_RingOfRegeneration extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Claymore extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Special_Bonus_Unique_Grimstroke_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ogre_Magi_Unrefined_Fireblast extends C_DOTA_Ability_Ogre_Magi_Fireblast {
	readonly type_name: string
	readonly m_nMostRecentMulticastCount: number
}

interface C_DOTA_Ability_Greevil_Miniboss_Green_LivingArmor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_MapTree extends C_DOTA_BinaryObject {
	readonly type_name: string
	readonly m_bInitialized: boolean
}

interface C_Sprite extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_hAttachedToEntity: C_BaseEntity
	readonly m_nAttachment: number
	readonly m_flSpriteFramerate: number
	readonly m_flFrame: number
	readonly m_flDieTime: number
	readonly m_nBrightness: number
	readonly m_flBrightnessTime: number
	readonly m_flSpriteScale: number
	readonly m_flScaleTime: number
	readonly m_bWorldSpaceScale: boolean
	readonly m_flGlowProxySize: number
	readonly m_flHDRColorScale: number
	readonly m_flLastTime: number
	readonly m_flMaxFrame: number
	readonly m_flStartScale: number
	readonly m_flDestScale: number
	readonly m_flScaleTimeStart: number
	readonly m_nStartBrightness: number
	readonly m_nDestBrightness: number
	readonly m_flBrightnessTimeStart: number
	readonly m_nSpriteWidth: number
	readonly m_nSpriteHeight: number
}

interface C_EnvCombinedLightProbeVolume extends C_BaseEntity {
	readonly type_name: string
	readonly m_Color: Color
	readonly m_flBrightness: number
	readonly m_bCustomCubemapTexture: boolean
	readonly m_vBoxMins: Vector
	readonly m_vBoxMaxs: Vector
	readonly m_LightGroups: string
	readonly m_bStatic: boolean
	readonly m_nHandshake: number
	readonly m_nIndoorOutdoorLevel: number
	readonly m_bStartDisabled: boolean
	readonly m_bEnabled: boolean
}

interface C_DOTA_Item_Recipe_Dagon4 extends C_DOTA_Item_Recipe_Dagon {
	readonly type_name: string
}

interface C_DOTA_Ability_Tusk_WalrusPunch extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Disruptor extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Exort extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bounty_Hunter extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Leshrac_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phoenix_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Medusa_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_350 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Creep_Neutral extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_SpiritBreaker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_PlayerResource extends C_BaseEntity {
	readonly type_name: string
	readonly m_szName: string[]
	readonly m_Colors: Color[]
	readonly m_iPing: number[]
	readonly m_iScore: number[]
	readonly m_iDeaths: number[]
	readonly m_bConnected: boolean[]
	readonly m_iTeam: number[]
	readonly m_bAlive: boolean[]
	readonly m_iHealth: number[]
	readonly m_bIsFakePlayer: boolean[]
	readonly m_nEventPlayerInfo: number
}

interface C_DOTA_Item_Recipe_Hood_Of_Defiance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Slark_ShadowDance extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Chen_HandOfGod extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Faceless_Void extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Luna_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Riki_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_125 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_GenericFlexCyclerAlias_cycler extends C_GenericFlexCycler {
	readonly type_name: string
}

interface CDOTA_Ability_AbyssalUnderlord_Firestorm extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Disruptor_KineticField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Shadowraze2 extends C_DOTA_Ability_Nevermore_Shadowraze {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Arc_Warden extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DataRadiant extends C_DOTA_DataNonSpectator {
	readonly type_name: string
}

interface C_BaseCombatWeapon extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hOwner: C_BaseEntity
	readonly m_nViewModelIndex: number
	readonly m_flNextPrimaryAttack: number
	readonly m_flNextSecondaryAttack: number
	readonly m_nQueuedAttack: number
	readonly m_flTimeAttackQueued: number
	readonly m_iState: number
	readonly m_iPrimaryAmmoType: number
	readonly m_iSecondaryAmmoType: number
	readonly m_iClip1: number
	readonly m_iClip2: number
	readonly m_bOnlyPump: boolean
	readonly m_flTimeWeaponIdle: number
	readonly m_flNextEmptySoundTime: number
	readonly m_fMinRange1: number
	readonly m_fMinRange2: number
	readonly m_fMaxRange1: number
	readonly m_fMaxRange2: number
	readonly m_fFireDuration: number
	readonly m_fMinAdvanceToRange1: number
	readonly m_Activity: number
	readonly m_iPrimaryAmmoCount: number
	readonly m_iSecondaryAmmoCount: number
	readonly m_iszName: string
	readonly m_bRemoveable: boolean
	readonly m_bInReload: boolean
	readonly m_bFireOnEmpty: boolean
	readonly m_bFiresUnderwater: boolean
	readonly m_bAltFiresUnderwater: boolean
	readonly m_bReloadsSingly: boolean
	readonly m_IdealActivity: number
	readonly m_iSubType: number
	readonly m_flUnlockTime: number
	readonly m_hLocker: C_BaseEntity
	readonly m_nTracerAttachmentIndex: number
	readonly m_iAltFireHudHintCount: number
	readonly m_iReloadHudHintCount: number
	readonly m_bAltFireHudHintDisplayed: boolean
	readonly m_bReloadHudHintDisplayed: boolean
	readonly m_flHudHintPollTime: number
	readonly m_flHudHintMinDisplayTime: number
	readonly m_bJustRestored: boolean
	readonly m_nLastNetworkedModelIndex: number
	readonly m_nPreDataChangedModelIndex: number
	readonly m_pWorldModelClone: C_CombatWeaponClone
	readonly m_iOldState: number
}

interface C_DynamicPropAlias_dynamic_prop extends C_DynamicProp {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Diffusal_Blade2 extends C_DOTA_Item_Recipe_Diffusal_Blade {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Spectre extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Weaver extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_ShadowShaman_Shackles extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hShackleTarget: C_BaseEntity
	readonly nShackleFXIndex: number
}

interface C_DOTA_Ability_Morphling_Morph_Agi extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_Morph extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bloodseeker_Bloodrage extends C_DOTABaseAbility {
	readonly type_name: string
	readonly max_stringges: number
	readonly stringge_restore_time: number
}

interface C_DotaSubquestEntityDeath extends C_DotaSubquestBase {
	readonly type_name: string
}

interface C_DOTA_Ability_BlueDragonspawnOverseer_Evasion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earth_Spirit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CLogicRelay extends CLogicalEntity {
	readonly type_name: string
	readonly m_OnTrigger: CEntityIOOutput
	readonly m_OnSpawn: CEntityIOOutput
	readonly m_bDisabled: boolean
	readonly m_bWaitForRefire: boolean
	readonly m_bTriggerOnce: boolean
	readonly m_bFastRetrigger: boolean
	readonly m_bPassthoughCaller: boolean
}

interface C_DOTA_Item_AeonDisk extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Hurricane_Pike extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Aegis extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ChaosKnight_Chaos_Bolt extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Batrider extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Jakiro_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pangolier_HeartPiercer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Overstringge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Alchemist_ChemicalRage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_VengefulSpirit_WaveOfTerror extends C_DOTABaseAbility {
	readonly type_name: string
	readonly wave_width: number
	readonly wave_speed: number
	readonly m_iProjectile: number
	readonly vision_aoe: number
	readonly vision_duration: number
	readonly m_nNumHeroesHit: number
	readonly m_ViewerTimer: CountdownTimer
}

interface C_DOTA_Ability_Special_Bonus_Unique_Antimage_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Jakiro_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_TonemapController2Alias_env_tonemap_controller2 extends C_TonemapController2 {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Crimson_Guard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_RodOfAtos extends C_DOTA_Item {
	readonly type_name: string
}

interface C_CDOTA_Ability_Treant_LeechSeed extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Meepo_DividedWeStand extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nWhichDividedWeStand: number
	readonly m_nNumDividedWeStand: number
	readonly m_entPrimeDividedWeStand: C_BaseEntity
	readonly m_entNextDividedWeStand: C_BaseEntity
}

interface CDOTA_Ability_Pudge_Dismember extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hVictim: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Witch_Doctor_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_9 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_HoldoutTower_ReduceSpeed extends C_DOTA_BaseNPC_HoldoutTower {
	readonly type_name: string
}

interface C_PropVehicleDriveable extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hPlayer: C_BaseEntity
	readonly m_nSpeed: number
	readonly m_nRPM: number
	readonly m_flThrottle: number
	readonly m_nBoostTimeLeft: number
	readonly m_bHasBoost: boolean
	readonly m_nScannerDisabledWeapons: boolean
	readonly m_nScannerDisabledVehicle: boolean
	readonly m_iFlashTimer: number
	readonly m_bLockedDim: boolean
	readonly m_bLockedIcon: boolean
	readonly m_iScannerWepFlashTimer: number
	readonly m_bScannerWepDim: boolean
	readonly m_bScannerWepIcon: boolean
	readonly m_iScannerVehicleFlashTimer: number
	readonly m_bScannerVehicleDim: boolean
	readonly m_bScannerVehicleIcon: boolean
	readonly m_flSequenceChangeTime: number
	readonly m_bEnterAnimOn: boolean
	readonly m_bExitAnimOn: boolean
	readonly m_flFOV: number
	readonly m_vecGunCrosshair: Vector
	readonly m_vecEyeExitEndpoint: Vector
	readonly m_bHasGun: boolean
	readonly m_bUnableToFire: boolean
	readonly m_hPrevPlayer: C_BaseEntity
	readonly m_ViewSmoothingData: C_ViewSmoothingData_t
}

interface CDOTA_Item_Recipe_Nullifier extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_BlackDragon_SplashAttack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Crystal_Maiden_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bloodseeker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_75 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CNetworkedIKProceduralTargetContext {
	readonly type_name: string
	readonly m_nChainIndex: number
	readonly m_nRuleIndex: number
	readonly m_vTargetPosition: Vector
	readonly m_flWeight: number
	readonly m_bIsValid: boolean
}

interface CDOTA_Item_Recipe_Solar_Crest extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Terrorblade_Reflection extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface CDOTA_Ability_Tusk_WalrusKick extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Visage_SummonFamiliars_StoneForm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Naga_Siren extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Bane extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_TFWearableItem extends C_EconWearable {
	readonly type_name: string
}

interface C_DOTA_Item_DragonLance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_BountyHunter_Track extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Clinkz_DeathPact extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Life_Stealer_Infest extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Rubick_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dragon_Knight_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Naga_Siren_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Lotus_Orb extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_PointBooster extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_EmberSpirit_Activate_FireRemnant extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_nProjectileID: number
	readonly m_vStartLocation: Vector
	readonly m_vProjectileLocation: Vector
	readonly m_ProjectileAngles: QAngle
	readonly m_hRemnantToKill: C_BaseEntity
	readonly m_bProjectileStarted: boolean
}

interface C_DOTA_Ability_Bristleback_ViscousNasalGoo extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Telekinesis extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vStartLocation: Vector
	readonly m_vLandLocation: Vector
	readonly m_flStartTime: number
	readonly m_pTarget: C_DOTA_BaseNPC
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bristleback_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Disruptor_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_30_Crit_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Courier extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_bUnitRespawned: boolean
	readonly m_bPreUpdateFlyingCourier: boolean
	readonly m_nSoleControllingPlayer: number
	readonly m_bFlyingCourier: boolean
	readonly m_flRespawnTime: number
	readonly m_nCourierState: number
	readonly m_hCourierStateEntity: C_BaseEntity
}

interface C_DOTA_Ability_Tiny_CraggyExterior extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hStolenTree: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chen_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_ParticleSystem extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_szSnapshotFileName: string[]
	readonly m_bActive: boolean
	readonly m_nStopType: number
	readonly m_flStartTime: number
	readonly m_vServerControlPoints: Vector[]
	readonly m_iServerControlPointAssignments: number[]
	readonly m_hControlPointEnts: C_BaseEntity[]
	readonly m_bNoSave: boolean
	readonly m_bStartActive: boolean
	readonly m_iszEffectName: string
	readonly m_iszControlPointNames: string[]
	readonly m_bOldActive: boolean
}

interface C_DOTA_Item_Clarity extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Tango extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Broodmother_SpawnSpiderlings extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pudge_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_65 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_MaterialModifyControl extends C_BaseEntity {
	readonly type_name: string
	readonly m_szMaterialName: string[]
	readonly m_szMaterialVar: string[]
	readonly m_szMaterialVarValue: string[]
	readonly m_bHasNewAnimationCommands: boolean
	readonly m_iFrameStart: number
	readonly m_iFrameEnd: number
	readonly m_bWrap: boolean
	readonly m_flFramerate: number
	readonly m_bNewAnimCommandsSemaphore: boolean
	readonly m_bOldAnimCommandsSemaphore: boolean
	readonly m_flFloatLerpStartValue: number
	readonly m_flFloatLerpEndValue: number
	readonly m_flFloatLerpTransitionTime: number
	readonly m_flAnimationStartTime: number
	readonly m_nModifyMode: number
}

interface C_EnvScreenEffect extends C_PointEntity {
	readonly type_name: string
	readonly m_flDuration: number
	readonly m_nType: number
}

interface C_DOTA_Item_Recipe_UltimateScepter extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Abaddon_Frostmourne extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_ChaosKnight_Chaos_Strike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pudge_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Timbersaw_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DevtestHierarchy extends C_DynamicProp {
	readonly type_name: string
	readonly m_vRotationAxis: Vector
	readonly m_flRotationSpeed: number
	readonly m_nTestMode: number
	readonly m_hChild: C_BaseEntity
	readonly m_vDynamicAttachOffset: Vector
	readonly m_nDynamicResetCount: number
	readonly m_nDynamicDetachCount: number
	readonly m_bChildIsDynamic: boolean
	readonly m_bCreateChildSideChild: boolean
	readonly m_hAlternateParent: C_BaseEntity
	readonly m_flEntityStartTime: number
	readonly m_nTestIndex: number
	readonly m_nCurrType: number
	readonly m_nCurrentModel: number
}

interface C_DOTA_Ability_ArcWarden_SparkWraith extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
	readonly activation_delay: number
	readonly wraith_vision_duration: number
	readonly wraith_vision_radius: number
	readonly spark_damage: number
}

interface CDOTA_Ability_Winter_Wyvern_Cold_Embrace extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SkeletonKing_Reincarnation extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dark_Seer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Undying_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tiny_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Ancient_Janggo extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Necronomicon_Warrior_LastWill extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Undying extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tidehunter_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAReflectionSkybox extends C_BaseEntity {
	readonly type_name: string
	readonly m_pSkySceneObject: CSceneObject
}

interface C_DevtestHierarchy2 extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_Ability_Tusk_IceShards extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iProjectile: number
	readonly shard_width: number
	readonly shard_damage: number
	readonly shard_count: number
	readonly shard_speed: number
	readonly shard_duration: number
	readonly shard_angle_step: number
	readonly shard_distance: number
	readonly m_vSpawnOrigin: Vector
	readonly m_vDirection: Vector
}

interface C_DOTA_Unit_Hero_Treant extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_SummonWolves_PermanentInvisibility extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Chen_HolyPersuasion extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hDominatedUnits: C_BaseEntity[]
}

interface C_DOTA_Ability_Lich_ChainFrost extends C_DOTABaseAbility {
	readonly type_name: string
	readonly jump_range: number
	readonly jumps: number
	readonly slow_duration: number
	readonly vision_radius: number
	readonly projectile_speed: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Shaman_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Night_Stalker extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Luna_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Lancer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Riki_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chen_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Legion_Commander_PressTheAttack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Magnataur_Shockwave extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Unit_Hero_Jakiro extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Enchantress_Enchant extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lion_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_PocketTower extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Blight_Stone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Spectre_Desolate extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_ShadowShaman_EtherShock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lina_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enchantress_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Puck extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_45 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAWorldParticleSystem extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nType: number
	readonly m_iClientEffectIndex: number
	readonly m_szEffectName: string
	readonly m_szTargetName: string
	readonly m_szControlPoint: string
	readonly m_vModelScale: Vector
	readonly m_bDayTime: boolean
	readonly m_bNightTime: boolean
	readonly m_bShowInFow: boolean
}

interface CDOTA_Ability_Abaddon_BorrowedTime extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Medusa_StoneGaze extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Slark_EssenceShift extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Kunkka_XMarksTheSpot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hThinker: C_BaseEntity
}

interface C_ColorCorrection extends C_BaseEntity {
	readonly type_name: string
	readonly m_vecOrigin: Vector
	readonly m_MinFalloff: number
	readonly m_MaxFalloff: number
	readonly m_flFadeInDuration: number
	readonly m_flFadeOutDuration: number
	readonly m_flMaxWeight: number
	readonly m_flCurWeight: number
	readonly m_netlookupFilename: string[]
	readonly m_bEnabled: boolean
	readonly m_bMaster: boolean
	readonly m_bClientSide: boolean
	readonly m_bExclusive: boolean
	readonly m_bEnabledOnClient: boolean[]
	readonly m_flCurWeightOnClient: number[]
	readonly m_bFadingIn: boolean[]
	readonly m_flFadeStartWeight: number[]
	readonly m_flFadeStartTime: number[]
	readonly m_flFadeDuration: number[]
}

interface C_DOTA_Ability_Gyrocopter_Rocket_Barrage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_QueenOfPain_ScreamOfPain extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_JumpBoots extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bane_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Beastmaster extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Generic_Hidden extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_AI_BaseNPC extends C_BaseCombatCharacter {
	readonly type_name: string
	readonly m_flTempRagdollTransitionTime: number
	readonly m_RagdollTransform: matrix3x4a_t[]
	readonly m_TransitionTransform: matrix3x4a_t[]
	readonly m_NPCState: number
	readonly m_flTimePingEffect: number
	readonly m_iDeathFrame: number
	readonly m_iSpeedModRadius: number
	readonly m_iSpeedModSpeed: number
	readonly m_bPerformAvoidance: boolean
	readonly m_bIsMoving: boolean
	readonly m_flStunUntilTime: number
	readonly m_bFadeCorpse: boolean
	readonly m_bSpeedModActive: boolean
	readonly m_bImportantRagdoll: boolean
	readonly m_hServerRagdoll: C_BaseEntity
	readonly m_nFootstepType: number
}

interface C_DOTA_Ability_ChaosKnight_Phantasm extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hIllusions: C_BaseEntity[]
}

interface C_DOTA_Ability_Spectre_SpectralDagger extends C_DOTABaseAbility {
	readonly type_name: string
	readonly dagger_path_duration: number
	readonly hero_path_duration: number
	readonly m_fCreateInterval: number
	readonly m_fLastCreate: number
	readonly m_bIsTrackingProjectile: boolean
	readonly m_hTrackingProjectileHits: C_BaseEntity[]
	readonly m_hTrackingTarget: C_BaseEntity
}

interface CDOTA_Ability_Life_Stealer_Control extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Vermillion_Robe extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Lina_FierySoul extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Queen_Of_Pain extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DynamicPropClientFadeOut extends C_DynamicProp {
	readonly type_name: string
	readonly m_nFadeOutMode: number
	readonly m_ShouldBeVisible: boolean
	readonly m_flAlpha: number
	readonly m_flLastUpdateTime: number
	readonly m_flFadeTime: number
	readonly m_flFadeRadius: number
	readonly m_flFadeRadiusEnd: number
	readonly m_bVisibleAtDay: boolean
	readonly m_bVisibleAtNight: boolean
	readonly m_bHiddenInShowcaseView: boolean
	readonly m_bClothSimDisabled: boolean
	readonly m_vFadeOrigin: Vector
	readonly m_vFadeOriginOffset: Vector
}

interface C_PropVRTrackedObject extends C_BaseAnimating {
	readonly type_name: string
	readonly m_mClientTransform: matrix3x4_t
	readonly m_vClientScale: Vector
	readonly m_vecRenderModelComponentTransforms: matrix3x4a_t[]
	readonly m_bIsTracking: boolean
	readonly m_vTrackedPosition: Vector
	readonly m_qTrackedAngles: QAngle
	readonly m_vPhysicallyConstrainedPosition: Vector
	readonly m_qPhysicallyConstrainedAngles: QAngle
	readonly m_bClientIsAuthoritativeForTransform: boolean
	readonly m_bIsInContact: boolean
}

interface C_DOTA_Item_Pipe extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_ReturnChakram extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DoomBringer_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Batrider_FlamingLasso extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Omniknight_Repel extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Requiem extends C_DOTABaseAbility {
	readonly type_name: string
	readonly requiem_line_width_start: number
	readonly requiem_line_width_end: number
	readonly m_nCachedSouls: number
	readonly m_nFXIndex: number
	readonly m_nKilleater_nLines: number
	readonly m_vecHeroesReqd: C_BaseEntity[]
}

interface CDOTA_Unit_Hero_AncientApparition extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Batrider_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Elder_Titan_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_9 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_120 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_NullTalisman extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_RiverPainter4 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Hidden1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_NightStalker_HunterInTheNight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_TemplarAssassin_Refraction_Holdout extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Vermillion_Robe extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Witch_Doctor_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Jakiro_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Shadow_Demon extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_GoToSideShop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Axe_CullingBlade extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Juggernaut_Omnislash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_NPC_DataDriven extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface C_DOTA_Ability_PolarFurbolgUrsaWarrior_ThunderClap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Spawnlord_Master_Freeze extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Puck_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Queen_Of_Pain_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_ParticlePerformanceMonitor extends C_PointEntity {
	readonly type_name: string
	readonly m_bDisplayPerf: boolean
	readonly m_bMeasurePerf: boolean
}

interface C_DOTA_Item_Recipe_Necronomicon_3 extends C_DOTA_Item_Recipe_Necronomicon {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_HandOfMidas extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Bracer extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkWillow_ShadowRealm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Leshrac_Pulse_Nova extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Puck_DreamCoil extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hThinker: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dazzle_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sniper_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_InfoOverlayAccessor extends C_BaseEntity {
	readonly type_name: string
	readonly m_iOverlayID: number
}

interface C_DOTA_Unit_Hero_Lion extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_unFingerPrestigeKills: number
}

interface C_DOTA_Ability_Tusk_Launch_Snowball extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_Shapeshift extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Viper_CorrosiveSkin extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Earthshaker_Fissure extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Haste extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Effigy_Statue extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface C_PointClientUIDialog extends C_BaseClientUIEntity {
	readonly type_name: string
	readonly m_hActivator: C_BaseEntity
	readonly m_bStartEnabled: boolean
}

interface C_BaseDoor extends C_BaseToggle {
	readonly type_name: string
	readonly m_bIsUsable: boolean
}

interface C_DOTA_Item_BootsOfTravel extends C_DOTA_Item {
	readonly type_name: string
	readonly m_nFXOrigin: number
	readonly m_nFXDestination: number
	readonly m_hTeleportTarget: C_BaseEntity
	readonly m_vTeleportLoc: Vector
	readonly m_bTeleportTargetIsBuilding: boolean
}

interface CDOTA_Item_Recipe_BootsOfTravel_2 extends C_DOTA_Item_Recipe_BootsOfTravel {
	readonly type_name: string
}

interface C_DOTA_Ability_Tusk_FrozenSigil extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Beastmaster_PrimalRoar extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
	readonly slow_duration: number
	readonly side_damage: number
	readonly damage_radius: number
	readonly path_width: number
	readonly push_duration: number
	readonly push_distance: number
	readonly damage: number
	readonly movement_speed_duration: number
}

interface C_DOTA_Ability_BigThunderLizard_Frenzy extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lina_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tusk_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_InfoLadderDismount extends C_BaseEntity {
	readonly type_name: string
}

interface CDOTA_Ability_AbyssalUnderlord_DarkRift extends C_DOTABaseAbility {
	readonly type_name: string
	readonly teleport_delay: number
	readonly m_hTeleportTarget: C_BaseEntity
}

interface C_DOTA_Unit_Broodmother_Spiderling extends C_DOTA_BaseNPC_Creep_Talking {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Pugna extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_CallOfTheWild_Boar_Poison extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_BagOfGold extends C_DOTA_Item {
	readonly type_name: string
	readonly m_hThinker: C_BaseEntity
}

interface C_DOTA_Ability_EnragedWildkin_Tornado extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hTornado: C_BaseEntity
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Alchemist_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Disruptor_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CRenderComponent extends CEntityComponent {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_bIsRenderingWithViewModels: boolean
	readonly m_nSplitscreenFlags: number
	readonly m_bEnableRendering: boolean
	readonly m_bInterpolationReadyToDraw: boolean
}

interface C_DOTA_Item_Recipe_Veil_Of_Discord extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Invoker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Sven_GodsStrength extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Storm_Spirit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Skywrath extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Arc_Warden_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CLightComponent extends CEntityComponent {
	readonly type_name: string
	readonly __m_pChainEntity: CNetworkVarChainer
	readonly m_Color: Color
	readonly m_flBrightness: number
	readonly m_flBrightnessMult: number
	readonly m_flRange: number
	readonly m_flFalloff: number
	readonly m_flAttenuation0: number
	readonly m_flAttenuation1: number
	readonly m_flAttenuation2: number
	readonly m_flTheta: number
	readonly m_flPhi: number
	readonly m_nCascades: number
	readonly m_bCastShadows: boolean
	readonly m_nShadowWidth: number
	readonly m_nShadowHeight: number
	readonly m_bRenderDiffuse: boolean
	readonly m_nRenderSpecular: number
	readonly m_flOrthoLightWidth: number
	readonly m_flOrthoLightHeight: number
	readonly m_nStyle: number
	readonly m_Pattern: string
	readonly m_flShadowCascadeDistance0: number
	readonly m_flShadowCascadeDistance1: number
	readonly m_flShadowCascadeDistance2: number
	readonly m_flShadowCascadeDistance3: number
	readonly m_nShadowCascadeResolution0: number
	readonly m_nShadowCascadeResolution1: number
	readonly m_nShadowCascadeResolution2: number
	readonly m_nShadowCascadeResolution3: number
	readonly m_nBakeLightIndex: number
	readonly m_flBakeLightIndexScale: number
	readonly m_bUsesIndexedBakedLighting: boolean
	readonly m_bRenderToCubemaps: boolean
	readonly m_nDirectLight: number
	readonly m_nIndirectLight: number
	readonly m_flFadeMinDist: number
	readonly m_flFadeMaxDist: number
	readonly m_flShadowFadeMinDist: number
	readonly m_flShadowFadeMaxDist: number
	readonly m_bEnabled: boolean
	readonly m_bFlicker: boolean
	readonly m_vPrecomputedBoundsMins: Vector
	readonly m_vPrecomputedBoundsMaxs: Vector
	readonly m_flPrecomputedMaxRange: number
	readonly m_vPrecomputePosition: Vector
	readonly m_vPrecomputeDirection: Vector
	readonly m_vPrecomputeUp: Vector
	readonly m_nFogLightingMode: number
	readonly m_flFogContributionStength: number
	readonly m_SkyColor: Color
	readonly m_flSkyIntensity: number
	readonly m_bLowerHemisphereIsBlack: boolean
	readonly m_SkyAmbientBounce: Color
	readonly m_bUnlitShadows: boolean
}

interface C_DOTA_Item_SacredRelic extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_HurlBoulder extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Alchemist_UnstableConcoctionThrow extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_fCookTime: number
	readonly m_vProjectileLoc: Vector
}

interface C_DOTA_Ability_NightStalker_Darkness extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Witch_Doctor_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chaos_Knight extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Viper_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Death_Prophet_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Legion_Commander_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Filler extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Medallion_Of_Courage extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Urn_Of_Shadows extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Dagon3 extends C_DOTA_Item_Recipe_Dagon {
	readonly type_name: string
}

interface C_DOTA_Item_PowerTreads extends C_DOTA_Item {
	readonly type_name: string
	readonly m_iStat: number
}

interface C_DOTA_Ability_Shadow_Demon_Soul_Catcher extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Weaver_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Broodmother_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvWindClientside extends C_BaseEntity {
	readonly type_name: string
	readonly m_EnvWindShared: C_CEnvWindShared
}

interface C_HandleTest extends C_BaseEntity {
	readonly type_name: string
	readonly m_Handle: C_BaseEntity
	readonly m_bSendHandle: boolean
}

interface C_DOTA_Unit_Hero_Oracle extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
}

interface C_DOTA_Ability_Obsidian_Destroyer_ArcaneOrb extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAWearableItem extends C_EconWearable {
	readonly type_name: string
	readonly m_hAdditionalWearable: C_BaseEntity
	readonly m_bOwnerModelChanged: boolean
	readonly m_bIsGeneratingEconItem: boolean
	readonly m_bIsItemVisibleOnGeneratedEntity: boolean
	readonly m_hDrawWearable: C_BaseEntity
	readonly m_bHiddenByCombiner: boolean
	readonly m_bIsPortrait: boolean
	readonly m_fZDelta: number
	readonly m_bCombinerMaterialOverrideListChanged: boolean
}

interface C_DOTA_Ability_Slithereen_Riptide extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Rubick_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Broodmother_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Night_Vision_500 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_175 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Mantle extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Skywrath_Mage_Concussive_Shot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly speed: number
	readonly slow_radius: number
	readonly damage: number
	readonly shot_vision: number
	readonly slow_duration: number
	readonly vision_duration: number
}

interface C_DOTA_Ability_Spectre_Dispersion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Beastmaster extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Enigma_Malefice extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Lich extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Troll_Warlord_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointClientUIWorldTextPanel extends C_PointClientUIWorldPanel {
	readonly type_name: string
	readonly m_messageText: string[]
}

interface C_DOTA_Ability_Invoker_ColdSnap extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Luna extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_PhantomAssassin_PhantomStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pugna_NetherBlast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Slardar extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Kunkka_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lycan_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chaos_Knight_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Disruptor_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Ward_Dispenser extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Bear_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Warlock_Fatal_Bonds extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Witch_Doctor_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Rubick extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tusk_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_70 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CAmbientCreatures extends C_DOTAWorldParticleSystem {
	readonly type_name: string
	readonly m_szAnimationName: string
}

interface C_DynamicPropClientside extends C_DynamicProp {
	readonly type_name: string
	readonly m_bSetupMaterialProxy: boolean
	readonly m_bNoInterpolate: boolean
}

interface C_DOTA_Item_ChainMail extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Meepo_Earthbind extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Brewmaster_SpellImmunity extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clockwerk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enchantress_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tidehunter extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Mjollnir extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Alchemist_GoblinsGreed extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Dazzle_ShadowWave extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iCurJumpCount: number
	readonly m_vCurTargetLoc: Vector
	readonly m_hHitEntities: C_BaseEntity[]
	readonly bounce_radius: number
	readonly damage_radius: number
	readonly damage: number
	readonly max_targets: number
}

interface C_DOTA_Ability_Warlock_Shadow_Word extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Centaur_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Silencer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Ring_Of_Basilius extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_AbyssalUnderlord_AtrophyAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_EarthSpirit_GeomagneticGrip extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hTarget: C_BaseEntity
}

interface C_DOTA_Ability_Leshrac_Lightning_Storm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Venomancer_PoisonSting extends C_DOTABaseAbility {
	readonly type_name: string
	readonly radius: number
}

interface C_DOTA_Item_Nian_Flag_Trap extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Alchemist_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Mana_Break_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Mekansm extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_LesserCritical extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Enchantress_NaturesAttendants extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Animation_RightClawSwipe extends C_DOTA_Ability_Animation_Attack {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Shaman_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spectre_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slark_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_PoorMansShield extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_EmberSpirit_SearingChains extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_SpellSteal extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_ActivityModifier: string[]
	readonly m_fStolenCastPoint: number
	readonly m_hStealTarget: C_BaseEntity
	readonly m_hStealAbility: C_BaseEntity
	readonly m_nFXIndex: number
}

interface C_DOTA_Unit_Broodmother_Web extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_vecOrigin: Vector
}

interface C_DOTA_Ability_Life_Stealer_Consume extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Slardar_Bash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_PhantomLancer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_SkeletonKing_MortalStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_AncientApparition_IceVortex extends C_DOTABaseAbility {
	readonly type_name: string
	readonly vision_aoe: number
}

interface C_DOTA_Item_Arcane_Boots extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Tether extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_hTarget: C_BaseEntity
	readonly m_vProjectileLocation: Vector
	readonly m_bProjectileActive: boolean
	readonly latch_distance: number
	readonly m_iProjectileIndex: number
}

interface C_DOTA_Ability_Enigma_MidnightPulse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Sven_Warcry extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAFogOfWarTempViewers extends C_BaseEntity {
	readonly type_name: string
	readonly m_FoWTempViewerVersion: number
	readonly m_TempViewerInfo: TempViewerInfo_t[]
	readonly m_dota_spectator_fog_of_war_last: number
}

interface CDOTA_Ability_Spawnlord_Master_Stomp extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Brewmaster_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_45 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Silver_Edge extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Skadi extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_GhostScepter extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Phoenix extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Tidehunter_Gush extends C_DOTABaseAbility {
	readonly type_name: string
	readonly gush_damage: number
}

interface C_DotaQuestBase extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Leshrac_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sand_King_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Arc_Warden_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Disruptor_StaticStorm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Jakiro_DualBreath extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Omniknight_GuardianAngel extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkSeer_Vacuum extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vPullLocation: Vector
}

interface C_DOTA_Ability_FacelessVoid_Backtrack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Roshan_Bash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Enigma extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Lich_FrostNova extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_CullingBlade extends C_DOTA_Ability_Axe_CullingBlade {
	readonly type_name: string
}

interface CDOTA_Ability_AncientApparition_ChillingTouch extends C_DOTABaseAbility {
	readonly type_name: string
	readonly radius: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Crystal_Maiden_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Outworld_Devourer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_75 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Sun extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_Overlay: C_SunGlowOverlay
	readonly m_GlowOverlay: C_SunGlowOverlay
	readonly m_vDirection: Vector
	readonly m_clrOverlay: Color
	readonly m_bOn: boolean
	readonly m_nSize: number
	readonly m_nOverlaySize: number
	readonly m_flHDRColorScale: number
}

interface C_FuncOccluder extends C_BaseModelEntity {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Iron_Talon extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Special_Bonus_Unique_Grimstroke_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bristleback_QuillSpray extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Slark_Pounce extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Disruptor_Glimpse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Zuus_ArcLightning extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_StormSpirit_BallLightning extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_bHasAutoRemnantTalent: boolean
	readonly m_fAutoRemnantInterval: number
	readonly ball_lightning_initial_mana_base: number
	readonly ball_lightning_initial_mana_percentage: number
	readonly ball_lightning_travel_cost_base: number
	readonly ball_lightning_travel_cost_percent: number
	readonly m_iProjectileID: number
	readonly m_vStartLocation: Vector
	readonly m_vProjectileLocation: Vector
	readonly m_fDistanceAccumulator: number
	readonly m_fTalentDistanceAccumulator: number
	readonly scepter_remnant_interval: number
}

interface C_DOTA_Ability_Greevil_Miniboss_Red_Overpower extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ghost_FrostAttack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_CentaurKhan_WarStomp extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Gib extends C_BaseAnimating {
	readonly type_name: string
	readonly m_flTouchDelta: number
}

interface C_DOTA_Ability_DoomBringer_InfernalBlade extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Spectre_Reality extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_VengefulSpirit extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Black_BrainSap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Huskar_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Kunkka_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PrecipitationBlocker extends C_BaseModelEntity {
	readonly type_name: string
}

interface C_PropHMDAvatar extends C_PropVRTrackedObject {
	readonly type_name: string
	readonly m_hLiteralControllerSlots: number[]
	readonly m_hLogicalControllerSlots: number[]
	readonly m_hVRControllers: C_BaseEntity[]
	readonly m_hCloseCaption: C_BaseEntity
	readonly m_bLocalHMDPoseValid: boolean
}

interface C_ColorCorrectionVolume extends C_BaseTrigger {
	readonly type_name: string
	readonly m_LastEnterWeight: number
	readonly m_LastEnterTime: number
	readonly m_LastExitWeight: number
	readonly m_LastExitTime: number
	readonly m_bEnabled: boolean
	readonly m_MaxWeight: number
	readonly m_FadeDuration: number
	readonly m_Weight: number
	readonly m_lookupFilename: string[]
}

interface C_DOTA_Ability_Courier_GoToSecretShop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lina_DragonSlave extends C_DOTABaseAbility {
	readonly type_name: string
	readonly dragon_slave_distance: number
}

interface C_DOTA_Ability_Razor_UnstableCurrent extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Mirana_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chaos_Knight_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Vladmir extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_MithrilHammer extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Batrider_StickyNapalm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ogre_Magi extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_BootsOfTravel_2 extends C_DOTA_Item_BootsOfTravel {
	readonly type_name: string
}

interface C_DOTA_Ability_BountyHunter_Jinada extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pugna_LifeDrain extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hTarget: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Skywrath_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_InfoPlayerStartGoodGuys extends C_InfoPlayerStartDota {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Centaur extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Relocate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndexEndTeam: number
	readonly m_nFXIndexChannel: number
	readonly cast_delay: number
	readonly return_time: number
}

interface C_DOTA_Ability_Roshan_SpellBlock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Throw_Coal extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Mirana_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tiny_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Undefined extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTATurboGameMode extends C_DOTABaseGameMode {
	readonly type_name: string
}

interface C_DotaSubquestBuyItems extends C_DotaSubquestBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nevermore_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Troll_Warlord_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Silencer_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Mana_Break_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_VR_BodyPart extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nBodyPart: number
	readonly m_unAccountID: number
	readonly m_nHatID: number
	readonly m_nSceneID: number
	readonly m_nAvatarMap: number
	readonly m_flLastThinkTime: number
}

interface CDOTA_Item_Lotus_Orb extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_TelekinesisLand extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Brewmaster extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_SpiritBreaker_stringgeOfDarkness extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_vstringgeStartPos: Vector
}

interface C_DOTA_BaseNPC_Venomancer_PlagueWard extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_angle: QAngle
	readonly m_iPoseParameterAim: number
}

interface C_DOTA_Ability_Creature_Fire_Breath extends C_DOTABaseAbility {
	readonly type_name: string
	readonly speed: number
	readonly projectile_count: number
	readonly rotation_angle: number
	readonly damage: number
	readonly radius: number
	readonly ctTimer: CountdownTimer
	readonly m_vecStartRot: Vector
	readonly m_vecEndRot: Vector
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spectre_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_HallofFame extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
	readonly m_HallofFame: number
}

interface C_DOTA_BaseNPC_Effigy_BattleCup extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface C_DOTA_Item_Kaya extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_GlimmerCape extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_HeavensHalberd extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_OblivionStaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_IronwoodBranch extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_ThunderClap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Life_Stealer_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Juggernaut_BladeDance extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Viper_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Storm_Spirit_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Urn_Of_Shadows extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_AbyssalBlade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_EmberSpirit_FireRemnant extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vRemnantData: RemnantData_t[]
	readonly max_stringges: number
}

interface C_DOTA_Ability_Disruptor_Thunder_Strike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Broodmother_SpinWeb_Destroy extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Furion_Sprout extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Frenzy extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Brewmaster_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Func_Dust extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_Color: Color
	readonly m_SpawnRate: number
	readonly m_SpeedMax: number
	readonly m_flSizeMin: number
	readonly m_flSizeMax: number
	readonly m_DistMax: number
	readonly m_LifetimeMin: number
	readonly m_LifetimeMax: number
	readonly m_FallSpeed: number
	readonly m_DustFlags: number
}

interface C_DOTA_Ability_Phoenix_IcarusDive extends C_DOTABaseAbility {
	readonly type_name: string
	readonly hp_cost_perc: number
}

interface C_DOTA_Ability_Phoenix_SunRay extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_EarthSpirit_RollingBoulder extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly radius: number
	readonly speed: number
	readonly rock_speed: number
	readonly damage: number
	readonly distance: number
	readonly rock_distance: number
	readonly slow_duration: number
	readonly m_nFXIndex: number
	readonly m_boulderSetposBool: boolean
	readonly m_nProjectileID: number
	readonly m_vStartingLocation: Vector
	readonly m_vProjectileLocation: Vector
	readonly m_vDir: Vector
	readonly m_vVel: Vector
	readonly m_bUsedStone: boolean
}

interface C_DOTA_Ability_Visage_GraveChill extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_SpiritBear extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_bShouldRespawn: boolean
	readonly m_bStolen: boolean
}

interface C_DOTA_Unit_Hero_Lycan extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Riki_TricksOfTheTrade extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_MudGolem_RockDestroy extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Antimage_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Luna_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Puck_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PropVRHand extends C_PropVRTrackedObject {
	readonly type_name: string
	readonly m_hActiveHandAttachment: C_BaseEntity
	readonly m_hHMDAvatar: C_BaseEntity
	readonly m_hAttachments: C_BaseVRHandAttachment[]
	readonly m_bInitialized: boolean
	readonly m_bIsInView: boolean
	readonly m_nHandID: number
	readonly m_flTriggerAnalogValue: number
	readonly m_flGripAnalogValue: number
	readonly m_flFinger0: number
	readonly m_flFinger1: number
	readonly m_flFinger2: number
	readonly m_flFinger3: number
	readonly m_flFinger4: number
	readonly m_flTrackpadAnalogValueX: number
	readonly m_flTrackpadAnalogValueY: number
	readonly m_flJoystickAnalogValueX: number
	readonly m_flJoystickAnalogValueY: number
	readonly m_bCanPerformUse: boolean
	readonly m_bTipTransformInitialized: boolean
	readonly m_localTipOrigin: Vector
	readonly m_localTipAngles: QAngle
	readonly m_flHapticPulseTime: number
	readonly m_nHapticPulseInterval: number
	readonly m_InteractionMgr: CInteractionManager
	readonly m_matUseTransform: matrix3x4_t
	readonly m_nAttachUseIndex: number
	readonly m_matHoldTransform: matrix3x4_t
	readonly m_nAttachHoldIndex: number
	readonly m_LiteralHandType: number
}

interface CDOTA_Ability_Pudge_MeatHook extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly m_nConsecutiveHits: number
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Soul_Ring extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Earth_Spirit_Stone extends C_DOTA_BaseNPC {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_SummonWolves extends C_DOTABaseAbility {
	readonly type_name: string
	readonly szUnitName: string[]
	readonly wolf_index: number
	readonly wolf_duration: number
	readonly m_hExistingUnits: C_BaseEntity[]
}

interface C_DOTA_Ability_Tinker_Rearm extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vProjectileLocation: Vector
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bane_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Magnus_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_175 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_55 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_225 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Beastmaster_Beasts extends C_DOTA_BaseNPC_Creep_Talking {
	readonly type_name: string
}

interface CDamageComponent extends CEntityComponent {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_EmberSpirit extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nevermore_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tiny extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Keeper_of_the_Light_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_StoutShield extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_FireSpirits extends C_DOTABaseAbility {
	readonly type_name: string
	readonly hp_cost_perc: number
}

interface C_DOTA_Ability_Luna_Eclipse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_PhantomAssassin extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
	readonly m_nArcanaLevel: number
}

interface C_DOTA_Ability_Warlock_Golem_Flaming_Fists extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_ReturnToBase extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Riki_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_20_Crit_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_SuperBlinkDagger extends C_DOTA_Item_BlinkDagger {
	readonly type_name: string
}

interface CDOTA_Ability_Techies_Minefield_Sign extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly aura_radius: number
}

interface C_DOTA_Unit_Hero_QueenOfPain extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Kunkka extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Razor_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Func_LOD extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nDisappearMinDist: number
	readonly m_nDisappearMaxDist: number
}

interface CDOTA_Ability_AbyssalUnderlord_PitOfMalice extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface C_DOTA_Unit_Hero_Chen extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Rubick_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Legion_Commander_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Vision_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_HeavensHalberd extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Axe_CounterHelix extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clockwerk_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DotaTutorialNetworker extends C_BaseEntity {
	readonly type_name: string
	readonly m_nTutorialState: number
	readonly m_nTaskProgress: number
	readonly m_nTaskSteps: number
	readonly m_nTaskSecondsRemianing: number
	readonly m_nUIState: number
	readonly m_nShopState: number
	readonly m_TargetLocation: Vector
	readonly m_TargetEntity: C_BaseEntity
	readonly m_SpeechBubbles: C_SpeechBubbleInfo[]
	readonly m_nLocationID: number
	readonly m_GuideStr: string[]
	readonly m_QuickBuyStr: string[]
	readonly m_nPreTutorialState: number
	readonly m_nPreUIState: number
	readonly m_nPreShopState: number
	readonly m_vecPrevTargetLocation: Vector
	readonly m_hPrevTargetEntity: C_BaseEntity
}

interface C_DOTA_Item_Smoke_Of_Deceit extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Shadow_Demon_Shadow_Poison_Release extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Jakiro_Liquid_Fire extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Weaver_Shukuchi extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
	readonly radius: number
	readonly damage: number
	readonly fade_time: number
}

interface C_DOTA_Ability_Broodmother_PoisonSting extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Tinker_MarchOfTheMachines extends C_DOTABaseAbility {
	readonly type_name: string
	readonly splash_radius: number
}

interface C_DOTA_Ability_Greevil_Miniboss_Purple_PlagueWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Oracle_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lifestealer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FuncLadder extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_vecLadderDir: Vector
	readonly m_Dismounts: C_InfoLadderDismount[]
	readonly m_vecLocalTop: Vector
	readonly m_vecPlayerMountPositionTop: Vector
	readonly m_vecPlayerMountPositionBottom: Vector
	readonly m_flAutoRideSpeed: number
	readonly m_bDisabled: boolean
	readonly m_bFakeLadder: boolean
	readonly m_bHasSlack: boolean
}

interface C_DOTA_BaseNPC_Invoker_Forged_Spirit extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
}

interface C_DOTA_Ability_DrowRanger_WaveOfSilence extends C_DOTABaseAbility {
	readonly type_name: string
	readonly wave_width: number
	readonly wave_speed: number
	readonly m_iProjectile: number
	readonly silence_duration: number
	readonly knockback_distance_max: number
	readonly m_nHeroesHit: number
}

interface CDOTA_Item_Hurricane_Pike extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Tusk_Snowball extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly snowball_windup_radius: number
	readonly snowball_radius: number
	readonly snowball_grow_rate: number
	readonly snowball_damage: number
	readonly snowball_damage_bonus: number
	readonly stun_duration: number
	readonly bonus_damage: number
	readonly bonus_stun: number
	readonly snowball_speed: number
	readonly snowball_duration: number
	readonly m_vProjectileLocation: Vector
	readonly m_hSnowballedUnits: C_BaseEntity[]
	readonly m_nFXIndex: number
	readonly ctSnowball: CountdownTimer
	readonly m_bSpeakAlly: boolean
	readonly m_bIsExpired: boolean
	readonly m_bInWindup: boolean
	readonly m_hPrimaryTarget: C_BaseEntity
	readonly m_nContainedValidUnits: number
	readonly m_bEndingSnowball: boolean
}

interface C_DOTA_Ability_Invoker_DeafeningBlast extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
	readonly end_vision_duration: number
	readonly damage: number
	readonly knockback_duration: number
	readonly disarm_duration: number
}

interface C_DOTA_Ability_FacelessVoid_TimeDilation extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_TI7 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Centaur_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necronomicon_Archer_ManaBurn extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_TeleportScroll extends C_DOTA_Item {
	readonly type_name: string
	readonly m_nFXOrigin: number
	readonly m_nFXDestination: number
	readonly m_vDestination: Vector
	readonly m_iMinDistance: number
	readonly m_flExtraTeleportTime: number
}

interface C_DOTA_Item_Broadsword extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_BootsOfElven extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Viper_Nethertoxin extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Slardar_Slithereen_Crush extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Lina extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PortraitHero extends C_DOTA_BaseNPC {
	readonly type_name: string
	readonly m_nHeroID: number
	readonly m_actQueuedActivity: number
	readonly m_szQueuedActivityModifier: string[]
}

interface C_DOTA_Item_Headdress extends C_DOTA_Item {
	readonly type_name: string
}

interface C_EnvVolumetricFogController extends C_BaseEntity {
	readonly type_name: string
	readonly m_flScattering: number
	readonly m_flAnisotropy: number
	readonly m_flFadeSpeed: number
	readonly m_flDrawDistance: number
	readonly m_flIndirectStrength: number
	readonly m_nIndirectTextureDimX: number
	readonly m_nIndirectTextureDimY: number
	readonly m_nIndirectTextureDimZ: number
	readonly m_vBoxMins: Vector
	readonly m_vBoxMaxs: Vector
	readonly m_bActive: boolean
	readonly m_flStartAnisoTime: number
	readonly m_flStartScatterTime: number
	readonly m_flStartDrawDistanceTime: number
	readonly m_flStartAnisotropy: number
	readonly m_flStartScattering: number
	readonly m_flStartDrawDistance: number
	readonly m_flDefaultAnisotropy: number
	readonly m_flDefaultScattering: number
	readonly m_flDefaultDrawDistance: number
	readonly m_bStartDisabled: boolean
	readonly m_bEnableIndirect: boolean
	readonly m_nNoiseType: number
	readonly m_vNoiseMovementDirectionA: Vector
	readonly m_vNoiseMovementDirectionB: Vector
	readonly m_flNoiseScale: number
	readonly m_flNoiseMovementSpeedA: number
	readonly m_flNoiseMovementSpeedB: number
	readonly m_flNoiseStrength: number
	readonly m_flNoiseContrast: number
	readonly m_bFirstTime: boolean
}

interface C_DOTA_Item_Orb_of_Venom extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Eaglehorn extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Shadow_Demon_Disruption extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hDisruptedUnit: C_BaseEntity
}

interface C_DOTA_Ability_Special_Bonus_Unique_Jakiro extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Luna_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ember_Spirit_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tusk_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Necronomicon_2 extends C_DOTA_Item_Recipe_Necronomicon {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_TranquilBoots extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_WitchDoctor extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_CrystalMaiden_FreezingField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_AncientApparition_IceBlast_Release extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_UpgradedBarricade extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bounty_Hunter_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slark_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_SlideshowDisplay extends C_BaseEntity {
	readonly type_name: string
	readonly m_bEnabled: boolean
	readonly m_szDisplayText: string[]
	readonly m_szSlideshowDirectory: string
	readonly m_fMinSlideTime: number
	readonly m_fMaxSlideTime: number
	readonly m_iCycleType: number
	readonly m_bNoListRepeats: boolean
	readonly m_chCurrentSlideLists: number[]
	readonly m_SlideMaterialLists: SlideMaterialList_t[]
	readonly m_iCurrentSlideIndex: number
	readonly m_NextSlideTime: number
	readonly m_iCurrentSlideList: number
	readonly m_iCurrentSlide: number
}

interface CDOTA_Item_RiverPainter3 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Unit_VisageFamiliar extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_nFXAmbient: number
}

interface C_DOTA_Ability_Sniper_Assassinate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hTarget: C_BaseEntity
	readonly m_iIndex: number
	readonly scepter_radius: number
}

interface C_DOTA_Ability_PhantomLancer_SpiritLance extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hHitEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_ForestTrollHighPriest_ManaAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bounty_Hunter_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_ManaLeak extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Obsidian_Destroyer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
}

interface C_DOTASpecGraphPlayerData extends C_BaseEntity {
	readonly type_name: string
	readonly m_rgGoldPerMinute: number[]
	readonly m_rgXPPerMinute: number[]
	readonly m_nCreatedByPlayerID: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Omniknight_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Crystal_Maiden_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_20_Bash_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAMinimapBoundary extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon_Upgraded extends C_DOTA_Item_Dagon {
	readonly type_name: string
}

interface C_DOTA_Ability_Warlock_Upheaval extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vPosition: Vector
	readonly aoe: number
	readonly slow_rate: number
	readonly slow_rate_duration: number
	readonly duration: number
	readonly max_slow: number
	readonly m_flCurrentSlow: number
	readonly m_nFXIndex: number
	readonly m_SlowTimer: CountdownTimer
	readonly m_timer: CountdownTimer
}

interface C_DOTA_NPC_WitchDoctor_Ward extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_nFXSkullIndex: number
	readonly m_nTargetType: number
	readonly m_nTargetFlags: number
}

interface C_DOTA_Ability_CrystalMaiden_Frostbite extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earthshaker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Death_Prophet extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_13 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_TimberChain extends C_DOTABaseAbility {
	readonly type_name: string
	readonly chain_radius: number
	readonly m_nFXIndex: number
	readonly m_vProjectileVelocity: Vector
	readonly m_bRetract: boolean
}

interface C_DOTA_Wisp_Spirit extends C_DOTA_BaseNPC {
	readonly type_name: string
}

interface CDOTA_Ability_Nyx_Assassin_Burrow extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nSpellStartFXIndex: number
	readonly m_nPhaseStartFXIndex: number
}

interface C_DOTA_Unit_Hero_Tiny extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_hTreeWearable: C_BaseEntity
	readonly m_nFXIndexScepterAmbient: number
	readonly m_hIllusionOwner: C_BaseEntity
}

interface C_DOTA_Unit_Hero_SkeletonKing extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nSkeletonWarriors: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Outworld_Devourer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chen_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_175 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointHintUIHighlightModel extends C_BaseAnimating {
	readonly type_name: string
	readonly m_vecRenderModelComponentTransforms: matrix3x4a_t[]
	readonly m_nTrackedDeviceIndex: number
	readonly m_matLocalHighlight: matrix3x4_t
}

interface C_DOTA_Item_Soul_Ring extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_RodOfAtos extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Terrorblade extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
	readonly m_szResponseCriteria: string
	readonly m_nArcanaColor: number
}

interface C_DOTA_Ability_VengefulSpirit_Nether_Swap extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
	readonly m_hScepterIllusion: C_BaseEntity
}

interface C_DOTA_Unit_Hero_AntiMage extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Rubick_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_MaskOfMadness extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_Reactive_Armor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_BlackDragon_Fireball extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FireSprite extends C_Sprite {
	readonly type_name: string
	readonly m_vecMoveDir: Vector
	readonly m_bFadeFromAbove: boolean
}

interface C_DOTA_Ability_LoneDruid_SpiritBear_Entangle extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Apocalypse extends C_DOTABaseAbility {
	readonly type_name: string
	readonly area_of_effect: number
	readonly m_nfxIndex_roar: number
	readonly fire_interval: number
	readonly delay: number
	readonly target_range: number
	readonly m_ctTimer: CountdownTimer
	readonly m_flTiming: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clinkz_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_300 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Night_Vision_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FuncDistanceOccluder extends C_FuncOccluder {
	readonly type_name: string
	readonly m_flFadeStartDist: number
	readonly m_flFadeEndDist: number
	readonly m_flTranslucencyLimit: number
	readonly m_hAttachedOccluder: C_BaseEntity
}

interface C_DOTA_Item_WraithBand extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Magnataur extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tinker extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_13 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_65 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Shredder_ReturnChakramAlias_shredder_return_chakram_2 extends C_DOTA_Ability_Shredder_ReturnChakram {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_SpiritForm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slardar_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_TriggerPlayerMovement extends C_BaseTrigger {
	readonly type_name: string
	readonly m_pNext: C_TriggerPlayerMovement
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pudge_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clockwerk_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_SDKTower extends C_DOTA_BaseNPC_HoldoutTower {
	readonly type_name: string
}

interface CDOTA_Item_RiverPainter7 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Item_TalismanOfEvasion extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Obsidian_Destroyer_EssenceAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_WitchDoctor_ParalyzingCask extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iBounces: number
	readonly bounces: number
}

interface C_DOTA_Ability_Mirana_Leap extends C_DOTABaseAbility {
	readonly type_name: string
	readonly stringge_restore_time: number
	readonly max_stringges: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Zeus extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAAbilityDraftGameMode extends C_DOTATurboGameMode {
	readonly type_name: string
}

interface C_DOTA_PortraitBuilding extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nAmbientFXIndex: number
	readonly m_ParticleTintColor: Color
}

interface CDOTA_Item_Recipe_EchoSabre extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Bloodstone extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_TrollWarlord_BerserkersRage extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iOriginalAttackCapabilities: number
}

interface C_DOTA_Item_ForceBoots extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Shaman_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Huskar extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_700 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointClientUIHUD extends C_BaseClientUIEntity {
	readonly type_name: string
	readonly m_bCheckCSSClasses: boolean
	readonly m_bIgnoreInput: boolean
	readonly m_flWidth: number
	readonly m_flHeight: number
	readonly m_flDPI: number
	readonly m_flInteractDistance: number
	readonly m_flDepthOffset: number
	readonly m_unOwnerContext: number
	readonly m_unHorizontalAlign: number
	readonly m_unVerticalAlign: number
	readonly m_unOrientation: number
	readonly m_bAllowInteractionFromAllSceneWorlds: boolean
	readonly m_vecCSSClasses: string[]
}

interface C_TeamplayRoundBasedRulesProxy extends C_GameRulesProxy {
	readonly type_name: string
	readonly m_pTeamplayRoundBasedRules: C_TeamplayRoundBasedRules
}

interface C_FuncTrackTrain extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nLongAxis: number
	readonly m_flRadius: number
	readonly m_flLineLength: number
}

interface C_DOTA_Item_OrchidMalevolence extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Nyx_Assassin_ManaBurn extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Silencer_LastWord extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_Multishot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vStartPos: Vector
	readonly m_iArrowProjectile: number
	readonly m_nFXIndex: number
	readonly arrow_width: number
	readonly arrow_speed: number
	readonly arrow_range: number
	readonly arrow_spread: number
	readonly arrow_count: number
	readonly m_bShouldReduceDamage: boolean
	readonly m_vHitTargets: C_BaseEntity[]
}

interface C_DOTA_Ability_Special_Bonus_Unique_Juggernaut_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pudge_FleshHeap extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iKills: number
}

interface C_DOTA_Item_Bloodthorn extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Alacrity extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Furion_ForceOfNature extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_RoshanSpawner extends C_PointEntity {
	readonly type_name: string
}

interface C_DOTA_Ability_Pudge_Rot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly rot_damage: number
	readonly m_flLastRotTime: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Huskar_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Tombstone_Drop extends C_DOTA_Item_Physical {
	readonly type_name: string
}

interface C_PostProcessController extends C_BaseEntity {
	readonly type_name: string
	readonly m_fLocalContrastStrength: number
	readonly m_fLocalContrastEdgeStrength: number
	readonly m_fVignetteStart: number
	readonly m_fVignetteEnd: number
	readonly m_fVignetteBlurStrength: number
	readonly m_fFadeToBlackStrength: number
	readonly m_fGrainStrength: number
	readonly m_fTopVignetteStrength: number
	readonly m_fFadeTime: number
	readonly m_bMaster: boolean
}

interface C_DevtestHierarchyChild extends C_DynamicProp {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Sange extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Perseverance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Brewmaster_PrimalFire extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_nFXAmbient: number
}

interface C_DOTA_Ability_Furion_WrathOfNature extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_ServerRagdoll extends C_BaseAnimating {
	readonly type_name: string
	readonly m_ragPos: Vector[]
	readonly m_ragAngles: QAngle[]
	readonly m_flBlendWeight: number
	readonly m_hRagdollSource: C_BaseEntity
	readonly m_iEyeAttachment: number
	readonly m_flBlendWeightCurrent: number
	readonly m_parentPhysicsBoneIndices: number[]
	readonly m_worldSpaceBoneComputationOrder: number[]
}

interface C_DOTA_Item_Recipe_Pipe extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Techies_FocusedDetonate extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Undying_Tombstone_Zombie_DeathStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_TrueForm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_CallOfTheWild_Hawk_Invisibility extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necrolyte_ReapersScythe extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_BeltOfStrength extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DeathProphet_Witchcraft extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DrowRanger_Marksmanship extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_GodsStrength extends C_DOTA_Ability_Sven_GodsStrength {
	readonly type_name: string
}

interface C_DOTA_Ability_AntiMage_SpellShield extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Throw_Snowball extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lycan_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Brewmaster extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_13 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Perseverance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Ursa_Fury_Swipes extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Windrunner_FocusFire extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_StormSpirit extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Beastmaster_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_250 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Treant_LivingArmor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Animation_LeftClawSwipe extends C_DOTA_Ability_Animation_Attack {
	readonly type_name: string
}

interface C_DOTA_Ability_Sniper_TakeAim extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Spawnlord_Master_Bash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Antimage_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nyx extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CInfoDynamicShadowHint extends C_PointEntity {
	readonly type_name: string
	readonly m_bDisabled: boolean
	readonly m_flRange: number
	readonly m_nImportance: number
	readonly m_hLight: C_BaseEntity
}

interface CDOTA_Ability_Centaur_Stampede extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
	readonly base_damage: number
	readonly strength_damage: number
	readonly slow_duration: number
	readonly m_hHitEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_NightStalker_CripplingFear extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Tinker_Laser extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vProjectileLocation: Vector
	readonly bBlocked: boolean
	readonly m_hHitEntities: C_BaseEntity[]
}

interface C_DOTA_Unit_Hero_Bloodseeker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Shadowraze3 extends C_DOTA_Ability_Nevermore_Shadowraze {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Necrophos extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tusk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_80 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Legion_Commander_MomentOfCourage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Elder_Titan_NaturalOrder extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Undying_Zombie extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_ctRespawn: CountdownTimer
	readonly m_pTombstone: C_DOTA_BaseNPC
}

interface C_DOTA_Unit_Hero_DoomBringer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Ursa extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Windrunner_Powershot extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_fStartTime: number
	readonly m_fPower: number
	readonly m_iProjectile: number
	readonly damage_reduction: number
	readonly arrow_width: number
	readonly powershot_damage: number
	readonly tree_width: number
	readonly m_bAwardedKillEater: boolean
	readonly m_nHeroesHit: number
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bloodseeker extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Broodmother_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_16 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_45 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_MagicStick extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_HelmOfIronWill extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Oracle_FatesEdict extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_bTargetIsAlly: boolean
}

interface C_DOTA_Unit_Hero_DeathProphet extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Riki_SmokeScreen extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AlphaWolf_CommandAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Day_Vision_400 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_80 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_LightDirectionalEntity extends C_LightEntity {
	readonly type_name: string
}

interface C_EnvCubemap extends C_BaseEntity {
	readonly type_name: string
	readonly m_bCustomCubemapTexture: boolean
	readonly m_flInfluenceRadius: number
	readonly m_vBoxProjectMins: Vector
	readonly m_vBoxProjectMaxs: Vector
	readonly m_LightGroups: string
	readonly m_bStatic: boolean
	readonly m_nHandshake: number
	readonly m_nIndoorOutdoorLevel: number
	readonly m_bStartDisabled: boolean
	readonly m_bEnabled: boolean
}

interface C_DOTA_Item_Recipe_Cyclone extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_Battlefury extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Javelin extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Abaddon_AphoticShield extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Gyrocopter extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_Bloodseeker_Bloodbath extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Presence extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Mana_Break_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Octarine_Core extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Maelstrom extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Shivas_Guard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Quas extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_QueenOfPain_SonicWave extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_fStartTime: number
	readonly m_fTotalTime: number
	readonly starting_aoe: number
	readonly final_aoe: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Weaver_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_75 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PortraitWorldPet extends C_DynamicProp {
	readonly type_name: string
}

interface CDOTA_Item_Medallion_Of_Courage extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Grimstroke_SoulChain extends C_DOTABaseAbility {
	readonly type_name: string
	readonly chain_duration: number
	readonly chain_latch_radius: number
	readonly creep_duration_pct: number
}

interface C_DOTA_Ability_Viper_PoisonAttack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Pugna_NetherWard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nevermore_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Troll_Warlord_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Storm_Spirit_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTACameraBounds extends C_BaseEntity {
	readonly type_name: string
	readonly m_vecBoundsMin: Vector
	readonly m_vecBoundsMax: Vector
}

interface C_EnvDOFController extends C_PointEntity {
	readonly type_name: string
	readonly m_bDOFEnabled: boolean
	readonly m_flNearBlurDepth: number
	readonly m_flNearFocusDepth: number
	readonly m_flFarFocusDepth: number
	readonly m_flFarBlurDepth: number
	readonly m_flNearBlurRadius: number
	readonly m_flFarBlurRadius: number
}

interface C_DOTA_Ability_Brewmaster_DrunkenHaze extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Rattletrap extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Whirlpool extends C_DOTABaseAbility {
	readonly type_name: string
	readonly pool_count: number
	readonly min_distance: number
	readonly max_distance: number
	readonly pull_radius: number
	readonly fire_interval: number
	readonly m_ctTimer: CountdownTimer
	readonly m_flTiming: number
}

interface C_DOTA_Ability_Lion_Voodoo extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lina_LightStrikeArray extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_ZeusCloud extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Antimage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointValueRemapper extends C_BaseEntity {
	readonly type_name: string
	readonly m_bDisabled: boolean
	readonly m_bDisabledOld: boolean
	readonly m_bUpdateOnClient: boolean
	readonly m_nInputType: number
	readonly m_hRemapLineStart: C_BaseEntity
	readonly m_hRemapLineEnd: C_BaseEntity
	readonly m_flMaximumChangePerSecond: number
	readonly m_flDisengageDistance: number
	readonly m_flEngageDistance: number
	readonly m_bRequiresUseKey: boolean
	readonly m_nOutputType: number
	readonly m_hOutputEntities: C_BaseEntity[]
	readonly m_nHapticsType: number
	readonly m_nMomentumType: number
	readonly m_flMomentumModifier: number
	readonly m_flSnapValue: number
	readonly m_flCurrentMomentum: number
	readonly m_nRatchetType: number
	readonly m_flRatchetOffset: number
	readonly m_flInputOffset: number
	readonly m_bEngaged: boolean
	readonly m_bFirstUpdate: boolean
	readonly m_flPreviousValue: number
	readonly m_flPreviousUpdateTickTime: number
}

interface CDOTA_Item_Guardian_Greaves extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ShadowShamanVoodoo extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bloodseeker_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Chen_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvCubemapBox extends C_EnvCubemap {
	readonly type_name: string
}

interface C_DOTA_Ability_Clinkz_WindWalk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Sphere extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_InvisibilityEdge extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Butterfly extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Magnus extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Night_Vision_1000 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Item_Recipe_TranquilBoots2 extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Grimstroke extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
}

interface C_DOTA_Ability_NagaSiren_Ensnare extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_CrystalMaiden_BrillianceAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Undying extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_251 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PhysBox extends C_Breakable {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Armlet extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_SkeletonKing_VampiricAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Mirana_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointHMDAnchor extends C_BaseEntity {
	readonly type_name: string
	readonly m_bDisabled: boolean
	readonly m_flEnableTime: number
	readonly m_nPlayerIndex: number
}

interface C_DOTA_Item_SheepStick extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_TrollWarlord_BattleTrance extends C_DOTABaseAbility {
	readonly type_name: string
	readonly trance_duration: number
}

interface C_DOTA_Ability_KeeperOfTheLight_ChakraMagic extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DoomBringer_Devour extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ursa_Enrage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Skywrath_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_160 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_BootsOfSpeed extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Elder_Titan_EchoStomp extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndexTitan: number
	readonly m_nFXIndexSpirit: number
	readonly m_nFXIndexTitanB: number
	readonly m_nFXIndexSpiritB: number
	readonly radius: number
	readonly stomp_damage: number
	readonly sleep_duration: number
	readonly cast_time: number
	readonly m_vecStompedHeroes: C_BaseEntity[]
	readonly m_bStompedInvisibleHero: boolean
}

interface C_DOTA_Ability_NagaSiren_MirrorImage extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hIllusions: C_BaseEntity[]
}

interface C_DOTA_Unit_Hero_Silencer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Weaver_TheSwarm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_BountyHunter_ShurikenToss extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hHitEntities: C_BaseEntity[]
	readonly m_hHitEntitiesScepter: C_BaseEntity[]
}

interface C_DOTA_Unit_Hero_DarkSeer extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Waterball extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_ctTimer: CountdownTimer
	readonly m_hEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_OgreMagi_FrostArmor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BasePlayer extends C_BaseCombatCharacter {
	readonly type_name: string
	readonly m_vecFlashlightOrigin: Vector
	readonly m_vecFlashlightForward: Vector
	readonly m_vecFlashlightUp: Vector
	readonly m_vecFlashlightRight: Vector
	readonly m_currentSCLPacked: number
	readonly m_bBehindLocalPlayer: boolean
	readonly m_nBehindLocalPlayerFrame: number
	readonly m_CurrentFog: fogparams_t
	readonly m_hOldFogController: C_BaseEntity
	readonly m_bOverrideFogColor: boolean[]
	readonly m_OverrideFogColor: Color[]
	readonly m_bOverrideFogStartEnd: boolean[]
	readonly m_fOverrideFogStart: number[]
	readonly m_fOverrideFogEnd: number[]
	readonly m_StuckLast: number
	readonly m_Local: C_PlayerLocalData
	readonly m_hTonemapController: C_BaseEntity
	readonly m_pl: C_PlayerState
	readonly m_iFOV: number
	readonly m_iFOVStart: number
	readonly m_afButtonLast: number
	readonly m_afButtonPressed: number
	readonly m_afButtonReleased: number
	readonly m_nButtons: number
	readonly m_nImpulse: number
	readonly m_flPhysics: number
	readonly m_flFOVTime: number
	readonly m_flWaterJumpTime: number
	readonly m_flSwimSoundTime: number
	readonly m_flStepSoundTime: number
	readonly m_surfaceFriction: number
	readonly m_vecLadderNormal: Vector
	readonly m_szAnimExtension: string[]
	readonly m_nOldTickBase: number
	readonly m_iBonusProgress: number
	readonly m_iBonusChallenge: number
	readonly m_flMaxspeed: number
	readonly m_hZoomOwner: C_BaseEntity
	readonly m_hVehicle: C_BaseEntity
	readonly m_hLastWeapon: C_BaseEntity
	readonly m_hViewModel: C_BaseEntity[]
	readonly m_hPropHMDAvatar: C_BaseEntity
	readonly m_hPointHMDAnchor: C_BaseEntity
	readonly m_VRControllerType: number
	readonly m_fOnTarget: boolean
	readonly m_iDefaultFOV: number
	readonly m_afButtonDisabled: number
	readonly m_afButtonForced: number
	readonly m_hViewEntity: C_BaseEntity
	readonly m_hConstraintEntity: C_BaseEntity
	readonly m_vecConstraintCenter: Vector
	readonly m_flConstraintRadius: number
	readonly m_flConstraintWidth: number
	readonly m_flConstraintSpeedFactor: number
	readonly m_bConstraintPastRadius: boolean
	readonly m_iObserverMode: number
	readonly m_hObserverTarget: C_BaseEntity
	readonly m_flObserverChaseDistance: number
	readonly m_vecFreezeFrameStart: Vector
	readonly m_flFreezeFrameStartTime: number
	readonly m_flFreezeFrameDistance: number
	readonly m_bStartedFreezeFraming: boolean
	readonly m_bFinishedFreezeFraming: boolean
	readonly m_flDeathTime: number
	readonly m_hOldVehicle: C_BaseEntity
	readonly m_hUseEntity: C_BaseEntity
	readonly m_hHeldEntity: C_BaseEntity
	readonly m_vecWaterJumpVel: Vector
	readonly m_vecOldViewAngles: QAngle
	readonly m_bWasFrozen: boolean
	readonly m_nTickBase: number
	readonly m_nFinalPredictedTick: number
	readonly m_bFlashlightEnabled: boolean[]
	readonly m_flOldPlayerZ: number
	readonly m_flOldPlayerViewOffsetZ: number
	readonly m_vecVehicleViewOrigin: Vector
	readonly m_vecVehicleViewAngles: QAngle
	readonly m_flVehicleViewFOV: number
	readonly m_nVehicleViewSavedFrame: number
	readonly m_CommandContext: C_CommandContext
	readonly m_flWaterSurfaceZ: number
	readonly m_bResampleWaterSurface: boolean
	readonly m_tWaterParticleTimer: TimedEvent
	readonly m_bPlayerUnderwater: boolean
	readonly m_ArmorValue: number
	readonly m_flNextAvoidanceTime: number
	readonly m_flAvoidanceRight: number
	readonly m_flAvoidanceForward: number
	readonly m_flAvoidanceDotForward: number
	readonly m_flAvoidanceDotRight: number
	readonly m_flLaggedMovementValue: number
	readonly m_vecPredictionError: Vector
	readonly m_flPredictionErrorTime: number
	readonly m_vecPreviouslyPredictedOrigin: Vector
	readonly m_szLastPlaceName: string[]
	readonly m_chTextureType: string
	readonly m_bSentFreezeFrame: boolean
	readonly m_flFreezeZOffset: number
	readonly m_hSplitScreenPlayers: C_BasePlayer[]
	readonly m_nSplitScreenSlot: CSplitScreenSlot
	readonly m_hSplitOwner: C_BaseEntity
	readonly m_bIsLocalPlayer: boolean
	readonly m_movementCollisionNormal: Vector
	readonly m_groundNormal: Vector
	readonly m_vOldOrigin: Vector
	readonly m_flOldSimulationTime: number
	readonly m_stuckCharacter: C_BaseEntity
	readonly m_hPostProcessCtrl: C_BaseEntity
	readonly m_hColorCorrectionCtrl: C_BaseEntity
	readonly m_PlayerFog: C_fogplayerparams_t
	readonly m_vecElevatorFixup: Vector
	readonly m_nUnHoldableButtons: number
}

interface C_DOTA_Ability_Magnataur_Skewer extends C_DOTABaseAbility {
	readonly type_name: string
	readonly skewer_radius: number
	readonly skewer_speed: number
	readonly range: number
	readonly tree_radius: number
	readonly m_nTargetsHit: number
}

interface C_DOTA_Ability_Wisp_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_KeeperOfTheLight_Illuminate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_fStartTime: number
	readonly m_fPower: number
	readonly m_iProjectile: number
	readonly m_nFXIndex: number
	readonly m_nFXIndexB: number
	readonly m_vPos: Vector
	readonly damage_per_second: number
	readonly m_bStarted: boolean
}

interface C_DOTA_Ability_DeathProphet_CarrionSwarm extends C_DOTABaseAbility {
	readonly type_name: string
	readonly start_radius: number
	readonly end_radius: number
	readonly m_fStartTime: number
	readonly m_fTotalTime: number
	readonly m_nProjectileHandle: number
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Morphling_Replicate extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hTarget: C_BaseEntity
}

interface C_DOTA_Ability_PhantomLancer_PhantomEdge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phoenix_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spectre_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Respawn_Reduction_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon_Upgraded5 extends C_DOTA_Item_Dagon_Upgraded {
	readonly type_name: string
}

interface C_DOTA_Ability_Pangolier_GyroshellStop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Broodmother_SpinWeb extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hWebs: C_BaseEntity[]
	readonly stringge_restore_time: number
	readonly max_stringges: number
}

interface C_DOTA_Ability_Warlock_Golem_Permanent_Immolation extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Puck_WaningRift extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Morphling extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Shadowraze1 extends C_DOTA_Ability_Nevermore_Shadowraze {
	readonly type_name: string
}

interface C_DOTA_Ability_Zombie_Berserk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Underlord extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Abaddon_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Hood_Of_Defiance extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkWillow_BrambleMaze extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Unit_Elder_Titan_AncestralSpirit extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
}

interface C_DOTA_Ability_Luna_MoonGlaive extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iAttackIndex: number
	readonly m_GlaiveInfo: sGlaiveInfo[]
}

interface C_DOTA_Ability_GiantWolf_CriticalStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CAdditionalWearable extends C_DynamicProp {
	readonly type_name: string
}

interface C_PropVehicleChoreoGeneric extends C_DynamicProp {
	readonly type_name: string
	readonly m_hPlayer: C_BaseEntity
	readonly m_hPrevPlayer: C_BaseEntity
	readonly m_bEnterAnimOn: boolean
	readonly m_bExitAnimOn: boolean
	readonly m_vecEyeExitEndpoint: Vector
	readonly m_flFOV: number
	readonly m_ViewSmoothingData: C_ViewSmoothingData_t
	readonly m_vehicleView: c_vehicleview_t
}

interface C_DOTA_Ability_Terrorblade_ConjureImage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Gold_Income_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_75 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTATurboHeroPickRules extends C_DOTABaseCustomHeroPickRules {
	readonly type_name: string
	readonly m_Phase: number
}

interface C_EnvCubemapFog extends C_BaseEntity {
	readonly type_name: string
	readonly m_flEndDistance: number
	readonly m_flStartDistance: number
	readonly m_flFogFalloffExponent: number
	readonly m_flLODBias: number
	readonly m_bActive: boolean
	readonly m_bStartDisabled: boolean
	readonly m_bFirstTime: boolean
}

interface C_DOTA_Item_Recipe_Sphere extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Skywrath_Mage extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Treant_NaturesGuise extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_BountyHunter_WindWalk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Beastmaster_Boar extends C_DOTA_Unit_Hero_Beastmaster_Beasts {
	readonly type_name: string
}

interface C_DOTA_Ability_Enigma_BlackHole extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_BladeFury extends C_DOTA_Ability_Juggernaut_BladeFury {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Yellow_IonShell extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pangolier_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dark_Seer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bloodseeker_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Beastmaster_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DataDire extends C_DOTA_DataNonSpectator {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Desolator extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Dagon2 extends C_DOTA_Item_Recipe_Dagon {
	readonly type_name: string
}

interface CDOTA_NPC_Observer_Ward_TrueSight extends CDOTA_NPC_Observer_Ward {
	readonly type_name: string
	readonly m_iTrueSight: number
	readonly m_hCasterEntity: C_BaseEntity
	readonly m_hAbilityEntity: C_BaseEntity
}

interface C_DOTA_Ability_Shredder_ChakramAlias_shredder_chakram_2 extends C_DOTA_Ability_Shredder_Chakram {
	readonly type_name: string
}

interface C_DOTA_Ability_DragonKnight_DragonTail extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Undying_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_RingOfAquila extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_DeathProphet_SpiritSiphon extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vStartPos: Vector
	readonly m_iArrowProjectile: number
	readonly m_nFXIndex: number
	readonly stringge_restore_time: number
	readonly max_stringges: number
}

interface C_DOTA_Ability_Slardar_Amplify_Damage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Orange_DragonSlave extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Oracle_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Naga_Siren_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Clinkz_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Reincarnation_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_325 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_SpeechBubbleManager extends C_BaseEntity {
	readonly type_name: string
	readonly m_SpeechBubbles: C_SpeechBubbleInfo[]
	readonly m_nLastCountInQueue: number[]
}

interface C_DOTA_Unit_Hero_Winter_Wyvern extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nFXDeath: number
}

interface CDOTA_Ability_Elder_Titan_AncestralSpirit extends C_DOTABaseAbility {
	readonly type_name: string
	readonly speed: number
	readonly radius: number
	readonly buff_duration: number
	readonly spirit_duration: number
	readonly m_nCreepsHit: number
	readonly m_nHeroesHit: number
	readonly m_bIsReturning: boolean
	readonly m_hAncestralSpirit: C_BaseEntity
	readonly m_nReturnFXIndex: number
}

interface C_DOTA_Ability_Tiny_Toss extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_UpgradedMortar extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Spirit_Breaker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Medusa_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Exp_Boost_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Brewmaster_PrimalStorm extends C_DOTA_BaseNPC_Creep {
	readonly type_name: string
	readonly m_nFXStormAmbient1: number
	readonly m_nFXStormAmbient2: number
}

interface C_DOTA_Unit_Hero_Warlock extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_StormSpirit_ElectricVortex extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_AntiMage_ManaBreak extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DotaSubquestAbilityCastCount extends C_DotaSubquestBase {
	readonly type_name: string
}

interface C_DOTA_Ability_SatyrHellcaller_UnholyAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_DarkWillow_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enigma extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_HoldoutTower_HeavySlow extends C_DOTA_BaseNPC_HoldoutTower {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_Boundless_Strike extends C_DOTABaseAbility {
	readonly type_name: string
	readonly strike_cast_range: number
	readonly strike_radius: number
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Skywrath_Mage_Arcane_Bolt extends C_DOTABaseAbility {
	readonly type_name: string
	readonly bolt_vision: number
	readonly vision_duration: number
	readonly m_flDamage: number
	readonly m_nFXIndex: number
}

interface C_DOTA_Ability_Shadow_Demon_Shadow_Poison extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Necrolyte_Sadist extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pangolier_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Naga_Siren extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_500 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAMutationGameMode extends C_DOTABaseGameMode {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Skadi extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_SpiritBear_Return extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Weaver_GeminateAttack extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CClient_Precipitation extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_nPrecipType: number
	readonly m_minSpeed: number
	readonly m_maxSpeed: number
	readonly m_Color: number[]
	readonly m_Lifetime: number
	readonly m_InitialRamp: number
	readonly m_Speed: number
	readonly m_Width: number
	readonly m_Remainder: number
	readonly m_flHalfScreenWidth: number
	readonly m_flDensity: number
	readonly m_flParticleInnerDist: number
	readonly m_pParticleInnerNearDef: string
	readonly m_pParticleInnerFarDef: string
	readonly m_pParticleOuterDef: string
	readonly m_tParticlePrecipTraceTimer: TimedEvent[]
	readonly m_bActiveParticlePrecipEmitter: boolean[]
	readonly m_bParticlePrecipInitialized: boolean
	readonly m_bHasSimulatedSinceLastSceneObjectUpdate: boolean
	readonly m_nAvailableSheetSequencesMaxIndex: number
}

interface C_LightSpotEntity extends C_LightEntity {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Butterfly extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkWillow_Bedlam extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Puck_PhaseShift extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Zuus_StaticField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Purple_VenomousGale extends C_DOTABaseAbility {
	readonly type_name: string
	readonly duration: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_350 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_PortraitBaseModel extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_PortraitTree extends C_BaseAnimating {
	readonly type_name: string
}

interface C_PropZipline extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hPrevZipline: C_BaseEntity
	readonly m_hNextZipline: C_BaseEntity
	readonly m_flMaxSpeed: number
}

interface C_DOTA_Item_Nullifier extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_DoomBringer_Doom extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_GoToSideShop2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Tidehunter extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_IngameEvent_FM2015 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_PocketRoshan extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Visage_SoulAssumption extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_fDamage: number
	readonly m_nFXIndex: number
	readonly m_iForcedStacks: number
}

interface C_DOTA_Ability_Lich_DarkRitual extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Morphling_AdaptiveStrike_Str extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_IngameEvent_WM2016 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enigma_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_200 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Maelstrom extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon_Upgraded2 extends C_DOTA_Item_Dagon_Upgraded {
	readonly type_name: string
}

interface C_DOTA_Item_SobiMask extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Beastmaster_Hawk extends C_DOTA_Unit_Hero_Beastmaster_Beasts {
	readonly type_name: string
}

interface C_DOTA_Ability_Enigma_DemonicConversion extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Abaddon extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tusk_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Meepo_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Block_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_RagdollManager extends C_BaseEntity {
	readonly type_name: string
	readonly m_iCurrentMaxRagdollCount: number
}

interface C_DOTAPlayer extends C_BasePlayer {
	readonly type_name: string
	readonly m_iMinimapMove: number
	readonly m_pClickBehaviorKeys: KeyValues
	readonly m_nRareLineClickCount: number
	readonly m_nRareLinesPlayed: number
	readonly m_flCenterTime: number
	readonly m_iConfirmationIndex: number
	readonly m_bCenterOnHero: boolean
	readonly m_bHeroAssigned: boolean
	readonly m_nKeyBindHeroID: number
	readonly m_bUsingCameraMan: boolean
	readonly m_bUsingAssistedCameraOperator: boolean
	readonly m_nPlayerAssistFlags: number
	readonly m_vLatestEvent: Vector
	readonly m_vecStartingPosition: Vector
	readonly m_hAssignedHero: C_BaseEntity
	readonly m_hLastAssignedHero: C_BaseEntity
	readonly m_hKillCamUnit: C_BaseEntity
	readonly m_hPreviousKillCamUnit: C_BaseEntity
	readonly m_flKillCamUnitReceivedTime: number
	readonly m_bTeleportRequiresHalt: boolean
	readonly m_bChannelRequiresHalt: boolean
	readonly m_bAutoPurchaseItems: boolean
	readonly m_bDisableHUDErrorMessages: boolean
	readonly m_iMouseDragStartX: number
	readonly m_iMouseDragStartY: number
	readonly m_nWeatherType: number
	readonly m_nSelectedControlGroup: number
	readonly m_iPlayerID: number
	readonly m_nCachedCoachedTeam: number
	readonly m_hActiveAbility: C_BaseEntity
	readonly m_unitorders: CUnitOrders[]
	readonly m_nOutgoingOrderSequenceNumber: number
	readonly m_nServerOrderSequenceNumber: number
	readonly m_nSelectedUnits: C_BaseEntity[]
	readonly m_nWaypoints: number[]
	readonly m_iActions: number
	readonly m_hQueryUnit: C_BaseEntity
	readonly m_bInQuery: boolean
	readonly m_bSelectionChangedInDataUpdate: boolean
	readonly m_flQueryInhibitingActionTime: number
	readonly m_flQueryInhibitDuration: number
	readonly m_RingedEntities: C_BaseEntity[]
	readonly m_ActiveRingOwners: C_BaseEntity[]
	readonly m_bOverridingQuery: boolean
	readonly m_flLastAutoRepeatTime: number
	readonly m_flConsumeDoubleclickTime: number
	readonly m_LightInfoWeatherEffect: string
	readonly m_bPreviousWasLightInfoWeather: boolean
	readonly m_MapDefaultWeatherEffect: string
	readonly m_iTotalEarnedGold: number
	readonly m_iTotalEarnedXP: number
	readonly m_vecCreepSpawnBoxEffects: number[]
	readonly m_vecSuggestedWardLocationEffects: number[]
	readonly m_pSmartCastNPC: C_DOTA_BaseNPC
	readonly m_nTeamSprayParticleIndex: number
	readonly m_iCursor: number[]
	readonly m_iSpectatorClickBehavior: number
	readonly m_flAspectRatio: number
	readonly m_hSpectatorQueryUnit: C_BaseEntity
	readonly m_iStatsPanel: number
	readonly m_iShopPanel: number
	readonly m_iShopViewMode: number
	readonly m_iStatsDropdownCategory: number
	readonly m_iStatsDropdownSort: number
	readonly m_szShopString: string[]
	readonly m_vecClientQuickBuyState: ClientQuickBuyItemState[]
	readonly m_bInShowCaseMode: boolean
	readonly m_flCameraZoomAmount: number
	readonly m_iHighPriorityScore: number
	readonly m_quickBuyItems: number[]
	readonly m_quickBuyIsPurchasable: boolean[]
	readonly m_iPrevCursor: number[]
	readonly m_iPositionHistoryTail: number
	readonly m_iMusicStatus: number
	readonly m_iPreviousMusicStatus: number
	readonly m_bRequestedInventory: boolean
	readonly m_flMusicOperatorVals: number[]
	readonly m_iMusicOperatorVals: number[]
	readonly m_ControlGroups: sControlGroupElem[]
	readonly m_pkvControlGroupKV: KeyValues
}

interface C_DOTA_Ability_TemplarAssassin_PsionicTrap extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SandKing_SandStorm extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkTrollWarlord_RaiseDead extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Medusa extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Arc_Warden_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvSky extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_bStartDisabled: boolean
	readonly m_vTintColor: Color
	readonly m_nFogType: number
	readonly m_flFogMinStart: number
	readonly m_flFogMinEnd: number
	readonly m_flFogMaxStart: number
	readonly m_flFogMaxEnd: number
	readonly m_bEnabled: boolean
}

interface C_DOTA_Ability_Obsidian_Destroyer_AstralImprisonment extends C_DOTABaseAbility {
	readonly type_name: string
	readonly steal_duration: number
	readonly m_hImprisonedUnit: C_BaseEntity
	readonly max_stringges_scepter: number
	readonly stringge_restore_time_scepter: number
}

interface C_DOTA_Ability_Clinkz_Strafe extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_GraniteGolem_HPAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sven_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CInfoTarget extends C_PointEntity {
	readonly type_name: string
}

interface CDOTA_Item_Solar_Crest extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Diffusal_Blade_Level2 extends C_DOTA_Item_Diffusal_Blade {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Empty2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Meepo_Poof extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXIndex: number
}

interface CDOTA_Ability_Life_Stealer_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_QueenOfPain_ShadowStrike extends C_DOTABaseAbility {
	readonly type_name: string
	readonly projectile_speed: Vector
}

interface C_DOTA_Ability_Special_Bonus_Unique_Kunkka_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Legion_Commander_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Invoker_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Assault_Cuirass extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Mirana_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lone_Druid_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_SpriteOriented extends C_Sprite {
	readonly type_name: string
}

interface C_PlayerCosmeticPropClientside extends C_DynamicPropClientside {
	readonly type_name: string
	readonly m_iPlayerNum: number
	readonly m_iCosmeticType: number
	readonly m_szProxyTextureName: string[]
	readonly m_bGeneratedShowcaseProps: boolean
	readonly m_vecShowcaseProps: C_PlayerCosmeticPropClientside[]
	readonly m_pShowcaseItem: C_EconItemView
}

interface C_DOTA_Item_Circlet extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Roshan_Slam extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phantom_Lancer extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_500 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_LoneDruid_SavageRoar_Bear extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_Invoke extends C_DOTABaseAbility {
	readonly type_name: string
	readonly max_invoked_spells: number
}

interface C_DOTA_Ability_Life_Stealer_Feast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_HoldoutTower_LightFast extends C_DOTA_BaseNPC_HoldoutTower {
	readonly type_name: string
}

interface C_DOTA_Item_Necronomicon_Level2 extends C_DOTA_Item_Necronomicon {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_DivineRapier extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_PowerTreads extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Undying_SoulRip extends C_DOTABaseAbility {
	readonly type_name: string
	readonly damage_per_unit: number
	readonly radius: number
	readonly max_units: number
	readonly tombstone_heal: number
}

interface C_DOTA_Ability_FacelessVoid_TimeLock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bane_BrainSap extends C_DOTABaseAbility {
	readonly type_name: string
	readonly brain_sap_damage: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Necrophos_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Phoenix_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Disruptor_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ancient_Apparition_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_65 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_GemOfTrueSight extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Gauntlets extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Medusa extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_RuneSpawner_Powerup extends C_BaseAnimating {
	readonly type_name: string
	readonly m_nRuneType: number
	readonly m_flLastSpawnTime: number
}

interface C_DOTA_Ability_Abaddon_DeathCoil extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_TemplarAssassin_Meld extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Sigils extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nevermore_Necromastery extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Underlord_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Shaman_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earth_Spirit_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Axe_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Faceless_Void_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ember_Spirit_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Arcane_Boots extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Winter_Wyvern_Winters_Curse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_FriendlySkewer extends C_DOTABaseAbility {
	readonly type_name: string
	readonly skewer_radius: number
	readonly skewer_speed: number
	readonly max_targets: number
	readonly range: number
	readonly tree_radius: number
	readonly affects_creeps: number
	readonly m_nTargetsHit: number
}

interface C_DOTA_Ability_DarkSeer_IonShell extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bane_Enfeeble extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_DeathGoldDropped extends C_BaseAnimating {
	readonly type_name: string
}

interface C_LocalTempEntity extends C_BaseAnimating {
	readonly type_name: string
	readonly flags: number
	readonly die: number
	readonly m_flFrameMax: number
	readonly x: number
	readonly y: number
	readonly fadeSpeed: number
	readonly bounceFactor: number
	readonly hitSound: number
	readonly priority: number
	readonly tentOffset: Vector
	readonly m_vecTempEntAngVelocity: QAngle
	readonly tempent_renderamt: number
	readonly m_vecNormal: Vector
	readonly m_flSpriteScale: number
	readonly m_nFlickerFrame: number
	readonly m_flFrameRate: number
	readonly m_flFrame: number
	readonly m_pszImpactEffect: string
	readonly m_pszParticleEffect: string
	readonly m_bParticleCollision: boolean
	readonly m_iLastCollisionFrame: number
	readonly m_vLastCollisionOrigin: Vector
	readonly m_vecTempEntVelocity: Vector
	readonly m_vecPrevAbsOrigin: Vector
	readonly m_vecTempEntAcceleration: Vector
}

interface C_DOTA_Item_Armlet extends C_DOTA_Item {
	readonly type_name: string
	readonly toggle_cooldown: number
}

interface C_DOTA_Ability_Courier_Shield extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DrowRanger_Silence extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Nevermore_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_14 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_LightEnvironmentEntity extends C_LightDirectionalEntity {
	readonly type_name: string
}

interface C_DOTA_Item_WindLace extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_EarthSpirit_Petrify extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_EmberSpirit_SleightOfFist extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vCastLoc: Vector
	readonly m_nHeroesKilled: number
	readonly m_hAttackEntities: C_BaseEntity[]
	readonly m_nFXMarkerIndex: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lion_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sniper_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Amplify_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DynamicLight extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_Flags: number
	readonly m_LightStyle: number
	readonly m_Radius: number
	readonly m_Exponent: number
	readonly m_InnerAngle: number
	readonly m_OuterAngle: number
	readonly m_SpotRadius: number
}

interface C_DOTA_Item_Satanic extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Unit_Grimstroke_InkCreature extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_MonkeyKing_UnTransform extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Elder_Titan_EarthSplitter extends C_DOTABaseAbility {
	readonly type_name: string
	readonly crack_width: number
	readonly crack_distance: number
	readonly speed: number
	readonly vision_width: number
	readonly crack_time: number
}

interface C_DOTA_Ability_Undying_FleshGolem extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pangolier_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Venomancer_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wraith_King_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PropJeep extends C_PropVehicleDriveable {
	readonly type_name: string
	readonly m_vecLastEyePos: Vector
	readonly m_vecLastEyeTarget: Vector
	readonly m_vecEyeSpeed: Vector
	readonly m_vecTargetSpeed: Vector
	readonly m_flViewAngleDeltaTime: number
	readonly m_flJeepFOV: number
	readonly m_pHeadlight: CHeadlightEffect
	readonly m_bHeadlightIsOn: boolean
}

interface C_DOTA_Item_Heart extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Pangolier_ShieldCrash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_NPC_TechiesMines extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_iRangeFX: number
}

interface C_DOTA_Ability_SandKing_CausticFinale extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SatyrHellcaller_Shockwave extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_Regen_16 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Broodmother extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_HelmOfTheDominator extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_RefresherOrb extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Silencer_CurseOfTheSilent extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Chen_Penitence extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Slardar_Sprint extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_PhantomLancer_Doppelwalk extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvDetailController extends C_BaseEntity {
	readonly type_name: string
	readonly m_flFadeStartDist: number
	readonly m_flFadeEndDist: number
}

interface CViewAngleAnimation extends C_BaseEntity {
	readonly type_name: string
	readonly m_flAnimStartTime: number
	readonly m_bFinished: boolean
	readonly m_KeyFrames: CViewAngleKeyFrame[]
	readonly m_vecBaseAngles: QAngle
	readonly m_iFlags: number
}

interface C_DOTA_Ability_SpiritBreaker_NetherStrike extends C_DOTABaseAbility {
	readonly type_name: string
	readonly cooldown_scepter: number
	readonly cast_range_scepter: number
}

interface C_DOTA_Unit_Hero_Enchantress extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Hurricane extends C_DOTABaseAbility {
	readonly type_name: string
	readonly min_distance: number
	readonly max_distance: number
	readonly torrent_count: number
	readonly fire_interval: number
	readonly pull_switch_interval: number
	readonly game_time_wind_activation: number
	readonly m_ctPullTimer: CountdownTimer
	readonly m_ctTimer: CountdownTimer
	readonly m_flTiming: number
	readonly m_bForward: boolean
	readonly m_bUseWind: boolean
	readonly m_nFXIndex: number
	readonly m_nfxIndex_roar: number
}

interface C_DOTA_Ability_Puck_IllusoryOrb extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iProjectile: number
	readonly m_ViewerTimer: CountdownTimer
	readonly orb_vision: number
	readonly vision_duration: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Doom_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Bristleback_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_CombatWeaponClone extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hWeaponParent: C_BaseEntity
	readonly m_nLastUpdatedWorldModelClone: number
}

interface C_DOTA_Ability_Rubick_NullField extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Clinkz_SearingArrows extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Razor_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Keeper_of_the_Light extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CPointHintUi extends C_PointClientUIWorldPanel {
	readonly type_name: string
	readonly m_attachType: number
	readonly m_hIconTarget: C_BaseEntity
	readonly m_szTargetAttachmentName: string
	readonly m_vOffset: Vector
	readonly m_bAlwaysVisible: boolean
	readonly m_vecWorldPosition: Vector
	readonly m_bUsesCustomLayout: boolean
	readonly m_nHighlightTargetParticleIdx: number
	readonly m_hHighlightModel: C_BaseEntity
	readonly m_nHighlightPointParticleIdx: number
	readonly m_vecLocalHighlightPoint: Vector
	readonly m_hHighlightOtherEntity: C_BaseEntity
}

interface C_PhysicsProp extends C_BreakableProp {
	readonly type_name: string
	readonly m_bAwake: boolean
	readonly m_spawnflags: number
}

interface C_DOTAPropCustomTexture extends C_DynamicProp {
	readonly type_name: string
	readonly m_unTeamID: number
	readonly m_bSetupMaterialProxy: boolean
}

interface C_DOTA_Ability_TrollWarlord_WhirlingAxes_Ranged extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vStartPos: Vector
	readonly m_iArrowProjectile: number
	readonly axe_width: number
	readonly axe_speed: number
	readonly axe_range: number
	readonly axe_spread: number
	readonly axe_count: number
	readonly m_hHitUnits: C_BaseEntity[]
}

interface C_DotaSubquestTutorialEvent extends C_DotaSubquestBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_White_Degen_Aura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Spawnlord_Aura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Riki_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_800 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_Beam extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_flFrameRate: number
	readonly m_flHDRColorScale: number
	readonly m_flFireTime: number
	readonly m_flDamage: number
	readonly m_nNumBeamEnts: number
	readonly m_queryHandleHalo: number
	readonly m_nBeamType: number
	readonly m_nBeamFlags: number
	readonly m_hAttachEntity: C_BaseEntity[]
	readonly m_nAttachIndex: number[]
	readonly m_fWidth: number
	readonly m_fEndWidth: number
	readonly m_fFadeLength: number
	readonly m_fHaloScale: number
	readonly m_fAmplitude: number
	readonly m_fStartFrame: number
	readonly m_fSpeed: number
	readonly m_flFrame: number
	readonly m_nClipStyle: number
	readonly m_bTurnedOff: boolean
	readonly m_vecEndPos: Vector
	readonly m_hEndEntity: C_BaseEntity
}

interface C_ShadowControl extends C_BaseEntity {
	readonly type_name: string
	readonly m_shadowDirection: Vector
	readonly m_shadowColor: Color
	readonly m_flShadowMaxDist: number
	readonly m_bDisableShadows: boolean
	readonly m_bEnableLocalLightShadows: boolean
}

interface C_FuncMoveLinear extends C_BaseToggle {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Heart extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_PlateMail extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Wisp_Tether_Break extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Beastmaster_InnerBeast extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Omniknight_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Magnus_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Rune extends C_BaseAnimating {
	readonly type_name: string
	readonly m_iRuneType: number
	readonly m_iOldRuneType: number
	readonly m_bShowingTooltip: boolean
}

interface C_DOTAAmbientCreatureParticleZone extends C_FuncBrush {
	readonly type_name: string
	readonly m_szModelName: string[]
	readonly m_szAreaName: string[]
}

interface C_DOTA_Hero_Recorder extends C_BaseEntity {
	readonly type_name: string
	readonly m_bStartRecording: boolean
	readonly m_hHero: C_BaseEntity
	readonly m_hPlayer: C_BaseEntity
	readonly m_bRecording: boolean
	readonly m_bLastStartRecording: boolean
	readonly m_flLastCycle: number
	readonly m_nCompletedCycles: number
	readonly m_nFramesThisCycle: number
	readonly m_nRecordedFrames: number
	readonly m_flHeroAdvanceTime: number
	readonly m_flStartTime: number
	readonly m_flCycles: float32[]
	readonly m_pBatchFiles: string[]
}

interface C_DOTA_Item_Aether_Lens extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Necronomicon_Level3 extends C_DOTA_Item_Necronomicon {
	readonly type_name: string
}

interface C_DOTA_Item_Sange extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Grimstroke_InkCreature extends C_DOTABaseAbility {
	readonly type_name: string
	readonly spawn_time: number
}

interface C_DOTA_Ability_Broodmother_InsatiableHunger extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Ursa_Earthshock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Bane_FiendsGrip extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_hGripTarget: C_BaseEntity
	readonly fiend_grip_damage: number
}

interface C_DOTA_Ability_Greevil_Miniboss_Red_Earthshock extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tinker_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_HP_600 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_PhantomAssassin_CoupdeGrace extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTAGamerulesProxy extends C_GameRulesProxy {
	readonly type_name: string
	readonly m_pGameRules: C_DOTAGamerules
}

interface C_DOTA_BaseNPC_Creep_Siege extends C_DOTA_BaseNPC_Creep_Lane {
	readonly type_name: string
}

interface CDOTA_Item_Enchanted_Mango extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_IcarusDiveStop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enchantress_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Winter_Wyvern_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_60 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EnvScreenOverlay extends C_PointEntity {
	readonly type_name: string
	readonly m_iszOverlayNames: string[]
	readonly m_flOverlayTimes: number[]
	readonly m_flStartTime: number
	readonly m_iDesiredOverlay: number
	readonly m_bIsActive: boolean
	readonly m_bWasActive: boolean
	readonly m_iCachedDesiredOverlay: number
	readonly m_iCurrentOverlay: number
	readonly m_flCurrentOverlayTime: number
}

interface C_DynamicPropAlias_prop_dynamic_override extends C_DynamicProp {
	readonly type_name: string
}

interface C_DOTA_Ability_Life_Stealer_Rage extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_TemplarAssassin extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Omniknight_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PointWorldText extends C_ModelPointEntity {
	readonly type_name: string
	readonly m_bForceRecreateNextUpdate: boolean
	readonly m_messageText: string[]
	readonly m_FontName: string[]
	readonly m_bEnabled: boolean
	readonly m_bFullbright: boolean
	readonly m_flWorldUnitsPerPx: number
	readonly m_flFontSize: number
	readonly m_flDepthOffset: number
	readonly m_Color: Color
	readonly m_nJustifyHorizontal: number
	readonly m_nJustifyVertical: number
	readonly m_nReorientMode: number
}

interface C_BodyComponentBaseAnimatingOverlay extends CBodyComponentSkeletonInstance {
	readonly type_name: string
	readonly m_animationController: C_BaseAnimatingOverlayController
	readonly __m_pChainEntity: CNetworkVarChainer
}

interface C_DOTA_Unit_Hero_Dazzle extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Kunkka_Return extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_DrowRanger_Trueshot extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Beastmaster_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_All_Stats_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Wisp extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
	readonly m_nAmbientFXIndex: number
	readonly m_nStunnedFXIndex: number
	readonly m_nTalkFXIndex: number
	readonly m_nIllusionFXIndex: number
	readonly m_bParticleHexed: boolean
	readonly m_bParticleStunned: boolean
	readonly m_bDetermineAmbientEffect: boolean
	readonly m_flPrevHealth: number
}

interface C_DOTA_Item_Faerie_Fire extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_MaskOfDeath extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Pangolier_Gyroshell extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFxIndex: number
}

interface C_DOTA_Ability_Bristleback_Bristleback extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Luna_LunarBlessing extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Animation_TailSpin extends C_DOTABaseAbility {
	readonly type_name: string
	readonly animation_time: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Earth_Spirit_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lifestealer_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Cheese extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Item_ForceStaff extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_GlovesOfHaste extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_NagaSiren_SongOfTheSiren extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_FacelessVoid_TimeWalk extends C_DOTABaseAbility, C_HorizontalMotionController {
	readonly type_name: string
	readonly speed: number
	readonly range: number
	readonly radius: number
}

interface C_DOTA_BaseNPC_ShadowShaman_SerpentWard extends C_DOTA_BaseNPC_Additive {
	readonly type_name: string
	readonly m_angle: QAngle
	readonly m_iPoseParameterAim: number
}

interface C_IngameEvent_TI6 extends C_IngameEvent_Base {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Orange_LightStrikeArray extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pangolier_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_MagicWand extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_TranquilBoots2 extends C_DOTA_Item {
	readonly type_name: string
	readonly break_count: number
	readonly m_DamageList: float32[]
}

interface C_DOTA_Ability_MonkeyKing_TreeDance extends C_DOTABaseAbility {
	readonly type_name: string
	readonly perched_jump_distance: number
	readonly ground_jump_distance: number
}

interface C_DOTA_Ability_Visage_GravekeepersCloak extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Brewmaster_Pulverize extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Sven_StormBolt extends C_DOTABaseAbility {
	readonly type_name: string
	readonly vision_radius: number
}

interface C_DOTA_Ability_HarpyStorm_ChainLightning extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Troll_Warlord extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Wisp_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTACustomGameHeroPickRules extends C_DOTABaseCustomHeroPickRules {
	readonly type_name: string
	readonly m_Phase: number
	readonly m_nNumBansPerTeam: number
	readonly m_flEnterTime: number
	readonly m_nNumHeroesPicked: number
}

interface C_PointEntityAlias_info_target_portrait_root extends C_PointEntity {
	readonly type_name: string
}

interface C_BasePropDoor extends C_DynamicProp {
	readonly type_name: string
	readonly m_eDoorState: number
	readonly m_modelChanged: boolean
	readonly m_bLocked: boolean
	readonly m_isRescueDoor: boolean
	readonly m_hMaster: C_BaseEntity
}

interface C_DOTA_Ability_Tidehunter_KrakenShell extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SandKing_Epicenter extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nFXEpicenterIndex: number
}

interface C_DotaSubquestPlayerStat extends C_DotaSubquestBase {
	readonly type_name: string
}

interface C_DotaQuest extends C_BaseEntity {
	readonly type_name: string
	readonly m_pszQuestTitle: string[]
	readonly m_pszQuestText: string[]
	readonly m_nQuestType: number
	readonly m_hSubquests: C_BaseEntity[]
	readonly m_bHidden: boolean
	readonly m_bCompleted: boolean
	readonly m_bWinIfCompleted: boolean
	readonly m_bLoseIfCompleted: boolean
	readonly m_pszGameEndText: string[]
	readonly m_pnTextReplaceValuesCDotaQuest: number[]
	readonly m_pszTextReplaceString: string[]
	readonly m_nTextReplaceValueVersion: number
	readonly m_bWasCompleted: boolean
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Lifesteal_70 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_ServerRagdollAttached extends C_ServerRagdoll {
	readonly type_name: string
	readonly m_boneIndexAttached: number
	readonly m_ragdollAttachedObjectIndex: number
	readonly m_attachmentPointBoneSpace: Vector
	readonly m_attachmentPointRagdollSpace: Vector
	readonly m_vecOffset: Vector
	readonly m_parentTime: number
	readonly m_bHasParent: boolean
}

interface C_DOTA_Ability_EmberSpirit_FlameGuard extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dazzle_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_PortraitEntity_FullBody extends C_DOTA_PortraitEntity {
	readonly type_name: string
}

interface C_DOTA_Tiny_ScepterTree extends C_DOTAWearableItem {
	readonly type_name: string
}

interface C_PhysPropClientside extends C_BreakableProp {
	readonly type_name: string
	readonly m_iPhysicsMode: number
	readonly m_flTouchDelta: number
	readonly m_fDeathTime: number
	readonly m_impactEnergyScale: number
	readonly m_spawnflags: number
	readonly m_inertiaScale: number
	readonly m_flDmgModBullet: number
	readonly m_flDmgModClub: number
	readonly m_flDmgModExplosive: number
	readonly m_flDmgModFire: number
	readonly m_iszPhysicsDamageTableName: string
	readonly m_iszBreakableModel: string
	readonly m_iBreakableSkin: number
	readonly m_iBreakableCount: number
	readonly m_iMaxBreakableSize: number
	readonly m_iszBasePropData: string
	readonly m_iInteractions: number
	readonly m_iNumBreakableChunks: number
	readonly m_explodeDamage: number
	readonly m_explodeRadius: number
	readonly m_bBlockLOSSetByPropData: boolean
	readonly m_bIsWalkableSetByPropData: boolean
	readonly m_nCarryTypeOverride: number
}

interface C_DOTA_Ability_Bear_Empty1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Chen_TestOfFaithTeleport extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_TransferItems extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Zuus extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Greevil_Miniboss_Black_Nightmare extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ursa extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Ember_Spirit_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FogController extends C_BaseEntity {
	readonly type_name: string
	readonly m_fog: fogparams_t
	readonly m_bUseAngles: boolean
	readonly m_iChangedVariables: number
}

interface C_DOTA_Item_Recipe_Yasha extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Jakiro_Macropyre extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Pugna_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_MP_Regen_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_TrollWarlord extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Headdress extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Terrorblade_Sunder extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Lycan_FeralImpulse extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Nian extends C_DOTA_BaseNPC_Creature {
	readonly type_name: string
}

interface C_DOTA_Ability_DataDriven extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_bProcsMagicStick: boolean
	readonly m_bIsSharedWithTeammates: boolean
	readonly m_bCastFilterRejectCaster: boolean
	readonly m_fAOERadius: number
	readonly m_CastAnimation: number
	readonly m_ModifierKVDescriptions: KeyValues[]
	readonly m_pOnChannelFinishKV: KeyValues
	readonly m_pOnChannelSucceededKV: KeyValues
	readonly m_pOnChannelInterruptedKV: KeyValues
	readonly m_pOnOwnerSpawnedKV: KeyValues
	readonly m_pOnOwnerDiedKV: KeyValues
	readonly m_pOnUpgradeKV: KeyValues
	readonly m_pOnProjectileHitUnitKV: KeyValues
	readonly m_pOnProjectileFinishKV: KeyValues
	readonly m_pOnSpellStartKV: KeyValues
	readonly m_pOnAbilityPhaseStartKV: KeyValues
	readonly m_pOnAbilityPhaseInterruptedKV: KeyValues
	readonly m_pOnToggleOnKV: KeyValues
	readonly m_pOnToggleOffKV: KeyValues
	readonly m_pOnCreatedKV: KeyValues
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enchantress_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Faceless_Void_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Lion_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Meepo extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_BaseNPC_Fort extends C_DOTA_BaseNPC_Building {
	readonly type_name: string
}

interface CDOTA_Ability_Elder_Titan_ReturnSpirit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Centaur_HoofStomp extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Batrider_Flamebreak extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iProjectile: number
}

interface C_DOTA_Ability_Rattletrap_RocketFlare extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vecEnemyHeroesInFog: C_BaseEntity[]
}

interface C_DOTA_Ability_Special_Bonus_Unique_Visage_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dark_Seer_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dark_Seer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sven_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Weaver_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Elder_Titan extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Damage_90 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Special_Bonus_Intelligence_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_25 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FuncMonitor extends C_FuncBrush {
	readonly type_name: string
	readonly m_targetCamera: string
	readonly m_nResolutionEnum: number
	readonly m_bRenderShadows: boolean
	readonly m_bUseUniqueColorTarget: boolean
	readonly m_brushModelName: string
	readonly m_hTargetCamera: C_BaseEntity
	readonly m_bEnabled: boolean
}

interface CInfoWorldLayer extends C_BaseEntity {
	readonly type_name: string
	readonly m_pOutputOnEntitiesSpawned: CEntityIOOutput
	readonly m_worldName: string
	readonly m_layerName: string
	readonly m_bWorldLayerVisible: boolean
	readonly m_bEntitiesSpawned: boolean
	readonly m_bCreateAsChildSpawnGroup: boolean
	readonly m_hLayerSpawnGroup: number
	readonly m_bWorldLayerActuallyVisible: boolean
}

interface C_DOTA_Ability_Nyx_Assassin_Vendetta extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Rubick_Hidden3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tiny_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Armor_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Strength_9 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Movement_Speed_10 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PoseController extends C_BaseEntity {
	readonly type_name: string
	readonly m_bPoseValueParity: boolean
	readonly m_fPoseValue: number
	readonly m_fInterpolationTime: number
	readonly m_bInterpolationWrap: boolean
	readonly m_fCycleFrequency: number
	readonly m_nFModType: number
	readonly m_fFModTimeOffset: number
	readonly m_fFModRate: number
	readonly m_fFModAmplitude: number
	readonly m_hProps: C_BaseEntity[]
	readonly m_chPoseIndex: number[]
	readonly m_bOldPoseValueParity: boolean
	readonly m_fCurrentPoseValue: number
	readonly m_fCurrentFMod: number
	readonly m_PoseTransitionValue: CInterpolatedValue
}

interface C_PointHMDAnchorOverride extends C_PointHMDAnchor {
	readonly type_name: string
}

interface C_NetTestBaseCombatCharacter extends C_BaseCombatCharacter {
	readonly type_name: string
}

interface C_DOTA_Item_PhaseBoots extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_AbyssalUnderlord extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Unit_Hero_Elder_Titan extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface CDOTA_Ability_Beastmaster_WildAxes extends C_DOTABaseAbility {
	readonly type_name: string
	readonly axe_damage: number
}

interface C_DOTA_Ability_Bane_Nightmare extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_ViewmodelWeapon extends C_BaseAnimating {
	readonly type_name: string
	readonly m_worldModel: string
}

interface C_PhysMagnet extends C_BaseAnimating {
	readonly type_name: string
	readonly m_aAttachedObjectsFromServer: number[]
	readonly m_aAttachedObjects: C_BaseEntity[]
}

interface C_FuncConveyor extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_flConveyorSpeed: number
}

interface C_EnvDeferredLightClientOnly extends C_EnvDeferredLight {
	readonly type_name: string
}

interface C_DOTA_Item_OgreAxe extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTAInGamePredictionState extends C_BaseEntity {
	readonly type_name: string
	readonly m_bVotingClosed: boolean
	readonly m_bAllPredictionsFinished: boolean
	readonly m_vecPredictions: InGamePredictionData_t[]
	readonly m_nLeagueID: number
	readonly m_vecPrevPredictions: InGamePredictionData_t[]
}

interface C_DOTA_Ability_Special_Bonus_Unique_Silencer_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_InvisibilityEdge extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_MonkeyKingBar extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_ForgedSpirit_MeltingStrike extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Warlock_RainOfChaos extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Riki extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Necrophos_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Morphling_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Dragon_Knight_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tiny_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_50 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Magic_Resistance_35 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_PortraitWorldCallbackHandler extends C_BaseEntity {
	readonly type_name: string
}

interface C_InfoPlayerStartBadGuys extends C_InfoPlayerStartDota {
	readonly type_name: string
}

interface C_BaseViewModel extends C_BaseAnimatingOverlay {
	readonly type_name: string
	readonly m_vecLastFacing: Vector
	readonly m_nViewModelIndex: number
	readonly m_nAnimationParity: number
	readonly m_nLayer: number
	readonly m_flAnimationStartTime: number
	readonly m_hWeapon: C_BaseEntity
	readonly m_hOwner: C_BaseEntity
	readonly m_Activity: number
	readonly m_sVMName: string
	readonly m_sAnimationPrefix: string
	readonly m_hWeaponModel: C_BaseEntity
	readonly m_iCameraAttachment: number
	readonly m_vecLastCameraAngles: QAngle
	readonly m_previousElapsedTime: number
	readonly m_previousCycle: number
	readonly m_nOldAnimationParity: number
	readonly m_oldLayer: number
	readonly m_oldLayerStartTime: number
}

interface CDOTA_Item_Silver_Edge extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_MantaStyle extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_Eruption extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Puck_EtherealJaunt extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Mirana extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Templar_Assassin_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_VR_AvatarManagerCallbackHandler extends C_BaseEntity {
	readonly type_name: string
}

interface C_DOTA_DataSpectator extends C_DOTA_DataNonSpectator {
	readonly type_name: string
	readonly m_hPowerupRune_1: C_BaseEntity
	readonly m_hPowerupRune_2: C_BaseEntity
	readonly m_hBountyRune_1: C_BaseEntity
	readonly m_hBountyRune_2: C_BaseEntity
	readonly m_hBountyRune_3: C_BaseEntity
	readonly m_hBountyRune_4: C_BaseEntity
	readonly m_iNetWorth: number[]
	readonly m_fRadiantWinProbability: number
	readonly m_iGoldSpentOnSupport: number[]
	readonly m_iHeroDamage: number[]
	readonly m_nWardsPurchased: number[]
	readonly m_nWardsPlaced: number[]
	readonly m_nWardsDestroyed: number[]
	readonly m_nRunesActivated: number[]
	readonly m_nCampsStacked: number[]
}

interface C_FuncAreaPortalWindow extends C_BaseModelEntity {
	readonly type_name: string
	readonly m_flFadeStartDist: number
	readonly m_flFadeDist: number
	readonly m_flTranslucencyLimit: number
}

interface CDOTA_Item_Recipe_Aether_Lens extends C_DOTA_Item {
	readonly type_name: string
}

interface CDOTA_Ability_Centaur_DoubleEdge extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Broodmother_SpawnSpiderite extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Holdout_FierySoul extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Razor extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Treant_7 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Oracle_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_DataCustomTeam extends C_DOTA_DataNonSpectator {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Bloodthorn extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon_Upgraded4 extends C_DOTA_Item_Dagon_Upgraded {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_ForgeSpirit extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface CDOTA_Ability_CallOfTheWild_Boar_PoisonGreater extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Roshan_InherentBuffs extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Unit_Announcer_Killing_Spree extends CDOTA_Unit_Announcer {
	readonly type_name: string
}

interface C_DOTA_Ability_Tinker_HeatSeekingMissile extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_nTargetsKilled: number
}

interface C_DOTA_Unit_Hero_Tinker extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_PoorMansShield extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Oracle_FalsePromise extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Magnataur_Empower extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_TakeStashAndTransferItems extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SandKing_BurrowStrike extends C_DOTABaseAbility {
	readonly type_name: string
	readonly burrow_width: number
	readonly burrow_speed: number
	readonly burrow_speed_scepter: number
	readonly burrow_duration: number
	readonly burrow_anim_time: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sand_King_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sand_King extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Viper_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Monkey_King_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Lifesteal_100 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_BaseVRHandAttachment extends C_BaseAnimating {
	readonly type_name: string
	readonly m_hOldAttachedHand: C_BaseEntity
	readonly m_OnAttachedToHand: CEntityIOOutput
	readonly m_OnDetachedFromHand: CEntityIOOutput
	readonly m_hAttachedHand: C_BaseEntity
	readonly m_bIsAttached: boolean
}

interface C_DOTA_Ability_Special_Bonus_Unique_Shadow_Demon_6 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Huskar_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cast_Range_150 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Range_125 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_EntityFlame extends C_BaseEntity {
	readonly type_name: string
	readonly m_hEntAttached: C_BaseEntity
	readonly m_hOldAttached: C_BaseEntity
	readonly m_bCheapEffect: boolean
}

interface C_DOTA_Unit_Hero_Leshrac extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_DragonKnight_BreatheFire extends C_DOTABaseAbility {
	readonly type_name: string
	readonly start_radius: number
	readonly end_radius: number
	readonly m_vStartPos: Vector
	readonly m_fStartTime: number
	readonly m_fTotalTime: number
}

interface C_DOTA_Ability_Special_Bonus_Unique_Vengeful_Spirit_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Keeper_of_the_Light_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_8 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_TintController extends C_BaseEntity {
	readonly type_name: string
}

interface C_PhysBoxMultiplayer extends C_PhysBox {
	readonly type_name: string
	readonly m_iPhysicsMode: number
	readonly m_fMass: number
}

interface C_DOTA_Ability_LoneDruid_TrueForm_BattleCry extends C_DOTABaseAbility {
	readonly type_name: string
	readonly cry_duration: number
}

interface C_DOTA_Ability_Brewmaster_DrunkenBrawler extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_iBrawlActive: number
	readonly m_bUpdateIcons: boolean
}

interface C_DOTA_Ability_Leshrac_Split_Earth extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_Courier_Morph extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_SatyrSoulstealer_ManaBurn extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Warlock_1 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Windranger_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cooldown_Reduction_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_SimpleObstruction extends C_BaseEntity {
	readonly type_name: string
	readonly m_bEnabled: boolean
	readonly m_bBlockFoW: boolean
	readonly m_nOccluderIndex: number
	readonly m_bBlockingGridNav: boolean
	readonly m_bPrevEnabled: boolean
}

interface CDOTA_Item_Recipe_Moonshard extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Phoenix_LaunchFireSpirit extends C_DOTABaseAbility {
	readonly type_name: string
	readonly spirit_speed: number
	readonly duration: number
	readonly radius: number
	readonly hp_cost_perc: number
	readonly m_nFXIndex: number
}

interface CDOTA_Ability_Elder_Titan_EchoStomp_Spirit extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Sniper extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_VengefulSpirit_Command_Aura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Enigma_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Sand_King_4 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Agility_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_15 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Cleave_30 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTASceneEntity extends C_SceneEntity {
	readonly type_name: string
	readonly m_nCustomStackIndex: number
	readonly m_flVolume: number
}

interface C_DOTA_Ability_BackdoorProtection extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_FireFromAboveSprite extends C_Sprite {
	readonly type_name: string
}

interface CDOTA_Item_RiverPainter6 extends C_DOTA_Item_RiverPainter {
	readonly type_name: string
}

interface C_DOTA_Beastmaster_Axe extends C_BaseAnimating {
	readonly type_name: string
}

interface C_DOTA_Ability_Courier_GoToEnemySecretShop extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_StormSpirit_StaticRemnant extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_vecCastPos: Vector
}

interface C_DOTA_Ability_Mirana_Starfall extends C_DOTABaseAbility {
	readonly type_name: string
}

interface CDOTA_Ability_AncientApparition_IceBlast extends C_DOTABaseAbility {
	readonly type_name: string
	readonly m_PathTimer: CountdownTimer
	readonly m_vTarget: Vector
	readonly m_vStartPos: Vector
	readonly m_vLastTempViewer: Vector
	readonly m_iTrackerProjectile: number
	readonly path_radius: number
	readonly radius_min: number
	readonly radius_max: number
	readonly radius_grow: number
	readonly frostbite_duration: number
	readonly frostbite_duration_scepter: number
	readonly target_sight_radius: number
	readonly m_hFrostbittenEntities: C_BaseEntity[]
}

interface C_DOTA_Ability_Lesser_NightCrawler_Pounce extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Tidehunter_2 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_VRHandModelOverride extends C_BaseVRHandAttachment {
	readonly type_name: string
}

interface C_DOTA_Item_GreaterCritical extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_TrollWarlord_Fervor extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Huskar_Burning_Spear extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Unit_Hero_Axe extends C_DOTA_BaseNPC_Hero {
	readonly type_name: string
}

interface C_DOTA_Ability_DarkTrollWarlord_Ensnare extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Furion_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Zeus_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Slark_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Spell_Block_20 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Attack_Speed_40 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Vladmir extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_Dagon_Upgraded3 extends C_DOTA_Item_Dagon_Upgraded {
	readonly type_name: string
}

interface C_DOTA_Item_Recipe_Dagon5 extends C_DOTA_Item_Recipe_Dagon {
	readonly type_name: string
}

interface C_DOTA_Item_MagicWand extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Item_PlaneswalkersCloak extends C_DOTA_Item {
	readonly type_name: string
}

interface C_DOTA_Ability_Invoker_GhostWalk extends CDOTA_Ability_Invoker_InvokedBase {
	readonly type_name: string
}

interface C_DOTA_Ability_Huskar_Berserkers_Blood extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Nian_GreaterBash extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_BlueDragonspawnOverseer_DevotionAura extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Antimage_5 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Unique_Leshrac_3 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Evasion_75 extends C_DOTABaseAbility {
	readonly type_name: string
}

interface C_DOTA_Ability_Special_Bonus_Intelligence_12 extends C_DOTABaseAbility {
	readonly type_name: string
}

declare const enum Hull_t {
	HULL_HUMAN = 0,
	HULL_SMALL_CENTERED = 1,
	HULL_WIDE_HUMAN = 2,
	HULL_TINY = 3,
	HULL_MEDIUM = 4,
	HULL_TINY_CENTERED = 5,
	HULL_LARGE = 6,
	HULL_LARGE_CENTERED = 7,
	HULL_MEDIUM_TALL = 8,
	NUM_HULLS = 9,
	HULL_NONE = 10
}
declare const enum AnimationProcessingType_t {
	ANIMATION_PROCESSING_SERVER_SIMULATION = 0,
	ANIMATION_PROCESSING_CLIENT_SIMULATION = 1,
	ANIMATION_PROCESSING_CLIENT_PREDICTION = 2,
	ANIMATION_PROCESSING_CLIENT_INTERPOLATION = 3,
	ANIMATION_PROCESSING_CLIENT_RENDER = 4,
	ANIMATION_PROCESSING_MAX = 5
}
declare const enum RenderPrimitiveType_t {
	RENDER_PRIM_POINTS = 0,
	RENDER_PRIM_LINES = 1,
	RENDER_PRIM_LINES_WITH_ADJACENCY = 2,
	RENDER_PRIM_LINE_STRIP = 3,
	RENDER_PRIM_LINE_STRIP_WITH_ADJACENCY = 4,
	RENDER_PRIM_TRIANGLES = 5,
	RENDER_PRIM_TRIANGLES_WITH_ADJACENCY = 6,
	RENDER_PRIM_TRIANGLE_STRIP = 7,
	RENDER_PRIM_TRIANGLE_STRIP_WITH_ADJACENCY = 8,
	RENDER_PRIM_INSTANCED_QUADS = 9,
	RENDER_PRIM_HETEROGENOUS = 10,
	RENDER_PRIM_1_CONTROL_POINT_PATCHLIST = 11,
	RENDER_PRIM_2_CONTROL_POINT_PATCHLIST = 12,
	RENDER_PRIM_3_CONTROL_POINT_PATCHLIST = 13,
	RENDER_PRIM_4_CONTROL_POINT_PATCHLIST = 14,
	RENDER_PRIM_5_CONTROL_POINT_PATCHLIST = 15,
	RENDER_PRIM_6_CONTROL_POINT_PATCHLIST = 16,
	RENDER_PRIM_7_CONTROL_POINT_PATCHLIST = 17,
	RENDER_PRIM_8_CONTROL_POINT_PATCHLIST = 18,
	RENDER_PRIM_9_CONTROL_POINT_PATCHLIST = 19,
	RENDER_PRIM_10_CONTROL_POINT_PATCHLIST = 20,
	RENDER_PRIM_11_CONTROL_POINT_PATCHLIST = 21,
	RENDER_PRIM_12_CONTROL_POINT_PATCHLIST = 22,
	RENDER_PRIM_13_CONTROL_POINT_PATCHLIST = 23,
	RENDER_PRIM_14_CONTROL_POINT_PATCHLIST = 24,
	RENDER_PRIM_15_CONTROL_POINT_PATCHLIST = 25,
	RENDER_PRIM_16_CONTROL_POINT_PATCHLIST = 26,
	RENDER_PRIM_17_CONTROL_POINT_PATCHLIST = 27,
	RENDER_PRIM_18_CONTROL_POINT_PATCHLIST = 28,
	RENDER_PRIM_19_CONTROL_POINT_PATCHLIST = 29,
	RENDER_PRIM_20_CONTROL_POINT_PATCHLIST = 30,
	RENDER_PRIM_21_CONTROL_POINT_PATCHLIST = 31,
	RENDER_PRIM_22_CONTROL_POINT_PATCHLIST = 32,
	RENDER_PRIM_23_CONTROL_POINT_PATCHLIST = 33,
	RENDER_PRIM_24_CONTROL_POINT_PATCHLIST = 34,
	RENDER_PRIM_25_CONTROL_POINT_PATCHLIST = 35,
	RENDER_PRIM_26_CONTROL_POINT_PATCHLIST = 36,
	RENDER_PRIM_27_CONTROL_POINT_PATCHLIST = 37,
	RENDER_PRIM_28_CONTROL_POINT_PATCHLIST = 38,
	RENDER_PRIM_29_CONTROL_POINT_PATCHLIST = 39,
	RENDER_PRIM_30_CONTROL_POINT_PATCHLIST = 40,
	RENDER_PRIM_31_CONTROL_POINT_PATCHLIST = 41,
	RENDER_PRIM_32_CONTROL_POINT_PATCHLIST = 42,
	RENDER_PRIM_COMPUTE_SHADER = 43,
	RENDER_PRIM_TYPE_COUNT = 44
}
declare const enum LuaModifierType {
	LUA_MODIFIER_MOTION_NONE = 0,
	LUA_MODIFIER_MOTION_HORIZONTAL = 1,
	LUA_MODIFIER_MOTION_VERTICAL = 2,
	LUA_MODIFIER_MOTION_BOTH = 3,
	LUA_MODIFIER_INVALID = 4
}
declare const enum ObjectTypeFlags_t {
	OBJECT_TYPE_IMAGE_LOD = 1,
	OBJECT_TYPE_GEOMETRY_LOD = 2,
	OBJECT_TYPE_DECAL = 4,
	OBJECT_TYPE_MODEL = 8,
	OBJECT_TYPE_BLOCK_LIGHT = 16,
	OBJECT_TYPE_NO_SHADOWS = 32,
	OBJECT_TYPE_WORLDSPACE_TEXURE_BLEND = 64,
	OBJECT_TYPE_DISABLED_IN_LOW_QUALITY = 128,
	OBJECT_TYPE_NO_SUN_SHADOWS = 256,
	OBJECT_TYPE_EXCLUDE_FROM_IMPOSTORS = 512
}
declare const enum DOTAMusicStatus_t {
	DOTA_MUSIC_STATUS_NONE = 0,
	DOTA_MUSIC_STATUS_EXPLORATION = 1,
	DOTA_MUSIC_STATUS_BATTLE = 2,
	DOTA_MUSIC_STATUS_PRE_GAME_EXPLORATION = 3,
	DOTA_MUSIC_STATUS_DEAD = 4,
	DOTA_MUSIC_STATUS_LAST = 5
}
declare const enum DOTA_RUNES {
	DOTA_RUNE_INVALID = -1,
	DOTA_RUNE_DOUBLEDAMAGE = 0,
	DOTA_RUNE_HASTE = 1,
	DOTA_RUNE_ILLUSION = 2,
	DOTA_RUNE_INVISIBILITY = 3,
	DOTA_RUNE_REGENERATION = 4,
	DOTA_RUNE_BOUNTY = 5,
	DOTA_RUNE_ARCANE = 6,
	DOTA_RUNE_COUNT = 7
}
declare const enum MoveCollide_t {
	MOVECOLLIDE_DEFAULT = 0,
	MOVECOLLIDE_FLY_BOUNCE = 1,
	MOVECOLLIDE_FLY_CUSTOM = 2,
	MOVECOLLIDE_FLY_SLIDE = 3,
	MOVECOLLIDE_COUNT = 4,
	MOVECOLLIDE_MAX_BITS = 3
}
declare const enum ItemQuality_t {
	DOTA_ITEM_QUALITY_CONSUMABLE = 0,
	DOTA_ITEM_QUALITY_PLAIN = 1,
	DOTA_ITEM_QUALITY_COMMON = 2,
	DOTA_ITEM_QUALITY_RARE = 3,
	DOTA_ITEM_QUALITY_EPIC = 4,
	DOTA_ITEM_QUALITY_ARTIFACT = 5,
	DOTA_ITEM_QUALITY_SECRET_SHOP = 6,
	NUM_ITEM_QUALITY_LEVELS = 7
}
declare const enum SteamUGCQuery {
	RankedByVote = 0,
	RankedByPublicationDate = 1,
	AcceptedForGameRankedByAcceptanceDate = 2,
	RankedByTrend = 3,
	FavoritedByFriendsRankedByPublicationDate = 4,
	CreatedByFriendsRankedByPublicationDate = 5,
	RankedByNumTimesReported = 6,
	CreatedByFollowedUsersRankedByPublicationDate = 7,
	NotYetRated = 8,
	RankedByTotalVotesAsc = 9,
	RankedByVotesUp = 10,
	RankedByTextSearch = 11,
	RankedByTotalUniqueSubscriptions = 12,
	RankedByPlaytimeTrend = 13,
	RankedByTotalPlaytime = 14,
	RankedByAveragePlaytimeTrend = 15,
	RankedByLifetimeAveragePlaytime = 16,
	RankedByPlaytimeSessionsTrend = 17,
	RankedByLifetimePlaytimeSessions = 18
}
declare const enum PlayerConnectedState {
	PlayerConnected = 0,
	PlayerDisconnecting = 1,
	PlayerDisconnected = 2
}
declare const enum JointMotion_t {
	JOINT_MOTION_FREE = 0,
	JOINT_MOTION_LOCKED = 1,
	JOINT_MOTION_COUNT = 2
}
declare const enum OrderQueueBehavior_t {
	DOTA_ORDER_QUEUE_DEFAULT = 0,
	DOTA_ORDER_QUEUE_NEVER = 1,
	DOTA_ORDER_QUEUE_ALWAYS = 2
}
declare const enum RenderFx_t {
	kRenderFxNone = 0,
	kRenderFxPulseSlow = 1,
	kRenderFxPulseFast = 2,
	kRenderFxPulseSlowWide = 3,
	kRenderFxPulseFastWide = 4,
	kRenderFxFadeSlow = 5,
	kRenderFxFadeFast = 6,
	kRenderFxSolidSlow = 7,
	kRenderFxSolidFast = 8,
	kRenderFxStrobeSlow = 9,
	kRenderFxStrobeFast = 10,
	kRenderFxStrobeFaster = 11,
	kRenderFxFlickerSlow = 12,
	kRenderFxFlickerFast = 13,
	kRenderFxNoDissipation = 14,
	kRenderFxFadeOut = 15,
	kRenderFxFadeIn = 16,
	kRenderFxPulseFastWider = 17,
	kRenderFxGlowShell = 18,
	kRenderFxMax = 19
}
declare const enum GameActivity_t {
	ACT_DOTA_IDLE = 1500,
	ACT_DOTA_IDLE_RARE = 1501,
	ACT_DOTA_RUN = 1502,
	ACT_DOTA_ATTACK = 1503,
	ACT_DOTA_ATTACK2 = 1504,
	ACT_DOTA_ATTACK_EVENT = 1505,
	ACT_DOTA_DIE = 1506,
	ACT_DOTA_FLINCH = 1507,
	ACT_DOTA_FLAIL = 1508,
	ACT_DOTA_DISABLED = 1509,
	ACT_DOTA_CAST_ABILITY_1 = 1510,
	ACT_DOTA_CAST_ABILITY_2 = 1511,
	ACT_DOTA_CAST_ABILITY_3 = 1512,
	ACT_DOTA_CAST_ABILITY_4 = 1513,
	ACT_DOTA_CAST_ABILITY_5 = 1514,
	ACT_DOTA_CAST_ABILITY_6 = 1515,
	ACT_DOTA_OVERRIDE_ABILITY_1 = 1516,
	ACT_DOTA_OVERRIDE_ABILITY_2 = 1517,
	ACT_DOTA_OVERRIDE_ABILITY_3 = 1518,
	ACT_DOTA_OVERRIDE_ABILITY_4 = 1519,
	ACT_DOTA_CHANNEL_ABILITY_1 = 1520,
	ACT_DOTA_CHANNEL_ABILITY_2 = 1521,
	ACT_DOTA_CHANNEL_ABILITY_3 = 1522,
	ACT_DOTA_CHANNEL_ABILITY_4 = 1523,
	ACT_DOTA_CHANNEL_ABILITY_5 = 1524,
	ACT_DOTA_CHANNEL_ABILITY_6 = 1525,
	ACT_DOTA_CHANNEL_END_ABILITY_1 = 1526,
	ACT_DOTA_CHANNEL_END_ABILITY_2 = 1527,
	ACT_DOTA_CHANNEL_END_ABILITY_3 = 1528,
	ACT_DOTA_CHANNEL_END_ABILITY_4 = 1529,
	ACT_DOTA_CHANNEL_END_ABILITY_5 = 1530,
	ACT_DOTA_CHANNEL_END_ABILITY_6 = 1531,
	ACT_DOTA_CONSTANT_LAYER = 1532,
	ACT_DOTA_CAPTURE = 1533,
	ACT_DOTA_SPAWN = 1534,
	ACT_DOTA_KILLTAUNT = 1535,
	ACT_DOTA_TAUNT = 1536,
	ACT_DOTA_THIRST = 1537,
	ACT_DOTA_CAST_DRAGONBREATH = 1538,
	ACT_DOTA_ECHO_SLAM = 1539,
	ACT_DOTA_CAST_ABILITY_1_END = 1540,
	ACT_DOTA_CAST_ABILITY_2_END = 1541,
	ACT_DOTA_CAST_ABILITY_3_END = 1542,
	ACT_DOTA_CAST_ABILITY_4_END = 1543,
	ACT_MIRANA_LEAP_END = 1544,
	ACT_WAVEFORM_START = 1545,
	ACT_WAVEFORM_END = 1546,
	ACT_DOTA_CAST_ABILITY_ROT = 1547,
	ACT_DOTA_DIE_SPECIAL = 1548,
	ACT_DOTA_RATTLETRAP_BATTERYASSAULT = 1549,
	ACT_DOTA_RATTLETRAP_POWERCOGS = 1550,
	ACT_DOTA_RATTLETRAP_HOOKSHOT_START = 1551,
	ACT_DOTA_RATTLETRAP_HOOKSHOT_LOOP = 1552,
	ACT_DOTA_RATTLETRAP_HOOKSHOT_END = 1553,
	ACT_STORM_SPIRIT_OVERLOAD_RUN_OVERRIDE = 1554,
	ACT_DOTA_TINKER_REARM1 = 1555,
	ACT_DOTA_TINKER_REARM2 = 1556,
	ACT_DOTA_TINKER_REARM3 = 1557,
	ACT_TINY_AVALANCHE = 1558,
	ACT_TINY_TOSS = 1559,
	ACT_TINY_GROWL = 1560,
	ACT_DOTA_WEAVERBUG_ATTACH = 1561,
	ACT_DOTA_CAST_WILD_AXES_END = 1562,
	ACT_DOTA_CAST_LIFE_BREAK_START = 1563,
	ACT_DOTA_CAST_LIFE_BREAK_END = 1564,
	ACT_DOTA_NIGHTSTALKER_TRANSITION = 1565,
	ACT_DOTA_LIFESTEALER_RAGE = 1566,
	ACT_DOTA_LIFESTEALER_OPEN_WOUNDS = 1567,
	ACT_DOTA_SAND_KING_BURROW_IN = 1568,
	ACT_DOTA_SAND_KING_BURROW_OUT = 1569,
	ACT_DOTA_EARTHSHAKER_TOTEM_ATTACK = 1570,
	ACT_DOTA_WHEEL_LAYER = 1571,
	ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START = 1572,
	ACT_DOTA_ALCHEMIST_CONCOCTION = 1573,
	ACT_DOTA_JAKIRO_LIQUIDFIRE_START = 1574,
	ACT_DOTA_JAKIRO_LIQUIDFIRE_LOOP = 1575,
	ACT_DOTA_LIFESTEALER_INFEST = 1576,
	ACT_DOTA_LIFESTEALER_INFEST_END = 1577,
	ACT_DOTA_LASSO_LOOP = 1578,
	ACT_DOTA_ALCHEMIST_CONCOCTION_THROW = 1579,
	ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_END = 1580,
	ACT_DOTA_CAST_COLD_SNAP = 1581,
	ACT_DOTA_CAST_GHOST_WALK = 1582,
	ACT_DOTA_CAST_TORNADO = 1583,
	ACT_DOTA_CAST_EMP = 1584,
	ACT_DOTA_CAST_ALACRITY = 1585,
	ACT_DOTA_CAST_CHAOS_METEOR = 1586,
	ACT_DOTA_CAST_SUN_STRIKE = 1587,
	ACT_DOTA_CAST_FORGE_SPIRIT = 1588,
	ACT_DOTA_CAST_ICE_WALL = 1589,
	ACT_DOTA_CAST_DEAFENING_BLAST = 1590,
	ACT_DOTA_VICTORY = 1591,
	ACT_DOTA_DEFEAT = 1592,
	ACT_DOTA_SPIRIT_BREAKER_stringGE_POSE = 1593,
	ACT_DOTA_SPIRIT_BREAKER_stringGE_END = 1594,
	ACT_DOTA_TELEPORT = 1595,
	ACT_DOTA_TELEPORT_END = 1596,
	ACT_DOTA_CAST_REFRACTION = 1597,
	ACT_DOTA_CAST_ABILITY_7 = 1598,
	ACT_DOTA_CANCEL_SIREN_SONG = 1599,
	ACT_DOTA_CHANNEL_ABILITY_7 = 1600,
	ACT_DOTA_LOADOUT = 1601,
	ACT_DOTA_FORCESTAFF_END = 1602,
	ACT_DOTA_POOF_END = 1603,
	ACT_DOTA_SLARK_POUNCE = 1604,
	ACT_DOTA_MAGNUS_SKEWER_START = 1605,
	ACT_DOTA_MAGNUS_SKEWER_END = 1606,
	ACT_DOTA_MEDUSA_STONE_GAZE = 1607,
	ACT_DOTA_RELAX_START = 1608,
	ACT_DOTA_RELAX_LOOP = 1609,
	ACT_DOTA_RELAX_END = 1610,
	ACT_DOTA_CENTAUR_STAMPEDE = 1611,
	ACT_DOTA_BELLYACHE_START = 1612,
	ACT_DOTA_BELLYACHE_LOOP = 1613,
	ACT_DOTA_BELLYACHE_END = 1614,
	ACT_DOTA_ROQUELAIRE_LAND = 1615,
	ACT_DOTA_ROQUELAIRE_LAND_IDLE = 1616,
	ACT_DOTA_GREEVIL_CAST = 1617,
	ACT_DOTA_GREEVIL_OVERRIDE_ABILITY = 1618,
	ACT_DOTA_GREEVIL_HOOK_START = 1619,
	ACT_DOTA_GREEVIL_HOOK_END = 1620,
	ACT_DOTA_GREEVIL_BLINK_BONE = 1621,
	ACT_DOTA_IDLE_SLEEPING = 1622,
	ACT_DOTA_INTRO = 1623,
	ACT_DOTA_GESTURE_POINT = 1624,
	ACT_DOTA_GESTURE_ACCENT = 1625,
	ACT_DOTA_SLEEPING_END = 1626,
	ACT_DOTA_AMBUSH = 1627,
	ACT_DOTA_ITEM_LOOK = 1628,
	ACT_DOTA_STARTLE = 1629,
	ACT_DOTA_FRUSTRATION = 1630,
	ACT_DOTA_TELEPORT_REACT = 1631,
	ACT_DOTA_TELEPORT_END_REACT = 1632,
	ACT_DOTA_SHRUG = 1633,
	ACT_DOTA_RELAX_LOOP_END = 1634,
	ACT_DOTA_PRESENT_ITEM = 1635,
	ACT_DOTA_IDLE_IMPATIENT = 1636,
	ACT_DOTA_SHARPEN_WEAPON = 1637,
	ACT_DOTA_SHARPEN_WEAPON_OUT = 1638,
	ACT_DOTA_IDLE_SLEEPING_END = 1639,
	ACT_DOTA_BRIDGE_DESTROY = 1640,
	ACT_DOTA_TAUNT_SNIPER = 1641,
	ACT_DOTA_DEATH_BY_SNIPER = 1642,
	ACT_DOTA_LOOK_AROUND = 1643,
	ACT_DOTA_CAGED_CREEP_RAGE = 1644,
	ACT_DOTA_CAGED_CREEP_RAGE_OUT = 1645,
	ACT_DOTA_CAGED_CREEP_SMASH = 1646,
	ACT_DOTA_CAGED_CREEP_SMASH_OUT = 1647,
	ACT_DOTA_IDLE_IMPATIENT_SWORD_TAP = 1648,
	ACT_DOTA_INTRO_LOOP = 1649,
	ACT_DOTA_BRIDGE_THREAT = 1650,
	ACT_DOTA_DAGON = 1651,
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL_START = 1652,
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL = 1653,
	ACT_DOTA_CAST_ABILITY_2_ES_ROLL_END = 1654,
	ACT_DOTA_NIAN_PIN_START = 1655,
	ACT_DOTA_NIAN_PIN_LOOP = 1656,
	ACT_DOTA_NIAN_PIN_END = 1657,
	ACT_DOTA_LEAP_STUN = 1658,
	ACT_DOTA_LEAP_SWIPE = 1659,
	ACT_DOTA_NIAN_INTRO_LEAP = 1660,
	ACT_DOTA_AREA_DENY = 1661,
	ACT_DOTA_NIAN_PIN_TO_STUN = 1662,
	ACT_DOTA_RAZE_1 = 1663,
	ACT_DOTA_RAZE_2 = 1664,
	ACT_DOTA_RAZE_3 = 1665,
	ACT_DOTA_UNDYING_DECAY = 1666,
	ACT_DOTA_UNDYING_SOUL_RIP = 1667,
	ACT_DOTA_UNDYING_TOMBSTONE = 1668,
	ACT_DOTA_WHIRLING_AXES_RANGED = 1669,
	ACT_DOTA_SHALLOW_GRAVE = 1670,
	ACT_DOTA_COLD_FEET = 1671,
	ACT_DOTA_ICE_VORTEX = 1672,
	ACT_DOTA_CHILLING_TOUCH = 1673,
	ACT_DOTA_ENFEEBLE = 1674,
	ACT_DOTA_FATAL_BONDS = 1675,
	ACT_DOTA_MIDNIGHT_PULSE = 1676,
	ACT_DOTA_ANCESTRAL_SPIRIT = 1677,
	ACT_DOTA_THUNDER_STRIKE = 1678,
	ACT_DOTA_KINETIC_FIELD = 1679,
	ACT_DOTA_STATIC_STORM = 1680,
	ACT_DOTA_MINI_TAUNT = 1681,
	ACT_DOTA_ARCTIC_BURN_END = 1682,
	ACT_DOTA_LOADOUT_RARE = 1683,
	ACT_DOTA_SWIM = 1684,
	ACT_DOTA_FLEE = 1685,
	ACT_DOTA_TROT = 1686,
	ACT_DOTA_SHAKE = 1687,
	ACT_DOTA_SWIM_IDLE = 1688,
	ACT_DOTA_WAIT_IDLE = 1689,
	ACT_DOTA_GREET = 1690,
	ACT_DOTA_TELEPORT_COOP_START = 1691,
	ACT_DOTA_TELEPORT_COOP_WAIT = 1692,
	ACT_DOTA_TELEPORT_COOP_END = 1693,
	ACT_DOTA_TELEPORT_COOP_EXIT = 1694,
	ACT_DOTA_SHOPKEEPER_PET_INTERACT = 1695,
	ACT_DOTA_ITEM_PICKUP = 1696,
	ACT_DOTA_ITEM_DROP = 1697,
	ACT_DOTA_CAPTURE_PET = 1698,
	ACT_DOTA_PET_WARD_OBSERVER = 1699,
	ACT_DOTA_PET_WARD_SENTRY = 1700,
	ACT_DOTA_PET_LEVEL = 1701,
	ACT_DOTA_CAST_BURROW_END = 1702,
	ACT_DOTA_LIFESTEALER_ASSIMILATE = 1703,
	ACT_DOTA_LIFESTEALER_EJECT = 1704,
	ACT_DOTA_ATTACK_EVENT_BASH = 1705,
	ACT_DOTA_CAPTURE_RARE = 1706,
	ACT_DOTA_AW_MAGNETIC_FIELD = 1707,
	ACT_DOTA_CAST_GHOST_SHIP = 1708,
	ACT_DOTA_FXANIM = 1709,
	ACT_DOTA_VICTORY_START = 1710,
	ACT_DOTA_DEFEAT_START = 1711,
	ACT_DOTA_DP_SPIRIT_SIPHON = 1712,
	ACT_DOTA_TRICKS_END = 1713,
	ACT_DOTA_ES_STONE_CALLER = 1714,
	ACT_DOTA_MK_STRIKE = 1715,
	ACT_DOTA_VERSUS = 1716,
	ACT_DOTA_CAPTURE_CARD = 1717,
	ACT_DOTA_MK_SPRING_SOAR = 1718,
	ACT_DOTA_MK_SPRING_END = 1719,
	ACT_DOTA_MK_TREE_SOAR = 1720,
	ACT_DOTA_MK_TREE_END = 1721,
	ACT_DOTA_MK_FUR_ARMY = 1722,
	ACT_DOTA_MK_SPRING_CAST = 1723,
	ACT_DOTA_NECRO_GHOST_SHROUD = 1724,
	ACT_DOTA_OVERRIDE_ARCANA = 1725,
	ACT_DOTA_SLIDE = 1726,
	ACT_DOTA_SLIDE_LOOP = 1727,
	ACT_DOTA_GENERIC_CHANNEL_1 = 1728,
	ACT_DOTA_GS_SOUL_CHAIN = 1729,
	ACT_DOTA_GS_INK_CREATURE = 1730
}
declare const enum TOGGLE_STATE {
	TS_AT_TOP = 0,
	TS_AT_BOTTOM = 1,
	TS_GOING_UP = 2,
	TS_GOING_DOWN = 3,
	DOOR_OPEN = 0,
	DOOR_CLOSED = 1,
	DOOR_OPENING = 2,
	DOOR_CLOSING = 3
}
declare const enum Attributes {
	DOTA_ATTRIBUTE_STRENGTH = 0,
	DOTA_ATTRIBUTE_AGILITY = 1,
	DOTA_ATTRIBUTE_INTELLECT = 2,
	DOTA_ATTRIBUTE_MAX = 3,
	DOTA_ATTRIBUTE_INVALID = -1
}
declare const enum SpeechPriorityType {
	SPEECH_PRIORITY_LOW = 0,
	SPEECH_PRIORITY_NORMAL = 1,
	SPEECH_PRIORITY_MANUAL = 2,
	SPEECH_PRIORITY_UNINTERRUPTABLE = 3
}
declare const enum PointWorldTextJustifyVertical_t {
	POINT_WORLD_TEXT_JUSTIFY_VERTICAL_BOTTOM = 0,
	POINT_WORLD_TEXT_JUSTIFY_VERTICAL_CENTER = 1,
	POINT_WORLD_TEXT_JUSTIFY_VERTICAL_TOP = 2
}
declare const enum PortraitScale_t {
	PORTRAIT_SCALE_INVALID = -1,
	PORTRAIT_SCALE_LOADOUT = 0,
	PORTRAIT_SCALE_ALTERNATE_LOADOUT = 1,
	PORTRAIT_SCALE_WORLD = 2,
	PORTRAIT_SCALE_SPECTATOR_LOADOUT = 3
}
declare const enum DOTA_UNIT_TARGET_TEAM {
	DOTA_UNIT_TARGET_TEAM_NONE = 0,
	DOTA_UNIT_TARGET_TEAM_FRIENDLY = 1,
	DOTA_UNIT_TARGET_TEAM_ENEMY = 2,
	DOTA_UNIT_TARGET_TEAM_CUSTOM = 4,
	DOTA_UNIT_TARGET_TEAM_BOTH = 3
}
declare const enum PointTemplateOwnerSpawnGroupType_t {
	INSERT_INTO_POINT_TEMPLATE_SPAWN_GROUP = 0,
	INSERT_INTO_CURRENTLY_ACTIVE_SPAWN_GROUP = 1,
	INSERT_INTO_NEWLY_CREATED_SPAWN_GROUP = 2
}
declare const enum ObstructionRelationshipClass_t {
	DOTA_OBSTRUCTION_RELATIONSHIP_NONE = 0,
	DOTA_OBSTRUCTION_RELATIONSHIP_BUILDING = 1,
	DOTA_OBSTRUCTION_RELATIONSHIP_PLAYER_CONTROLLED = 2,
	DOTA_OBSTRUCTION_RELATIONSHIP_NPC = 3,
	DOTA_OBSTRUCTION_RELATIONSHIP_LAST = 4
}
declare const enum NavDirType {
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3,
	NUM_DIRECTIONS = 4
}
declare const enum CLICK_BEHAVIORS {
	DOTA_CLICK_BEHAVIOR_NONE = 0,
	DOTA_CLICK_BEHAVIOR_MOVE = 1,
	DOTA_CLICK_BEHAVIOR_ATTACK = 2,
	DOTA_CLICK_BEHAVIOR_CAST = 3,
	DOTA_CLICK_BEHAVIOR_DROP_ITEM = 4,
	DOTA_CLICK_BEHAVIOR_DROP_SHOP_ITEM = 5,
	DOTA_CLICK_BEHAVIOR_DRAG = 6,
	DOTA_CLICK_BEHAVIOR_LEARN_ABILITY = 7,
	DOTA_CLICK_BEHAVIOR_PATROL = 8,
	DOTA_CLICK_BEHAVIOR_VECTOR_CAST = 9,
	DOTA_CLICK_BEHAVIOR_UNUSED = 10,
	DOTA_CLICK_BEHAVIOR_RADAR = 11,
	DOTA_CLICK_BEHAVIOR_LAST = 12
}
declare const enum sound_states {
	SS_NONE = 0,
	SS_SHUTDOWN = 1,
	SS_SHUTDOWN_WATER = 2,
	SS_START_WATER = 3,
	SS_START_IDLE = 4,
	SS_IDLE = 5,
	SS_GEAR_0 = 6,
	SS_GEAR_1 = 7,
	SS_GEAR_2 = 8,
	SS_GEAR_3 = 9,
	SS_GEAR_4 = 10,
	SS_SLOWDOWN = 11,
	SS_SLOWDOWN_HIGHSPEED = 12,
	SS_GEAR_0_RESUME = 13,
	SS_GEAR_1_RESUME = 14,
	SS_GEAR_2_RESUME = 15,
	SS_GEAR_3_RESUME = 16,
	SS_GEAR_4_RESUME = 17,
	SS_TURBO = 18,
	SS_REVERSE = 19,
	SS_NUM_STATES = 20
}
declare const enum SurroundingBoundsType_t {
	USE_OBB_COLLISION_BOUNDS = 0,
	USE_BEST_COLLISION_BOUNDS = 1,
	USE_HITBOXES = 2,
	USE_SPECIFIED_BOUNDS = 3,
	USE_GAME_CODE = 4,
	USE_ROTATION_EXPANDED_BOUNDS = 5,
	USE_COLLISION_BOUNDS_NEVER_VPHYSICS = 6,
	USE_ROTATION_EXPANDED_SEQUENCE_BOUNDS = 7,
	SURROUNDING_TYPE_BIT_COUNT = 3
}
declare const enum RenderMultisampleType_t {
	RENDER_MULTISAMPLE_INVALID = -1,
	RENDER_MULTISAMPLE_NONE = 0,
	RENDER_MULTISAMPLE_2X = 1,
	RENDER_MULTISAMPLE_4X = 2,
	RENDER_MULTISAMPLE_6X = 3,
	RENDER_MULTISAMPLE_8X = 4,
	RENDER_MULTISAMPLE_16X = 5,
	RENDER_MULTISAMPLE_TYPE_COUNT = 6
}
declare const enum ParticleLightTypeChoiceList_t {
	PARTICLE_LIGHT_TYPE_POINT = 0,
	PARTICLE_LIGHT_TYPE_SPOT = 1
}
declare const enum WorldTextPanelOrientation_t {
	WORLDTEXT_ORIENTATION_DEFAULT = 0,
	WORLDTEXT_ORIENTATION_FACEUSER = 1,
	WORLDTEXT_ORIENTATION_FACEUSER_UPRIGHT = 2
}
declare const enum DotaCustomUIType_t {
	DOTA_CUSTOM_UI_TYPE_HUD = 0,
	DOTA_CUSTOM_UI_TYPE_HERO_SELECTION = 1,
	DOTA_CUSTOM_UI_TYPE_GAME_INFO = 2,
	DOTA_CUSTOM_UI_TYPE_GAME_SETUP = 3,
	DOTA_CUSTOM_UI_TYPE_FLYOUT_SCOREBOARD = 4,
	DOTA_CUSTOM_UI_TYPE_HUD_TOP_BAR = 5,
	DOTA_CUSTOM_UI_TYPE_END_SCREEN = 6,
	DOTA_CUSTOM_UI_TYPE_COUNT = 7,
	DOTA_CUSTOM_UI_TYPE_INVALID = -1
}
declare const enum TextureSpecificationFlags_t {
	TSPEC_FLAGS = 0,
	TSPEC_RENDER_TARGET = 1,
	TSPEC_VERTEX_TEXTURE = 2,
	TSPEC_UNFILTERABLE_OK = 4,
	TSPEC_RENDER_TARGET_SAMPLEABLE = 8,
	TSPEC_SUGGEST_CLAMPS = 16,
	TSPEC_SUGGEST_CLAMPT = 32,
	TSPEC_SUGGEST_CLAMPU = 64,
	TSPEC_NO_LOD = 128,
	TSPEC_CUBE_TEXTURE = 256,
	TSPEC_VOLUME_TEXTURE = 512,
	TSPEC_TEXTURE_ARRAY = 1024,
	TSPEC_TEXTURE_GEN_MIP_MAPS = 2048,
	TSPEC_LINE_TEXTURE_360 = 4096,
	TSPEC_LINEAR_ADDRESSING_360 = 8192,
	TSPEC_USE_TYPED_IMAGEFORMAT = 16384,
	TSPEC_SHARED_RESOURCE = 32768,
	TSPEC_UAV = 65536,
	TSPEC_INPUT_ATTACHMENT = 131072,
	TSPEC_CUBE_CAN_SAMPLE_AS_ARRAY = 262144
}
declare const enum EShareAbility {
	ITEM_FULLY_SHAREABLE = 0,
	ITEM_PARTIALLY_SHAREABLE = 1,
	ITEM_NOT_SHAREABLE = 2
}
declare const enum ShatterSurface_t {
	SHATTERSURFACE_GLASS = 0,
	SHATTERSURFACE_TILE = 1
}
declare const enum vote_create_failed_t {
	VOTE_FAILED_GENERIC = 0,
	VOTE_FAILED_TRANSITIONING_PLAYERS = 1,
	VOTE_FAILED_RATE_EXCEEDED = 2,
	VOTE_FAILED_YES_MUST_EXCEED_NO = 3,
	VOTE_FAILED_QUORUM_FAILURE = 4,
	VOTE_FAILED_ISSUE_DISABLED = 5,
	VOTE_FAILED_MAP_NOT_FOUND = 6,
	VOTE_FAILED_MAP_NAME_REQUIRED = 7,
	VOTE_FAILED_FAILED_RECENTLY = 8,
	VOTE_FAILED_TEAM_CANT_CALL = 9,
	VOTE_FAILED_WAITINGFORPLAYERS = 10,
	VOTE_FAILED_PLAYERNOTFOUND = 11,
	VOTE_FAILED_CANNOT_KICK_ADMIN = 12,
	VOTE_FAILED_SCRAMBLE_IN_PROGRESS = 13,
	VOTE_FAILED_SPECTATOR = 14
}
declare const enum EDOTA_ModifyGold_Reason {
	DOTA_ModifyGold_Unspecified = 0,
	DOTA_ModifyGold_Death = 1,
	DOTA_ModifyGold_Buyback = 2,
	DOTA_ModifyGold_PurchaseConsumable = 3,
	DOTA_ModifyGold_PurchaseItem = 4,
	DOTA_ModifyGold_AbandonedRedistribute = 5,
	DOTA_ModifyGold_SellItem = 6,
	DOTA_ModifyGold_AbilityCost = 7,
	DOTA_ModifyGold_CheatCommand = 8,
	DOTA_ModifyGold_SelectionPenalty = 9,
	DOTA_ModifyGold_GameTick = 10,
	DOTA_ModifyGold_Building = 11,
	DOTA_ModifyGold_HeroKill = 12,
	DOTA_ModifyGold_CreepKill = 13,
	DOTA_ModifyGold_RoshanKill = 14,
	DOTA_ModifyGold_CourierKill = 15,
	DOTA_ModifyGold_SharedGold = 16
}
declare const enum DOTASlotType_t {
	DOTA_LOADOUT_TYPE_INVALID = -1,
	DOTA_LOADOUT_TYPE_WEAPON = 0,
	DOTA_LOADOUT_TYPE_OFFHAND_WEAPON = 1,
	DOTA_LOADOUT_TYPE_WEAPON2 = 2,
	DOTA_LOADOUT_TYPE_OFFHAND_WEAPON2 = 3,
	DOTA_LOADOUT_TYPE_HEAD = 4,
	DOTA_LOADOUT_TYPE_SHOULDER = 5,
	DOTA_LOADOUT_TYPE_ARMS = 6,
	DOTA_LOADOUT_TYPE_ARMOR = 7,
	DOTA_LOADOUT_TYPE_BELT = 8,
	DOTA_LOADOUT_TYPE_NECK = 9,
	DOTA_LOADOUT_TYPE_BACK = 10,
	DOTA_LOADOUT_TYPE_LEGS = 11,
	DOTA_LOADOUT_TYPE_GLOVES = 12,
	DOTA_LOADOUT_TYPE_TAIL = 13,
	DOTA_LOADOUT_TYPE_MISC = 14,
	DOTA_LOADOUT_TYPE_BODY_HEAD = 15,
	DOTA_LOADOUT_TYPE_MOUNT = 16,
	DOTA_LOADOUT_TYPE_SUMMON = 17,
	DOTA_LOADOUT_TYPE_SHAPESHIFT = 18,
	DOTA_LOADOUT_TYPE_TAUNT = 19,
	DOTA_LOADOUT_TYPE_AMBIENT_EFFECTS = 20,
	DOTA_LOADOUT_TYPE_ABILITY_ATTACK = 21,
	DOTA_LOADOUT_TYPE_ABILITY1 = 22,
	DOTA_LOADOUT_TYPE_ABILITY2 = 23,
	DOTA_LOADOUT_TYPE_ABILITY3 = 24,
	DOTA_LOADOUT_TYPE_ABILITY4 = 25,
	DOTA_LOADOUT_TYPE_ABILITY_ULTIMATE = 26,
	DOTA_LOADOUT_TYPE_VOICE = 27,
	DOTA_LOADOUT_TYPE_ACTION_ITEM = 28,
	DOTA_LOADOUT_TYPE_COURIER = 29,
	DOTA_LOADOUT_TYPE_ANNOUNCER = 30,
	DOTA_LOADOUT_TYPE_MEGA_KILLS = 31,
	DOTA_LOADOUT_TYPE_MUSIC = 32,
	DOTA_LOADOUT_TYPE_WARD = 33,
	DOTA_LOADOUT_TYPE_HUD_SKIN = 34,
	DOTA_LOADOUT_TYPE_LOADING_SCREEN = 35,
	DOTA_LOADOUT_TYPE_WEATHER = 36,
	DOTA_LOADOUT_TYPE_HEROIC_STATUE = 37,
	DOTA_LOADOUT_TYPE_MULTIKILL_BANNER = 38,
	DOTA_LOADOUT_TYPE_CURSOR_PACK = 39,
	DOTA_LOADOUT_TYPE_TELEPORT_EFFECT = 40,
	DOTA_LOADOUT_TYPE_BLINK_EFFECT = 41,
	DOTA_LOADOUT_TYPE_EMBLEM = 42,
	DOTA_LOADOUT_TYPE_TERRAIN = 43,
	DOTA_LOADOUT_TYPE_RADIANT_CREEPS = 44,
	DOTA_LOADOUT_TYPE_DIRE_CREEPS = 45,
	DOTA_PLAYER_LOADOUT_START = 28,
	DOTA_PLAYER_LOADOUT_END = 45,
	DOTA_LOADOUT_TYPE_NONE = 46,
	DOTA_LOADOUT_TYPE_COUNT = 47
}
declare const enum PlayerUltimateStateOrTime_t {
	PLAYER_ULTIMATE_STATE_READY = 0,
	PLAYER_ULTIMATE_STATE_NO_MANA = -1,
	PLAYER_ULTIMATE_STATE_NOT_LEVELED = -2,
	PLAYER_ULTIMATE_STATE_HIDDEN = -3
}
declare const enum DOTA_HOLDOUT_WALL_TYPE {
	DOTA_HOLDOUT_WALL_NONE = 0,
	DOTA_HOLDOUT_WALL_PHYSICAL = 1,
	DOTA_HOLDOUT_WALL_FIRE = 2,
	DOTA_HOLDOUT_WALL_ICE = 3,
	DOTA_HOLDOUT_WALL_COUNT = 4
}
declare const enum ConstraintType_t {
	CONSTRAINT_TYPE_INVALID = 0,
	CONSTRAINT_TYPE_HELPER_BONE = 1,
	CONSTRAINT_TYPE_TWIST = 2,
	CONSTRAINT_TYPE_AIM = 3,
	CONSTRAINT_TYPE_POINT = 4,
	CONSTRAINT_TYPE_ROTATION = 5,
	CONSTRAINT_TYPE_ORIENT = 6,
	CONSTRAINT_TYPE_2_BONE_IK = 7,
	CONSTRAINT_TYPE_JIGGLE_BONE = 8,
	CONSTRAINT_TYPE_TILT_TWIST = 9,
	CONSTRAINT_TYPE_MORPH = 10,
	CONSTRAINT_TYPE_PARENT = 11,
	CONSTRAINT_TYPE_POSE_SPACE_MORPH = 12,
	CONSTRAINT_TYPE_POSE_SPACE_BONE = 13,
	CONSTRAINT_TYPE_MAX = 14
}
declare const enum Materials {
	matGlass = 0,
	matWood = 1,
	matMetal = 2,
	matFlesh = 3,
	matCinderBlock = 4,
	matCeilingTile = 5,
	matComputer = 6,
	matUnbreakableGlass = 7,
	matRocks = 8,
	matWeb = 9,
	matNone = 10,
	matLastMaterial = 11
}
declare const enum LayoutPositionType_e {
	LAYOUTPOSITIONTYPE_VIEWPORT_RELATIVE = 0,
	LAYOUTPOSITIONTYPE_FRACTIONAL = 1,
	LAYOUTPOSITIONTYPE_NONE = 2
}
declare const enum HeroPickType {
	HERO_PICK = 0,
	HERO_BAN = 1
}
declare const enum JointAxis_t {
	JOINT_AXIS_X = 0,
	JOINT_AXIS_Y = 1,
	JOINT_AXIS_Z = 2,
	JOINT_AXIS_COUNT = 3
}
declare const enum RMSG_EventType_t {
	RMSG_EVENT_INVALID = -1,
	RMSG_SYSTEM_FRAME_BOUNDARY = 0,
	RMSG_SYSTEM_BLOCKING_LOAD = 1,
	RMSG_SYSTEM_TYPE_MANAGER_UPDATE = 2,
	RMSG_RESOURCE_LOAD_REQUEST_QUEUED = 3,
	RMSG_RESOURCE_OBSOLETE_1 = 4,
	RMSG_RESOURCE_OBSOLETE_2 = 5,
	RMSG_RESOURCE_DATA_IO = 6,
	RMSG_RESOURCE_DATA_LOADED = 7,
	RMSG_RESOURCE_AUTOCONVERT = 8,
	RMSG_RESOURCE_EXTREF_FIXUP = 9,
	RMSG_RESOURCE_ALLOCATE = 10,
	RMSG_CLEANUP_REFERENCES = 11,
	RMSG_RESOURCE_DEALLOCATE = 12,
	RMSG_RESOURCE_LOAD_COMPLETED = 13,
	RMSG_RESOURCE_LOAD_FAILED = 14,
	RMSG_RESOURCE_LOAD_NAMEONLY_COMPLETED = 15,
	RMSG_MANIFEST_DATA_LOADED = 16,
	RMSG_MANIFEST_BLOCKING_LOAD = 17,
	RMSG_MANIFEST_LOAD_COMPLETED = 18,
	RMSG_ENTITY_SPAWN = 19,
	RMSG_ENTITY_ACTIVATE = 20,
	RMSG_ENTITY_DELETE = 21,
	RMSG_ENTITY_COMPONENTS_ACTIVATE = 22,
	RMSG_PRE_SPAWN_GROUP_LOAD = 23,
	RMSG_POST_SPAWN_GROUP_LOAD = 24,
	RMSG_UNUSED_1 = 25,
	RMSG_UNUSED_2 = 26,
	RMSG_UNUSED_3 = 27,
	RMSG_UNUSED_4 = 28,
	RMSG_UNUSED_5 = 29,
	RMSG_UNUSED_6 = 30,
	RMSG_UNUSED_7 = 31,
	RMSG_UNUSED_8 = 32,
	RMSG_EVENT_COUNT = 33
}
declare const enum AimMatrixBlendMode {
	AimMatrixBlendMode_Additive = 0,
	AimMatrixBlendMode_BoneMask = 1
}
declare const enum modifierstate {
	MODIFIER_STATE_ROOTED = 0,
	MODIFIER_STATE_DISARMED = 1,
	MODIFIER_STATE_ATTACK_IMMUNE = 2,
	MODIFIER_STATE_SILENCED = 3,
	MODIFIER_STATE_MUTED = 4,
	MODIFIER_STATE_STUNNED = 5,
	MODIFIER_STATE_HEXED = 6,
	MODIFIER_STATE_INVISIBLE = 7,
	MODIFIER_STATE_INVULNERABLE = 8,
	MODIFIER_STATE_MAGIC_IMMUNE = 9,
	MODIFIER_STATE_PROVIDES_VISION = 10,
	MODIFIER_STATE_NIGHTMARED = 11,
	MODIFIER_STATE_BLOCK_DISABLED = 12,
	MODIFIER_STATE_EVADE_DISABLED = 13,
	MODIFIER_STATE_UNSELECTABLE = 14,
	MODIFIER_STATE_CANNOT_TARGET_ENEMIES = 15,
	MODIFIER_STATE_CANNOT_MISS = 16,
	MODIFIER_STATE_SPECIALLY_DENIABLE = 17,
	MODIFIER_STATE_FROZEN = 18,
	MODIFIER_STATE_COMMAND_RESTRICTED = 19,
	MODIFIER_STATE_NOT_ON_MINIMAP = 20,
	MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES = 21,
	MODIFIER_STATE_LOW_ATTACK_PRIORITY = 22,
	MODIFIER_STATE_NO_HEALTH_BAR = 23,
	MODIFIER_STATE_FLYING = 24,
	MODIFIER_STATE_NO_UNIT_COLLISION = 25,
	MODIFIER_STATE_NO_TEAM_MOVE_TO = 26,
	MODIFIER_STATE_NO_TEAM_SELECT = 27,
	MODIFIER_STATE_PASSIVES_DISABLED = 28,
	MODIFIER_STATE_DOMINATED = 29,
	MODIFIER_STATE_BLIND = 30,
	MODIFIER_STATE_OUT_OF_GAME = 31,
	MODIFIER_STATE_FAKE_ALLY = 32,
	MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY = 33,
	MODIFIER_STATE_TRUESIGHT_IMMUNE = 34,
	MODIFIER_STATE_UNTARGETABLE = 35,
	MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS = 36,
	MODIFIER_STATE_LAST = 37
}
declare const enum BlurFilterType_t {
	BLURFILTER_GAUSSIAN = 0,
	BLURFILTER_BOX = 1
}
declare const enum AnimVRHand_t {
	AnimVRHand_Left = 0,
	AnimVRHand_Right = 1
}
declare const enum MeshDrawPrimitiveFlags_t {
	MESH_DRAW_FLAGS_NONE = 0,
	MESH_DRAW_FLAGS_USE_SHADOW_FAST_PATH = 1,
	MESH_DRAW_FLAGS_USE_COMPRESSED_NORMAL_TANGENT = 2,
	MESH_DRAW_FLAGS_IS_OCCLUDER = 4,
	MESH_DRAW_INPUT_LAYOUT_IS_NOT_MATCHED_TO_MATERIAL = 8,
	MESH_DRAW_FLAGS_USE_COMPRESSED_PER_VERTEX_LIGHTING = 16,
	MESH_DRAW_FLAGS_USE_UNCOMPRESSED_PER_VERTEX_LIGHTING = 32,
	MESH_DRAW_FLAGS_CAN_BATCH_WITH_DYNAMIC_SHADER_CONSTANTS = 64,
	MESH_DRAW_FLAGS_DRAW_LAST = 128,
	MESH_DRAW_FLAGS_HAS_LIGHTING_BASIS = 256
}
declare const enum ParticleFloatType_t {
	PF_TYPE_INVALID = -1,
	PF_TYPE_LITERAL = 0,
	PF_TYPE_PARTICLE_AGE = 1,
	PF_TYPE_PARTICLE_AGE_NORMALIZED = 2,
	PF_TYPE_COLLECTION_AGE = 3,
	PF_TYPE_CONTROL_POINT_COMPONENT = 4,
	PF_TYPE_PARTICLE_FLOAT = 5,
	PF_TYPE_PARTICLE_VECTOR_COMPONENT = 6,
	PF_TYPE_PARTICLE_SPEED = 7,
	PF_TYPE_COUNT = 8
}
declare const enum EconEntityParticleDisableMode_t {
	ECON_ENTITY_PARTICLES_ENABLED = 0,
	ECON_ENTITY_PARTICLES_DISABLED = 1,
	ECON_ENTITY_PARTICLES_DISABLED_BUT_PLAY_ENDCAPS_TO_STOP = 2
}
declare const enum ShopItemViewMode_t {
	SHOP_VIEW_MODE_LIST = 0,
	SHOP_VIEW_MODE_GRID = 1
}
declare const enum IrradVolumeFlags_t {
	IRRADVOLUME_FLAGS_NONE = 0,
	IRRADVOLUME_FLAG_AUTO_GENERATED = 1
}
declare const enum ParticleFloatMapType_t {
	PF_MAP_TYPE_INVALID = -1,
	PF_MAP_TYPE_DIRECT = 0,
	PF_MAP_TYPE_MULT = 1,
	PF_MAP_TYPE_REMAP = 2,
	PF_MAP_TYPE_CURVE = 3,
	PF_MAP_TYPE_COUNT = 4
}
declare const enum BeamType_t {
	BEAM_INVALID = 0,
	BEAM_POINTS = 1,
	BEAM_ENTPOINT = 2,
	BEAM_ENTS = 3,
	BEAM_HOSE = 4,
	BEAM_SPLINE = 5,
	BEAM_LASER = 6
}
declare const enum subquest_player_stat_types_t {
	SUBQUEST_PLAYER_STAT_GOLD = 0,
	SUBQUEST_PLAYER_STAT_LEVEL = 1,
	SUBQUEST_PLAYER_STAT_LAST_HITS = 2,
	SUBQUEST_PLAYER_STAT_DENIES = 3,
	SUBQUEST_NUM_PLAYER_STATS = 4
}
declare const enum SequenceCombineMode_t {
	SEQUENCE_COMBINE_MODE_USE_SEQUENCE_0 = 0,
	SEQUENCE_COMBINE_MODE_USE_SEQUENCE_1 = 1,
	SEQUENCE_COMBINE_MODE_AVERAGE = 2,
	SEQUENCE_COMBINE_MODE_ADDITIVE = 3,
	SEQUENCE_COMBINE_MODE_ALPHA_FROM0_RGB_FROM_1 = 4,
	SEQUENCE_COMBINE_MODE_ALPHA_FROM1_RGB_FROM_0 = 5,
	SEQUENCE_COMBINE_MODE_WEIGHTED_BLEND = 6,
	SEQUENCE_COMBINE_MODE_ALPHA_BLEND_1_OVER_0 = 7,
	SEQUENCE_COMBINE_MODE_REPLICATEALPHA0 = 8,
	SEQUENCE_COMBINE_MODE_REPLICATEALPHA1 = 9,
	SEQUENCE_COMBINE_MODE_ALPHA_BLEND_0_OVER_1 = 10,
	SEQUENCE_COMBINE_MODE_REPLICATE_COLOR_0 = 11,
	SEQUENCE_COMBINE_MODE_REPLICATE_COLOR_1 = 12
}
declare const enum LightType_t {
	MATERIAL_LIGHT_DISABLE = 0,
	MATERIAL_LIGHT_POINT = 1,
	MATERIAL_LIGHT_DIRECTIONAL = 2,
	MATERIAL_LIGHT_SPOT = 3,
	MATERIAL_LIGHT_ORTHO = 4,
	MATERIAL_LIGHT_ENVIRONMENT_PROBE = 5
}
declare const enum ValueRemapperOutputType_t {
	OutputType_AnimationCycle = 0,
	OutputType_RotationX = 1,
	OutputType_RotationY = 2,
	OutputType_RotationZ = 3
}
declare const enum WorldTextAttachmentType_t {
	ATTACHED_NONE = 0,
	ATTACHED_PRIMARY_HAND = 1,
	ATTACHED_OFF_HAND = 2,
	ATTACHED_ENTITY = 3,
	ATTACHED_HMD = 4,
	ATTACHED_ENTITY_LARGE = 5,
	ATTACHED_HAND_SPECIFIED_IN_EVENT = 6
}
declare const enum DOTA_ABILITY_BEHAVIOR {
	DOTA_ABILITY_BEHAVIOR_NONE = 0,
	DOTA_ABILITY_BEHAVIOR_HIDDEN = 1,
	DOTA_ABILITY_BEHAVIOR_PASSIVE = 2,
	DOTA_ABILITY_BEHAVIOR_NO_TARGET = 4,
	DOTA_ABILITY_BEHAVIOR_UNIT_TARGET = 8,
	DOTA_ABILITY_BEHAVIOR_POINT = 16,
	DOTA_ABILITY_BEHAVIOR_AOE = 32,
	DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE = 64,
	DOTA_ABILITY_BEHAVIOR_CHANNELLED = 128,
	DOTA_ABILITY_BEHAVIOR_ITEM = 256,
	DOTA_ABILITY_BEHAVIOR_TOGGLE = 512,
	DOTA_ABILITY_BEHAVIOR_DIRECTIONAL = 1024,
	DOTA_ABILITY_BEHAVIOR_IMMEDIATE = 2048,
	DOTA_ABILITY_BEHAVIOR_AUTOCAST = 4096,
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET = 8192,
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT = 16384,
	DOTA_ABILITY_BEHAVIOR_OPTIONAL_NO_TARGET = 32768,
	DOTA_ABILITY_BEHAVIOR_AURA = 65536,
	DOTA_ABILITY_BEHAVIOR_ATTACK = 131072,
	DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT = 262144,
	DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES = 524288,
	DOTA_ABILITY_BEHAVIOR_UNRESTRICTED = 1048576,
	DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE = 2097152,
	DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL = 4194304,
	DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT = 8388608,
	DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET = 16777216,
	DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK = 33554432,
	DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN = 67108864,
	DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING = 134217728,
	DOTA_ABILITY_BEHAVIOR_RUNE_TARGET = 268435456,
	DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL = 536870912,
	DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING = 1073741824,
	DOTA_ABILITY_BEHAVIOR_LAST_RESORT_POINT = 2147483648,
	DOTA_ABILITY_BEHAVIOR_CAN_SELF_CAST = 4294967296,
	DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES = 8589934592
}
declare const enum DAMAGE_TYPES {
	DAMAGE_TYPE_NONE = 0,
	DAMAGE_TYPE_PHYSICAL = 1,
	DAMAGE_TYPE_MAGICAL = 2,
	DAMAGE_TYPE_PURE = 4,
	DAMAGE_TYPE_HP_REMOVAL = 8,
	DAMAGE_TYPE_ALL = 7
}
declare const enum SosGroupType_t {
	SOS_GROUPTYPE_DYNAMIC = 0,
	SOS_GROUPTYPE_STATIC = 1
}
declare const enum AnimParamButton_t {
	ANIMPARAM_BUTTON_NONE = 0,
	ANIMPARAM_BUTTON_DPAD_UP = 1,
	ANIMPARAM_BUTTON_DPAD_RIGHT = 2,
	ANIMPARAM_BUTTON_DPAD_DOWN = 3,
	ANIMPARAM_BUTTON_DPAD_LEFT = 4,
	ANIMPARAM_BUTTON_A = 5,
	ANIMPARAM_BUTTON_B = 6,
	ANIMPARAM_BUTTON_X = 7,
	ANIMPARAM_BUTTON_Y = 8,
	ANIMPARAM_BUTTON_LEFT_SHOULDER = 9,
	ANIMPARAM_BUTTON_RIGHT_SHOULDER = 10,
	ANIMPARAM_BUTTON_LTRIGGER = 11,
	ANIMPARAM_BUTTON_RTRIGGER = 12
}
declare const enum BloomBlendMode_t {
	BLOOM_BLEND_ADD = 0,
	BLOOM_BLEND_SCREEN = 1,
	BLOOM_BLEND_BLUR = 2
}
declare const enum PrecipitationType_t {
	PRECIPITATION_TYPE_RAIN = 0,
	PRECIPITATION_TYPE_SNOW = 1,
	PRECIPITATION_TYPE_ASH = 2,
	PRECIPITATION_TYPE_SNOWFALL = 3,
	PRECIPITATION_TYPE_PARTICLERAIN = 4,
	PRECIPITATION_TYPE_PARTICLEASH = 5,
	PRECIPITATION_TYPE_PARTICLERAINSTORM = 6,
	PRECIPITATION_TYPE_PARTICLEBUGS = 7,
	PRECIPITATION_TYPE_PARTICLESMOKE = 8,
	PRECIPITATION_TYPE_PARTICLESNOW = 9,
	PRECIPITATION_TYPE_PARTICLEXENSPORES = 10,
	PRECIPITATION_TYPE_DUSTMOTES = 11,
	NUM_PRECIPITATION_TYPES = 12
}
declare const enum DOTAModifierAttribute_t {
	MODIFIER_ATTRIBUTE_NONE = 0,
	MODIFIER_ATTRIBUTE_PERMANENT = 1,
	MODIFIER_ATTRIBUTE_MULTIPLE = 2,
	MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE = 4,
	MODIFIER_ATTRIBUTE_AURA_PRIORITY = 8
}
declare const enum PerformanceMode_t {
	PM_NORMAL = 0,
	PM_NO_GIBS = 1,
	PM_FULL_GIBS = 2,
	PM_REDUCED_GIBS = 3
}
declare const enum ChoiceMethod {
	WeightedRandom = 0,
	WeightedRandomNoRepeat = 1,
	Iterate = 2,
	IterateRandom = 3
}
declare const enum PathStatusOptions {
	PathStatus_HasPath = 0,
	PathStatus_WaypointIsGoal = 1,
	PathStatus_GoalHasChanged = 2
}
declare const enum BrushSolidities_e {
	BRUSHSOLID_TOGGLE = 0,
	BRUSHSOLID_NEVER = 1,
	BRUSHSOLID_ALWAYS = 2
}
declare const enum Detail2Combo_t {
	DETAIL_2_COMBO_UNINITIALIZED = -1,
	DETAIL_2_COMBO_OFF = 0,
	DETAIL_2_COMBO_ADD = 1,
	DETAIL_2_COMBO_ADD_SELF_ILLUM = 2,
	DETAIL_2_COMBO_MOD2X = 3,
	DETAIL_2_COMBO_MUL = 4,
	DETAIL_2_COMBO_CROSSFADE = 5
}
declare const enum AttachmentInfluenceFlags_t {
	ATTACHMENT_INFLUENCE_FLAGS_NONE = 0,
	ATTACHMENT_INFLUENCE_FLAGS_ROOT_TRANSFORM = 1
}
declare const enum ScreenEffectType_t {
	SCREENEFFECT_EP2_ADVISOR_STUN = 0,
	SCREENEFFECT_EP1_INTRO = 1,
	SCREENEFFECT_EP2_GROGGY = 2
}
declare const enum IGE_AssassinationState {
	ASSASSINMINIGAMESTATE_NotActive = 0,
	ASSASSINMINIGAMESTATE_AwaitingInitialization = 1,
	ASSASSINMINIGAMESTATE_InProgress = 2,
	ASSASSINMINIGAMESTATE_ContractFilled = 3,
	ASSASSINMINIGAMESTATE_ContractDenied = 4
}
declare const enum ValueRemapperInputType_t {
	InputType_PlayerShootPosition = 0,
	InputType_PlayerShootPositionAroundAxis = 1
}
declare const enum BaseActivity_t {
	ACT_RESET = 0,
	ACT_IDLE = 1,
	ACT_TRANSITION = 2,
	ACT_COVER = 3,
	ACT_COVER_MED = 4,
	ACT_COVER_LOW = 5,
	ACT_WALK = 6,
	ACT_WALK_AIM = 7,
	ACT_WALK_CROUCH = 8,
	ACT_WALK_CROUCH_AIM = 9,
	ACT_RUN = 10,
	ACT_RUN_AIM = 11,
	ACT_RUN_CROUCH = 12,
	ACT_RUN_CROUCH_AIM = 13,
	ACT_RUN_PROTECTED = 14,
	ACT_SCRIPT_CUSTOM_MOVE = 15,
	ACT_RANGE_ATTACK1 = 16,
	ACT_RANGE_ATTACK2 = 17,
	ACT_RANGE_ATTACK1_LOW = 18,
	ACT_RANGE_ATTACK2_LOW = 19,
	ACT_DIESIMPLE = 20,
	ACT_DIEBACKWARD = 21,
	ACT_DIEFORWARD = 22,
	ACT_DIEVIOLENT = 23,
	ACT_DIERAGDOLL = 24,
	ACT_FLY = 25,
	ACT_HOVER = 26,
	ACT_GLIDE = 27,
	ACT_SWIM = 28,
	ACT_JUMP = 29,
	ACT_HOP = 30,
	ACT_LEAP = 31,
	ACT_LAND = 32,
	ACT_CLIMB_UP = 33,
	ACT_CLIMB_DOWN = 34,
	ACT_CLIMB_DISMOUNT = 35,
	ACT_SHIPLADDER_UP = 36,
	ACT_SHIPLADDER_DOWN = 37,
	ACT_STRAFE_LEFT = 38,
	ACT_STRAFE_RIGHT = 39,
	ACT_ROLL_LEFT = 40,
	ACT_ROLL_RIGHT = 41,
	ACT_TURN_LEFT = 42,
	ACT_TURN_RIGHT = 43,
	ACT_CROUCH = 44,
	ACT_CROUCHIDLE = 45,
	ACT_STAND = 46,
	ACT_USE = 47,
	ACT_ALIEN_BURROW_IDLE = 48,
	ACT_ALIEN_BURROW_OUT = 49,
	ACT_SIGNAL1 = 50,
	ACT_SIGNAL2 = 51,
	ACT_SIGNAL3 = 52,
	ACT_SIGNAL_ADVANCE = 53,
	ACT_SIGNAL_FORWARD = 54,
	ACT_SIGNAL_GROUP = 55,
	ACT_SIGNAL_HALT = 56,
	ACT_SIGNAL_LEFT = 57,
	ACT_SIGNAL_RIGHT = 58,
	ACT_SIGNAL_TAKECOVER = 59,
	ACT_LOOKBACK_RIGHT = 60,
	ACT_LOOKBACK_LEFT = 61,
	ACT_COWER = 62,
	ACT_SMALL_FLINCH = 63,
	ACT_BIG_FLINCH = 64,
	ACT_MELEE_ATTACK1 = 65,
	ACT_MELEE_ATTACK2 = 66,
	ACT_RELOAD = 67,
	ACT_RELOAD_START = 68,
	ACT_RELOAD_FINISH = 69,
	ACT_RELOAD_LOW = 70,
	ACT_ARM = 71,
	ACT_DISARM = 72,
	ACT_DROP_WEAPON = 73,
	ACT_DROP_WEAPON_SHOTGUN = 74,
	ACT_PICKUP_GROUND = 75,
	ACT_PICKUP_RACK = 76,
	ACT_IDLE_ANGRY = 77,
	ACT_IDLE_RELAXED = 78,
	ACT_IDLE_STIMULATED = 79,
	ACT_IDLE_AGITATED = 80,
	ACT_IDLE_STEALTH = 81,
	ACT_IDLE_HURT = 82,
	ACT_WALK_RELAXED = 83,
	ACT_WALK_STIMULATED = 84,
	ACT_WALK_AGITATED = 85,
	ACT_WALK_STEALTH = 86,
	ACT_RUN_RELAXED = 87,
	ACT_RUN_STIMULATED = 88,
	ACT_RUN_AGITATED = 89,
	ACT_RUN_STEALTH = 90,
	ACT_IDLE_AIM_RELAXED = 91,
	ACT_IDLE_AIM_STIMULATED = 92,
	ACT_IDLE_AIM_AGITATED = 93,
	ACT_IDLE_AIM_STEALTH = 94,
	ACT_WALK_AIM_RELAXED = 95,
	ACT_WALK_AIM_STIMULATED = 96,
	ACT_WALK_AIM_AGITATED = 97,
	ACT_WALK_AIM_STEALTH = 98,
	ACT_RUN_AIM_RELAXED = 99,
	ACT_RUN_AIM_STIMULATED = 100,
	ACT_RUN_AIM_AGITATED = 101,
	ACT_RUN_AIM_STEALTH = 102,
	ACT_CROUCHIDLE_STIMULATED = 103,
	ACT_CROUCHIDLE_AIM_STIMULATED = 104,
	ACT_CROUCHIDLE_AGITATED = 105,
	ACT_WALK_HURT = 106,
	ACT_RUN_HURT = 107,
	ACT_SPECIAL_ATTACK1 = 108,
	ACT_SPECIAL_ATTACK2 = 109,
	ACT_COMBAT_IDLE = 110,
	ACT_WALK_SCARED = 111,
	ACT_RUN_SCARED = 112,
	ACT_VICTORY_DANCE = 113,
	ACT_DIE_HEADSHOT = 114,
	ACT_DIE_CHESTSHOT = 115,
	ACT_DIE_GUTSHOT = 116,
	ACT_DIE_BACKSHOT = 117,
	ACT_FLINCH_HEAD = 118,
	ACT_FLINCH_CHEST = 119,
	ACT_FLINCH_STOMACH = 120,
	ACT_FLINCH_LEFTARM = 121,
	ACT_FLINCH_RIGHTARM = 122,
	ACT_FLINCH_LEFTLEG = 123,
	ACT_FLINCH_RIGHTLEG = 124,
	ACT_FLINCH_PHYSICS = 125,
	ACT_FLINCH_HEAD_BACK = 126,
	ACT_FLINCH_CHEST_BACK = 127,
	ACT_FLINCH_STOMACH_BACK = 128,
	ACT_FLINCH_CROUCH_FRONT = 129,
	ACT_FLINCH_CROUCH_BACK = 130,
	ACT_FLINCH_CROUCH_LEFT = 131,
	ACT_FLINCH_CROUCH_RIGHT = 132,
	ACT_IDLE_ON_FIRE = 133,
	ACT_WALK_ON_FIRE = 134,
	ACT_RUN_ON_FIRE = 135,
	ACT_RAPPEL_LOOP = 136,
	ACT_180_LEFT = 137,
	ACT_180_RIGHT = 138,
	ACT_90_LEFT = 139,
	ACT_90_RIGHT = 140,
	ACT_STEP_LEFT = 141,
	ACT_STEP_RIGHT = 142,
	ACT_STEP_BACK = 143,
	ACT_STEP_FORE = 144,
	ACT_GESTURE_RANGE_ATTACK1 = 145,
	ACT_GESTURE_RANGE_ATTACK2 = 146,
	ACT_GESTURE_MELEE_ATTACK1 = 147,
	ACT_GESTURE_MELEE_ATTACK2 = 148,
	ACT_GESTURE_RANGE_ATTACK1_LOW = 149,
	ACT_GESTURE_RANGE_ATTACK2_LOW = 150,
	ACT_MELEE_ATTACK_SWING_GESTURE = 151,
	ACT_GESTURE_SMALL_FLINCH = 152,
	ACT_GESTURE_BIG_FLINCH = 153,
	ACT_GESTURE_FLINCH_BLAST = 154,
	ACT_GESTURE_FLINCH_BLAST_SHOTGUN = 155,
	ACT_GESTURE_FLINCH_BLAST_DAMAGED = 156,
	ACT_GESTURE_FLINCH_BLAST_DAMAGED_SHOTGUN = 157,
	ACT_GESTURE_FLINCH_HEAD = 158,
	ACT_GESTURE_FLINCH_CHEST = 159,
	ACT_GESTURE_FLINCH_STOMACH = 160,
	ACT_GESTURE_FLINCH_LEFTARM = 161,
	ACT_GESTURE_FLINCH_RIGHTARM = 162,
	ACT_GESTURE_FLINCH_LEFTLEG = 163,
	ACT_GESTURE_FLINCH_RIGHTLEG = 164,
	ACT_GESTURE_TURN_LEFT = 165,
	ACT_GESTURE_TURN_RIGHT = 166,
	ACT_GESTURE_TURN_LEFT45 = 167,
	ACT_GESTURE_TURN_RIGHT45 = 168,
	ACT_GESTURE_TURN_LEFT90 = 169,
	ACT_GESTURE_TURN_RIGHT90 = 170,
	ACT_GESTURE_TURN_LEFT45_FLAT = 171,
	ACT_GESTURE_TURN_RIGHT45_FLAT = 172,
	ACT_GESTURE_TURN_LEFT90_FLAT = 173,
	ACT_GESTURE_TURN_RIGHT90_FLAT = 174,
	ACT_BARNACLE_HIT = 175,
	ACT_BARNACLE_PULL = 176,
	ACT_BARNACLE_CHOMP = 177,
	ACT_BARNACLE_CHEW = 178,
	ACT_DO_NOT_DISTURB = 179,
	ACT_SPECIFIC_SEQUENCE = 180,
	ACT_VM_DEPLOY = 181,
	ACT_VM_RELOAD_EMPTY = 182,
	ACT_VM_DRAW = 183,
	ACT_VM_HOLSTER = 184,
	ACT_VM_IDLE = 185,
	ACT_VM_FIDGET = 186,
	ACT_VM_PULLBACK = 187,
	ACT_VM_PULLBACK_HIGH = 188,
	ACT_VM_PULLBACK_LOW = 189,
	ACT_VM_THROW = 190,
	ACT_VM_DROP = 191,
	ACT_VM_PULLPIN = 192,
	ACT_VM_PRIMARYATTACK = 193,
	ACT_VM_SECONDARYATTACK = 194,
	ACT_VM_RELOAD = 195,
	ACT_VM_DRYFIRE = 196,
	ACT_VM_HITLEFT = 197,
	ACT_VM_HITLEFT2 = 198,
	ACT_VM_HITRIGHT = 199,
	ACT_VM_HITRIGHT2 = 200,
	ACT_VM_HITCENTER = 201,
	ACT_VM_HITCENTER2 = 202,
	ACT_VM_MISSLEFT = 203,
	ACT_VM_MISSLEFT2 = 204,
	ACT_VM_MISSRIGHT = 205,
	ACT_VM_MISSRIGHT2 = 206,
	ACT_VM_MISSCENTER = 207,
	ACT_VM_MISSCENTER2 = 208,
	ACT_VM_HAULBACK = 209,
	ACT_VM_SWINGHARD = 210,
	ACT_VM_SWINGMISS = 211,
	ACT_VM_SWINGHIT = 212,
	ACT_VM_IDLE_TO_LOWERED = 213,
	ACT_VM_IDLE_LOWERED = 214,
	ACT_VM_LOWERED_TO_IDLE = 215,
	ACT_VM_RECOIL1 = 216,
	ACT_VM_RECOIL2 = 217,
	ACT_VM_RECOIL3 = 218,
	ACT_VM_PICKUP = 219,
	ACT_VM_RELEASE = 220,
	ACT_VM_MAUL_LOOP = 221,
	ACT_VM_ATTACH_SILENCER = 222,
	ACT_VM_DETACH_SILENCER = 223,
	ACT_SLAM_STICKWALL_IDLE = 224,
	ACT_SLAM_STICKWALL_ND_IDLE = 225,
	ACT_SLAM_STICKWALL_ATTACH = 226,
	ACT_SLAM_STICKWALL_ATTACH2 = 227,
	ACT_SLAM_STICKWALL_ND_ATTACH = 228,
	ACT_SLAM_STICKWALL_ND_ATTACH2 = 229,
	ACT_SLAM_STICKWALL_DETONATE = 230,
	ACT_SLAM_STICKWALL_DETONATOR_HOLSTER = 231,
	ACT_SLAM_STICKWALL_DRAW = 232,
	ACT_SLAM_STICKWALL_ND_DRAW = 233,
	ACT_SLAM_STICKWALL_TO_THROW = 234,
	ACT_SLAM_STICKWALL_TO_THROW_ND = 235,
	ACT_SLAM_STICKWALL_TO_TRIPMINE_ND = 236,
	ACT_SLAM_THROW_IDLE = 237,
	ACT_SLAM_THROW_ND_IDLE = 238,
	ACT_SLAM_THROW_THROW = 239,
	ACT_SLAM_THROW_THROW2 = 240,
	ACT_SLAM_THROW_THROW_ND = 241,
	ACT_SLAM_THROW_THROW_ND2 = 242,
	ACT_SLAM_THROW_DRAW = 243,
	ACT_SLAM_THROW_ND_DRAW = 244,
	ACT_SLAM_THROW_TO_STICKWALL = 245,
	ACT_SLAM_THROW_TO_STICKWALL_ND = 246,
	ACT_SLAM_THROW_DETONATE = 247,
	ACT_SLAM_THROW_DETONATOR_HOLSTER = 248,
	ACT_SLAM_THROW_TO_TRIPMINE_ND = 249,
	ACT_SLAM_TRIPMINE_IDLE = 250,
	ACT_SLAM_TRIPMINE_DRAW = 251,
	ACT_SLAM_TRIPMINE_ATTACH = 252,
	ACT_SLAM_TRIPMINE_ATTACH2 = 253,
	ACT_SLAM_TRIPMINE_TO_STICKWALL_ND = 254,
	ACT_SLAM_TRIPMINE_TO_THROW_ND = 255,
	ACT_SLAM_DETONATOR_IDLE = 256,
	ACT_SLAM_DETONATOR_DRAW = 257,
	ACT_SLAM_DETONATOR_DETONATE = 258,
	ACT_SLAM_DETONATOR_HOLSTER = 259,
	ACT_SLAM_DETONATOR_STICKWALL_DRAW = 260,
	ACT_SLAM_DETONATOR_THROW_DRAW = 261,
	ACT_SHOTGUN_RELOAD_START = 262,
	ACT_SHOTGUN_RELOAD_FINISH = 263,
	ACT_SHOTGUN_PUMP = 264,
	ACT_SMG2_IDLE2 = 265,
	ACT_SMG2_FIRE2 = 266,
	ACT_SMG2_DRAW2 = 267,
	ACT_SMG2_RELOAD2 = 268,
	ACT_SMG2_DRYFIRE2 = 269,
	ACT_SMG2_TOAUTO = 270,
	ACT_SMG2_TOBURST = 271,
	ACT_PHYSCANNON_UPGRADE = 272,
	ACT_RANGE_ATTACK_AR1 = 273,
	ACT_RANGE_ATTACK_AR2 = 274,
	ACT_RANGE_ATTACK_AR2_LOW = 275,
	ACT_RANGE_ATTACK_AR2_GRENADE = 276,
	ACT_RANGE_ATTACK_HMG1 = 277,
	ACT_RANGE_ATTACK_ML = 278,
	ACT_RANGE_ATTACK_SMG1 = 279,
	ACT_RANGE_ATTACK_SMG1_LOW = 280,
	ACT_RANGE_ATTACK_SMG2 = 281,
	ACT_RANGE_ATTACK_SHOTGUN = 282,
	ACT_RANGE_ATTACK_SHOTGUN_LOW = 283,
	ACT_RANGE_ATTACK_PISTOL = 284,
	ACT_RANGE_ATTACK_PISTOL_LOW = 285,
	ACT_RANGE_ATTACK_SLAM = 286,
	ACT_RANGE_ATTACK_TRIPWIRE = 287,
	ACT_RANGE_ATTACK_THROW = 288,
	ACT_RANGE_ATTACK_SNIPER_RIFLE = 289,
	ACT_RANGE_ATTACK_RPG = 290,
	ACT_MELEE_ATTACK_SWING = 291,
	ACT_RANGE_AIM_LOW = 292,
	ACT_RANGE_AIM_SMG1_LOW = 293,
	ACT_RANGE_AIM_PISTOL_LOW = 294,
	ACT_RANGE_AIM_AR2_LOW = 295,
	ACT_COVER_PISTOL_LOW = 296,
	ACT_COVER_SMG1_LOW = 297,
	ACT_GESTURE_RANGE_ATTACK_AR1 = 298,
	ACT_GESTURE_RANGE_ATTACK_AR2 = 299,
	ACT_GESTURE_RANGE_ATTACK_AR2_GRENADE = 300,
	ACT_GESTURE_RANGE_ATTACK_HMG1 = 301,
	ACT_GESTURE_RANGE_ATTACK_ML = 302,
	ACT_GESTURE_RANGE_ATTACK_SMG1 = 303,
	ACT_GESTURE_RANGE_ATTACK_SMG1_LOW = 304,
	ACT_GESTURE_RANGE_ATTACK_SMG2 = 305,
	ACT_GESTURE_RANGE_ATTACK_SHOTGUN = 306,
	ACT_GESTURE_RANGE_ATTACK_PISTOL = 307,
	ACT_GESTURE_RANGE_ATTACK_PISTOL_LOW = 308,
	ACT_GESTURE_RANGE_ATTACK_SLAM = 309,
	ACT_GESTURE_RANGE_ATTACK_TRIPWIRE = 310,
	ACT_GESTURE_RANGE_ATTACK_THROW = 311,
	ACT_GESTURE_RANGE_ATTACK_SNIPER_RIFLE = 312,
	ACT_GESTURE_MELEE_ATTACK_SWING = 313,
	ACT_IDLE_RIFLE = 314,
	ACT_IDLE_SMG1 = 315,
	ACT_IDLE_ANGRY_SMG1 = 316,
	ACT_IDLE_PISTOL = 317,
	ACT_IDLE_ANGRY_PISTOL = 318,
	ACT_IDLE_ANGRY_SHOTGUN = 319,
	ACT_IDLE_STEALTH_PISTOL = 320,
	ACT_IDLE_PACKAGE = 321,
	ACT_WALK_PACKAGE = 322,
	ACT_IDLE_SUITCASE = 323,
	ACT_WALK_SUITCASE = 324,
	ACT_IDLE_SMG1_RELAXED = 325,
	ACT_IDLE_SMG1_STIMULATED = 326,
	ACT_WALK_RIFLE_RELAXED = 327,
	ACT_RUN_RIFLE_RELAXED = 328,
	ACT_WALK_RIFLE_STIMULATED = 329,
	ACT_RUN_RIFLE_STIMULATED = 330,
	ACT_IDLE_AIM_RIFLE_STIMULATED = 331,
	ACT_WALK_AIM_RIFLE_STIMULATED = 332,
	ACT_RUN_AIM_RIFLE_STIMULATED = 333,
	ACT_IDLE_SHOTGUN_RELAXED = 334,
	ACT_IDLE_SHOTGUN_STIMULATED = 335,
	ACT_IDLE_SHOTGUN_AGITATED = 336,
	ACT_WALK_ANGRY = 337,
	ACT_POLICE_HARASS1 = 338,
	ACT_POLICE_HARASS2 = 339,
	ACT_IDLE_MANNEDGUN = 340,
	ACT_IDLE_MELEE = 341,
	ACT_IDLE_ANGRY_MELEE = 342,
	ACT_IDLE_RPG_RELAXED = 343,
	ACT_IDLE_RPG = 344,
	ACT_IDLE_ANGRY_RPG = 345,
	ACT_COVER_LOW_RPG = 346,
	ACT_WALK_RPG = 347,
	ACT_RUN_RPG = 348,
	ACT_WALK_CROUCH_RPG = 349,
	ACT_RUN_CROUCH_RPG = 350,
	ACT_WALK_RPG_RELAXED = 351,
	ACT_RUN_RPG_RELAXED = 352,
	ACT_WALK_RIFLE = 353,
	ACT_WALK_AIM_RIFLE = 354,
	ACT_WALK_CROUCH_RIFLE = 355,
	ACT_WALK_CROUCH_AIM_RIFLE = 356,
	ACT_RUN_RIFLE = 357,
	ACT_RUN_AIM_RIFLE = 358,
	ACT_RUN_CROUCH_RIFLE = 359,
	ACT_RUN_CROUCH_AIM_RIFLE = 360,
	ACT_RUN_STEALTH_PISTOL = 361,
	ACT_WALK_AIM_SHOTGUN = 362,
	ACT_RUN_AIM_SHOTGUN = 363,
	ACT_WALK_PISTOL = 364,
	ACT_RUN_PISTOL = 365,
	ACT_WALK_AIM_PISTOL = 366,
	ACT_RUN_AIM_PISTOL = 367,
	ACT_WALK_STEALTH_PISTOL = 368,
	ACT_WALK_AIM_STEALTH_PISTOL = 369,
	ACT_RUN_AIM_STEALTH_PISTOL = 370,
	ACT_RELOAD_PISTOL = 371,
	ACT_RELOAD_PISTOL_LOW = 372,
	ACT_RELOAD_SMG1 = 373,
	ACT_RELOAD_SMG1_LOW = 374,
	ACT_RELOAD_SHOTGUN = 375,
	ACT_RELOAD_SHOTGUN_LOW = 376,
	ACT_GESTURE_RELOAD = 377,
	ACT_GESTURE_RELOAD_PISTOL = 378,
	ACT_GESTURE_RELOAD_SMG1 = 379,
	ACT_GESTURE_RELOAD_SHOTGUN = 380,
	ACT_BUSY_LEAN_LEFT = 381,
	ACT_BUSY_LEAN_LEFT_ENTRY = 382,
	ACT_BUSY_LEAN_LEFT_EXIT = 383,
	ACT_BUSY_LEAN_BACK = 384,
	ACT_BUSY_LEAN_BACK_ENTRY = 385,
	ACT_BUSY_LEAN_BACK_EXIT = 386,
	ACT_BUSY_SIT_GROUND = 387,
	ACT_BUSY_SIT_GROUND_ENTRY = 388,
	ACT_BUSY_SIT_GROUND_EXIT = 389,
	ACT_BUSY_SIT_CHAIR = 390,
	ACT_BUSY_SIT_CHAIR_ENTRY = 391,
	ACT_BUSY_SIT_CHAIR_EXIT = 392,
	ACT_BUSY_STAND = 393,
	ACT_BUSY_QUEUE = 394,
	ACT_DUCK_DODGE = 395,
	ACT_DIE_BARNACLE_SWALLOW = 396,
	ACT_GESTURE_BARNACLE_STRANGLE = 397,
	ACT_PHYSCANNON_DETACH = 398,
	ACT_PHYSCANNON_ANIMATE = 399,
	ACT_PHYSCANNON_ANIMATE_PRE = 400,
	ACT_PHYSCANNON_ANIMATE_POST = 401,
	ACT_DIE_FRONTSIDE = 402,
	ACT_DIE_RIGHTSIDE = 403,
	ACT_DIE_BACKSIDE = 404,
	ACT_DIE_LEFTSIDE = 405,
	ACT_DIE_CROUCH_FRONTSIDE = 406,
	ACT_DIE_CROUCH_RIGHTSIDE = 407,
	ACT_DIE_CROUCH_BACKSIDE = 408,
	ACT_DIE_CROUCH_LEFTSIDE = 409,
	ACT_DIE_INCAP = 410,
	ACT_DIE_STANDING = 411,
	ACT_OPEN_DOOR = 412,
	ACT_DI_ALYX_ZOMBIE_MELEE = 413,
	ACT_DI_ALYX_ZOMBIE_TORSO_MELEE = 414,
	ACT_DI_ALYX_HEADCRAB_MELEE = 415,
	ACT_DI_ALYX_ANTLION = 416,
	ACT_DI_ALYX_ZOMBIE_SHOTGUN64 = 417,
	ACT_DI_ALYX_ZOMBIE_SHOTGUN26 = 418,
	ACT_READINESS_RELAXED_TO_STIMULATED = 419,
	ACT_READINESS_RELAXED_TO_STIMULATED_WALK = 420,
	ACT_READINESS_AGITATED_TO_STIMULATED = 421,
	ACT_READINESS_STIMULATED_TO_RELAXED = 422,
	ACT_READINESS_PISTOL_RELAXED_TO_STIMULATED = 423,
	ACT_READINESS_PISTOL_RELAXED_TO_STIMULATED_WALK = 424,
	ACT_READINESS_PISTOL_AGITATED_TO_STIMULATED = 425,
	ACT_READINESS_PISTOL_STIMULATED_TO_RELAXED = 426,
	ACT_IDLE_CARRY = 427,
	ACT_WALK_CARRY = 428,
	ACT_STARTDYING = 429,
	ACT_DYINGLOOP = 430,
	ACT_DYINGTODEAD = 431,
	ACT_RIDE_MANNED_GUN = 432,
	ACT_VM_SPRINT_ENTER = 433,
	ACT_VM_SPRINT_IDLE = 434,
	ACT_VM_SPRINT_LEAVE = 435,
	ACT_FIRE_START = 436,
	ACT_FIRE_LOOP = 437,
	ACT_FIRE_END = 438,
	ACT_CROUCHING_GRENADEIDLE = 439,
	ACT_CROUCHING_GRENADEREADY = 440,
	ACT_CROUCHING_PRIMARYATTACK = 441,
	ACT_OVERLAY_GRENADEIDLE = 442,
	ACT_OVERLAY_GRENADEREADY = 443,
	ACT_OVERLAY_PRIMARYATTACK = 444,
	ACT_OVERLAY_SHIELD_UP = 445,
	ACT_OVERLAY_SHIELD_DOWN = 446,
	ACT_OVERLAY_SHIELD_UP_IDLE = 447,
	ACT_OVERLAY_SHIELD_ATTACK = 448,
	ACT_OVERLAY_SHIELD_KNOCKBACK = 449,
	ACT_SHIELD_UP = 450,
	ACT_SHIELD_DOWN = 451,
	ACT_SHIELD_UP_IDLE = 452,
	ACT_SHIELD_ATTACK = 453,
	ACT_SHIELD_KNOCKBACK = 454,
	ACT_CROUCHING_SHIELD_UP = 455,
	ACT_CROUCHING_SHIELD_DOWN = 456,
	ACT_CROUCHING_SHIELD_UP_IDLE = 457,
	ACT_CROUCHING_SHIELD_ATTACK = 458,
	ACT_CROUCHING_SHIELD_KNOCKBACK = 459,
	ACT_TURNRIGHT45 = 460,
	ACT_TURNLEFT45 = 461,
	ACT_TURN = 462,
	ACT_OBJ_ASSEMBLING = 463,
	ACT_OBJ_DISMANTLING = 464,
	ACT_OBJ_STARTUP = 465,
	ACT_OBJ_RUNNING = 466,
	ACT_OBJ_IDLE = 467,
	ACT_OBJ_PLACING = 468,
	ACT_OBJ_DETERIORATING = 469,
	ACT_OBJ_UPGRADING = 470,
	ACT_DEPLOY = 471,
	ACT_DEPLOY_IDLE = 472,
	ACT_UNDEPLOY = 473,
	ACT_CROSSBOW_DRAW_UNLOADED = 474,
	ACT_GAUSS_SPINUP = 475,
	ACT_GAUSS_SPINCYCLE = 476,
	ACT_VM_PRIMARYATTACK_SILENCED = 477,
	ACT_VM_RELOAD_SILENCED = 478,
	ACT_VM_DRYFIRE_SILENCED = 479,
	ACT_VM_IDLE_SILENCED = 480,
	ACT_VM_DRAW_SILENCED = 481,
	ACT_VM_IDLE_EMPTY_LEFT = 482,
	ACT_VM_DRYFIRE_LEFT = 483,
	ACT_VM_IS_DRAW = 484,
	ACT_VM_IS_HOLSTER = 485,
	ACT_VM_IS_IDLE = 486,
	ACT_VM_IS_PRIMARYATTACK = 487,
	ACT_PLAYER_IDLE_FIRE = 488,
	ACT_PLAYER_CROUCH_FIRE = 489,
	ACT_PLAYER_CROUCH_WALK_FIRE = 490,
	ACT_PLAYER_WALK_FIRE = 491,
	ACT_PLAYER_RUN_FIRE = 492,
	ACT_IDLETORUN = 493,
	ACT_RUNTOIDLE = 494,
	ACT_VM_DRAW_DEPLOYED = 495,
	ACT_HL2MP_IDLE_MELEE = 496,
	ACT_HL2MP_RUN_MELEE = 497,
	ACT_HL2MP_IDLE_CROUCH_MELEE = 498,
	ACT_HL2MP_WALK_CROUCH_MELEE = 499,
	ACT_HL2MP_GESTURE_RANGE_ATTACK_MELEE = 500,
	ACT_HL2MP_GESTURE_RELOAD_MELEE = 501,
	ACT_HL2MP_JUMP_MELEE = 502,
	ACT_MP_STAND_IDLE = 503,
	ACT_MP_CROUCH_IDLE = 504,
	ACT_MP_CROUCH_DEPLOYED_IDLE = 505,
	ACT_MP_CROUCH_DEPLOYED = 506,
	ACT_MP_DEPLOYED_IDLE = 507,
	ACT_MP_RUN = 508,
	ACT_MP_WALK = 509,
	ACT_MP_AIRWALK = 510,
	ACT_MP_CROUCHWALK = 511,
	ACT_MP_SPRINT = 512,
	ACT_MP_JUMP = 513,
	ACT_MP_JUMP_START = 514,
	ACT_MP_JUMP_FLOAT = 515,
	ACT_MP_JUMP_LAND = 516,
	ACT_MP_DOUBLEJUMP = 517,
	ACT_MP_SWIM = 518,
	ACT_MP_DEPLOYED = 519,
	ACT_MP_SWIM_DEPLOYED = 520,
	ACT_MP_VCD = 521,
	ACT_MP_ATTACK_STAND_PRIMARYFIRE = 522,
	ACT_MP_ATTACK_STAND_PRIMARYFIRE_DEPLOYED = 523,
	ACT_MP_ATTACK_STAND_SECONDARYFIRE = 524,
	ACT_MP_ATTACK_STAND_GRENADE = 525,
	ACT_MP_ATTACK_CROUCH_PRIMARYFIRE = 526,
	ACT_MP_ATTACK_CROUCH_PRIMARYFIRE_DEPLOYED = 527,
	ACT_MP_ATTACK_CROUCH_SECONDARYFIRE = 528,
	ACT_MP_ATTACK_CROUCH_GRENADE = 529,
	ACT_MP_ATTACK_SWIM_PRIMARYFIRE = 530,
	ACT_MP_ATTACK_SWIM_SECONDARYFIRE = 531,
	ACT_MP_ATTACK_SWIM_GRENADE = 532,
	ACT_MP_ATTACK_AIRWALK_PRIMARYFIRE = 533,
	ACT_MP_ATTACK_AIRWALK_SECONDARYFIRE = 534,
	ACT_MP_ATTACK_AIRWALK_GRENADE = 535,
	ACT_MP_RELOAD_STAND = 536,
	ACT_MP_RELOAD_STAND_LOOP = 537,
	ACT_MP_RELOAD_STAND_END = 538,
	ACT_MP_RELOAD_CROUCH = 539,
	ACT_MP_RELOAD_CROUCH_LOOP = 540,
	ACT_MP_RELOAD_CROUCH_END = 541,
	ACT_MP_RELOAD_SWIM = 542,
	ACT_MP_RELOAD_SWIM_LOOP = 543,
	ACT_MP_RELOAD_SWIM_END = 544,
	ACT_MP_RELOAD_AIRWALK = 545,
	ACT_MP_RELOAD_AIRWALK_LOOP = 546,
	ACT_MP_RELOAD_AIRWALK_END = 547,
	ACT_MP_ATTACK_STAND_PREFIRE = 548,
	ACT_MP_ATTACK_STAND_POSTFIRE = 549,
	ACT_MP_ATTACK_STAND_STARTFIRE = 550,
	ACT_MP_ATTACK_CROUCH_PREFIRE = 551,
	ACT_MP_ATTACK_CROUCH_POSTFIRE = 552,
	ACT_MP_ATTACK_SWIM_PREFIRE = 553,
	ACT_MP_ATTACK_SWIM_POSTFIRE = 554,
	ACT_MP_STAND_PRIMARY = 555,
	ACT_MP_CROUCH_PRIMARY = 556,
	ACT_MP_RUN_PRIMARY = 557,
	ACT_MP_WALK_PRIMARY = 558,
	ACT_MP_AIRWALK_PRIMARY = 559,
	ACT_MP_CROUCHWALK_PRIMARY = 560,
	ACT_MP_JUMP_PRIMARY = 561,
	ACT_MP_JUMP_START_PRIMARY = 562,
	ACT_MP_JUMP_FLOAT_PRIMARY = 563,
	ACT_MP_JUMP_LAND_PRIMARY = 564,
	ACT_MP_SWIM_PRIMARY = 565,
	ACT_MP_DEPLOYED_PRIMARY = 566,
	ACT_MP_SWIM_DEPLOYED_PRIMARY = 567,
	ACT_MP_ATTACK_STAND_PRIMARY = 568,
	ACT_MP_ATTACK_STAND_PRIMARY_DEPLOYED = 569,
	ACT_MP_ATTACK_CROUCH_PRIMARY = 570,
	ACT_MP_ATTACK_CROUCH_PRIMARY_DEPLOYED = 571,
	ACT_MP_ATTACK_SWIM_PRIMARY = 572,
	ACT_MP_ATTACK_AIRWALK_PRIMARY = 573,
	ACT_MP_RELOAD_STAND_PRIMARY = 574,
	ACT_MP_RELOAD_STAND_PRIMARY_LOOP = 575,
	ACT_MP_RELOAD_STAND_PRIMARY_END = 576,
	ACT_MP_RELOAD_CROUCH_PRIMARY = 577,
	ACT_MP_RELOAD_CROUCH_PRIMARY_LOOP = 578,
	ACT_MP_RELOAD_CROUCH_PRIMARY_END = 579,
	ACT_MP_RELOAD_SWIM_PRIMARY = 580,
	ACT_MP_RELOAD_SWIM_PRIMARY_LOOP = 581,
	ACT_MP_RELOAD_SWIM_PRIMARY_END = 582,
	ACT_MP_RELOAD_AIRWALK_PRIMARY = 583,
	ACT_MP_RELOAD_AIRWALK_PRIMARY_LOOP = 584,
	ACT_MP_RELOAD_AIRWALK_PRIMARY_END = 585,
	ACT_MP_ATTACK_STAND_GRENADE_PRIMARY = 586,
	ACT_MP_ATTACK_CROUCH_GRENADE_PRIMARY = 587,
	ACT_MP_ATTACK_SWIM_GRENADE_PRIMARY = 588,
	ACT_MP_ATTACK_AIRWALK_GRENADE_PRIMARY = 589,
	ACT_MP_STAND_SECONDARY = 590,
	ACT_MP_CROUCH_SECONDARY = 591,
	ACT_MP_RUN_SECONDARY = 592,
	ACT_MP_WALK_SECONDARY = 593,
	ACT_MP_AIRWALK_SECONDARY = 594,
	ACT_MP_CROUCHWALK_SECONDARY = 595,
	ACT_MP_JUMP_SECONDARY = 596,
	ACT_MP_JUMP_START_SECONDARY = 597,
	ACT_MP_JUMP_FLOAT_SECONDARY = 598,
	ACT_MP_JUMP_LAND_SECONDARY = 599,
	ACT_MP_SWIM_SECONDARY = 600,
	ACT_MP_ATTACK_STAND_SECONDARY = 601,
	ACT_MP_ATTACK_CROUCH_SECONDARY = 602,
	ACT_MP_ATTACK_SWIM_SECONDARY = 603,
	ACT_MP_ATTACK_AIRWALK_SECONDARY = 604,
	ACT_MP_RELOAD_STAND_SECONDARY = 605,
	ACT_MP_RELOAD_STAND_SECONDARY_LOOP = 606,
	ACT_MP_RELOAD_STAND_SECONDARY_END = 607,
	ACT_MP_RELOAD_CROUCH_SECONDARY = 608,
	ACT_MP_RELOAD_CROUCH_SECONDARY_LOOP = 609,
	ACT_MP_RELOAD_CROUCH_SECONDARY_END = 610,
	ACT_MP_RELOAD_SWIM_SECONDARY = 611,
	ACT_MP_RELOAD_SWIM_SECONDARY_LOOP = 612,
	ACT_MP_RELOAD_SWIM_SECONDARY_END = 613,
	ACT_MP_RELOAD_AIRWALK_SECONDARY = 614,
	ACT_MP_RELOAD_AIRWALK_SECONDARY_LOOP = 615,
	ACT_MP_RELOAD_AIRWALK_SECONDARY_END = 616,
	ACT_MP_ATTACK_STAND_GRENADE_SECONDARY = 617,
	ACT_MP_ATTACK_CROUCH_GRENADE_SECONDARY = 618,
	ACT_MP_ATTACK_SWIM_GRENADE_SECONDARY = 619,
	ACT_MP_ATTACK_AIRWALK_GRENADE_SECONDARY = 620,
	ACT_MP_STAND_MELEE = 621,
	ACT_MP_CROUCH_MELEE = 622,
	ACT_MP_RUN_MELEE = 623,
	ACT_MP_WALK_MELEE = 624,
	ACT_MP_AIRWALK_MELEE = 625,
	ACT_MP_CROUCHWALK_MELEE = 626,
	ACT_MP_JUMP_MELEE = 627,
	ACT_MP_JUMP_START_MELEE = 628,
	ACT_MP_JUMP_FLOAT_MELEE = 629,
	ACT_MP_JUMP_LAND_MELEE = 630,
	ACT_MP_SWIM_MELEE = 631,
	ACT_MP_ATTACK_STAND_MELEE = 632,
	ACT_MP_ATTACK_STAND_MELEE_SECONDARY = 633,
	ACT_MP_ATTACK_CROUCH_MELEE = 634,
	ACT_MP_ATTACK_CROUCH_MELEE_SECONDARY = 635,
	ACT_MP_ATTACK_SWIM_MELEE = 636,
	ACT_MP_ATTACK_AIRWALK_MELEE = 637,
	ACT_MP_ATTACK_STAND_GRENADE_MELEE = 638,
	ACT_MP_ATTACK_CROUCH_GRENADE_MELEE = 639,
	ACT_MP_ATTACK_SWIM_GRENADE_MELEE = 640,
	ACT_MP_ATTACK_AIRWALK_GRENADE_MELEE = 641,
	ACT_MP_STAND_ITEM1 = 642,
	ACT_MP_CROUCH_ITEM1 = 643,
	ACT_MP_RUN_ITEM1 = 644,
	ACT_MP_WALK_ITEM1 = 645,
	ACT_MP_AIRWALK_ITEM1 = 646,
	ACT_MP_CROUCHWALK_ITEM1 = 647,
	ACT_MP_JUMP_ITEM1 = 648,
	ACT_MP_JUMP_START_ITEM1 = 649,
	ACT_MP_JUMP_FLOAT_ITEM1 = 650,
	ACT_MP_JUMP_LAND_ITEM1 = 651,
	ACT_MP_SWIM_ITEM1 = 652,
	ACT_MP_ATTACK_STAND_ITEM1 = 653,
	ACT_MP_ATTACK_STAND_ITEM1_SECONDARY = 654,
	ACT_MP_ATTACK_CROUCH_ITEM1 = 655,
	ACT_MP_ATTACK_CROUCH_ITEM1_SECONDARY = 656,
	ACT_MP_ATTACK_SWIM_ITEM1 = 657,
	ACT_MP_ATTACK_AIRWALK_ITEM1 = 658,
	ACT_MP_STAND_ITEM2 = 659,
	ACT_MP_CROUCH_ITEM2 = 660,
	ACT_MP_RUN_ITEM2 = 661,
	ACT_MP_WALK_ITEM2 = 662,
	ACT_MP_AIRWALK_ITEM2 = 663,
	ACT_MP_CROUCHWALK_ITEM2 = 664,
	ACT_MP_JUMP_ITEM2 = 665,
	ACT_MP_JUMP_START_ITEM2 = 666,
	ACT_MP_JUMP_FLOAT_ITEM2 = 667,
	ACT_MP_JUMP_LAND_ITEM2 = 668,
	ACT_MP_SWIM_ITEM2 = 669,
	ACT_MP_ATTACK_STAND_ITEM2 = 670,
	ACT_MP_ATTACK_STAND_ITEM2_SECONDARY = 671,
	ACT_MP_ATTACK_CROUCH_ITEM2 = 672,
	ACT_MP_ATTACK_CROUCH_ITEM2_SECONDARY = 673,
	ACT_MP_ATTACK_SWIM_ITEM2 = 674,
	ACT_MP_ATTACK_AIRWALK_ITEM2 = 675,
	ACT_MP_GESTURE_FLINCH = 676,
	ACT_MP_GESTURE_FLINCH_PRIMARY = 677,
	ACT_MP_GESTURE_FLINCH_SECONDARY = 678,
	ACT_MP_GESTURE_FLINCH_MELEE = 679,
	ACT_MP_GESTURE_FLINCH_ITEM1 = 680,
	ACT_MP_GESTURE_FLINCH_ITEM2 = 681,
	ACT_MP_GESTURE_FLINCH_HEAD = 682,
	ACT_MP_GESTURE_FLINCH_CHEST = 683,
	ACT_MP_GESTURE_FLINCH_STOMACH = 684,
	ACT_MP_GESTURE_FLINCH_LEFTARM = 685,
	ACT_MP_GESTURE_FLINCH_RIGHTARM = 686,
	ACT_MP_GESTURE_FLINCH_LEFTLEG = 687,
	ACT_MP_GESTURE_FLINCH_RIGHTLEG = 688,
	ACT_MP_GRENADE1_DRAW = 689,
	ACT_MP_GRENADE1_IDLE = 690,
	ACT_MP_GRENADE1_ATTACK = 691,
	ACT_MP_GRENADE2_DRAW = 692,
	ACT_MP_GRENADE2_IDLE = 693,
	ACT_MP_GRENADE2_ATTACK = 694,
	ACT_MP_PRIMARY_GRENADE1_DRAW = 695,
	ACT_MP_PRIMARY_GRENADE1_IDLE = 696,
	ACT_MP_PRIMARY_GRENADE1_ATTACK = 697,
	ACT_MP_PRIMARY_GRENADE2_DRAW = 698,
	ACT_MP_PRIMARY_GRENADE2_IDLE = 699,
	ACT_MP_PRIMARY_GRENADE2_ATTACK = 700,
	ACT_MP_SECONDARY_GRENADE1_DRAW = 701,
	ACT_MP_SECONDARY_GRENADE1_IDLE = 702,
	ACT_MP_SECONDARY_GRENADE1_ATTACK = 703,
	ACT_MP_SECONDARY_GRENADE2_DRAW = 704,
	ACT_MP_SECONDARY_GRENADE2_IDLE = 705,
	ACT_MP_SECONDARY_GRENADE2_ATTACK = 706,
	ACT_MP_MELEE_GRENADE1_DRAW = 707,
	ACT_MP_MELEE_GRENADE1_IDLE = 708,
	ACT_MP_MELEE_GRENADE1_ATTACK = 709,
	ACT_MP_MELEE_GRENADE2_DRAW = 710,
	ACT_MP_MELEE_GRENADE2_IDLE = 711,
	ACT_MP_MELEE_GRENADE2_ATTACK = 712,
	ACT_MP_ITEM1_GRENADE1_DRAW = 713,
	ACT_MP_ITEM1_GRENADE1_IDLE = 714,
	ACT_MP_ITEM1_GRENADE1_ATTACK = 715,
	ACT_MP_ITEM1_GRENADE2_DRAW = 716,
	ACT_MP_ITEM1_GRENADE2_IDLE = 717,
	ACT_MP_ITEM1_GRENADE2_ATTACK = 718,
	ACT_MP_ITEM2_GRENADE1_DRAW = 719,
	ACT_MP_ITEM2_GRENADE1_IDLE = 720,
	ACT_MP_ITEM2_GRENADE1_ATTACK = 721,
	ACT_MP_ITEM2_GRENADE2_DRAW = 722,
	ACT_MP_ITEM2_GRENADE2_IDLE = 723,
	ACT_MP_ITEM2_GRENADE2_ATTACK = 724,
	ACT_MP_STAND_BUILDING = 725,
	ACT_MP_CROUCH_BUILDING = 726,
	ACT_MP_RUN_BUILDING = 727,
	ACT_MP_WALK_BUILDING = 728,
	ACT_MP_AIRWALK_BUILDING = 729,
	ACT_MP_CROUCHWALK_BUILDING = 730,
	ACT_MP_JUMP_BUILDING = 731,
	ACT_MP_JUMP_START_BUILDING = 732,
	ACT_MP_JUMP_FLOAT_BUILDING = 733,
	ACT_MP_JUMP_LAND_BUILDING = 734,
	ACT_MP_SWIM_BUILDING = 735,
	ACT_MP_ATTACK_STAND_BUILDING = 736,
	ACT_MP_ATTACK_CROUCH_BUILDING = 737,
	ACT_MP_ATTACK_SWIM_BUILDING = 738,
	ACT_MP_ATTACK_AIRWALK_BUILDING = 739,
	ACT_MP_ATTACK_STAND_GRENADE_BUILDING = 740,
	ACT_MP_ATTACK_CROUCH_GRENADE_BUILDING = 741,
	ACT_MP_ATTACK_SWIM_GRENADE_BUILDING = 742,
	ACT_MP_ATTACK_AIRWALK_GRENADE_BUILDING = 743,
	ACT_MP_STAND_PDA = 744,
	ACT_MP_CROUCH_PDA = 745,
	ACT_MP_RUN_PDA = 746,
	ACT_MP_WALK_PDA = 747,
	ACT_MP_AIRWALK_PDA = 748,
	ACT_MP_CROUCHWALK_PDA = 749,
	ACT_MP_JUMP_PDA = 750,
	ACT_MP_JUMP_START_PDA = 751,
	ACT_MP_JUMP_FLOAT_PDA = 752,
	ACT_MP_JUMP_LAND_PDA = 753,
	ACT_MP_SWIM_PDA = 754,
	ACT_MP_ATTACK_STAND_PDA = 755,
	ACT_MP_ATTACK_SWIM_PDA = 756,
	ACT_MP_GESTURE_VC_HANDMOUTH = 757,
	ACT_MP_GESTURE_VC_FINGERPOINT = 758,
	ACT_MP_GESTURE_VC_FISTPUMP = 759,
	ACT_MP_GESTURE_VC_THUMBSUP = 760,
	ACT_MP_GESTURE_VC_NODYES = 761,
	ACT_MP_GESTURE_VC_NODNO = 762,
	ACT_MP_GESTURE_VC_HANDMOUTH_PRIMARY = 763,
	ACT_MP_GESTURE_VC_FINGERPOINT_PRIMARY = 764,
	ACT_MP_GESTURE_VC_FISTPUMP_PRIMARY = 765,
	ACT_MP_GESTURE_VC_THUMBSUP_PRIMARY = 766,
	ACT_MP_GESTURE_VC_NODYES_PRIMARY = 767,
	ACT_MP_GESTURE_VC_NODNO_PRIMARY = 768,
	ACT_MP_GESTURE_VC_HANDMOUTH_SECONDARY = 769,
	ACT_MP_GESTURE_VC_FINGERPOINT_SECONDARY = 770,
	ACT_MP_GESTURE_VC_FISTPUMP_SECONDARY = 771,
	ACT_MP_GESTURE_VC_THUMBSUP_SECONDARY = 772,
	ACT_MP_GESTURE_VC_NODYES_SECONDARY = 773,
	ACT_MP_GESTURE_VC_NODNO_SECONDARY = 774,
	ACT_MP_GESTURE_VC_HANDMOUTH_MELEE = 775,
	ACT_MP_GESTURE_VC_FINGERPOINT_MELEE = 776,
	ACT_MP_GESTURE_VC_FISTPUMP_MELEE = 777,
	ACT_MP_GESTURE_VC_THUMBSUP_MELEE = 778,
	ACT_MP_GESTURE_VC_NODYES_MELEE = 779,
	ACT_MP_GESTURE_VC_NODNO_MELEE = 780,
	ACT_MP_GESTURE_VC_HANDMOUTH_ITEM1 = 781,
	ACT_MP_GESTURE_VC_FINGERPOINT_ITEM1 = 782,
	ACT_MP_GESTURE_VC_FISTPUMP_ITEM1 = 783,
	ACT_MP_GESTURE_VC_THUMBSUP_ITEM1 = 784,
	ACT_MP_GESTURE_VC_NODYES_ITEM1 = 785,
	ACT_MP_GESTURE_VC_NODNO_ITEM1 = 786,
	ACT_MP_GESTURE_VC_HANDMOUTH_ITEM2 = 787,
	ACT_MP_GESTURE_VC_FINGERPOINT_ITEM2 = 788,
	ACT_MP_GESTURE_VC_FISTPUMP_ITEM2 = 789,
	ACT_MP_GESTURE_VC_THUMBSUP_ITEM2 = 790,
	ACT_MP_GESTURE_VC_NODYES_ITEM2 = 791,
	ACT_MP_GESTURE_VC_NODNO_ITEM2 = 792,
	ACT_MP_GESTURE_VC_HANDMOUTH_BUILDING = 793,
	ACT_MP_GESTURE_VC_FINGERPOINT_BUILDING = 794,
	ACT_MP_GESTURE_VC_FISTPUMP_BUILDING = 795,
	ACT_MP_GESTURE_VC_THUMBSUP_BUILDING = 796,
	ACT_MP_GESTURE_VC_NODYES_BUILDING = 797,
	ACT_MP_GESTURE_VC_NODNO_BUILDING = 798,
	ACT_MP_GESTURE_VC_HANDMOUTH_PDA = 799,
	ACT_MP_GESTURE_VC_FINGERPOINT_PDA = 800,
	ACT_MP_GESTURE_VC_FISTPUMP_PDA = 801,
	ACT_MP_GESTURE_VC_THUMBSUP_PDA = 802,
	ACT_MP_GESTURE_VC_NODYES_PDA = 803,
	ACT_MP_GESTURE_VC_NODNO_PDA = 804,
	ACT_VM_UNUSABLE = 805,
	ACT_VM_UNUSABLE_TO_USABLE = 806,
	ACT_VM_USABLE_TO_UNUSABLE = 807,
	ACT_PRIMARY_VM_DRAW = 808,
	ACT_PRIMARY_VM_HOLSTER = 809,
	ACT_PRIMARY_VM_IDLE = 810,
	ACT_PRIMARY_VM_PULLBACK = 811,
	ACT_PRIMARY_VM_PRIMARYATTACK = 812,
	ACT_PRIMARY_VM_SECONDARYATTACK = 813,
	ACT_PRIMARY_VM_RELOAD = 814,
	ACT_PRIMARY_VM_DRYFIRE = 815,
	ACT_PRIMARY_VM_IDLE_TO_LOWERED = 816,
	ACT_PRIMARY_VM_IDLE_LOWERED = 817,
	ACT_PRIMARY_VM_LOWERED_TO_IDLE = 818,
	ACT_SECONDARY_VM_DRAW = 819,
	ACT_SECONDARY_VM_HOLSTER = 820,
	ACT_SECONDARY_VM_IDLE = 821,
	ACT_SECONDARY_VM_PULLBACK = 822,
	ACT_SECONDARY_VM_PRIMARYATTACK = 823,
	ACT_SECONDARY_VM_SECONDARYATTACK = 824,
	ACT_SECONDARY_VM_RELOAD = 825,
	ACT_SECONDARY_VM_DRYFIRE = 826,
	ACT_SECONDARY_VM_IDLE_TO_LOWERED = 827,
	ACT_SECONDARY_VM_IDLE_LOWERED = 828,
	ACT_SECONDARY_VM_LOWERED_TO_IDLE = 829,
	ACT_MELEE_VM_DRAW = 830,
	ACT_MELEE_VM_HOLSTER = 831,
	ACT_MELEE_VM_IDLE = 832,
	ACT_MELEE_VM_PULLBACK = 833,
	ACT_MELEE_VM_PRIMARYATTACK = 834,
	ACT_MELEE_VM_SECONDARYATTACK = 835,
	ACT_MELEE_VM_RELOAD = 836,
	ACT_MELEE_VM_DRYFIRE = 837,
	ACT_MELEE_VM_IDLE_TO_LOWERED = 838,
	ACT_MELEE_VM_IDLE_LOWERED = 839,
	ACT_MELEE_VM_LOWERED_TO_IDLE = 840,
	ACT_PDA_VM_DRAW = 841,
	ACT_PDA_VM_HOLSTER = 842,
	ACT_PDA_VM_IDLE = 843,
	ACT_PDA_VM_PULLBACK = 844,
	ACT_PDA_VM_PRIMARYATTACK = 845,
	ACT_PDA_VM_SECONDARYATTACK = 846,
	ACT_PDA_VM_RELOAD = 847,
	ACT_PDA_VM_DRYFIRE = 848,
	ACT_PDA_VM_IDLE_TO_LOWERED = 849,
	ACT_PDA_VM_IDLE_LOWERED = 850,
	ACT_PDA_VM_LOWERED_TO_IDLE = 851,
	ACT_ITEM1_VM_DRAW = 852,
	ACT_ITEM1_VM_HOLSTER = 853,
	ACT_ITEM1_VM_IDLE = 854,
	ACT_ITEM1_VM_PULLBACK = 855,
	ACT_ITEM1_VM_PRIMARYATTACK = 856,
	ACT_ITEM1_VM_SECONDARYATTACK = 857,
	ACT_ITEM1_VM_RELOAD = 858,
	ACT_ITEM1_VM_DRYFIRE = 859,
	ACT_ITEM1_VM_IDLE_TO_LOWERED = 860,
	ACT_ITEM1_VM_IDLE_LOWERED = 861,
	ACT_ITEM1_VM_LOWERED_TO_IDLE = 862,
	ACT_ITEM2_VM_DRAW = 863,
	ACT_ITEM2_VM_HOLSTER = 864,
	ACT_ITEM2_VM_IDLE = 865,
	ACT_ITEM2_VM_PULLBACK = 866,
	ACT_ITEM2_VM_PRIMARYATTACK = 867,
	ACT_ITEM2_VM_SECONDARYATTACK = 868,
	ACT_ITEM2_VM_RELOAD = 869,
	ACT_ITEM2_VM_DRYFIRE = 870,
	ACT_ITEM2_VM_IDLE_TO_LOWERED = 871,
	ACT_ITEM2_VM_IDLE_LOWERED = 872,
	ACT_ITEM2_VM_LOWERED_TO_IDLE = 873,
	ACT_RELOAD_SUCCEED = 874,
	ACT_RELOAD_FAIL = 875,
	ACT_WALK_AIM_AUTOGUN = 876,
	ACT_RUN_AIM_AUTOGUN = 877,
	ACT_IDLE_AUTOGUN = 878,
	ACT_IDLE_AIM_AUTOGUN = 879,
	ACT_RELOAD_AUTOGUN = 880,
	ACT_CROUCH_IDLE_AUTOGUN = 881,
	ACT_RANGE_ATTACK_AUTOGUN = 882,
	ACT_JUMP_AUTOGUN = 883,
	ACT_IDLE_AIM_PISTOL = 884,
	ACT_WALK_AIM_DUAL = 885,
	ACT_RUN_AIM_DUAL = 886,
	ACT_IDLE_DUAL = 887,
	ACT_IDLE_AIM_DUAL = 888,
	ACT_RELOAD_DUAL = 889,
	ACT_CROUCH_IDLE_DUAL = 890,
	ACT_RANGE_ATTACK_DUAL = 891,
	ACT_JUMP_DUAL = 892,
	ACT_IDLE_AIM_SHOTGUN = 893,
	ACT_CROUCH_IDLE_SHOTGUN = 894,
	ACT_IDLE_AIM_RIFLE = 895,
	ACT_CROUCH_IDLE_RIFLE = 896,
	ACT_RANGE_ATTACK_RIFLE = 897,
	ACT_SLEEP = 898,
	ACT_WAKE = 899,
	ACT_FLICK_LEFT = 900,
	ACT_FLICK_LEFT_MIDDLE = 901,
	ACT_FLICK_RIGHT_MIDDLE = 902,
	ACT_FLICK_RIGHT = 903,
	ACT_SPINAROUND = 904,
	ACT_PREP_TO_FIRE = 905,
	ACT_FIRE = 906,
	ACT_FIRE_RECOVER = 907,
	ACT_SPRAY = 908,
	ACT_PREP_EXPLODE = 909,
	ACT_EXPLODE = 910,
	ACT_SCRIPT_CUSTOM_0 = 911,
	ACT_SCRIPT_CUSTOM_1 = 912,
	ACT_SCRIPT_CUSTOM_2 = 913,
	ACT_SCRIPT_CUSTOM_3 = 914,
	ACT_SCRIPT_CUSTOM_4 = 915,
	ACT_SCRIPT_CUSTOM_5 = 916,
	ACT_SCRIPT_CUSTOM_6 = 917,
	ACT_SCRIPT_CUSTOM_7 = 918,
	ACT_SCRIPT_CUSTOM_8 = 919,
	ACT_SCRIPT_CUSTOM_9 = 920,
	ACT_SCRIPT_CUSTOM_10 = 921,
	ACT_SCRIPT_CUSTOM_11 = 922,
	ACT_SCRIPT_CUSTOM_12 = 923,
	ACT_SCRIPT_CUSTOM_13 = 924,
	ACT_SCRIPT_CUSTOM_14 = 925,
	ACT_SCRIPT_CUSTOM_15 = 926,
	ACT_SCRIPT_CUSTOM_16 = 927,
	ACT_SCRIPT_CUSTOM_17 = 928,
	ACT_SCRIPT_CUSTOM_18 = 929,
	ACT_SCRIPT_CUSTOM_19 = 930,
	ACT_SCRIPT_CUSTOM_20 = 931,
	ACT_SCRIPT_CUSTOM_21 = 932,
	ACT_SCRIPT_CUSTOM_22 = 933,
	ACT_SCRIPT_CUSTOM_23 = 934,
	ACT_SCRIPT_CUSTOM_24 = 935,
	ACT_SCRIPT_CUSTOM_25 = 936,
	ACT_SCRIPT_CUSTOM_26 = 937,
	ACT_SCRIPT_CUSTOM_27 = 938,
	ACT_SCRIPT_CUSTOM_28 = 939,
	ACT_SCRIPT_CUSTOM_29 = 940,
	ACT_SCRIPT_CUSTOM_30 = 941,
	ACT_SCRIPT_CUSTOM_31 = 942,
	ACT_VR_PISTOL_LAST_SHOT = 943,
	ACT_VR_PISTOL_SLIDE_RELEASE = 944,
	ACT_VR_PISTOL_CLIP_OUT_CHAMBERED = 945,
	ACT_VR_PISTOL_CLIP_OUT_SLIDE_BACK = 946,
	ACT_VR_PISTOL_CLIP_IN_CHAMBERED = 947,
	ACT_VR_PISTOL_CLIP_IN_SLIDE_BACK = 948,
	ACT_VR_PISTOL_IDLE_SLIDE_BACK = 949,
	ACT_VR_PISTOL_IDLE_SLIDE_BACK_CLIP_READY = 950,
	ACT_RAGDOLL_RECOVERY_FRONT = 951,
	ACT_RAGDOLL_RECOVERY_BACK = 952,
	ACT_RAGDOLL_RECOVERY_LEFT = 953,
	ACT_RAGDOLL_RECOVERY_RIGHT = 954,
	ACT_GRABBITYGLOVES_GRAB = 955,
	ACT_GRABBITYGLOVES_RELEASE = 956,
	ACT_GRABBITYGLOVES_GRAB_IDLE = 957,
	ACT_GRABBITYGLOVES_ACTIVE = 958,
	ACT_GRABBITYGLOVES_ACTIVE_IDLE = 959,
	ACT_GRABBITYGLOVES_DEACTIVATE = 960,
	ACT_GRABBITYGLOVES_PULL = 961,
	ACT_HEADCRAB_SMOKE_BOMB = 962,
	ACT_HEADCRAB_SPIT = 963,
	ACT_ZOMBIE_TRIP = 964,
	ACT_ZOMBIE_LUNGE = 965,
	ACT_NEUTRAL_REF_POSE = 966,
	ACT_ANTLION_SCUTTLE_FORWARD = 967,
	ACT_ANTLION_SCUTTLE_BACK = 968,
	ACT_ANTLION_SCUTTLE_LEFT = 969,
	ACT_ANTLION_SCUTTLE_RIGHT = 970,
	ACT_VR_PISTOL_EMPTY_CLIP_IN_SLIDE_BACK = 971,
	ACT_VR_SHOTGUN_IDLE = 972,
	ACT_VR_SHOTGUN_OPEN_CHAMBER = 973,
	ACT_VR_SHOTGUN_RELOAD_1 = 974,
	ACT_VR_SHOTGUN_RELOAD_2 = 975,
	ACT_VR_SHOTGUN_RELOAD_3 = 976,
	ACT_VR_SHOTGUN_CLOSE_CHAMBER = 977,
	ACT_VR_SHOTGUN_TRIGGER_SQUEEZE = 978,
	ACT_VR_SHOTGUN_SHOOT = 979,
	ACT_VR_SHOTGUN_SLIDE_BACK = 980,
	ACT_VR_SHOTGUN_SLIDE_FORWARD = 981,
	ACT_VR_PISTOL_LONG_CLIP_IN_CHAMBERED = 982,
	ACT_VR_PISTOL_LONG_CLIP_IN_SLIDE_BACK = 983,
	ACT_VR_PISTOL_BURST_TOGGLE = 984,
	ACT_VR_PISTOL_LOW_KICK = 985,
	ACT_VR_PISTOL_BURST_ATTACK = 986
}
declare const enum ThreeState_t {
	TRS_FALSE = 0,
	TRS_TRUE = 1,
	TRS_NONE = 2
}
declare const enum TrainOrientationType_t {
	TrainOrientation_Fixed = 0,
	TrainOrientation_AtPathTracks = 1,
	TrainOrientation_LinearBlend = 2,
	TrainOrientation_EaseInEaseOut = 3
}
declare const enum explosion_t {
	EXPLOSION_DEFAULT = 0,
	EXPLOSION_GRENADE = 1,
	EXPLOSION_MOLOTOV = 2,
	EXPLOSION_FIREWORKS = 3
}
declare const enum ValueRemapperMomentumType_t {
	MomentumType_None = 0,
	MomentumType_Friction = 1,
	MomentumType_SpringTowardSnapValue = 2,
	MomentumType_SpringAwayFromSnapValue = 3
}
declare const enum ValueRemapperHapticsType_t {
	HaticsType_Default = 0,
	HaticsType_None = 1
}
declare const enum quest_hud_types_t {
	QUEST_HUD_TYPE_DEFAULT = 0,
	QUEST_HUD_TYPE_GOLD = 1,
	QUEST_HUD_TYPE_ATTACK = 2,
	QUEST_HUD_TYPE_DEFEND = 3,
	QUEST_NUM_HUD_TYPES = 4
}
declare const enum DamageCategory_t {
	DOTA_DAMAGE_CATEGORY_SPELL = 0,
	DOTA_DAMAGE_CATEGORY_ATTACK = 1
}
declare const enum AnimNodeNetworkMode {
	ServerAuthoritative = 0,
	ClientSimulate = 1
}
declare const enum SteamUGCMatchingUGCType {
	Items = 0,
	Items_Mtx = 1,
	Items_ReadyToUse = 2,
	Collections = 3,
	Artwork = 4,
	Videos = 5,
	Screenshots = 6,
	AllGuides = 7,
	WebGuides = 8,
	IntegratedGuides = 9,
	UsableInGame = 10,
	ControllerBindings = 11,
	GameManagedItems = 12,
	All = -1
}
declare const enum navproperties_t {
	NAV_IGNORE = 1
}
declare const enum GlobalIlluminationMethod_t {
	GLOBAL_ILLUMINATION_NONE = 0,
	GLOBAL_ILLUMINATION_BAKE = 1,
	GLOBAL_ILLUMINATION_AMBIENT_OCCLUSION = 2,
	GLOBAL_ILLUMINATION_REALTIME_RADIOSITY = 3
}
declare const enum RenderMeshFlexControllerRemapType_t {
	FLEXCONTROLLER_REMAP_PASSTHRU = 0,
	FLEXCONTROLLER_REMAP_2WAY = 1,
	FLEXCONTROLLER_REMAP_NWAY = 2,
	FLEXCONTROLLER_REMAP_EYELID = 3
}
declare const enum RMSG_SubEventType_t {
	RMSG_SUB_EVENT_INVALID = -1,
	RMSG_SUB_EVENT_INSTANT = 0,
	RMSG_SUB_EVENT_BEGIN_SPAN = 1,
	RMSG_SUB_EVENT_END_SPAN = 2,
	RMSG_SUB_EVENT_COUNT = 3
}
declare const enum Explosions {
	expRandom = 0,
	expDirected = 1,
	expUsePrecise = 2
}
declare const enum DOTAProjectileAttachment_t {
	DOTA_PROJECTILE_ATTACHMENT_NONE = 0,
	DOTA_PROJECTILE_ATTACHMENT_ATTACK_1 = 1,
	DOTA_PROJECTILE_ATTACHMENT_ATTACK_2 = 2,
	DOTA_PROJECTILE_ATTACHMENT_HITLOCATION = 3,
	DOTA_PROJECTILE_ATTACHMENT_ATTACK_3 = 4,
	DOTA_PROJECTILE_ATTACHMENT_ATTACK_4 = 5,
	DOTA_PROJECTILE_ATTACHMENT_LAST = 6
}
declare const enum ChoiceChangeMethod {
	OnReset = 0,
	OnCycleEnd = 1,
	OnResetOrCycleEnd = 2
}
declare const enum PropDoorRotatingSpawnPos_t {
	DOOR_SPAWN_CLOSED = 0,
	DOOR_SPAWN_OPEN_FORWARD = 1,
	DOOR_SPAWN_OPEN_BACK = 2,
	DOOR_SPAWN_AJAR = 3
}
declare const enum Touch_t {
	touch_none = 0,
	touch_player_only = 1,
	touch_npc_only = 2,
	touch_player_or_npc = 3,
	touch_player_or_npc_or_physicsprop = 4
}
declare const enum DOTAInventoryFlags_t {
	DOTA_INVENTORY_ALLOW_NONE = 0,
	DOTA_INVENTORY_ALLOW_MAIN = 1,
	DOTA_INVENTORY_ALLOW_STASH = 2,
	DOTA_INVENTORY_ALLOW_DROP_ON_GROUND = 4,
	DOTA_INVENTORY_ALLOW_DROP_AT_FOUNTAIN = 8,
	DOTA_INVENTORY_LIMIT_DROP_ON_GROUND = 16,
	DOTA_INVENTORY_ALL_ACCESS = 3
}
declare const enum DotaDefaultUIElement_t {
	DOTA_DEFAULT_UI_INVALID = -1,
	DOTA_DEFAULT_UI_TOP_TIMEOFDAY = 0,
	DOTA_DEFAULT_UI_TOP_HEROES = 1,
	DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD = 2,
	DOTA_DEFAULT_UI_ACTION_PANEL = 3,
	DOTA_DEFAULT_UI_ACTION_MINIMAP = 4,
	DOTA_DEFAULT_UI_INVENTORY_PANEL = 5,
	DOTA_DEFAULT_UI_INVENTORY_SHOP = 6,
	DOTA_DEFAULT_UI_INVENTORY_ITEMS = 7,
	DOTA_DEFAULT_UI_INVENTORY_QUICKBUY = 8,
	DOTA_DEFAULT_UI_INVENTORY_COURIER = 9,
	DOTA_DEFAULT_UI_INVENTORY_PROTECT = 10,
	DOTA_DEFAULT_UI_INVENTORY_GOLD = 11,
	DOTA_DEFAULT_UI_SHOP_SUGGESTEDITEMS = 12,
	DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS = 13,
	DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME = 14,
	DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK = 15,
	DOTA_DEFAULT_UI_TOP_MENU_BUTTONS = 16,
	DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND = 17,
	DOTA_DEFAULT_UI_TOP_BAR_RADIANT_TEAM = 18,
	DOTA_DEFAULT_UI_TOP_BAR_DIRE_TEAM = 19,
	DOTA_DEFAULT_UI_TOP_BAR_SCORE = 20,
	DOTA_DEFAULT_UI_ENDGAME = 21,
	DOTA_DEFAULT_UI_ENDGAME_CHAT = 22,
	DOTA_DEFAULT_UI_QUICK_STATS = 23,
	DOTA_DEFAULT_UI_PREGAME_STRATEGYUI = 24,
	DOTA_DEFAULT_UI_KILLCAM = 25,
	DOTA_DEFAULT_UI_TOP_BAR = 26,
	DOTA_DEFAULT_UI_ELEMENT_COUNT = 27
}
declare const enum MeshTranslucencyType_t {
	MESH_TRANSLUCENCY_FULLY_OPAQUE = 0,
	MESH_TRANSLUCENCY_PARTIALLY_ALPHA_BLENDED = 1,
	MESH_TRANSLUCENCY_FULLY_ALPHA_BLENDED = 2
}
declare const enum SignonState_t {
	SIGNONSTATE_NONE = 0,
	SIGNONSTATE_CHALLENGE = 1,
	SIGNONSTATE_CONNECTED = 2,
	SIGNONSTATE_NEW = 3,
	SIGNONSTATE_PRESPAWN = 4,
	SIGNONSTATE_SPAWN = 5,
	SIGNONSTATE_FULL = 6,
	SIGNONSTATE_CHANGELEVEL = 7
}
declare const enum WeaponTexture_t {
	WEAPON_TEXTURE_ICON_ACTIVE = 0,
	WEAPON_TEXTURE_ICON_INACTIVE = 1,
	WEAPON_TEXTURE_ICON_AMMO = 2,
	WEAPON_TEXTURE_ICON_AMMO2 = 3,
	WEAPON_TEXTURE_ICON_CROSSHAIR = 4,
	WEAPON_TEXTURE_ICON_AUTOAIM = 5,
	WEAPON_TEXTURE_ICON_ZOOMED_CROSSHAIR = 6,
	WEAPON_TEXTURE_ICON_ZOOMED_AUTOAIM = 7,
	WEAPON_TEXTURE_ICON_SMALL = 8
}
declare const enum EDOTASpecialBonusOperation {
	SPECIAL_BONUS_ADD = 0,
	SPECIAL_BONUS_MULTIPLY = 1,
	SPECIAL_BONUS_SUBTRACT = 2
}
declare const enum DOTAAbilitySpeakTrigger_t {
	DOTA_ABILITY_SPEAK_START_ACTION_PHASE = 0,
	DOTA_ABILITY_SPEAK_CAST = 1
}
declare const enum HierarchyType_t {
	HIERARCHY_NONE = 0,
	HIERARCHY_BONE_MERGE = 1,
	HIERARCHY_ATTACHMENT = 2,
	HIERARCHY_ABSORIGIN = 3,
	HIERARCHY_BONE = 4,
	HIERARCHY_TYPE_COUNT = 5
}
declare const enum BoneMaskBlendSpace {
	BlendSpace_Parent = 0,
	BlendSpace_Model = 1,
	BlendSpace_Model_RotationOnly = 2
}
declare const enum quest_text_replace_values_t {
	QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE = 0,
	QUEST_TEXT_REPLACE_VALUE_TARGET_VALUE = 1,
	QUEST_TEXT_REPLACE_VALUE_ROUND = 2,
	QUEST_TEXT_REPLACE_VALUE_REWARD = 3,
	QUEST_NUM_TEXT_REPLACE_VALUES = 4
}
declare const enum modifierremove {
	DOTA_BUFF_REMOVE_ALL = 0,
	DOTA_BUFF_REMOVE_ENEMY = 1,
	DOTA_BUFF_REMOVE_ALLY = 2
}
declare const enum DoorState_t {
	DOOR_STATE_CLOSED = 0,
	DOOR_STATE_OPENING = 1,
	DOOR_STATE_OPEN = 2,
	DOOR_STATE_CLOSING = 3,
	DOOR_STATE_AJAR = 4
}
declare const enum AnimVectorSource {
	MoveDirection = 0,
	FacingDirection = 1,
	LookDirection = 2,
	VectorParameter = 3,
	WayPointDirection = 4,
	WayPointFacingDirection = 5,
	TargetMoveDirection = 6,
	Acceleration = 7,
	SlopeNormal = 8,
	LookTarget = 9,
	WayPointPosition = 10,
	GoalPosition = 11,
	GoalFacingDirection = 12
}
declare const enum fieldtype_t {
	FIELD_VOID = 0,
	FIELD_FLOAT32 = 1,
	FIELD_STRING = 2,
	FIELD_VECTOR = 3,
	FIELD_INT32 = 5,
	FIELD_BOOLEAN = 6,
	FIELD_INT16 = 7,
	FIELD_CHARACTER = 8,
	FIELD_COLOR32 = 9,
	FIELD_EMBEDDED = 10,
	FIELD_CUSTOM = 11,
	FIELD_CLASSPTR = 12,
	FIELD_EHANDLE = 13,
	FIELD_POSITION_VECTOR = 14,
	FIELD_TIME = 15,
	FIELD_TICK = 16,
	FIELD_SOUNDNAME = 17,
	FIELD_INPUT = 18,
	FIELD_FUNCTION = 19,
	FIELD_VMATRIX = 20,
	FIELD_VMATRIX_WORLDSPACE = 21,
	FIELD_MATRIX3X4_WORLDSPACE = 22,
	FIELD_INTERVAL = 23,
	FIELD_UNUSED = 24,
	FIELD_VECTOR2D = 25,
	FIELD_INT64 = 26,
	FIELD_VECTOR4D = 27,
	FIELD_RESOURCE = 28,
	FIELD_TYPEUNKNOWN = 29,
	FIELD_CSTRING = 30,
	FIELD_VARIANT = 32,
	FIELD_UINT64 = 33,
	FIELD_FLOAT64 = 34,
	FIELD_POSITIVEINTEGER_OR_NULL = 35,
	FIELD_UINT32 = 37,
	FIELD_QANGLE = 39,
	FIELD_NETWORK_ORIGIN_CELL_QUANTIZED_VECTOR = 40,
	FIELD_HMATERIAL = 41,
	FIELD_HMODEL = 42,
	FIELD_NETWORK_QUANTIZED_VECTOR = 43,
	FIELD_NETWORK_QUANTIZED_FLOAT = 44,
	FIELD_DIRECTION_VECTOR_WORLDSPACE = 45,
	FIELD_QANGLE_WORLDSPACE = 46,
	FIELD_V8_VALUE = 49,
	FIELD_V8_OBJECT = 50,
	FIELD_V8_ARRAY = 51,
	FIELD_V8_CALLBACK_INFO = 52,
	FIELD_UTLSTRING = 53,
	FIELD_NETWORK_ORIGIN_CELL_QUANTIZED_POSITION_VECTOR = 54,
	FIELD_HRENDERTEXTURE = 55,
	FIELD_HPARTICLESYSTEMDEFINITION = 56,
	FIELD_UINT8 = 57,
	FIELD_UINT16 = 58,
	FIELD_CTRANSFORM = 59,
	FIELD_CTRANSFORM_WORLDSPACE = 60,
	FIELD_HPOSTPROCESSING = 61,
	FIELD_TYPECOUNT = 62
}
declare const enum PlayerOrderIssuer_t {
	DOTA_ORDER_ISSUER_SELECTED_UNITS = 0,
	DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY = 1,
	DOTA_ORDER_ISSUER_HERO_ONLY = 2,
	DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY = 3
}
declare const enum SPELL_DISPELLABLE_TYPES {
	SPELL_DISPELLABLE_NONE = 0,
	SPELL_DISPELLABLE_YES_STRONG = 1,
	SPELL_DISPELLABLE_YES = 2,
	SPELL_DISPELLABLE_NO = 3
}
declare const enum DOTAMinimapEvent_t {
	DOTA_MINIMAP_EVENT_ANCIENT_UNDER_ATTACK = 2,
	DOTA_MINIMAP_EVENT_BASE_UNDER_ATTACK = 4,
	DOTA_MINIMAP_EVENT_BASE_GLYPHED = 8,
	DOTA_MINIMAP_EVENT_TEAMMATE_UNDER_ATTACK = 16,
	DOTA_MINIMAP_EVENT_TEAMMATE_TELEPORTING = 32,
	DOTA_MINIMAP_EVENT_TEAMMATE_DIED = 64,
	DOTA_MINIMAP_EVENT_TUTORIAL_TASK_ACTIVE = 128,
	DOTA_MINIMAP_EVENT_TUTORIAL_TASK_FINISHED = 256,
	DOTA_MINIMAP_EVENT_HINT_LOCATION = 512,
	DOTA_MINIMAP_EVENT_ENEMY_TELEPORTING = 1024,
	DOTA_MINIMAP_EVENT_CANCEL_TELEPORTING = 2048,
	DOTA_MINIMAP_EVENT_RADAR = 4096,
	DOTA_MINIMAP_EVENT_RADAR_TARGET = 8192
}
declare const enum LessonPanelLayoutFileTypes_t {
	LAYOUT_HAND_DEFAULT = 0,
	LAYOUT_WORLD_DEFAULT = 1,
	LAYOUT_CUSTOM = 2
}
declare const enum EntityIOTargetType_t {
	ENTITY_IO_TARGET_INVALID = -1,
	ENTITY_IO_TARGET_CLASSNAME = 0,
	ENTITY_IO_TARGET_CLASSNAME_DERIVES_FROM = 1,
	ENTITY_IO_TARGET_ENTITYNAME = 2,
	ENTITY_IO_TARGET_CONTAINS_COMPONENT = 3,
	ENTITY_IO_TARGET_SPECIAL_ACTIVATOR = 4,
	ENTITY_IO_TARGET_SPECIAL_CALLER = 5,
	ENTITY_IO_TARGET_EHANDLE = 6,
	ENTITY_IO_TARGET_ENTITYNAME_OR_CLASSNAME = 7
}
declare const enum PetCoopStates_t {
	COOP_IGNORE = 0,
	COOPTELEPORT_START_PERFORMING = 1,
	COOPTELEPORT_PLAY_ENDANIM = 2,
	COOPTELEPORT_PLAY_EXITANIM = 3,
	COOP_WARD_OBSERVER = 4,
	COOP_WARD_SENTRY = 5
}
declare const enum gender_t {
	GENDER_NONE = 0,
	GENDER_MALE = 1,
	GENDER_FEMALE = 2,
	GENDER_NAMVET = 3,
	GENDER_TEENGIRL = 4,
	GENDER_BIKER = 5,
	GENDER_MANAGER = 6,
	GENDER_GAMBLER = 7,
	GENDER_PRODUCER = 8,
	GENDER_COACH = 9,
	GENDER_MECHANIC = 10,
	GENDER_CEDA = 11,
	GENDER_CRAWLER = 12,
	GENDER_UNDISTRACTABLE = 13,
	GENDER_FALLEN = 14,
	GENDER_RIOT_CONTROL = 15,
	GENDER_CLOWN = 16,
	GENDER_JIMMY = 17,
	GENDER_HOSPITAL_PATIENT = 18,
	GENDER_BRIDE = 19,
	GENDER_LAST = 20
}
declare const enum SteamUniverse {
	Invalid = 0,
	Internal = 3,
	Dev = 4,
	Beta = 2,
	Public = 1
}
declare const enum DOTACustomHeroPickRulesPhase_t {
	PHASE_Ban = 0,
	PHASE_Pick = 1
}
declare const enum DOTA_HOLDOUT_TOWER_TYPE {
	DOTA_HOLDOUT_TOWER_NONE = 0,
	DOTA_HOLDOUT_TOWER_LIGHTFAST = 1,
	DOTA_HOLDOUT_TOWER_HEAVYSLOW = 2,
	DOTA_HOLDOUT_TOWER_REDUCESPEED = 3,
	DOTA_HOLDOUT_TOWER_COUNT = 4
}
declare const enum PointWorldTextReorientMode_t {
	POINT_WORLD_TEXT_REORIENT_NONE = 0,
	POINT_WORLD_TEXT_REORIENT_AROUND_UP = 1
}
declare const enum DOTA_PURGE_FLAGS {
	DOTA_PURGE_FLAG_NONE = 0,
	DOTA_PURGE_FLAG_REMOVE_BUFFS = 2,
	DOTA_PURGE_FLAG_REMOVE_DEBUFFS = 4,
	DOTA_PURGE_FLAG_REMOVE_STUNS = 8,
	DOTA_PURGE_FLAG_REMOVE_EXCEPTIONS = 16,
	DOTA_PURGE_FLAG_REMOVE_THIS_FRAME_ONLY = 32
}
declare const enum SosActionSortType_t {
	SOS_SORTTYPE_HIGHEST = 0,
	SOS_SORTTYPE_LOWEST = 1
}
declare const enum NPC_STATE {
	NPC_STATE_INVALID = -1,
	NPC_STATE_NONE = 0,
	NPC_STATE_IDLE = 1,
	NPC_STATE_ALERT = 2,
	NPC_STATE_COMBAT = 3,
	NPC_STATE_SCRIPT = 4,
	NPC_STATE_PLAYDEAD = 5,
	NPC_STATE_PRONE = 6,
	NPC_STATE_DEAD = 7
}
declare const enum AnimVRHandMotionRange_t {
	MotionRange_WithController = 0,
	MotionRange_WithoutController = 1
}
declare const enum ResourceStructFlags_t {
	STRUCT_HAS_VTABLE = 1,
	STRUCT_TREE_REQUIRES_SCATTER = 2,
	STRUCT_TREE_REQUIRES_CONSTRUCTOR = 4,
	STRUCT_TREE_REQUIRES_DESTRUCTOR = 8,
	STRUCT_TREE_REQUIRES_EXT_REFERENCES = 16,
	STRUCT_TREE_REQUIRES_UNUSED = 32,
	STRUCT_FLAGS_MAX = 32
}
declare const enum WorldTextPanelHorizontalAlign_t {
	WORLDTEXT_HORIZONTAL_ALIGN_LEFT = 0,
	WORLDTEXT_HORIZONTAL_ALIGN_CENTER = 1,
	WORLDTEXT_HORIZONTAL_ALIGN_RIGHT = 2
}
declare const enum DOTA_UNIT_TARGET_TYPE {
	DOTA_UNIT_TARGET_NONE = 0,
	DOTA_UNIT_TARGET_HERO = 1,
	DOTA_UNIT_TARGET_CREEP = 2,
	DOTA_UNIT_TARGET_BUILDING = 4,
	DOTA_UNIT_TARGET_COURIER = 16,
	DOTA_UNIT_TARGET_OTHER = 32,
	DOTA_UNIT_TARGET_TREE = 64,
	DOTA_UNIT_TARGET_CUSTOM = 128,
	DOTA_UNIT_TARGET_BASIC = 18,
	DOTA_UNIT_TARGET_ALL = 55
}
declare const enum PetGroundType_t {
	PET_GROUND_NONE = 0,
	PET_GROUND_GRID = 1,
	PET_GROUND_PLANE = 2
}
declare const enum PortraitDisplayMode_t {
	PORTRAIT_DISPLAY_MODE_INVALID = -1,
	PORTRAIT_DISPLAY_MODE_LOADOUT = 0,
	PORTRAIT_DISPLAY_MODE_LOADOUT_DIRE = 1,
	PORTRAIT_DISPLAY_MODE_LOADOUT_SMALL = 2,
	PORTRAIT_DISPLAY_MODE_TREASURE_SMALL = 3
}
declare const enum eLogicalHandType {
	LOGICAL_HAND_TYPE_UNKNOWN = -1,
	LOGICAL_HAND_TYPE_PRIMARY_HAND = 0,
	LOGICAL_HAND_TYPE_OFF_HAND = 1,
	LOGICAL_HAND_TYPE_COUNT = 2
}
declare const enum InputLayoutVariation_t {
	INPUT_LAYOUT_VARIATION_DEFAULT = 0,
	INPUT_LAYOUT_VARIATION_STREAM1_MAT3X4 = 1,
	INPUT_LAYOUT_VARIATION_STREAM1_INSTANCEID = 2,
	INPUT_LAYOUT_VARIATION_STREAM1_INSTANCEID_LIGHTMAP_PARAMS = 3,
	INPUT_LAYOUT_VARIATION_STREAM1_INSTANCEID_MORPH_VERT_ID = 4,
	INPUT_LAYOUT_VARIATION_MAX = 5
}
declare const enum BlendKeyType {
	BlendKey_UserValue = 0,
	BlendKey_Velocity = 1,
	BlendKey_Distance = 2,
	BlendKey_RemainingDistance = 3
}
declare const enum VertJustification_e {
	VERT_JUSTIFICATION_TOP = 0,
	VERT_JUSTIFICATION_CENTER = 1,
	VERT_JUSTIFICATION_BOTTOM = 2,
	VERT_JUSTIFICATION_NONE = 3
}
declare const enum TakeHealthOptions_t {
	TH_IGNORE_MAX_HITPOINTS = 1
}
declare const enum MoveType_t {
	MOVETYPE_NONE = 0,
	MOVETYPE_ISOMETRIC = 1,
	MOVETYPE_WALK = 2,
	MOVETYPE_STEP = 3,
	MOVETYPE_FLY = 4,
	MOVETYPE_FLYGRAVITY = 5,
	MOVETYPE_VPHYSICS = 6,
	MOVETYPE_PUSH = 7,
	MOVETYPE_NOCLIP = 8,
	MOVETYPE_LADDER = 9,
	MOVETYPE_OBSERVER = 10,
	MOVETYPE_CUSTOM = 11,
	MOVETYPE_LAST = 11,
	MOVETYPE_MAX_BITS = 4
}
declare const enum LatchDirtyPermission_t {
	LATCH_DIRTY_DISALLOW = 0,
	LATCH_DIRTY_SERVER_CONTROLLED = 1,
	LATCH_DIRTY_CLIENT_SIMULATED = 2,
	LATCH_DIRTY_PREDICTION = 3,
	LATCH_DIRTY_FRAMESIMULATE = 4,
	LATCH_DIRTY_PARTICLE_SIMULATE = 5
}
declare const enum AbilityLearnResult_t {
	ABILITY_CAN_BE_UPGRADED = 0,
	ABILITY_CANNOT_BE_UPGRADED_NOT_UPGRADABLE = 1,
	ABILITY_CANNOT_BE_UPGRADED_AT_MAX = 2,
	ABILITY_CANNOT_BE_UPGRADED_REQUIRES_LEVEL = 3,
	ABILITY_NOT_LEARNABLE = 4
}
declare const enum PostProcessParameterNames_t {
	PPPN_FADE_TIME = 0,
	PPPN_LOCAL_CONTRAST_STRENGTH = 1,
	PPPN_LOCAL_CONTRAST_EDGE_STRENGTH = 2,
	PPPN_VIGNETTE_START = 3,
	PPPN_VIGNETTE_END = 4,
	PPPN_VIGNETTE_BLUR_STRENGTH = 5,
	PPPN_FADE_TO_BLACK_STRENGTH = 6,
	PPPN_DEPTH_BLUR_FOCAL_DISTANCE = 7,
	PPPN_DEPTH_BLUR_STRENGTH = 8,
	PPPN_SCREEN_BLUR_STRENGTH = 9,
	PPPN_FILM_GRAIN_STRENGTH = 10,
	PPPN_TOP_VIGNETTE_STRENGTH = 11,
	POST_PROCESS_PARAMETER_COUNT = 12
}
declare const enum HorizJustification_e {
	HORIZ_JUSTIFICATION_LEFT = 0,
	HORIZ_JUSTIFICATION_CENTER = 1,
	HORIZ_JUSTIFICATION_RIGHT = 2,
	HORIZ_JUSTIFICATION_NONE = 3
}
declare const enum DOTAPortraitEnvironmentType_t {
	DOTA_PORTRAIT_ENVIRONMENT_INVALID = -1,
	DOTA_PORTRAIT_ENVIRONMENT_DEFAULT = 0,
	DOTA_PORTRAIT_ENVIRONMENT_FULL_BODY = 1,
	DOTA_PORTRAIT_ENVIRONMENT_CARD = 2,
	DOTA_PORTRAIT_ENVIRONMENT_VERSUS_RADIANT = 3,
	DOTA_PORTRAIT_ENVIRONMENT_VERSUS_DIRE = 4,
	DOTA_PORTRAIT_ENVIRONMENT_WEBPAGE = 5,
	DOTA_PORTRAIT_ENVIRONMENT_FULL_BODY_RIGHT_SIDE = 6,
	DOTA_PORTRAIT_ENVIRONMENT_TYPE_COUNT = 7
}
declare const enum PointTemplateClientOnlyEntityBehavior_t {
	CREATE_FOR_CURRENTLY_CONNECTED_CLIENTS_ONLY = 0,
	CREATE_FOR_CLIENTS_WHO_CONNECT_LATER = 1
}
declare const enum DOTADamageFlag_t {
	DOTA_DAMAGE_FLAG_NONE = 0,
	DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR = 1,
	DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR = 2,
	DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY = 4,
	DOTA_DAMAGE_FLAG_BYPASSES_BLOCK = 8,
	DOTA_DAMAGE_FLAG_REFLECTION = 16,
	DOTA_DAMAGE_FLAG_HPLOSS = 32,
	DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT = 64,
	DOTA_DAMAGE_FLAG_NON_LETHAL = 128,
	DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY = 256,
	DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS = 512,
	DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION = 1024,
	DOTA_DAMAGE_FLAG_DONT_DISPLAY_DAMAGE_IF_SOURCE_HIDDEN = 2048,
	DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL = 4096
}
declare const enum TimelineCompression_t {
	TIMELINE_COMPRESSION_SUM = 0,
	TIMELINE_COMPRESSION_COUNT_PER_INTERVAL = 1,
	TIMELINE_COMPRESSION_AVERAGE = 2,
	TIMELINE_COMPRESSION_AVERAGE_BLEND = 3,
	TIMELINE_COMPRESSION_TOTAL = 4
}
declare const enum ERoshanSpawnPhase {
	ROSHAN_SPAWN_PHASE_ALIVE = 0,
	ROSHAN_SPAWN_PHASE_BASE_TIMER = 1,
	ROSHAN_SPAWN_PHASE_VISIBLE_TIMER = 2
}
declare const enum attributeprovidertypes_t {
	PROVIDER_GENERIC = 0,
	PROVIDER_WEAPON = 1
}
declare const enum DOTAUnitMoveCapability_t {
	DOTA_UNIT_CAP_MOVE_NONE = 0,
	DOTA_UNIT_CAP_MOVE_GROUND = 1,
	DOTA_UNIT_CAP_MOVE_FLY = 2
}
declare const enum DOTA_MOTION_CONTROLLER_PRIORITY {
	DOTA_MOTION_CONTROLLER_PRIORITY_LOWEST = 0,
	DOTA_MOTION_CONTROLLER_PRIORITY_LOW = 1,
	DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM = 2,
	DOTA_MOTION_CONTROLLER_PRIORITY_HIGH = 3,
	DOTA_MOTION_CONTROLLER_PRIORITY_HIGHEST = 4
}
declare const enum DOTAUnitAttackCapability_t {
	DOTA_UNIT_CAP_NO_ATTACK = 0,
	DOTA_UNIT_CAP_MELEE_ATTACK = 1,
	DOTA_UNIT_CAP_RANGED_ATTACK = 2,
	DOTA_UNIT_CAP_RANGED_ATTACK_DIRECTIONAL = 4,
	DOTA_UNIT_ATTACK_CAPABILITY_BIT_COUNT = 3
}
declare const enum attackfail {
	DOTA_ATTACK_RECORD_FAIL_NO = 0,
	DOTA_ATTACK_RECORD_FAIL_TERRAIN_MISS = 1,
	DOTA_ATTACK_RECORD_FAIL_SOURCE_MISS = 2,
	DOTA_ATTACK_RECORD_FAIL_TARGET_EVADED = 3,
	DOTA_ATTACK_RECORD_FAIL_TARGET_INVULNERABLE = 4,
	DOTA_ATTACK_RECORD_FAIL_TARGET_OUT_OF_RANGE = 5,
	DOTA_ATTACK_RECORD_CANNOT_FAIL = 6,
	DOTA_ATTACK_RECORD_FAIL_BLOCKED_BY_OBSTRUCTION = 7
}
declare const enum ControlValue {
	ControlValue_MoveHeading = 0,
	ControlValue_MoveSpeed = 1,
	ControlValue_FacingHeading = 2,
	ControlValue_LookHeading = 3,
	ControlValue_LookPitch = 4,
	ControlValue_WayPointHeading = 5,
	ControlValue_WayPointFacing = 6,
	ControlValue_WayPointDistance = 7,
	ControlValue_TotalTranslation_SourceState = 8,
	ControlValue_TotalTranslation_TargetState = 9,
	ControlValue_RemainingTranslation_SourceState = 10,
	ControlValue_RemainingTranslation_TargetState = 11,
	ControlValue_MoveVsFacingDelta = 12,
	ControlValue_SourceStateBlendWeight = 13,
	ControlValue_TargetStateBlendWeight = 14,
	ControlValue_TargetMoveHeading = 15,
	ControlValue_TargetMoveSpeed = 16,
	ControlValue_AccelerationHeading = 17,
	ControlValue_AccelerationSpeed = 18,
	ControlValue_SlopeHeading = 19,
	ControlValue_SlopeAngle = 20,
	ControlValue_GoalDistance = 21,
	ControlValue_AccelerationLeftRight = 22,
	ControlValue_AccelerationFrontBack = 23,
	ControlValue_RootMotionSpeed = 24,
	ControlValue_RootMotionTurnSpeed = 25,
	ControlValue_MoveHeadingRelativeToLookHeading = 26,
	ControlValue_Count = 27,
	ControlValue_Invalid = 255
}
declare const enum NavAttributeEnum {
	NAV_MESH_CROUCH = 1,
	NAV_MESH_JUMP = 2,
	NAV_MESH_PRECISE = 4,
	NAV_MESH_NO_JUMP = 8,
	NAV_MESH_AVOID = 128,
	NAV_MESH_STAIRS = 4096,
	NAV_MESH_NO_MERGE = 8192,
	NAV_MESH_OBSTACLE_TOP = 16384,
	NAV_MESH_CLIFF = 32768
}
declare const enum RenderBufferFlags_t {
	RENDER_BUFFER_USAGE_VERTEX_BUFFER = 1,
	RENDER_BUFFER_USAGE_INDEX_BUFFER = 2,
	RENDER_BUFFER_USAGE_SHADER_RESOURCE = 4,
	RENDER_BUFFER_USAGE_UNORDERED_ACCESS = 8,
	RENDER_BUFFER_BYTEADDRESS_BUFFER = 16,
	RENDER_BUFFER_STRUCTURED_BUFFER = 32,
	RENDER_BUFFER_APPEND_CONSUME_BUFFER = 64,
	RENDER_BUFFER_UAV_COUNTER = 128
}
declare const enum DOTA_UNIT_TARGET_FLAGS {
	DOTA_UNIT_TARGET_FLAG_NONE = 0,
	DOTA_UNIT_TARGET_FLAG_RANGED_ONLY = 2,
	DOTA_UNIT_TARGET_FLAG_MELEE_ONLY = 4,
	DOTA_UNIT_TARGET_FLAG_DEAD = 8,
	DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES = 16,
	DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES = 32,
	DOTA_UNIT_TARGET_FLAG_INVULNERABLE = 64,
	DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE = 128,
	DOTA_UNIT_TARGET_FLAG_NO_INVIS = 256,
	DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS = 512,
	DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED = 1024,
	DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED = 2048,
	DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED = 4096,
	DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS = 8192,
	DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE = 16384,
	DOTA_UNIT_TARGET_FLAG_MANA_ONLY = 32768,
	DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP = 65536,
	DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO = 131072,
	DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD = 262144,
	DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED = 524288,
	DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES = 1048576,
	DOTA_UNIT_TARGET_FLAG_RESPECT_OBSTRUCTIONS = 2097152
}
declare const enum TRAIN_CODE {
	TRAIN_SAFE = 0,
	TRAIN_BLOCKING = 1,
	TRAIN_FOLLOWING = 2
}
declare const enum SosEditItemType_t {
	SOS_EDIT_ITEM_TYPE_SOUNDEVENTS = 0,
	SOS_EDIT_ITEM_TYPE_SOUNDEVENT = 1,
	SOS_EDIT_ITEM_TYPE_LIBRARYSTACKS = 2,
	SOS_EDIT_ITEM_TYPE_STACK = 3,
	SOS_EDIT_ITEM_TYPE_OPERATOR = 4,
	SOS_EDIT_ITEM_TYPE_FIELD = 5
}
declare const enum DOTAScriptInventorySlot_t {
	DOTA_ITEM_SLOT_1 = 0,
	DOTA_ITEM_SLOT_2 = 1,
	DOTA_ITEM_SLOT_3 = 2,
	DOTA_ITEM_SLOT_4 = 3,
	DOTA_ITEM_SLOT_5 = 4,
	DOTA_ITEM_SLOT_6 = 5,
	DOTA_ITEM_SLOT_7 = 6,
	DOTA_ITEM_SLOT_8 = 7,
	DOTA_ITEM_SLOT_9 = 8,
	DOTA_STASH_SLOT_1 = 9,
	DOTA_STASH_SLOT_2 = 10,
	DOTA_STASH_SLOT_3 = 11,
	DOTA_STASH_SLOT_4 = 12,
	DOTA_STASH_SLOT_5 = 13,
	DOTA_STASH_SLOT_6 = 14
}
declare const enum filter_t {
	FILTER_AND = 0,
	FILTER_OR = 1
}
declare const enum subquest_text_replace_values_t {
	SUBQUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE = 0,
	SUBQUEST_TEXT_REPLACE_VALUE_TARGET_VALUE = 1,
	SUBQUEST_NUM_TEXT_REPLACE_VALUES = 2
}
declare const enum SosActionStopType_t {
	SOS_STOPTYPE_NONE = 0,
	SOS_STOPTYPE_TIME = 1,
	SOS_STOPTYPE_OPVAR = 2
}
declare const enum ModelBoneFlexComponent_t {
	MODEL_BONE_FLEX_INVALID = -1,
	MODEL_BONE_FLEX_TX = 0,
	MODEL_BONE_FLEX_TY = 1,
	MODEL_BONE_FLEX_TZ = 2
}
declare const enum ParticleAttachment_t {
	PATTACH_INVALID = -1,
	PATTACH_ABSORIGIN = 0,
	PATTACH_ABSORIGIN_FOLLOW = 1,
	PATTACH_CUSTOMORIGIN = 2,
	PATTACH_CUSTOMORIGIN_FOLLOW = 3,
	PATTACH_POINT = 4,
	PATTACH_POINT_FOLLOW = 5,
	PATTACH_EYES_FOLLOW = 6,
	PATTACH_OVERHEAD_FOLLOW = 7,
	PATTACH_WORLDORIGIN = 8,
	PATTACH_ROOTBONE_FOLLOW = 9,
	PATTACH_RENDERORIGIN_FOLLOW = 10,
	PATTACH_MAIN_VIEW = 11,
	PATTACH_WATERWAKE = 12,
	PATTACH_CENTER_FOLLOW = 13,
	MAX_PATTACH_TYPES = 14
}
declare const enum WeaponProficiency_t {
	WEAPON_PROFICIENCY_POOR = 0,
	WEAPON_PROFICIENCY_AVERAGE = 1,
	WEAPON_PROFICIENCY_GOOD = 2,
	WEAPON_PROFICIENCY_VERY_GOOD = 3,
	WEAPON_PROFICIENCY_PERFECT = 4
}
declare const enum CourierState_t {
	COURIER_STATE_INIT = -1,
	COURIER_STATE_IDLE = 0,
	COURIER_STATE_AT_BASE = 1,
	COURIER_STATE_MOVING = 2,
	COURIER_STATE_DELIVERING_ITEMS = 3,
	COURIER_STATE_RETURNING_TO_BASE = 4,
	COURIER_STATE_DEAD = 5,
	COURIER_NUM_STATES = 6
}
declare const enum HandSkeletonBone {
	eBone_Root = 0,
	eBone_Wrist = 1,
	eBone_Thumb0 = 2,
	eBone_Thumb1 = 3,
	eBone_Thumb2 = 4,
	eBone_Thumb3 = 5,
	eBone_IndexFinger0 = 6,
	eBone_IndexFinger1 = 7,
	eBone_IndexFinger2 = 8,
	eBone_IndexFinger3 = 9,
	eBone_IndexFinger4 = 10,
	eBone_MiddleFinger0 = 11,
	eBone_MiddleFinger1 = 12,
	eBone_MiddleFinger2 = 13,
	eBone_MiddleFinger3 = 14,
	eBone_MiddleFinger4 = 15,
	eBone_RingFinger0 = 16,
	eBone_RingFinger1 = 17,
	eBone_RingFinger2 = 18,
	eBone_RingFinger3 = 19,
	eBone_RingFinger4 = 20,
	eBone_PinkyFinger0 = 21,
	eBone_PinkyFinger1 = 22,
	eBone_PinkyFinger2 = 23,
	eBone_PinkyFinger3 = 24,
	eBone_PinkyFinger4 = 25,
	eBone_Aux_Thumb = 26,
	eBone_Aux_IndexFinger = 27,
	eBone_Aux_MiddleFinger = 28,
	eBone_Aux_RingFinger = 29,
	eBone_Aux_PinkyFinger = 30,
	eBone_Count = 31
}
declare const enum FuncDoorSpawnPos_t {
	FUNC_DOOR_SPAWN_CLOSED = 0,
	FUNC_DOOR_SPAWN_OPEN = 1
}
declare const enum DOTA_ITEM_STATE {
	DOTA_ITEM_NEEDS_EQUIPPED = 0,
	DOTA_ITEM_READY = 1
}
declare const enum SolidType_t {
	SOLID_NONE = 0,
	SOLID_BSP = 1,
	SOLID_BBOX = 2,
	SOLID_OBB = 3,
	SOLID_POINT = 5,
	SOLID_VPHYSICS = 6,
	SOLID_CAPSULE = 7,
	SOLID_LAST = 8
}
declare const enum CubeMapFace_t {
	CUBEMAP_FACE_POSITIVE_X = 0,
	CUBEMAP_FACE_NEGATIVE_X = 1,
	CUBEMAP_FACE_POSITIVE_Y = 2,
	CUBEMAP_FACE_NEGATIVE_Y = 3,
	CUBEMAP_FACE_POSITIVE_Z = 4,
	CUBEMAP_FACE_NEGATIVE_Z = 5
}
declare const enum DOTAKeybindCommand_t {
	DOTA_KEYBIND_NONE = 0,
	DOTA_KEYBIND_FIRST = 1,
	DOTA_KEYBIND_CAMERA_UP = 1,
	DOTA_KEYBIND_CAMERA_DOWN = 2,
	DOTA_KEYBIND_CAMERA_LEFT = 3,
	DOTA_KEYBIND_CAMERA_RIGHT = 4,
	DOTA_KEYBIND_CAMERA_GRIP = 5,
	DOTA_KEYBIND_CAMERA_YAW_GRIP = 6,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_1 = 7,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_2 = 8,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_3 = 9,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_4 = 10,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_5 = 11,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_6 = 12,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_7 = 13,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_8 = 14,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_9 = 15,
	DOTA_KEYBIND_CAMERA_SAVED_POSITION_10 = 16,
	DOTA_KEYBIND_HERO_ATTACK = 17,
	DOTA_KEYBIND_HERO_MOVE = 18,
	DOTA_KEYBIND_HERO_MOVE_DIRECTION = 19,
	DOTA_KEYBIND_PATROL = 20,
	DOTA_KEYBIND_HERO_STOP = 21,
	DOTA_KEYBIND_HERO_HOLD = 22,
	DOTA_KEYBIND_HERO_SELECT = 23,
	DOTA_KEYBIND_COURIER_SELECT = 24,
	DOTA_KEYBIND_COURIER_DELIVER = 25,
	DOTA_KEYBIND_COURIER_HASTE = 26,
	DOTA_KEYBIND_PAUSE = 27,
	DOTA_SELECT_ALL = 28,
	DOTA_SELECT_ALL_OTHERS = 29,
	DOTA_RECENT_EVENT = 30,
	DOTA_KEYBIND_CHAT_TEAM = 31,
	DOTA_KEYBIND_CHAT_GLOBAL = 32,
	DOTA_KEYBIND_CHAT_TEAM2 = 33,
	DOTA_KEYBIND_CHAT_GLOBAL2 = 34,
	DOTA_KEYBIND_CHAT_VOICE_PARTY = 35,
	DOTA_KEYBIND_CHAT_VOICE_TEAM = 36,
	DOTA_KEYBIND_CHAT_WHEEL = 37,
	DOTA_KEYBIND_CHAT_WHEEL2 = 38,
	DOTA_KEYBIND_CHAT_WHEEL_CARE = 39,
	DOTA_KEYBIND_CHAT_WHEEL_BACK = 40,
	DOTA_KEYBIND_CHAT_WHEEL_NEED_WARDS = 41,
	DOTA_KEYBIND_CHAT_WHEEL_STUN = 42,
	DOTA_KEYBIND_CHAT_WHEEL_HELP = 43,
	DOTA_KEYBIND_CHAT_WHEEL_GET_PUSH = 44,
	DOTA_KEYBIND_CHAT_WHEEL_GOOD_JOB = 45,
	DOTA_KEYBIND_CHAT_WHEEL_MISSING = 46,
	DOTA_KEYBIND_CHAT_WHEEL_MISSING_TOP = 47,
	DOTA_KEYBIND_CHAT_WHEEL_MISSING_MIDDLE = 48,
	DOTA_KEYBIND_CHAT_WHEEL_MISSING_BOTTOM = 49,
	DOTA_KEYBIND_HERO_CHAT_WHEEL = 50,
	DOTA_KEYBIND_SPRAY_WHEEL = 51,
	DOTA_KEYBIND_ABILITY_PRIMARY1 = 52,
	DOTA_KEYBIND_ABILITY_PRIMARY2 = 53,
	DOTA_KEYBIND_ABILITY_PRIMARY3 = 54,
	DOTA_KEYBIND_ABILITY_SECONDARY1 = 55,
	DOTA_KEYBIND_ABILITY_SECONDARY2 = 56,
	DOTA_KEYBIND_ABILITY_ULTIMATE = 57,
	DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST = 58,
	DOTA_KEYBIND_ABILITY_PRIMARY2_QUICKCAST = 59,
	DOTA_KEYBIND_ABILITY_PRIMARY3_QUICKCAST = 60,
	DOTA_KEYBIND_ABILITY_SECONDARY1_QUICKCAST = 61,
	DOTA_KEYBIND_ABILITY_SECONDARY2_QUICKCAST = 62,
	DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST = 63,
	DOTA_KEYBIND_ABILITY_PRIMARY1_EXPLICIT_AUTOCAST = 64,
	DOTA_KEYBIND_ABILITY_PRIMARY2_EXPLICIT_AUTOCAST = 65,
	DOTA_KEYBIND_ABILITY_PRIMARY3_EXPLICIT_AUTOCAST = 66,
	DOTA_KEYBIND_ABILITY_SECONDARY1_EXPLICIT_AUTOCAST = 67,
	DOTA_KEYBIND_ABILITY_SECONDARY2_EXPLICIT_AUTOCAST = 68,
	DOTA_KEYBIND_ABILITY_ULTIMATE_EXPLICIT_AUTOCAST = 69,
	DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST_AUTOCAST = 70,
	DOTA_KEYBIND_ABILITY_PRIMARY2_QUICKCAST_AUTOCAST = 71,
	DOTA_KEYBIND_ABILITY_PRIMARY3_QUICKCAST_AUTOCAST = 72,
	DOTA_KEYBIND_ABILITY_SECONDARY1_QUICKCAST_AUTOCAST = 73,
	DOTA_KEYBIND_ABILITY_SECONDARY2_QUICKCAST_AUTOCAST = 74,
	DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST_AUTOCAST = 75,
	DOTA_KEYBIND_ABILITY_PRIMARY1_AUTOMATIC_AUTOCAST = 76,
	DOTA_KEYBIND_ABILITY_PRIMARY2_AUTOMATIC_AUTOCAST = 77,
	DOTA_KEYBIND_ABILITY_PRIMARY3_AUTOMATIC_AUTOCAST = 78,
	DOTA_KEYBIND_ABILITY_SECONDARY1_AUTOMATIC_AUTOCAST = 79,
	DOTA_KEYBIND_ABILITY_SECONDARY2_AUTOMATIC_AUTOCAST = 80,
	DOTA_KEYBIND_ABILITY_ULTIMATE_AUTOMATIC_AUTOCAST = 81,
	DOTA_KEYBIND_INVENTORY1 = 82,
	DOTA_KEYBIND_INVENTORY2 = 83,
	DOTA_KEYBIND_INVENTORY3 = 84,
	DOTA_KEYBIND_INVENTORY4 = 85,
	DOTA_KEYBIND_INVENTORY5 = 86,
	DOTA_KEYBIND_INVENTORY6 = 87,
	DOTA_KEYBIND_INVENTORY1_QUICKCAST = 88,
	DOTA_KEYBIND_INVENTORY2_QUICKCAST = 89,
	DOTA_KEYBIND_INVENTORY3_QUICKCAST = 90,
	DOTA_KEYBIND_INVENTORY4_QUICKCAST = 91,
	DOTA_KEYBIND_INVENTORY5_QUICKCAST = 92,
	DOTA_KEYBIND_INVENTORY6_QUICKCAST = 93,
	DOTA_KEYBIND_INVENTORY1_AUTOCAST = 94,
	DOTA_KEYBIND_INVENTORY2_AUTOCAST = 95,
	DOTA_KEYBIND_INVENTORY3_AUTOCAST = 96,
	DOTA_KEYBIND_INVENTORY4_AUTOCAST = 97,
	DOTA_KEYBIND_INVENTORY5_AUTOCAST = 98,
	DOTA_KEYBIND_INVENTORY6_AUTOCAST = 99,
	DOTA_KEYBIND_INVENTORY1_QUICKAUTOCAST = 100,
	DOTA_KEYBIND_INVENTORY2_QUICKAUTOCAST = 101,
	DOTA_KEYBIND_INVENTORY3_QUICKAUTOCAST = 102,
	DOTA_KEYBIND_INVENTORY4_QUICKAUTOCAST = 103,
	DOTA_KEYBIND_INVENTORY5_QUICKAUTOCAST = 104,
	DOTA_KEYBIND_INVENTORY6_QUICKAUTOCAST = 105,
	DOTA_KEYBIND_CONTROL_GROUP1 = 106,
	DOTA_KEYBIND_CONTROL_GROUP2 = 107,
	DOTA_KEYBIND_CONTROL_GROUP3 = 108,
	DOTA_KEYBIND_CONTROL_GROUP4 = 109,
	DOTA_KEYBIND_CONTROL_GROUP5 = 110,
	DOTA_KEYBIND_CONTROL_GROUP6 = 111,
	DOTA_KEYBIND_CONTROL_GROUP7 = 112,
	DOTA_KEYBIND_CONTROL_GROUP8 = 113,
	DOTA_KEYBIND_CONTROL_GROUP9 = 114,
	DOTA_KEYBIND_CONTROL_GROUP10 = 115,
	DOTA_KEYBIND_CONTROL_GROUPCYCLE = 116,
	DOTA_KEYBIND_SHOP_TOGGLE = 117,
	DOTA_KEYBIND_SCOREBOARD_TOGGLE = 118,
	DOTA_KEYBIND_SCREENSHOT = 119,
	DOTA_KEYBIND_ESCAPE = 120,
	DOTA_KEYBIND_CONSOLE = 121,
	DOTA_KEYBIND_DEATH_SUMMARY = 122,
	DOTA_KEYBIND_LEARN_ABILITIES = 123,
	DOTA_KEYBIND_LEARN_STATS = 124,
	DOTA_KEYBIND_ACTIVATE_GLYPH = 125,
	DOTA_KEYBIND_ACTIVATE_RADAR = 126,
	DOTA_KEYBIND_PURCHASE_QUICKBUY = 127,
	DOTA_KEYBIND_PURCHASE_STICKY = 128,
	DOTA_KEYBIND_GRAB_STASH_ITEMS = 129,
	DOTA_KEYBIND_TOGGLE_AUTOATTACK = 130,
	DOTA_KEYBIND_USE_ACTION_ITEM = 131,
	DOTA_KEYBIND_TAUNT = 132,
	DOTA_KEYBIND_SHOP_CONSUMABLES = 133,
	DOTA_KEYBIND_SHOP_ATTRIBUTES = 134,
	DOTA_KEYBIND_SHOP_ARMAMENTS = 135,
	DOTA_KEYBIND_SHOP_ARCANE = 136,
	DOTA_KEYBIND_SHOP_BASICS = 137,
	DOTA_KEYBIND_SHOP_SUPPORT = 138,
	DOTA_KEYBIND_SHOP_CASTER = 139,
	DOTA_KEYBIND_SHOP_WEAPONS = 140,
	DOTA_KEYBIND_SHOP_ARMOR = 141,
	DOTA_KEYBIND_SHOP_ARTIFACTS = 142,
	DOTA_KEYBIND_SHOP_SIDE_PAGE_1 = 143,
	DOTA_KEYBIND_SHOP_SIDE_PAGE_2 = 144,
	DOTA_KEYBIND_SHOP_SECRET = 145,
	DOTA_KEYBIND_SHOP_SEARCHBOX = 146,
	DOTA_KEYBIND_SHOP_SLOT_1 = 147,
	DOTA_KEYBIND_SHOP_SLOT_2 = 148,
	DOTA_KEYBIND_SHOP_SLOT_3 = 149,
	DOTA_KEYBIND_SHOP_SLOT_4 = 150,
	DOTA_KEYBIND_SHOP_SLOT_5 = 151,
	DOTA_KEYBIND_SHOP_SLOT_6 = 152,
	DOTA_KEYBIND_SHOP_SLOT_7 = 153,
	DOTA_KEYBIND_SHOP_SLOT_8 = 154,
	DOTA_KEYBIND_SHOP_SLOT_9 = 155,
	DOTA_KEYBIND_SHOP_SLOT_10 = 156,
	DOTA_KEYBIND_SHOP_SLOT_11 = 157,
	DOTA_KEYBIND_SHOP_SLOT_12 = 158,
	DOTA_KEYBIND_SHOP_SLOT_13 = 159,
	DOTA_KEYBIND_SHOP_SLOT_14 = 160,
	DOTA_KEYBIND_SPEC_CAMERA_UP = 161,
	DOTA_KEYBIND_SPEC_CAMERA_DOWN = 162,
	DOTA_KEYBIND_SPEC_CAMERA_LEFT = 163,
	DOTA_KEYBIND_SPEC_CAMERA_RIGHT = 164,
	DOTA_KEYBIND_SPEC_CAMERA_GRIP = 165,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_1 = 166,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_2 = 167,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_3 = 168,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_4 = 169,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_5 = 170,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_6 = 171,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_7 = 172,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_8 = 173,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_9 = 174,
	DOTA_KEYBIND_SPEC_CAMERA_SAVED_POSITION_10 = 175,
	DOTA_KEYBIND_SPEC_UNIT_SELECT = 176,
	DOTA_KEYBIND_SPEC_HERO_SELECT = 177,
	DOTA_KEYBIND_SPEC_PAUSE = 178,
	DOTA_KEYBIND_SPEC_CHAT = 179,
	DOTA_KEYBIND_SPEC_SCOREBOARD = 180,
	DOTA_KEYBIND_SPEC_INCREASE_REPLAY_SPEED = 181,
	DOTA_KEYBIND_SPEC_DECREASE_REPLAY_SPEED = 182,
	DOTA_KEYBIND_SPEC_STATS_HARVEST = 183,
	DOTA_KEYBIND_SPEC_STATS_ITEM = 184,
	DOTA_KEYBIND_SPEC_STATS_GOLD = 185,
	DOTA_KEYBIND_SPEC_STATS_XP = 186,
	DOTA_KEYBIND_SPEC_STATS_FANTASY = 187,
	DOTA_KEYBIND_SPEC_STATS_WINCHANCE = 188,
	DOTA_KEYBIND_SPEC_FOW_TOGGLEBOTH = 189,
	DOTA_KEYBIND_SPEC_FOW_TOGGLERADIENT = 190,
	DOTA_KEYBIND_SPEC_FOW_TOGGLEDIRE = 191,
	DOTA_KEYBIND_SPEC_OPEN_BROADCASTER_MENU = 192,
	DOTA_KEYBIND_SPEC_DROPDOWN_KDA = 193,
	DOTA_KEYBIND_SPEC_DROPDOWN_LASTHITS_DENIES = 194,
	DOTA_KEYBIND_SPEC_DROPDOWN_LEVEL = 195,
	DOTA_KEYBIND_SPEC_DROPDOWN_XP_PER_MIN = 196,
	DOTA_KEYBIND_SPEC_DROPDOWN_GOLD = 197,
	DOTA_KEYBIND_SPEC_DROPDOWN_TOTALGOLD = 198,
	DOTA_KEYBIND_SPEC_DROPDOWN_GOLD_PER_MIN = 199,
	DOTA_KEYBIND_SPEC_DROPDOWN_BUYBACK = 200,
	DOTA_KEYBIND_SPEC_DROPDOWN_NETWORTH = 201,
	DOTA_KEYBIND_SPEC_DROPDOWN_FANTASY = 202,
	DOTA_KEYBIND_SPEC_DROPDOWN_SORT = 203,
	DOTA_KEYBIND_SPEC_DROPDOWN_CLOSE = 204,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_1 = 205,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_2 = 206,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_3 = 207,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_4 = 208,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_5 = 209,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_6 = 210,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_7 = 211,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_8 = 212,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_9 = 213,
	DOTA_KEYBIND_SPEC_FOCUS_PLAYER_10 = 214,
	DOTA_KEYBIND_SPEC_COACH_VIEWTOGGLE = 215,
	DOTA_KEYBIND_INSPECTHEROINWORLD = 216,
	DOTA_KEYBIND_CAMERA_ZOOM_IN = 217,
	DOTA_KEYBIND_CAMERA_ZOOM_OUT = 218,
	DOTA_KEYBIND_CONTROL_GROUPCYCLEPREV = 219,
	DOTA_KEYBIND_DOTA_ALT = 220,
	DOTA_KEYBIND_COUNT = 221
}
declare const enum modifierpriority {
	MODIFIER_PRIORITY_LOW = 0,
	MODIFIER_PRIORITY_NORMAL = 1,
	MODIFIER_PRIORITY_HIGH = 2,
	MODIFIER_PRIORITY_ULTRA = 3,
	MODIFIER_PRIORITY_SUPER_ULTRA = 4
}
declare const enum ParticleOrientationChoiceList_t {
	PARTICLE_ORIENTATION_SCREEN_ALIGNED = 0,
	PARTICLE_ORIENTATION_SCREEN_Z_ALIGNED = 1,
	PARTICLE_ORIENTATION_WORLD_Z_ALIGNED = 2,
	PARTICLE_ORIENTATION_ALIGN_TO_PARTICLE_NORMAL = 3,
	PARTICLE_ORIENTATION_SCREENALIGN_TO_PARTICLE_NORMAL = 4,
	PARTICLE_ORIENTATION_FULL_3AXIS_ROTATION = 5
}
declare const enum DOTA_SHOP_TYPE {
	DOTA_SHOP_HOME = 0,
	DOTA_SHOP_SIDE = 1,
	DOTA_SHOP_SECRET = 2,
	DOTA_SHOP_GROUND = 3,
	DOTA_SHOP_SIDE2 = 4,
	DOTA_SHOP_SECRET2 = 5,
	DOTA_SHOP_CUSTOM = 6,
	DOTA_SHOP_NONE = 7
}
declare const enum EntityDisolveType_t {
	ENTITY_DISSOLVE_NORMAL = 0,
	ENTITY_DISSOLVE_ELECTRICAL = 1,
	ENTITY_DISSOLVE_ELECTRICAL_LIGHT = 2,
	ENTITY_DISSOLVE_CORE = 3
}
declare const enum LightSourceShape_t {
	LIGHT_SOURCE_SHAPE_SPHERE = 0
}
declare const enum ShadowType_t {
	SHADOWS_NONE = 0,
	SHADOWS_SIMPLE = 1
}
declare const enum DOTASpeechType_t {
	DOTA_SPEECH_USER_INVALID = 0,
	DOTA_SPEECH_USER_SINGLE = 1,
	DOTA_SPEECH_USER_TEAM = 2,
	DOTA_SPEECH_USER_TEAM_NEARBY = 3,
	DOTA_SPEECH_USER_NEARBY = 4,
	DOTA_SPEECH_USER_ALL = 5,
	DOTA_SPEECH_GOOD_TEAM = 6,
	DOTA_SPEECH_BAD_TEAM = 7,
	DOTA_SPEECH_SPECTATOR = 8,
	DOTA_SPEECH_RECIPIENT_TYPE_MAX = 9
}
declare const enum Class_T {
	CLASS_NONE = 0,
	CLASS_PLAYER = 1,
	CLASS_PLAYER_ALLY = 2,
	CLASS_BULLSEYE = 3,
	LAST_SHARED_ENTITY_CLASS = 4
}
declare const enum TrainVelocityType_t {
	TrainVelocity_Instantaneous = 0,
	TrainVelocity_LinearBlend = 1,
	TrainVelocity_EaseInEaseOut = 2
}
declare const enum Disposition_t {
	D_ER = 0,
	D_HT = 1,
	D_FR = 2,
	D_LI = 3,
	D_NU = 4,
	D_ERROR = 0,
	D_HATE = 1,
	D_FEAR = 2,
	D_LIKE = 3,
	D_NEUTRAL = 4
}
declare const enum TrackOrientationType_t {
	TrackOrientation_Fixed = 0,
	TrackOrientation_FacePath = 1,
	TrackOrientation_FacePathAngles = 2
}
declare const enum ParticleTopology_t {
	PARTICLE_TOPOLOGY_POINTS = 0,
	PARTICLE_TOPOLOGY_LINES = 1,
	PARTICLE_TOPOLOGY_TRIS = 2,
	PARTICLE_TOPOLOGY_QUADS = 3,
	PARTICLE_TOPOLOGY_CUBES = 4
}
declare const enum DOTA_HeroPickState {
	DOTA_HEROPICK_STATE_NONE = 0,
	DOTA_HEROPICK_STATE_AP_SELECT = 1,
	DOTA_HEROPICK_STATE_SD_SELECT = 2,
	DOTA_HEROPICK_STATE_INTRO_SELECT_UNUSED = 3,
	DOTA_HEROPICK_STATE_RD_SELECT_UNUSED = 4,
	DOTA_HEROPICK_STATE_CM_INTRO = 5,
	DOTA_HEROPICK_STATE_CM_CAPTAINPICK = 6,
	DOTA_HEROPICK_STATE_CM_BAN1 = 7,
	DOTA_HEROPICK_STATE_CM_BAN2 = 8,
	DOTA_HEROPICK_STATE_CM_BAN3 = 9,
	DOTA_HEROPICK_STATE_CM_BAN4 = 10,
	DOTA_HEROPICK_STATE_CM_BAN5 = 11,
	DOTA_HEROPICK_STATE_CM_BAN6 = 12,
	DOTA_HEROPICK_STATE_CM_BAN7 = 13,
	DOTA_HEROPICK_STATE_CM_BAN8 = 14,
	DOTA_HEROPICK_STATE_CM_BAN9 = 15,
	DOTA_HEROPICK_STATE_CM_BAN10 = 16,
	DOTA_HEROPICK_STATE_CM_BAN11 = 17,
	DOTA_HEROPICK_STATE_CM_BAN12 = 18,
	DOTA_HEROPICK_STATE_CM_SELECT1 = 19,
	DOTA_HEROPICK_STATE_CM_SELECT2 = 20,
	DOTA_HEROPICK_STATE_CM_SELECT3 = 21,
	DOTA_HEROPICK_STATE_CM_SELECT4 = 22,
	DOTA_HEROPICK_STATE_CM_SELECT5 = 23,
	DOTA_HEROPICK_STATE_CM_SELECT6 = 24,
	DOTA_HEROPICK_STATE_CM_SELECT7 = 25,
	DOTA_HEROPICK_STATE_CM_SELECT8 = 26,
	DOTA_HEROPICK_STATE_CM_SELECT9 = 27,
	DOTA_HEROPICK_STATE_CM_SELECT10 = 28,
	DOTA_HEROPICK_STATE_CM_PICK = 29,
	DOTA_HEROPICK_STATE_AR_SELECT = 30,
	DOTA_HEROPICK_STATE_MO_SELECT = 31,
	DOTA_HEROPICK_STATE_FH_SELECT = 32,
	DOTA_HEROPICK_STATE_CD_INTRO = 33,
	DOTA_HEROPICK_STATE_CD_CAPTAINPICK = 34,
	DOTA_HEROPICK_STATE_CD_BAN1 = 35,
	DOTA_HEROPICK_STATE_CD_BAN2 = 36,
	DOTA_HEROPICK_STATE_CD_BAN3 = 37,
	DOTA_HEROPICK_STATE_CD_BAN4 = 38,
	DOTA_HEROPICK_STATE_CD_BAN5 = 39,
	DOTA_HEROPICK_STATE_CD_BAN6 = 40,
	DOTA_HEROPICK_STATE_CD_SELECT1 = 41,
	DOTA_HEROPICK_STATE_CD_SELECT2 = 42,
	DOTA_HEROPICK_STATE_CD_SELECT3 = 43,
	DOTA_HEROPICK_STATE_CD_SELECT4 = 44,
	DOTA_HEROPICK_STATE_CD_SELECT5 = 45,
	DOTA_HEROPICK_STATE_CD_SELECT6 = 46,
	DOTA_HEROPICK_STATE_CD_SELECT7 = 47,
	DOTA_HEROPICK_STATE_CD_SELECT8 = 48,
	DOTA_HEROPICK_STATE_CD_SELECT9 = 49,
	DOTA_HEROPICK_STATE_CD_SELECT10 = 50,
	DOTA_HEROPICK_STATE_CD_PICK = 51,
	DOTA_HEROPICK_STATE_BD_SELECT = 52,
	DOTA_HERO_PICK_STATE_ABILITY_DRAFT_SELECT = 53,
	DOTA_HERO_PICK_STATE_ARDM_SELECT = 54,
	DOTA_HEROPICK_STATE_ALL_DRAFT_SELECT = 55,
	DOTA_HERO_PICK_STATE_CUSTOMGAME_SELECT = 56,
	DOTA_HEROPICK_STATE_SELECT_PENALTY = 57,
	DOTA_HEROPICK_STATE_CUSTOM_PICK_RULES = 58,
	DOTA_HEROPICK_STATE_COUNT = 59
}
declare const enum AttributeDerivedStats {
	DOTA_ATTRIBUTE_STRENGTH_DAMAGE = 0,
	DOTA_ATTRIBUTE_STRENGTH_HP = 1,
	DOTA_ATTRIBUTE_STRENGTH_HP_REGEN_PERCENT = 2,
	DOTA_ATTRIBUTE_STRENGTH_STATUS_RESISTANCE_PERCENT = 3,
	DOTA_ATTRIBUTE_STRENGTH_MAGIC_RESISTANCE_PERCENT = 4,
	DOTA_ATTRIBUTE_AGILITY_DAMAGE = 5,
	DOTA_ATTRIBUTE_AGILITY_ARMOR = 6,
	DOTA_ATTRIBUTE_AGILITY_ATTACK_SPEED = 7,
	DOTA_ATTRIBUTE_AGILITY_MOVE_SPEED_PERCENT = 8,
	DOTA_ATTRIBUTE_INTELLIGENCE_DAMAGE = 9,
	DOTA_ATTRIBUTE_INTELLIGENCE_MANA = 10,
	DOTA_ATTRIBUTE_INTELLIGENCE_MANA_REGEN_PERCENT = 11,
	DOTA_ATTRIBUTE_INTELLIGENCE_SPELL_AMP_PERCENT = 12,
	DOTA_ATTRIBUTE_INTELLIGENCE_MAGIC_RESISTANCE_PERCENT = 13
}
declare const enum DampingSpeedFunction {
	NoDamping = 0,
	Constant = 1,
	Spring = 2
}
declare const enum EDOTA_ModifyXP_Reason {
	DOTA_ModifyXP_Unspecified = 0,
	DOTA_ModifyXP_HeroKill = 1,
	DOTA_ModifyXP_CreepKill = 2,
	DOTA_ModifyXP_RoshanKill = 3
}
declare const enum RenderMode_t {
	kRenderNormal = 0,
	kRenderTransColor = 1,
	kRenderTransTexture = 2,
	kRenderGlow = 3,
	kRenderTransAlpha = 4,
	kRenderTransAdd = 5,
	kRenderEnvironmental = 6,
	kRenderTransAddFrameBlend = 7,
	kRenderTransAlphaAdd = 8,
	kRenderWorldGlow = 9,
	kRenderNone = 10,
	kRenderDevVisualizer = 11,
	kRenderModeCount = 12
}
declare const enum BeamClipStyle_t {
	kNOCLIP = 0,
	kGEOCLIP = 1,
	kMODELCLIP = 2,
	kBEAMCLIPSTYLE_NUMBITS = 2
}
declare const enum MaterialModifyMode_t {
	MATERIAL_MODIFY_MODE_NONE = 0,
	MATERIAL_MODIFY_MODE_SETVAR = 1,
	MATERIAL_MODIFY_MODE_ANIM_SEQUENCE = 2,
	MATERIAL_MODIFY_MODE_FLOAT_LERP = 3
}
declare const enum soundlevel_t {
	SNDLVL_NONE = 0,
	SNDLVL_20dB = 20,
	SNDLVL_25dB = 25,
	SNDLVL_30dB = 30,
	SNDLVL_35dB = 35,
	SNDLVL_40dB = 40,
	SNDLVL_45dB = 45,
	SNDLVL_50dB = 50,
	SNDLVL_55dB = 55,
	SNDLVL_IDLE = 60,
	SNDLVL_60dB = 60,
	SNDLVL_65dB = 65,
	SNDLVL_STATIC = 66,
	SNDLVL_70dB = 70,
	SNDLVL_NORM = 75,
	SNDLVL_75dB = 75,
	SNDLVL_80dB = 80,
	SNDLVL_TALKING = 80,
	SNDLVL_85dB = 85,
	SNDLVL_90dB = 90,
	SNDLVL_95dB = 95,
	SNDLVL_100dB = 100,
	SNDLVL_105dB = 105,
	SNDLVL_110dB = 110,
	SNDLVL_120dB = 120,
	SNDLVL_130dB = 130,
	SNDLVL_GUNFIRE = 140,
	SNDLVL_140dB = 140,
	SNDLVL_150dB = 150,
	SNDLVL_180dB = 180
}
declare const enum AnimationSnapshotType_t {
	ANIMATION_SNAPSHOT_SERVER_SIMULATION = 0,
	ANIMATION_SNAPSHOT_CLIENT_SIMULATION = 1,
	ANIMATION_SNAPSHOT_CLIENT_PREDICTION = 2,
	ANIMATION_SNAPSHOT_CLIENT_INTERPOLATION = 3,
	ANIMATION_SNAPSHOT_CLIENT_RENDER = 4,
	ANIMATION_SNAPSHOT_FINAL_COMPOSITE = 5,
	ANIMATION_SNAPSHOT_MAX = 6
}
declare const enum ValueRemapperRatchetType_t {
	RatchetType_Absolute = 0,
	RatchetType_EachEngage = 1
}
declare const enum gamerules_roundstate_t {
	GR_STATE_INIT = 0,
	GR_STATE_PREGAME = 1,
	GR_STATE_STARTGAME = 2,
	GR_STATE_PREROUND = 3,
	GR_STATE_RND_RUNNING = 4,
	GR_STATE_TEAM_WIN = 5,
	GR_STATE_RESTART = 6,
	GR_STATE_STALEMATE = 7,
	GR_STATE_GAME_OVER = 8,
	GR_NUM_ROUND_STATES = 9
}
declare const enum SchemaClassFlags_t {
	SCHEMA_CLASS_HAS_VIRTUAL_MEMBERS = 1,
	SCHEMA_CLASS_IS_ABSTRACT = 2,
	SCHEMA_CLASS_HAS_TRIVIAL_CONSTRUCTOR = 4,
	SCHEMA_CLASS_HAS_TRIVIAL_DESTRUCTOR = 8,
	SCHEMA_CLASS_TEMP_HACK_HAS_NOSCHEMA_MEMBERS = 16,
	SCHEMA_CLASS_TEMP_HACK_HAS_CONSTRUCTOR_LIKE_METHODS = 32,
	SCHEMA_CLASS_TEMP_HACK_HAS_DESTRUCTOR_LIKE_METHODS = 64,
	SCHEMA_CLASS_IS_NOSCHEMA_CLASS = 128
}
declare const enum ParticleColorBlendMode_t {
	PARTICLEBLEND_DEFAULT = 0,
	PARTICLEBLEND_OVERLAY = 1,
	PARTICLEBLEND_DARKEN = 2,
	PARTICLEBLEND_LIGHTEN = 3,
	PARTICLEBLEND_MULTIPLY = 4
}
declare const enum PropDoorRotatingOpenDirection_e {
	DOOR_ROTATING_OPEN_BOTH_WAYS = 0,
	DOOR_ROTATING_OPEN_FORWARD = 1,
	DOOR_ROTATING_OPEN_BACKWARD = 2
}
declare const enum eEconItemOrigin {
	kEconItemOrigin_Invalid = -1,
	kEconItemOrigin_Drop = 0,
	kEconItemOrigin_Achievement = 1,
	kEconItemOrigin_Purchased = 2,
	kEconItemOrigin_Traded = 3,
	kEconItemOrigin_Crafted = 4,
	kEconItemOrigin_StorePromotion = 5,
	kEconItemOrigin_Gifted = 6,
	kEconItemOrigin_SupportGranted = 7,
	kEconItemOrigin_FoundInCrate = 8,
	kEconItemOrigin_Earned = 9,
	kEconItemOrigin_ThirdPartyPromotion = 10,
	kEconItemOrigin_GiftWrapped = 11,
	kEconItemOrigin_HalloweenDrop = 12,
	kEconItemOrigin_PackageItem = 13,
	kEconItemOrigin_Foreign = 14,
	kEconItemOrigin_CDKey = 15,
	kEconItemOrigin_CollectionReward = 16,
	kEconItemOrigin_PreviewItem = 17,
	kEconItemOrigin_SteamWorkshopContribution = 18,
	kEconItemOrigin_PeriodicScoreReward = 19,
	kEconItemOrigin_Recycling = 20,
	kEconItemOrigin_TournamentDrop = 21,
	kEconItemOrigin_PassportReward = 22,
	kEconItemOrigin_TutorialDrop = 23,
	kEconItemOrigin_RecipeOutput = 24,
	kEconItemOrigin_GemExtract = 25,
	kEconItemOrigin_EventPointReward = 26,
	kEconItemOrigin_ItemRedemption = 27,
	kEconItemOrigin_FantasyTicketRefund = 28,
	kEconItemOrigin_VictoryPredictionReward = 29,
	kEconItemOrigin_AssassinEventReward = 30,
	kEconItemOrigin_CompendiumReward = 31,
	kEconItemOrigin_CompendiumDrop = 32,
	kEconItemOrigin_MysteryItem = 33,
	kEconItemOrigin_UnpackedFromBundle = 34,
	kEconItemOrigin_WonFromWeeklyGame = 35,
	kEconItemOrigin_SeasonalItemGrant = 36,
	kEconItemOrigin_Max = 37
}
declare const enum DOTALimits_t {
	DOTA_MAX_PLAYERS = 64,
	DOTA_MAX_TEAM = 24,
	DOTA_MAX_PLAYER_TEAMS = 10,
	DOTA_MAX_TEAM_PLAYERS = 24,
	DOTA_MAX_SPECTATOR_TEAM_SIZE = 40,
	DOTA_MAX_SPECTATOR_LOBBY_SIZE = 15,
	DOTA_DEFAULT_MAX_TEAM = 5,
	DOTA_DEFAULT_MAX_TEAM_PLAYERS = 10
}
declare const enum interactions_t {
	INTERACTION_NONE = -1,
	INTERACTION_CLIP_TO_ENERGYGUN = 0,
	INTERACTION_LARGE_CLIP_TO_ENERGYGUN = 1,
	INTERACTION_CLIP_TO_SHOTGUN = 2,
	INTERACTION_MULTICLIP_TO_SHOTGUN = 3,
	INTERACTION_SPEEDLOADER_TO_SHOTGUN = 4,
	INTERACTION_GRENADE_TO_SHOTGUN = 5,
	INTERACTION_CLIP_TO_RAPIDFIRE = 6,
	NUM_HAND_INTERACTIONS = 7
}
declare const enum SeqResourceCmdEnum {
	SEQ_CMD_Nop = 0,
	SEQ_CMD_LinearDelta = 1,
	SEQ_CMD_FetchFrameRange = 2,
	SEQ_CMD_Slerp = 3,
	SEQ_CMD_Add = 4,
	SEQ_CMD_Subtract = 5,
	SEQ_CMD_Scale = 6,
	SEQ_CMD_Copy = 7,
	SEQ_CMD_Blend = 8,
	SEQ_CMD_Worldspace = 9,
	SEQ_CMD_Sequence = 10,
	SEQ_CMD_FetchCycle = 11,
	SEQ_CMD_FetchFrame = 12,
	SEQ_CMD_IKLockInPlace = 13,
	SEQ_CMD_IKRestoreAll = 14,
	SEQ_CMD_ReverseSequence = 15,
	SEQ_CMD_Transform = 16
}
declare const enum LifeState_t {
	LIFE_ALIVE = 0,
	LIFE_DYING = 1,
	LIFE_DEAD = 2,
	LIFE_RESPAWNABLE = 3,
	LIFE_RESPAWNING = 4
}
declare const enum voxel_vis_compression_t {
	VOXVIS_COMPRESS_RAW = 0,
	VOXVIS_COMPRESS_RLE = 1
}
declare const enum DamageOptions_t {
	DAMAGE_NO = 0,
	DAMAGE_EVENTS_ONLY = 1,
	DAMAGE_YES = 2
}
declare const enum PortraitSoundMode_t {
	PORTRAIT_SOUND_MODE_INVALID = -1,
	PORTRAIT_SOUND_MODE_NO_SOUNDS = 0,
	PORTRAIT_SOUND_MODE_ONLY_TAUNT_SOUNDS = 1,
	PORTRAIT_SOUND_MODE_ALL_SOUNDS = 2
}
declare const enum EntityLumpFlags_t {
	ENTITY_LUMP_NONE = 0
}
declare const enum EntFinderMethod_t {
	ENT_FIND_METHOD_NEAREST = 0,
	ENT_FIND_METHOD_FARTHEST = 1,
	ENT_FIND_METHOD_RANDOM = 2
}
declare const enum DOTA_SHOP_CATEGORY {
	DOTA_SHOP_CATEGORY_NONE = -1,
	DOTA_SHOP_CATEGORY_CONSUMABLES = 0,
	DOTA_SHOP_CATEGORY_ATTRIBUTES = 1,
	DOTA_SHOP_CATEGORY_WEAPONS_ARMOR = 2,
	DOTA_SHOP_CATEGORY_MISC = 3,
	DOTA_SHOP_CATEGORY_BASICS = 4,
	DOTA_SHOP_CATEGORY_SUPPORT = 5,
	DOTA_SHOP_CATEGORY_MAGICS = 6,
	DOTA_SHOP_CATEGORY_WEAPONS = 7,
	DOTA_SHOP_CATEGORY_DEFENSE = 8,
	DOTA_SHOP_CATEGORY_ARTIFACTS = 9,
	DOTA_SHOP_CATEGORY_SIDE_SHOP_PAGE_1 = 10,
	DOTA_SHOP_CATEGORY_SIDE_SHOP_PAGE_2 = 11,
	DOTA_SHOP_CATEGORY_SECRET_SHOP = 12,
	DOTA_SHOP_CATEGORY_RECOMMENDED_ITEMS = 13,
	DOTA_SHOP_CATEGORY_SEARCH_RESULTS = 14,
	NUM_SHOP_CATEGORIES = 15
}
declare const enum eLiteralHandType {
	LITERAL_HAND_TYPE_UNKNOWN = -1,
	LITERAL_HAND_TYPE_RIGHT = 0,
	LITERAL_HAND_TYPE_LEFT = 1,
	LITERAL_HAND_TYPE_COUNT = 2
}
declare const enum WeaponSound_t {
	WEAPON_SOUND_EMPTY = 0,
	WEAPON_SOUND_SINGLE = 1,
	WEAPON_SOUND_SINGLE_NPC = 2,
	WEAPON_SOUND_DOUBLE = 3,
	WEAPON_SOUND_DOUBLE_NPC = 4,
	WEAPON_SOUND_BURST = 5,
	WEAPON_SOUND_RELOAD = 6,
	WEAPON_SOUND_RELOAD_NPC = 7,
	WEAPON_SOUND_MELEE_MISS = 8,
	WEAPON_SOUND_MELEE_HIT = 9,
	WEAPON_SOUND_MELEE_HIT_WORLD = 10,
	WEAPON_SOUND_SPECIAL1 = 11,
	WEAPON_SOUND_SPECIAL2 = 12,
	WEAPON_SOUND_SPECIAL3 = 13,
	WEAPON_SOUND_TAUNT = 14,
	WEAPON_SOUND_FAST_RELOAD = 15,
	WEAPON_SOUND_NUM_TYPES = 16
}
declare const enum WeaponState_t {
	WEAPON_NOT_CARRIED = 0,
	WEAPON_IS_CARRIED_BY_PLAYER = 1,
	WEAPON_IS_ACTIVE = 2
}
declare const enum UnitFilterResult {
	UF_SUCCESS = 0,
	UF_FAIL_FRIENDLY = 1,
	UF_FAIL_ENEMY = 2,
	UF_FAIL_HERO = 3,
	UF_FAIL_CONSIDERED_HERO = 4,
	UF_FAIL_CREEP = 5,
	UF_FAIL_BUILDING = 6,
	UF_FAIL_COURIER = 7,
	UF_FAIL_OTHER = 8,
	UF_FAIL_ANCIENT = 9,
	UF_FAIL_ILLUSION = 10,
	UF_FAIL_SUMMONED = 11,
	UF_FAIL_DOMINATED = 12,
	UF_FAIL_MELEE = 13,
	UF_FAIL_RANGED = 14,
	UF_FAIL_DEAD = 15,
	UF_FAIL_MAGIC_IMMUNE_ALLY = 16,
	UF_FAIL_MAGIC_IMMUNE_ENEMY = 17,
	UF_FAIL_INVULNERABLE = 18,
	UF_FAIL_IN_FOW = 19,
	UF_FAIL_INVISIBLE = 20,
	UF_FAIL_NOT_PLAYER_CONTROLLED = 21,
	UF_FAIL_ATTACK_IMMUNE = 22,
	UF_FAIL_CUSTOM = 23,
	UF_FAIL_INVALID_LOCATION = 24,
	UF_FAIL_DISABLE_HELP = 25,
	UF_FAIL_OUT_OF_WORLD = 26,
	UF_FAIL_NIGHTMARED = 27,
	UF_FAIL_OBSTRUCTED = 28
}
declare const enum doorCheck_e {
	DOOR_CHECK_FORWARD = 0,
	DOOR_CHECK_BACKWARD = 1,
	DOOR_CHECK_FULL = 2
}
declare const enum SPELL_IMMUNITY_TYPES {
	SPELL_IMMUNITY_NONE = 0,
	SPELL_IMMUNITY_ALLIES_YES = 1,
	SPELL_IMMUNITY_ALLIES_NO = 2,
	SPELL_IMMUNITY_ENEMIES_YES = 3,
	SPELL_IMMUNITY_ENEMIES_NO = 4
}
declare const enum RenderSlotType_t {
	RENDER_SLOT_INVALID = -1,
	RENDER_SLOT_PER_VERTEX = 0,
	RENDER_SLOT_PER_INSTANCE = 1
}
declare const enum AnimValueSource {
	MoveHeading = 0,
	MoveSpeed = 1,
	FacingHeading = 2,
	LookHeading = 3,
	LookPitch = 4,
	Parameter = 5,
	WayPointHeading = 6,
	WayPointFacing = 7,
	WayPointDistance = 8,
	TargetMoveHeading = 9,
	TargetMoveSpeed = 10,
	AccelerationHeading = 11,
	AccelerationSpeed = 12,
	SlopeHeading = 13,
	SlopeAngle = 14,
	GoalDistance = 15,
	AccelerationLeftRight = 16,
	AccelerationFrontBack = 17,
	RootMotionSpeed = 18,
	RootMotionTurnSpeed = 19,
	MoveHeadingRelativeToLookHeading = 20
}
declare const enum modifierfunction {
	MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,
	MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC = 1,
	MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 2,
	MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE = 3,
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL = 4,
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL = 5,
	MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE = 6,
	MODIFIER_PROPERTY_PROCATTACK_FEEDBACK = 7,
	MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE = 8,
	MODIFIER_PROPERTY_PRE_ATTACK = 9,
	MODIFIER_PROPERTY_INVISIBILITY_LEVEL = 10,
	MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY = 11,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT = 12,
	MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE = 13,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE = 14,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE = 15,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE_2 = 16,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE = 17,
	MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2 = 18,
	MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE = 19,
	MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN = 20,
	MODIFIER_PROPERTY_MOVESPEED_LIMIT = 21,
	MODIFIER_PROPERTY_MOVESPEED_MAX = 22,
	MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE = 23,
	MODIFIER_PROPERTY_FIXED_ATTACK_RATE = 24,
	MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT = 25,
	MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT = 26,
	MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT = 27,
	MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT = 28,
	MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE = 29,
	MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION = 30,
	MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE = 31,
	MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE = 32,
	MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE = 33,
	MODIFIER_PROPERTY_HP_REGEN_AMPLIFY_PERCENTAGE = 34,
	MODIFIER_PROPERTY_MP_REGEN_AMPLIFY_PERCENTAGE = 35,
	MODIFIER_PROPERTY_MAGICDAMAGEOUTGOING_PERCENTAGE = 36,
	MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE = 37,
	MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE = 38,
	MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE = 39,
	MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE = 40,
	MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_CONSTANT = 41,
	MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT = 42,
	MODIFIER_PROPERTY_EVASION_CONSTANT = 43,
	MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT = 44,
	MODIFIER_PROPERTY_STATUS_RESISTANCE = 45,
	MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING = 46,
	MODIFIER_PROPERTY_AVOID_DAMAGE = 47,
	MODIFIER_PROPERTY_AVOID_SPELL = 48,
	MODIFIER_PROPERTY_MISS_PERCENTAGE = 49,
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS = 50,
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE = 51,
	MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE = 52,
	MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR = 53,
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DIRECT_MODIFICATION = 54,
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS = 55,
	MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE = 56,
	MODIFIER_PROPERTY_BASE_MANA_REGEN = 57,
	MODIFIER_PROPERTY_MANA_REGEN_CONSTANT = 58,
	MODIFIER_PROPERTY_MANA_REGEN_CONSTANT_UNIQUE = 59,
	MODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE = 60,
	MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT = 61,
	MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE = 62,
	MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE_UNIQUE = 63,
	MODIFIER_PROPERTY_HEALTH_BONUS = 64,
	MODIFIER_PROPERTY_MANA_BONUS = 65,
	MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS = 66,
	MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS = 67,
	MODIFIER_PROPERTY_EXTRA_MANA_BONUS = 68,
	MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE = 69,
	MODIFIER_PROPERTY_STATS_STRENGTH_BONUS = 70,
	MODIFIER_PROPERTY_STATS_AGILITY_BONUS = 71,
	MODIFIER_PROPERTY_STATS_INTELLECT_BONUS = 72,
	MODIFIER_PROPERTY_CAST_RANGE_BONUS = 73,
	MODIFIER_PROPERTY_CAST_RANGE_BONUS_TARGET = 74,
	MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING = 75,
	MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE = 76,
	MODIFIER_PROPERTY_ATTACK_RANGE_BONUS = 77,
	MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE = 78,
	MODIFIER_PROPERTY_MAX_ATTACK_RANGE = 79,
	MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS = 80,
	MODIFIER_PROPERTY_PROJECTILE_NAME = 81,
	MODIFIER_PROPERTY_REINCARNATION = 82,
	MODIFIER_PROPERTY_RESPAWNTIME = 83,
	MODIFIER_PROPERTY_RESPAWNTIME_PERCENTAGE = 84,
	MODIFIER_PROPERTY_RESPAWNTIME_STACKING = 85,
	MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE = 86,
	MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_STACKING = 87,
	MODIFIER_PROPERTY_CASTTIME_PERCENTAGE = 88,
	MODIFIER_PROPERTY_MANACOST_PERCENTAGE = 89,
	MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING = 90,
	MODIFIER_PROPERTY_DEATHGOLDCOST = 91,
	MODIFIER_PROPERTY_EXP_RATE_BOOST = 92,
	MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE = 93,
	MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE = 94,
	MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK = 95,
	MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK = 96,
	MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL = 97,
	MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR = 98,
	MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK = 99,
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION = 100,
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT = 101,
	MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE = 102,
	MODIFIER_PROPERTY_ABSORB_SPELL = 103,
	MODIFIER_PROPERTY_REFLECT_SPELL = 104,
	MODIFIER_PROPERTY_DISABLE_AUTOATTACK = 105,
	MODIFIER_PROPERTY_BONUS_DAY_VISION = 106,
	MODIFIER_PROPERTY_BONUS_NIGHT_VISION = 107,
	MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE = 108,
	MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE = 109,
	MODIFIER_PROPERTY_FIXED_DAY_VISION = 110,
	MODIFIER_PROPERTY_FIXED_NIGHT_VISION = 111,
	MODIFIER_PROPERTY_MIN_HEALTH = 112,
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL = 113,
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL = 114,
	MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE = 115,
	MODIFIER_PROPERTY_IS_ILLUSION = 116,
	MODIFIER_PROPERTY_ILLUSION_LABEL = 117,
	MODIFIER_PROPERTY_SUPER_ILLUSION = 118,
	MODIFIER_PROPERTY_SUPER_ILLUSION_WITH_ULTIMATE = 119,
	MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE = 120,
	MODIFIER_PROPERTY_TURN_RATE_OVERRIDE = 121,
	MODIFIER_PROPERTY_DISABLE_HEALING = 122,
	MODIFIER_PROPERTY_ALWAYS_ALLOW_ATTACK = 123,
	MODIFIER_PROPERTY_OVERRIDE_ATTACK_MAGICAL = 124,
	MODIFIER_PROPERTY_UNIT_STATS_NEEDS_REFRESH = 125,
	MODIFIER_PROPERTY_BOUNTY_CREEP_MULTIPLIER = 126,
	MODIFIER_PROPERTY_BOUNTY_OTHER_MULTIPLIER = 127,
	MODIFIER_PROPERTY_UNIT_DISALLOW_UPGRADING = 128,
	MODIFIER_PROPERTY_DODGE_PROJECTILE = 129,
	MODIFIER_EVENT_ON_SPELL_TARGET_READY = 130,
	MODIFIER_EVENT_ON_ATTACK_RECORD = 131,
	MODIFIER_EVENT_ON_ATTACK_START = 132,
	MODIFIER_EVENT_ON_ATTACK = 133,
	MODIFIER_EVENT_ON_ATTACK_LANDED = 134,
	MODIFIER_EVENT_ON_ATTACK_FAIL = 135,
	MODIFIER_EVENT_ON_ATTACK_ALLIED = 136,
	MODIFIER_EVENT_ON_PROJECTILE_DODGE = 137,
	MODIFIER_EVENT_ON_ORDER = 138,
	MODIFIER_EVENT_ON_UNIT_MOVED = 139,
	MODIFIER_EVENT_ON_ABILITY_START = 140,
	MODIFIER_EVENT_ON_ABILITY_EXECUTED = 141,
	MODIFIER_EVENT_ON_ABILITY_FULLY_CAST = 142,
	MODIFIER_EVENT_ON_BREAK_INVISIBILITY = 143,
	MODIFIER_EVENT_ON_ABILITY_END_CHANNEL = 144,
	MODIFIER_EVENT_ON_PROCESS_UPGRADE = 145,
	MODIFIER_EVENT_ON_REFRESH = 146,
	MODIFIER_EVENT_ON_TAKEDAMAGE = 147,
	MODIFIER_EVENT_ON_STATE_CHANGED = 148,
	MODIFIER_EVENT_ON_ORB_EFFECT = 149,
	MODIFIER_EVENT_ON_ATTACKED = 150,
	MODIFIER_EVENT_ON_DEATH = 151,
	MODIFIER_EVENT_ON_RESPAWN = 152,
	MODIFIER_EVENT_ON_SPENT_MANA = 153,
	MODIFIER_EVENT_ON_TELEPORTING = 154,
	MODIFIER_EVENT_ON_TELEPORTED = 155,
	MODIFIER_EVENT_ON_SET_LOCATION = 156,
	MODIFIER_EVENT_ON_HEALTH_GAINED = 157,
	MODIFIER_EVENT_ON_MANA_GAINED = 158,
	MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT = 159,
	MODIFIER_EVENT_ON_HERO_KILLED = 160,
	MODIFIER_EVENT_ON_HEAL_RECEIVED = 161,
	MODIFIER_EVENT_ON_BUILDING_KILLED = 162,
	MODIFIER_EVENT_ON_MODEL_CHANGED = 163,
	MODIFIER_EVENT_ON_MODIFIER_ADDED = 164,
	MODIFIER_PROPERTY_TOOLTIP = 165,
	MODIFIER_PROPERTY_MODEL_CHANGE = 166,
	MODIFIER_PROPERTY_MODEL_SCALE = 167,
	MODIFIER_PROPERTY_IS_SCEPTER = 168,
	MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS = 169,
	MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND = 170,
	MODIFIER_PROPERTY_LIFETIME_FRACTION = 171,
	MODIFIER_PROPERTY_PROVIDES_FOW_POSITION = 172,
	MODIFIER_PROPERTY_SPELLS_REQUIRE_HP = 173,
	MODIFIER_PROPERTY_FORCE_DRAW_MINIMAP = 174,
	MODIFIER_PROPERTY_DISABLE_TURNING = 175,
	MODIFIER_PROPERTY_IGNORE_CAST_ANGLE = 176,
	MODIFIER_PROPERTY_CHANGE_ABILITY_VALUE = 177,
	MODIFIER_PROPERTY_ABILITY_LAYOUT = 178,
	MODIFIER_EVENT_ON_DOMINATED = 179,
	MODIFIER_PROPERTY_TEMPEST_DOUBLE = 180,
	MODIFIER_PROPERTY_PRESERVE_PARTICLES_ON_MODEL_CHANGE = 181,
	MODIFIER_EVENT_ON_ATTACK_FINISHED = 182,
	MODIFIER_PROPERTY_IGNORE_COOLDOWN = 183,
	MODIFIER_PROPERTY_CAN_ATTACK_TREES = 184,
	MODIFIER_PROPERTY_VISUAL_Z_DELTA = 185,
	MODIFIER_PROPERTY_INCOMING_DAMAGE_ILLUSION = 186,
	MODIFIER_PROPERTY_DONT_GIVE_VISION_OF_ATTACKER = 187,
	MODIFIER_PROPERTY_TOOLTIP2 = 188,
	MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY = 189,
	MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT = 190,
	MODIFIER_PROPERTY_SUPPRESS_TELEPORT = 191,
	MODIFIER_FUNCTION_LAST = 192,
	MODIFIER_FUNCTION_INVALID = 255
}
declare const enum DOTATeam_t {
	DOTA_TEAM_FIRST = 2,
	DOTA_TEAM_GOODGUYS = 2,
	DOTA_TEAM_BADGUYS = 3,
	DOTA_TEAM_NEUTRALS = 4,
	DOTA_TEAM_NOTEAM = 5,
	DOTA_TEAM_CUSTOM_1 = 6,
	DOTA_TEAM_CUSTOM_2 = 7,
	DOTA_TEAM_CUSTOM_3 = 8,
	DOTA_TEAM_CUSTOM_4 = 9,
	DOTA_TEAM_CUSTOM_5 = 10,
	DOTA_TEAM_CUSTOM_6 = 11,
	DOTA_TEAM_CUSTOM_7 = 12,
	DOTA_TEAM_CUSTOM_8 = 13,
	DOTA_TEAM_COUNT = 14,
	DOTA_TEAM_CUSTOM_MIN = 6,
	DOTA_TEAM_CUSTOM_MAX = 13,
	DOTA_TEAM_CUSTOM_COUNT = 8
}
declare const enum CreatureAbilityType {
	CREATURE_ABILITY_OFFENSIVE = 0,
	CREATURE_ABILITY_DEFENSIVE = 1,
	CREATURE_ABILITY_ESCAPE = 2
}
declare const enum SeqResourcePoseSettingEnum {
	SEQ_POSE_CONSTANT = 0,
	SEQ_POSE_ROTATION = 1,
	SEQ_POSE_POSITION = 2,
	SEQ_POSE_VELOCITY = 3
}
declare const enum EntityDormancyType_t {
	ENTITY_NOT_DORMANT = 0,
	ENTITY_DORMANT = 1,
	ENTITY_SUSPENDED = 2
}
declare const enum StartupBehavior_t {
	UNIT_STARTUP_BEHAVIOR_DEFAULT = 0,
	UNIT_STARTUP_BEHAVIOR_TAUNT = 1
}
declare const enum BinaryNodeTiming {
	UseChild1 = 0,
	UseChild2 = 1,
	SyncChildren = 2
}
declare const enum ResetCycleOption {
	Beginning = 0,
	SameCycleAsSource = 1,
	InverseSourceCycle = 2,
	FixedValue = 3
}
declare const enum DOTA_LANE {
	DOTA_LANE_NONE = 0,
	DOTA_LANE_TOP = 1,
	DOTA_LANE_MIDDLE = 2,
	DOTA_LANE_BOTTOM = 3,
	DOTA_LANE_MAX = 4
}
declare const enum DOTAHUDVisibility_t {
	DOTA_HUD_VISIBILITY_INVALID = -1,
	DOTA_HUD_VISIBILITY_TOP_TIMEOFDAY = 0,
	DOTA_HUD_VISIBILITY_TOP_HEROES = 1,
	DOTA_HUD_VISIBILITY_TOP_SCOREBOARD = 2,
	DOTA_HUD_VISIBILITY_ACTION_PANEL = 3,
	DOTA_HUD_VISIBILITY_ACTION_MINIMAP = 4,
	DOTA_HUD_VISIBILITY_INVENTORY_PANEL = 5,
	DOTA_HUD_VISIBILITY_INVENTORY_SHOP = 6,
	DOTA_HUD_VISIBILITY_INVENTORY_ITEMS = 7,
	DOTA_HUD_VISIBILITY_INVENTORY_QUICKBUY = 8,
	DOTA_HUD_VISIBILITY_INVENTORY_COURIER = 9,
	DOTA_HUD_VISIBILITY_INVENTORY_PROTECT = 10,
	DOTA_HUD_VISIBILITY_INVENTORY_GOLD = 11,
	DOTA_HUD_VISIBILITY_SHOP_SUGGESTEDITEMS = 12,
	DOTA_HUD_VISIBILITY_HERO_SELECTION_TEAMS = 13,
	DOTA_HUD_VISIBILITY_HERO_SELECTION_GAME_NAME = 14,
	DOTA_HUD_VISIBILITY_HERO_SELECTION_CLOCK = 15,
	DOTA_HUD_VISIBILITY_TOP_MENU_BUTTONS = 16,
	DOTA_HUD_VISIBILITY_TOP_BAR_BACKGROUND = 17,
	DOTA_HUD_VISIBILITY_TOP_BAR_RADIANT_TEAM = 18,
	DOTA_HUD_VISIBILITY_TOP_BAR_DIRE_TEAM = 19,
	DOTA_HUD_VISIBILITY_TOP_BAR_SCORE = 20,
	DOTA_HUD_VISIBILITY_ENDGAME = 21,
	DOTA_HUD_VISIBILITY_ENDGAME_CHAT = 22,
	DOTA_HUD_VISIBILITY_QUICK_STATS = 23,
	DOTA_HUD_VISIBILITY_PREGAME_STRATEGYUI = 24,
	DOTA_HUD_VISIBILITY_KILLCAM = 25,
	DOTA_HUD_VISIBILITY_TOP_BAR = 26,
	DOTA_HUD_VISIBILITY_COUNT = 27
}
declare const enum ABILITY_TYPES {
	ABILITY_TYPE_BASIC = 0,
	ABILITY_TYPE_ULTIMATE = 1,
	ABILITY_TYPE_ATTRIBUTES = 2,
	ABILITY_TYPE_HIDDEN = 3
}
declare const enum ActionType_t {
	SOS_ACTION_NONE = 0,
	SOS_ACTION_LIMITER = 1
}
declare const enum FootFallTagFoot_t {
	FOOT1 = 0,
	FOOT2 = 1,
	FOOT3 = 2,
	FOOT4 = 3,
	FOOT5 = 4,
	FOOT6 = 5,
	FOOT7 = 6,
	FOOT8 = 7
}
declare const enum BundleType_t {
	BUNDLE_TYPE_NONE = 0,
	BUNDLE_TYPE_POSITION_SPEED = 1,
	BUNDLE_TYPE_NORMAL_WRINKLE = 2,
	BUNDLE_TYPE_COUNT = 3
}
declare const enum ShakeCommand_t {
	SHAKE_START = 0,
	SHAKE_STOP = 1,
	SHAKE_AMPLITUDE = 2,
	SHAKE_FREQUENCY = 3,
	SHAKE_START_RUMBLEONLY = 4,
	SHAKE_START_NORUMBLE = 5
}
declare const enum PoseController_FModType_t {
	POSECONTROLLER_FMODTYPE_NONE = 0,
	POSECONTROLLER_FMODTYPE_SINE = 1,
	POSECONTROLLER_FMODTYPE_SQUARE = 2,
	POSECONTROLLER_FMODTYPE_TRIANGLE = 3,
	POSECONTROLLER_FMODTYPE_SAWTOOTH = 4,
	POSECONTROLLER_FMODTYPE_NOISE = 5,
	POSECONTROLLER_FMODTYPE_TOTAL = 6
}
declare const enum WorldTextPanelVerticalAlign_t {
	WORLDTEXT_VERTICAL_ALIGN_TOP = 0,
	WORLDTEXT_VERTICAL_ALIGN_CENTER = 1,
	WORLDTEXT_VERTICAL_ALIGN_BOTTOM = 2
}
declare const enum NetChannelBufType_t {
	BUF_DEFAULT = -1,
	BUF_UNRELIABLE = 0,
	BUF_RELIABLE = 1,
	BUF_VOICE = 2
}
declare const enum PointWorldTextJustifyHorizontal_t {
	POINT_WORLD_TEXT_JUSTIFY_HORIZONTAL_LEFT = 0,
	POINT_WORLD_TEXT_JUSTIFY_HORIZONTAL_CENTER = 1,
	POINT_WORLD_TEXT_JUSTIFY_HORIZONTAL_RIGHT = 2
}
