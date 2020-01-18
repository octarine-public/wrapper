import QAngle from "../../Base/QAngle"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { Team } from "../../Enums/Team"
import { default as EntityManager, LocalPlayer } from "../../Managers/EntityManager"
import { DegreesToRadian } from "../../Utils/Math"

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
export default class Entity {
	/* ================================ Fields ================================ */

	public readonly Entity: Nullable<CEntityIdentity>
	public readonly Index: number
	public Owner_: Entity | CEntityIndex

	public IsValid: boolean = false
	public IsVisible = true
	public Name_ = ""

	public Team = Team.None
	public LifeState = LifeState_t.LIFE_ALIVE
	public HP = 0
	public MaxHP = 0

	private readonly Position_: Vector3 = new Vector3().Invalidate() // cached position
	private readonly Angles_ = new QAngle().Invalidate() // cached angles
	private readonly NetworkAngles_ = new QAngle().Invalidate()// cached network angles

	constructor(public readonly m_pBaseEntity: C_BaseEntity) {
		this.Entity = this.m_pBaseEntity.m_pEntity
		this.Index = EntityManager.IndexByNative(this.m_pBaseEntity)
		this.Owner_ = this.m_pBaseEntity.m_hOwnerEntity

		this.MaxHP = this.m_pBaseEntity.m_iMaxHealth
		this.HP = this.m_pBaseEntity.m_iHealth
		this.LifeState = this.m_pBaseEntity.m_lifeState
		this.Team = this.m_pBaseEntity.m_iTeamNum
	}

	/* ================ GETTERS ================ */
	public get Name(): string {
		return (this.Name_ = this.Name_ || this.Entity?.m_name || this.Entity?.m_designerName || "")
	}
	public get Owner(): Nullable<Entity> { // trick to make it public ro, and protected rw
		if (this.Owner_ instanceof Entity)
			return this.Owner_

		this.Owner_ = EntityManager.GetEntityByNative(this.Owner_) as Entity || this.Owner_

		if (this.Owner_ instanceof Entity)
			return this.Owner_

		return undefined
	}
	public get RootOwner(): Nullable<Entity> {
		let owner = this.Owner
		while (true) {
			let root_owner = owner?.Owner as Nullable<Entity>
			if (root_owner === undefined)
				break

			owner = root_owner
		}
		return owner
	}
	public get GameSceneNode(): CGameSceneNode {
		return this.m_pBaseEntity.m_pGameSceneNode
	}
	public get Position(): Vector3 { // trick to make it public ro, and protected rw
		if (!this.Position_.IsValid) {
			let vec = Vector3.fromIOBuffer(this.m_pBaseEntity.m_VisualData)
			if (vec === undefined)
				return new Vector3()
			vec.CopyTo(this.Position_)
		}
		return this.Position_.Clone()
	}
	public get NetworkRotation(): number {
		return this.NetworkAngles_.y
	}
	public get NetworkAngles(): QAngle {
		return this.NetworkAngles_.Clone()
	}
	public get CreateTime(): number {
		return this.m_pBaseEntity.m_flCreateTime
	}
	public get HPPercent(): number {
		return Math.floor(this.HP / this.MaxHP * 100) || 0
	}
	public get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE || this.LifeState === LifeState_t.LIFE_RESPAWNING
	}
	public get IsDOTANPC(): boolean {
		return this.m_pBaseEntity.m_bIsDOTANPC
	}
	public get IsNPC(): boolean {
		return this.m_pBaseEntity.m_bIsNPC
	}
	/**
	 * as Direction
	 */
	public get Forward(): Vector3 {
		return Vector3.FromAngle(this.NetworkRotationRad)
	}
	public get NetworkRotationRad(): number {
		return DegreesToRadian(this.NetworkRotation)
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	public get Speed(): number {
		return this.m_pBaseEntity.m_flSpeed
	}
	public get Flags(): number {
		if (!this.IsValid || this.Entity === undefined)
			return -1
		return this.Entity.m_flags
	}
	public set Flags(value: number) {
		if (!this.IsValid || this.Entity === undefined)
			return
		this.Entity.m_flags = value
	}

	public get Agility(): number {
		return 0
	}
	public get Intellect(): number {
		return 0
	}
	public get Strength(): number {
		return 0
	}
	public get TotalAgility(): number {
		return 0
	}
	public get TotalIntellect(): number {
		return 0
	}
	public get TotalStrength(): number {
		return 0
	}
	public get CollisionRadius(): number {
		return Math.sqrt(this.m_pBaseEntity.m_pCollision?.m_flRadius ?? 0)
	}

	/* ================ METHODS ================ */
	public Distance(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.Distance(vec)
	}
	public Distance2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.Distance2D(vec)
	}
	public DistanceSqr(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.DistanceSqr(vec)
	}
	public DistanceSqr2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.DistanceSqr2D(vec)
	}
	public AngleBetweenFaces(front: Vector3): number {
		return this.Forward.AngleBetweenFaces(front)
	}
	public InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	public InFrontFromAngle(angle: number, distance: number): Vector3 {
		return this.Position.InFrontFromAngle(this.NetworkRotationRad + angle, distance)
	}
	public FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.FindRotationAngle(vec, this.NetworkRotationRad)
	}
	/**
	 * faster (Distance <= range)
	 */
	public IsInRange(ent: Vector3 | Vector2 | Entity, range: number): boolean {
		return this.DistanceSqr2D(ent) < range ** 2
	}
	public Closest(ents: Entity[]): Entity {
		let thisPos = this.Position

		let entity: Nullable<Entity>
		let distance = Number.POSITIVE_INFINITY

		ents.forEach(ent => {
			let tempDist = ent.Distance(thisPos)
			if (tempDist < distance) {
				distance = tempDist
				entity = ent
			}
		})

		return entity as Entity
	}
	/**
	 * @example
	 * unit.ClosestGroup(groups, group => Vector3.GetCenterType(creeps, creep => creep.InFront(200)))
	 */
	public ClosestGroup(groups: Entity[][], callback: (entity: Entity[]) => Vector3): [Entity[], Vector3] {
		let thisPos = this.Position

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
	public IsEnemy(ent: Nullable<Entity> = LocalPlayer): boolean {
		return ent === undefined || ent.Team !== this.Team
	}

	public Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.Index, bAddToGroup)
	}

	public OnGameSceneNodeChanged(m_vecOrigin: Vector3, m_angAbsRotation: QAngle) {
		m_vecOrigin.CopyTo(this.Position_)
		m_angAbsRotation.CopyTo(this.Angles_)
	}
	public OnNetworkRotationChanged() {
		let gameSceneNode = this.GameSceneNode
		if (gameSceneNode === undefined)
			return
		QAngle.fromIOBuffer(gameSceneNode.m_angRotation)?.CopyTo(this.NetworkAngles_).CopyTo(this.Angles_)
	}
	public OnCreated() {
		this.IsValid = true

		this.OnNetworkRotationChanged()
	}

	public toString(): string {
		return this.Name
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_BaseEntity", Entity)
