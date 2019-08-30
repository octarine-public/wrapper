import QAngle from "../../Base/QAngle"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { default as EntityManager, LocalPlayer } from "../../Managers/EntityManager"
import { DegreesToRadian } from "../../Utils/Math"

export const rotation_speed = {
	npc_dota_hero_base: 0.5,
	npc_dota_hero_antimage: 0.5,
	npc_dota_hero_axe: 0.6,
	npc_dota_hero_bane: 0.6,
	npc_dota_hero_bloodseeker: 0.5,
	npc_dota_hero_crystal_maiden: 0.5,
	npc_dota_hero_drow_ranger: 0.7,
	npc_dota_hero_earthshaker: 0.9,
	npc_dota_hero_juggernaut: 0.6,
	npc_dota_hero_mirana: 0.5,
	npc_dota_hero_nevermore: 1,
	npc_dota_hero_morphling: 0.6,
	npc_dota_hero_phantom_lancer: 0.6,
	npc_dota_hero_puck: 0.5,
	npc_dota_hero_pudge: 0.7,
	npc_dota_hero_razor: 0.5,
	npc_dota_hero_sand_king: 0.5,
	npc_dota_hero_storm_spirit: 0.8,
	npc_dota_hero_sven: 0.6,
	npc_dota_hero_tiny: 0.5,
	npc_dota_hero_vengefulspirit: 0.6,
	npc_dota_hero_windrunner: 0.8,
	npc_dota_hero_zuus: 0.6,
	npc_dota_hero_kunkka: 0.6,
	npc_dota_hero_lina: 0.5,
	npc_dota_hero_lich: 0.5,
	npc_dota_hero_lion: 0.5,
	npc_dota_hero_shadow_shaman: 0.5,
	npc_dota_hero_slardar: 0.5,
	npc_dota_hero_tidehunter: 0.5,
	npc_dota_hero_witch_doctor: 0.5,
	npc_dota_hero_riki: 0.6,
	npc_dota_hero_enigma: 0.5,
	npc_dota_hero_tinker: 0.6,
	npc_dota_hero_sniper: 0.7,
	npc_dota_hero_necrolyte: 0.5,
	npc_dota_hero_warlock: 0.5,
	npc_dota_hero_beastmaster: 0.5,
	npc_dota_hero_queenofpain: 0.5,
	npc_dota_hero_venomancer: 0.5,
	npc_dota_hero_faceless_void: 1,
	npc_dota_hero_skeleton_king: 0.5,
	npc_dota_hero_death_prophet: 0.5,
	npc_dota_hero_phantom_assassin: 0.6,
	npc_dota_hero_pugna: 0.5,
	npc_dota_hero_templar_assassin: 0.7,
	npc_dota_hero_viper: 0.5,
	npc_dota_hero_luna: 0.6,
	npc_dota_hero_dragon_knight: 0.6,
	npc_dota_hero_dazzle: 0.6,
	npc_dota_hero_rattletrap: 0.6,
	npc_dota_hero_leshrac: 0.5,
	npc_dota_hero_furion: 0.6,
	npc_dota_hero_life_stealer: 1,
	npc_dota_hero_dark_seer: 0.6,
	npc_dota_hero_clinkz: 0.5,
	npc_dota_hero_omniknight: 0.6,
	npc_dota_hero_enchantress: 0.5,
	npc_dota_hero_huskar: 0.5,
	npc_dota_hero_night_stalker: 0.5,
	npc_dota_hero_broodmother: 0.5,
	npc_dota_hero_bounty_hunter: 0.6,
	npc_dota_hero_weaver: 0.5,
	npc_dota_hero_jakiro: 0.5,
	npc_dota_hero_batrider: 1,
	npc_dota_hero_chen: 0.6,
	npc_dota_hero_spectre: 0.5,
	npc_dota_hero_doom_bringer: 0.5,
	npc_dota_hero_ancient_apparition: 0.6,
	npc_dota_hero_ursa: 0.5,
	npc_dota_hero_spirit_breaker: 0.5,
	npc_dota_hero_gyrocopter: 0.6,
	npc_dota_hero_alchemist: 0.6,
	npc_dota_hero_invoker: 0.5,
	npc_dota_hero_silencer: 0.6,
	npc_dota_hero_obsidian_destroyer: 0.5,
	npc_dota_hero_lycan: 0.5,
	npc_dota_hero_brewmaster: 0.6,
	npc_dota_hero_shadow_demon: 0.6,
	npc_dota_hero_lone_druid: 0.5,
	npc_dota_hero_chaos_knight: 0.5,
	npc_dota_hero_meepo: 0.65,
	npc_dota_hero_treant: 0.5,
	npc_dota_hero_ogre_magi: 0.6,
	npc_dota_hero_undying: 0.6,
	npc_dota_hero_rubick: 0.7,
	npc_dota_hero_disruptor: 0.5,
	npc_dota_hero_nyx_assassin: 0.5,
	npc_dota_hero_naga_siren: 0.5,
	npc_dota_hero_keeper_of_the_light: 0.5,
	npc_dota_hero_wisp: 0.7,
	npc_dota_hero_visage: 0.5,
	npc_dota_hero_slark: 0.6,
	npc_dota_hero_medusa: 0.5,
	npc_dota_hero_troll_warlord: 0.5,
	npc_dota_hero_centaur: 0.5,
	npc_dota_hero_magnataur: 0.8,
	npc_dota_hero_shredder: 0.6,
	npc_dota_hero_bristleback: 1,
	npc_dota_hero_tusk: 0.7,
	npc_dota_hero_skywrath_mage: 0.5,
	npc_dota_hero_abaddon: 0.5,
	npc_dota_hero_elder_titan: 0.5,
	npc_dota_hero_legion_commander: 0.5,
	npc_dota_hero_ember_spirit: 0.5,
	npc_dota_hero_earth_spirit: 0.6,
	npc_dota_hero_terrorblade: 0.5,
	npc_dota_hero_phoenix: 1,
	npc_dota_hero_oracle: 0.7,
	npc_dota_hero_techies: 0.5,
	npc_dota_hero_target_dummy: 0.5,
	npc_dota_hero_winter_wyvern: 0.5,
	npc_dota_hero_arc_warden: 0.6,
	npc_dota_hero_abyssal_underlord: 0.6,
	npc_dota_hero_monkey_king: 0.6,
	npc_dota_hero_pangolier: 1,
	npc_dota_hero_dark_willow: 0.7,
	npc_dota_hero_grimstroke: 0.6,
	npc_dota_hero_mars: 0.8,
}

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
export default class Entity {
	/* ================================ Fields ================================ */
	public IsValid: boolean = false
	private readonly NetworkPosition_: Vector3 = new Vector3().Invalidate() // cached networkposition
	private readonly Position_: Vector3 = new Vector3().Invalidate() // cached position
	private readonly Angles_: QAngle = new QAngle().Invalidate() // cached angles
	private Rotation_: number = NaN // cached rotation
	private Scale_: number = 1 // cached scale
	public Name: string = ""
	private readonly Entity: CEntityIdentity
	public Owner_: Entity | C_BaseEntity | number
	public GameSceneNode_: CGameSceneNode

	/* ================================ BASE ================================ */
	constructor(public m_pBaseEntity: C_BaseEntity, public readonly Index: number) {
		this.Entity = this.m_pBaseEntity.m_pEntity
		this.Owner_ = this.m_pBaseEntity.m_hOwnerEntity
		if (this.Entity !== undefined)
			this.Name = this.Entity.m_name || this.Entity.m_designerName || ""
	}

	/* ================ GETTERS ================ */
	get Owner(): Entity { // trick to make it public ro, and protected rw
		return this.Owner_ instanceof Entity ? this.Owner_ : (this.Owner_ = EntityManager.GetEntityByNative(this.Owner_, true) || EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOwnerEntity, true))
	}
	get GameSceneNode(): CGameSceneNode {
		return this.GameSceneNode_ || (this.GameSceneNode_ = this.m_pBaseEntity.m_pGameSceneNode)
	}
	get Position(): Vector3 { // trick to make it public ro, and protected rw
		if (!this.Position_.IsValid) {
			let gameSceneNode = this.GameSceneNode
			if (gameSceneNode === undefined)
				return new Vector3()
			Vector3.fromIOBuffer(gameSceneNode.m_vecOrigin.m_Value).CopyTo(this.Position_)
		}
		return this.Position_.Clone()
	}
	get NetworkPosition(): Vector3 {
		if (!this.NetworkPosition_.IsValid)
			this.Position.CopyTo(this.NetworkPosition_)
		return this.NetworkPosition_.Clone()
	}
	get Scale(): number {
		if (this.Rotation_ === NaN) {
			let gameSceneNode = this.GameSceneNode
			if (gameSceneNode === undefined)
				return 0
			this.Scale_ = gameSceneNode.m_flAbsScale
		}
		return this.Scale_
	}
	get Rotation(): number {
		if (this.Rotation_ === NaN) {
			let gameSceneNode = this.GameSceneNode
			if (gameSceneNode === undefined)
				return 0
			this.Rotation_ = QAngle.fromIOBuffer(gameSceneNode.m_angRotation)[1]
		}
		return this.Rotation_
	}
	get Angles(): QAngle {
		if (!this.Angles_.IsValid) {
			let gameSceneNode = this.GameSceneNode
			if (gameSceneNode === undefined)
				return new QAngle()
			QAngle.fromIOBuffer(gameSceneNode.m_angAbsRotation).CopyTo(this.Angles_)
		}
		return this.Angles_.Clone()
	}
	get CreateTime(): number {
		return this.m_pBaseEntity.m_flCreateTime
	}
	get HP(): number {
		return this.m_pBaseEntity.m_iHealth
	}
	get HPPercent(): number {
		return Math.floor(this.HP / this.MaxHP * 100) || 0
	}
	get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE
	}
	get IsDormant(): boolean {
		return !this.IsVisible
	}
	get IsDOTANPC(): boolean {
		return this.m_pBaseEntity.m_bIsDOTANPC
	}
	get IsNPC(): boolean {
		return this.m_pBaseEntity.m_bIsNPC
	}
	get IsVisible(): boolean {
		return (this.Flags & (1 << 7)) === 0
	}
	get LifeState(): LifeState_t {
		return this.m_pBaseEntity.m_lifeState
	}
	get MaxHP(): number {
		return this.m_pBaseEntity.m_iMaxHealth
	}
	/**
	 * as Direction
	 */
	get Forward(): Vector3 {
		return Vector3.FromAngle(this.RotationRad)
	}
	get RotationRad(): number {
		return DegreesToRadian(this.Rotation)
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	get Speed(): number {
		return this.m_pBaseEntity.m_flSpeed
	}
	get Team(): DOTATeam_t {
		return this.m_pBaseEntity.m_iTeamNum
	}
	get Flags(): number {
		if (!this.IsValid)
			return -1
		return this.Entity.m_flags
	}
	set Flags(value: number) {
		if (!this.IsValid)
			return
		this.Entity.m_flags = value
	}

	/* ================ METHODS ================ */
	Distance(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.Distance(vec)

		return this.NetworkPosition.Distance(vec.NetworkPosition)
	}
	Distance2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.NetworkPosition
		return this.NetworkPosition.Distance2D(vec)
	}
	DistanceSqr(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.NetworkPosition
		return this.NetworkPosition.DistanceSqr(vec)
	}
	DistanceSqr2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.NetworkPosition
		return this.NetworkPosition.DistanceSqr2D(vec)
	}
	AngleBetweenFaces(front: Vector3): number {
		return this.Forward.AngleBetweenFaces(front)
	}
	InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	InFrontFromAngle(angle: number, distance: number): Vector3 {
		return this.Position.InFrontFromAngle(this.RotationRad + angle, distance)
	}
	FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.NetworkPosition
		return this.NetworkPosition.FindRotationAngle(vec, this.RotationRad)
	}
	/**
	 * faster (Distance <= range)
	 */
	IsInRange(ent: Vector3 | Vector2 | Entity, range: number): boolean {
		return this.DistanceSqr2D(ent) < range ** 2
	}
	Closest(ents: Entity[]): Entity {
		let thisPos = this.NetworkPosition

		let entity: Entity
		let distance = Number.POSITIVE_INFINITY

		ents.forEach(ent => {
			let tempDist = ent.Distance(thisPos)
			if (tempDist < distance) {
				distance = tempDist
				entity = ent
			}
		})
		return entity
	}
	/**
	 * @example
	 * unit.ClosestGroup(groups, group => Vector3.GetCenterType(creeps, creep => creep.InFront(200)))
	 */
	ClosestGroup(groups: Entity[][], callback: (entity: Entity[]) => Vector3): [Entity[], Vector3] {
		let thisPos = this.NetworkPosition

		let entities: Entity[] = []
		let vec = new Vector3()
		let distance = Number.POSITIVE_INFINITY

		groups.forEach(group => {
			let tempVec = callback(group)
			let tempDist = thisPos.Distance(tempVec)

			if (tempDist < distance) {
				distance = tempDist
				entities = group
				vec = tempVec
			}
		})
		return [entities, vec]
	}
	/**
	 * @param ent if undefined => this compare with LocalPlayer
	 */
	IsEnemy(ent: Entity = LocalPlayer): boolean {
		return ent === undefined || ent.Team !== this.Team
	}

	Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.m_pBaseEntity, bAddToGroup)
	}

	GetRotationTime(vec: Vector3): number {
		const turn_rad = Math.PI - 0.25
		let ang = this.FindRotationAngle(vec)
		return ang <= turn_rad ? 30 * ang / rotation_speed[this.Name] : 0
	}

	OnGameSceneNodeChanged(m_vecOrigin: Vector3, m_angAbsRotation: QAngle, m_angRotation: number, m_flAbsScale: number) {
		m_vecOrigin.CopyTo(this.Position_)
		m_angAbsRotation.CopyTo(this.Angles_)
		this.Rotation_ = m_angRotation
		this.Scale_ = m_flAbsScale
	}
	OnNetworkPositionChanged(m_vecOrigin: Vector3) {
		m_vecOrigin.CopyTo(this.NetworkPosition_).CopyTo(this.Position_)
	}
	OnCreated() {
		this.IsValid = true
	}

	toString(): string {
		return this.Name
	}
}
