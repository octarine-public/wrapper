import QAngle from "../../Base/QAngle"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { Team } from "../../Enums/Team"
import { default as EntityManager, EntityPropertyType } from "../../Managers/EntityManager"
import { DegreesToRadian } from "../../Utils/Math"
import EventsSDK from "../../Managers/EventsSDK"
import Player from "../../Objects/Base/Player"
import * as StringTables from "../../Managers/StringTables"
import Manifest from "../../Managers/Manifest"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import CGameRules from "./GameRules"
import Item from "./Item"
import GameState from "../../Utils/GameState"

export var LocalPlayer: Nullable<Player>
let player_slot = NaN
EventsSDK.on("ServerInfo", info => player_slot = (info.get("player_slot") as number) ?? NaN)
EventsSDK.on("EntityCreated", ent => {
	if (ent.Index === player_slot + 1 /* skip worldent at index 0 */)
		LocalPlayer = ent as Player
})
export function OnLocalPlayerDeleted() {
	LocalPlayer = undefined
}
export let GameRules: Nullable<CGameRules>
EventsSDK.on("EntityCreated", ent => {
	if (ent.IsGameRules)
		GameRules = ent as CGameRules
})
EventsSDK.on("EntityDestroyed", ent => {
	if (!ent.IsGameRules)
		return
	GameRules = undefined
	GameState.RawGameTime = 0
})

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
@WrapperClass("C_BaseEntity")
export default class Entity {
	public IsValid = true
	public Name_ = ""
	@NetworkedBasicField("m_flCreateTime")
	public CreateTime_ = 0
	public FakeCreateTime_ = GameState.RawGameTime
	public Team = Team.None
	public LifeState = LifeState_t.LIFE_DEAD
	@NetworkedBasicField("m_iHealth")
	public HP = 0
	@NetworkedBasicField("m_iMaxHealth")
	public MaxHP = 0
	public ClassName = ""
	public BecameDormantTime = 0
	public ModelName = ""
	public Agility = 0
	public Intellect = 0
	public Strength = 0
	public TotalAgility = 0
	public TotalIntellect = 0
	public TotalStrength = 0
	@NetworkedBasicField("m_hOwnerEntity")
	private Owner_ = 0

	private readonly PersonalProps: Nullable<Map<string, EntityPropertyType>>

	constructor(public readonly Index: number) {
		this.PersonalProps = EntityManager.GetEntityProperties(this.Index) as Map<string, EntityPropertyType>
	}

	public get IsVisible(): boolean {
		return EntityManager.IsEntityVisible(this.Index)
	}
	public get Name(): string {
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
	public get Position(): Vector3 {
		return new Vector3(
			EntityVisualPositions[this.Index * 3 + 0],
			EntityVisualPositions[this.Index * 3 + 1],
			EntityVisualPositions[this.Index * 3 + 2]
		)
	}
	public get Rotation(): number {
		return EntityVisualRotations[this.Index * 3 + 1]
	}
	public get Angles(): QAngle {
		return new QAngle(
			EntityVisualRotations[this.Index * 3 + 0],
			EntityVisualRotations[this.Index * 3 + 1],
			EntityVisualRotations[this.Index * 3 + 2],
		)
	}
	public get CreateTime() {
		return this.CreateTime_ !== 0
			? this.CreateTime_
			: this.FakeCreateTime_
	}
	public get HPPercent(): number {
		return Math.floor(this.HP / this.MaxHP * 100) || 0
	}
	public get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE || this.LifeState === LifeState_t.LIFE_RESPAWNING
	}
	public get Forward(): Vector3 {
		return Vector3.FromAngle(this.RotationRad)
	}
	public get RotationRad(): number {
		return DegreesToRadian(this.Rotation)
	}
	public get IsNeutral(): boolean {
		return this.Team === Team.Neutral
	}

	public get Speed(): number {
		return 0
	}
	public get CollisionRadius(): number {
		return GetEntityCollisionRadius(this.Index) ?? 0
	}
	public get RingRadius(): number {
		return 30 // TODO: actually it uses model unless it doesn't have such for C_BaseEntity#GetRingRadius
	}
	public get IsGameRules(): boolean {
		return false
	}

	public GetPropertyByName(name: string): Nullable<EntityPropertyType> {
		return this.PersonalProps?.get(name)
	}
	public GetPropertyByPath(path: (string | number)[]): Nullable<EntityPropertyType> {
		let node = this.PersonalProps as Nullable<EntityPropertyType>
		if (node === undefined)
			return undefined

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
		return this.Position.InFrontFromAngle(this.RotationRad + angle, distance)
	}
	public FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.FindRotationAngle(vec, this.RotationRad)
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
	public CannotUseItem(item: Item): boolean {
		item // that's weird.
		return false
	}

	public toString(): string {
		return this.Name
	}
}

function QuantitizedVecCoordToCoord(cell: number, inside: number): number {
	return ((cell ?? 0) - 128) * 128 + (inside ?? 0)
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Entity, "m_iTeamNum", (ent, new_val) => {
	const old_team = ent.Team
	ent.Team = new_val as Team
	if (old_team !== ent.Team)
		EventsSDK.emit("EntityTeamChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_lifeState", (ent, new_val) => {
	const old_state = ent.LifeState
	ent.LifeState = new_val as LifeState_t
	if (old_state !== ent.LifeState)
		EventsSDK.emit("LifeStateChanged", false, ent)
})
RegisterFieldHandler(Entity, "m_hModel", (ent, new_val) => ent.ModelName = Manifest.GetPathByHash(new_val as bigint) ?? "")
RegisterFieldHandler(Entity, "m_angRotation", (ent, new_val) => {
	const m_angRotation = new_val as QAngle
	EntityVisualRotations[ent.Index * 3 + 0] = m_angRotation.x
	EntityVisualRotations[ent.Index * 3 + 1] = m_angRotation.y
	EntityVisualRotations[ent.Index * 3 + 2] = m_angRotation.z
})
RegisterFieldHandler(Entity, "m_nameStringableIndex", (ent, new_val) => {
	const old_name = ent.Name
	ent.Name_ = StringTables.GetString("EntityNames", new_val as number) ?? ent.Name_
	if (old_name !== ent.Name)
		EventsSDK.emit("EntityNameChanged", false, ent)
})

RegisterFieldHandler(Entity, "m_cellX", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 0] = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_vecX") as number
))
RegisterFieldHandler(Entity, "m_vecX", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 0] = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_cellX") as number,
	new_val as number
))
RegisterFieldHandler(Entity, "m_cellY", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 1] = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_vecY") as number
))
RegisterFieldHandler(Entity, "m_vecY", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 1] = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_cellY") as number,
	new_val as number
))
RegisterFieldHandler(Entity, "m_cellZ", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 2] = QuantitizedVecCoordToCoord(
	new_val as number,
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_vecZ") as number
))
RegisterFieldHandler(Entity, "m_vecZ", (ent, new_val) => EntityVisualPositions[ent.Index * 3 + 2] = QuantitizedVecCoordToCoord(
	(ent.GetPropertyByName("CBodyComponent") as Map<string, EntityPropertyType>)?.get("m_cellZ") as number,
	new_val as number
))

EventsSDK.on("GameEvent", (name, obj) => {
	if (name !== "entity_hurt")
		return
	let ent = EntityManager.EntityByIndex(obj.entindex_killed)
	if (ent === undefined || !ent.IsAlive)
		return
	ent.HP = Math.max(Math.round(ent.HP - obj.damage), 1)
})
