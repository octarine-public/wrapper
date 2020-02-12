import QAngle from "../../Base/QAngle"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { Team } from "../../Enums/Team"
import { default as EntityManager, EntityPropertyType } from "../../Managers/EntityManager"
import { DegreesToRadian } from "../../Utils/Math"
import EventsSDK from "../../Managers/EventsSDK"
import Player from "../../Objects/Base/Player"
import * as StringTables from "../../Managers/StringTables"

export var LocalPlayer: Nullable<Player>
let player_slot = NaN
EventsSDK.on("ServerInfo", info => player_slot = (info.get("player_slot") as number) ?? NaN)
EventsSDK.on("EntityCreated", ent => {
	if (ent.Index === player_slot + 1 /* skip worldent at index 0 */)
		LocalPlayer = ent as Player
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent === LocalPlayer)
		LocalPlayer = undefined
})

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
export default class Entity {
	public NativeEntity: Nullable<C_BaseEntity>

	public IsValid = true
	public Name_ = ""
	public CreateTime = 0
	public Team = Team.None
	public LifeState = LifeState_t.LIFE_DEAD
	public HP = 0
	public MaxHP = 0
	public Owner_ = 0
	public ClassName = ""
	public BecameDormantTime = 0

	public readonly Position_: Vector3 = new Vector3().Invalidate() // cached position
	public readonly Angles_ = new QAngle().Invalidate() // cached angles
	private readonly NetworkAngles_ = new QAngle().Invalidate()// cached network angles
	private readonly PersonalProps: Nullable<Map<string, EntityPropertyType>>

	constructor(public readonly Index: number) {
		this.NativeEntity = EntityManager.NativeByIndex(this.Index)
		this.PersonalProps = EntityManager.GetEntityProperties(this.Index) as Map<string, EntityPropertyType>
	}

	public get IsVisible(): boolean {
		return EntityManager.IsEntityVisible(this.Index)
	}
	public get Name(): string {
		if (this.Name_)
			return this.Name_
		this.Name_ = this.NativeEntity?.m_pEntity?.m_designerName || ""
		return this.Name_
	}
	public get Owner(): Nullable<Entity> {
		return EntityManager.EntityByIndex(this.Owner_)
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
	public get GameSceneNode(): Nullable<CGameSceneNode> {
		return this.NativeEntity?.m_pGameSceneNode
	}
	public get Position(): Vector3 {
		if (!this.Position_.IsValid) {
			let vec = Vector3.fromIOBuffer(this.NativeEntity?.m_VisualData ?? false)
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
	public get HPPercent(): number {
		return Math.floor(this.HP / this.MaxHP * 100) || 0
	}
	public get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE || this.LifeState === LifeState_t.LIFE_RESPAWNING
	}
	public get Forward(): Vector3 {
		return Vector3.FromAngle(this.NetworkRotationRad)
	}
	public get NetworkRotationRad(): number {
		return DegreesToRadian(this.NetworkRotation)
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
	public get Speed(): number {
		return 0
	}
	public get CollisionRadius(): number {
		return Math.sqrt(this.NativeEntity?.m_pCollision?.m_flRadius ?? 0)
	}

	public GetPropertyByName(name: string): Nullable<EntityPropertyType> {
		return this.PersonalProps?.get(name)
	}
	public GetPropertyByPath(path: (string | number)[]): Nullable<EntityPropertyType> {
		let node = this.PersonalProps as Nullable<EntityPropertyType>
		if (node === undefined)
			return undefined

		// loop-optimizer: FORWARD
		if (
			path.some(a => {
				if (typeof a === "number") {
					if (!Array.isArray(node))
						return true
					node = node[a]
				} else {
					if (!(node instanceof Map))
						return true
					node = node.get(a)
				}
				return false
			})
		)
			return undefined
		return node
	}
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
	 * That's a bit faster than just checking this.Distance(ent) < range,
	 * since square root is omitted, and square of number is easier to calculate
	 * than square root
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
	 * @param ent optional, defaults to LocalPlayer
	 */
	public IsEnemy(ent: Nullable<Entity> = LocalPlayer): boolean {
		return ent?.Team !== this.Team
	}

	public Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.Index, bAddToGroup)
	}

	public OnNetworkRotationChanged(m_angAbsRotation: QAngle) {
		m_angAbsRotation.CopyTo(this.NetworkAngles_).CopyTo(this.Angles_)
	}

	public toString(): string {
		return this.Name
	}
}

function QuantitizedVecCoordToCoord(cell: number, inside: number): number {
	return (cell - 128) * 128 + inside
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_BaseEntity", Entity)
RegisterFieldHandler(Entity, "m_flCreateTime", (ent, new_val) => ent.CreateTime = new_val as number)
RegisterFieldHandler(Entity, "m_iTeamNum", (ent, new_val) => {
	ent.Team = new_val as Team
	EventsSDK.emit("EntityTeamChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_lifeState", (ent, new_val) => {
	let old_state = ent.LifeState
	ent.LifeState = new_val as LifeState_t
	if (old_state !== ent.LifeState)
		EventsSDK.emit("LifeStateChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_iHealth", (ent, new_val) => ent.HP = new_val as number)
RegisterFieldHandler(Entity, "m_iMaxHealth", (ent, new_val) => ent.MaxHP = new_val as number)
RegisterFieldHandler(Entity, "m_hOwnerEntity", (ent, new_val) => ent.Owner_ = new_val as number)
RegisterFieldHandler(Entity, "m_angRotation", (ent, new_val) => ent.OnNetworkRotationChanged(new_val as QAngle))
RegisterFieldHandler(Entity, "m_nameStringableIndex", (ent, new_val) => {
	ent.Name_ = StringTables.GetString("EntityNames", new_val as number) ?? ent.Name_
	EventsSDK.emit("EntityNameChanged", false, ent)
})

RegisterFieldHandler(Entity, "m_cellX", (ent, new_val) => ent.Position_.x = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_vecX") as number
))
RegisterFieldHandler(Entity, "m_vecX", (ent, new_val) => ent.Position_.x = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_cellX") as number,
	new_val as number
))
RegisterFieldHandler(Entity, "m_cellY", (ent, new_val) => ent.Position_.y = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_vecY") as number
))
RegisterFieldHandler(Entity, "m_vecY", (ent, new_val) => ent.Position_.y = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_cellY") as number,
	new_val as number
))
RegisterFieldHandler(Entity, "m_cellZ", (ent, new_val) => ent.Position_.z = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_vecZ") as number
))
RegisterFieldHandler(Entity, "m_vecZ", (ent, new_val) => ent.Position_.z = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>).get("m_cellZ") as number,
	new_val as number
))
