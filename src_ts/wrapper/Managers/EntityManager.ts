import * as ArrayExtensions from "../Utils/ArrayExtensions"

import Events from "./Events"

import Entity from "../Objects/Base/Entity"
import Unit from "../Objects/Base/Unit"
import Hero from "../Objects/Base/Hero"
import Player from "../Objects/Base/Player"

import Creep from "../Objects/Base/Creep"

import Ability from "../Objects/Base/Ability"
import Item from "../Objects/Base/Item"
import NativeToSDK, { GetSDKClasses } from "../Objects/NativeToSDK"

import Building from "../Objects/Base/Building"
import PhysicalItem from "../Objects/Base/PhysicalItem"
import Tower from "../Objects/Base/Tower"

import Game from "../Objects/GameResources/GameRules"
import PlayerResource from "../Objects/GameResources/PlayerResource"
import EventsSDK, { gameInProgress, ToggleGameInProgress } from "./EventsSDK"
import Roshan from "../Objects/Roshan/npc_dota_roshan"

let AllEntities: Entity[] = []
let EntitiesIDs = new Map<number, C_BaseEntity>()
let AllEntitiesAsMap = new Map<C_BaseEntity, Entity>()
let ClassToEntities = new Map<Constructor<any>, Entity[]>()

export var LocalPlayer: Nullable<Player>

let player_slot = NaN
Events.on("ServerInfo", info => player_slot = info.player_slot ?? NaN)

class CEntityManager {
	private Roshan_: Nullable<Entity | number>

	get Roshan(): Nullable<Entity | number> {
		if (this.Roshan_ instanceof Entity) {
			if (!this.Roshan_.IsValid || !(this.Roshan_ instanceof Roshan))
				return this.Roshan_ = undefined
			return this.Roshan_
		}
		return this.Roshan_ = (this.EntityByIndex(this.Roshan_ as number)
			?? this.Roshan_
			?? AllEntities.find(ent => ent instanceof Roshan))
	}
	set Roshan(ent: Nullable<Entity | number>) {
		this.Roshan_ = ent
	}
	get LocalPlayer(): Nullable<Player> {
		return LocalPlayer
	}
	get LocalHero(): Nullable<Hero> {
		return LocalPlayer !== undefined ? LocalPlayer.Hero : undefined
	}
	get AllEntities(): Entity[] {
		return AllEntities
	}
	public EntityByIndex(index: number): Nullable<Entity> {
		return this.GetEntityByNative(EntitiesIDs.get(index))
	}
	public EntityByHandle(handle: number | undefined): Nullable<Entity> {
		if (handle === undefined || handle === 0)
			return undefined
		let index = handle & 0x3FFF
		if (index === 0x3FFF || index === 0)
			return undefined
		return this.EntityByIndex(index)
	}
	public IndexByNative(ent: C_BaseEntity): number {
		for (let [index, ent_] of EntitiesIDs.entries())
			if (ent === ent_)
				return index
		return -1
	}
	public GetPlayerByID(playerID: number): Nullable<Player> {
		if (playerID === -1)
			return undefined
		return AllEntities.find(entity => entity instanceof Player && entity.PlayerID === playerID) as Player
	}

	public GetEntityByNative(ent: CEntityIndex): Nullable<Entity> {
		if (ent === undefined)
			return undefined

		if (!(ent instanceof C_BaseEntity))
			return this.EntityByIndex(ent)

		return AllEntitiesAsMap.get(ent)
	}

	public GetEntityByFilter(filter: (ent: Entity) => boolean): Nullable<Entity> {
		return AllEntities.find(filter)
	}

	public GetEntitiesByNative(ents: (CEntityIndex | Entity)[]): (Entity | C_BaseEntity | undefined)[] {
		// loop-optimizer: FORWARD
		return ents.map(ent => {
			if (ent === undefined || ent instanceof Entity)
				return ent

			if (!(ent instanceof C_BaseEntity))
				return this.EntityByIndex(ent)

			return AllEntitiesAsMap.get(ent) ?? ent
		})
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>, flags: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH): T[] {
		if (class_ === undefined || !ClassToEntities.has(class_))
			return []
		switch (flags) {
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY:
				// loop-optimizer: FORWARD
				return ClassToEntities.get(class_)!.filter(e => !e.IsEnemy()) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY:
				// loop-optimizer: FORWARD
				return ClassToEntities.get(class_)!.filter(e => e.IsEnemy()) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH:
				return ClassToEntities.get(class_) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_CUSTOM:
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE:
			default:
				return []
		}
	}
	/**
	 * @deprecated USE IT ONLY IF YOU REALLY NEED IT \
	 * GetEntitiesByClasses is 60 times slower than GetEntitiesByClass
	 */
	public GetEntitiesByClasses<T>(classes: Constructor<T>[], flags: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH): T[] {
		let ar: T[] = []
		// loop-optimizer: FORWARD
		classes.forEach(class_ => ar.push(...this.GetEntitiesByClass(class_, flags)))
		return [...new Set(ar)]
	}
}

const EntityManager = new CEntityManager()
export default EntityManager

Events.on("EntityCreated", (ent, index) => {
	{ // add globals
		if (ent instanceof C_DOTA_PlayerResource)
			PlayerResource.m_pBaseEntity = ent

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = ent.m_pGameRules
			Game.RawGameTime = Game.m_GameRules.m_fGameTime
			Game.IsPaused = Game.m_GameRules.m_bGamePaused
		}

		if (ent instanceof C_DOTAGameManagerProxy)
			Game.m_GameManager = ent.m_pGameManager
	}

	EntitiesIDs.set(index, ent)
	AddToCache(ent)
})

Events.on("EntityDestroyed", (ent, index) => {
	{ // delete global
		if (ent instanceof C_DOTA_PlayerResource)
			PlayerResource.m_pBaseEntity = undefined

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = undefined
			Game.RawGameTime = 0
			Game.IsPaused = false
		}

		if (ent instanceof C_DOTAGameManagerProxy)
			Game.m_GameManager = undefined

		if (ent instanceof C_DOTAPlayer && LocalPlayer?.m_pBaseEntity === ent)
			LocalPlayer = undefined
	}

	DeleteFromCache(ent)
	EntitiesIDs.delete(index)
})

let last_event_ent = -1
Events.on("GameEvent", (name, obj) => {
	if (name === "npc_spawned")
		last_event_ent = obj.entindex
	else if (name === "dota_item_spawned" && obj.player_id === -1 && last_event_ent !== -1 && EntityManager.Roshan === undefined)
		EntityManager.Roshan = last_event_ent
	else
		last_event_ent = -1
})

/* ================ RUNTIME CACHE ================ */
export function AddToCache(ent: C_BaseEntity) {
	let name = ent.m_pEntity?.m_name
	if (ent instanceof C_DOTABaseAbility && name === undefined)
		return

	let entity = ClassFromNative(ent, name)
	if (entity.Index === player_slot + 1 /* skip worldent at index 0 */)
		LocalPlayer = entity as Player
	entity.OnCreated()
	AllEntitiesAsMap.set(entity.m_pBaseEntity, entity)
	AllEntities.push(entity)

	GetSDKClasses().forEach(class_ => {
		if (!(entity instanceof class_))
			return
		if (!ClassToEntities.has(class_))
			ClassToEntities.set(class_, [])

		ClassToEntities.get(class_)!.push(entity)
	})
	EventsSDK.emit("EntityCreated", false, entity)
	FireEntityEvents(entity)
	if (entity === LocalPlayer && LocalPlayer.Hero !== undefined && !gameInProgress) {
		ToggleGameInProgress()
		EventsSDK.emit("GameStarted", false, LocalPlayer.Hero)
	}
}

function DeleteFromCache(entNative: C_BaseEntity) {
	const entity = AllEntitiesAsMap.get(entNative)
	if (entity === undefined)
		return

	entity.IsValid = false

	AllEntitiesAsMap.delete(entNative)
	ArrayExtensions.arrayRemove(AllEntities, entity)

	// console.log("onEntityDestroyed SDK", entity, entity.m_pBaseEntity, index);
	EventsSDK.emit("EntityDestroyed", false, entity)
	GetSDKClasses().forEach(class_ => {
		if (!(entity instanceof class_))
			return

		let classToEnt = ClassToEntities.get(class_)

		if (!classToEnt)
			return
		ArrayExtensions.arrayRemove(classToEnt, entity)
	})
}

function ClassFromNative(ent: C_BaseEntity, name: string): Entity {
	{
		let constructor = NativeToSDK(ent instanceof C_DOTABaseAbility ? name : ent.constructor.name)
		if (constructor !== undefined)
			return new constructor(ent, name)
	}
	// TODO: automatically use Entity#Name/instanceof (instead of just comparing class names) here

	if (ent instanceof C_DOTA_BaseNPC_Tower)
		return new Tower(ent)

	if (ent instanceof C_DOTA_BaseNPC_Building)
		return new Building(ent)

	if (ent instanceof C_DOTA_BaseNPC_Hero)
		return new Hero(ent)

	if (ent instanceof C_DOTA_BaseNPC_Creep)
		return new Creep(ent)

	if (ent instanceof C_DOTA_BaseNPC)
		return new Unit(ent)

	if (ent instanceof C_DOTA_Item)
		return new Item(ent, name)

	if (ent instanceof C_DOTABaseAbility)
		return new Ability(ent, name)

	if (ent instanceof C_DOTA_Item_Physical)
		return new PhysicalItem(ent)

	return new Entity(ent)
}

/* ================ CHANGE FIELDS ================ */
function FireEntityEvents(ent: Entity) {
	EventsSDK.emit("LifeStateChanged", false, ent)
	if (ent instanceof Unit) {
		EventsSDK.emit("TeamVisibilityChanged", false, ent)
		EventsSDK.emit("NetworkActivityChanged", false, ent)
	}
}
