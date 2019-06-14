import { arrayRemove } from "../Utils/ArrayExtensions";

//import * as Debug from "../Utils/Debug";
import Benchmark from "../Utils/BenchMark";

import EventsSDK from "./Events";

import Vector3 from "../Base/Vector3";

import Entity from "../Objects/Base/Entity";
import Unit from "../Objects/Base/Unit";
import Hero from "../Objects/Base/Hero";
import Player from "../Objects/Base/Player";
import Courier from "../Objects/Base/Courier";
import Creep from "../Objects/Base/Creep";
import Meepo from "../Objects/Heroes/Meepo";

import Ability from "../Objects/Base/Ability";
import Item from "../Objects/Base/Item";
import ItemToNative from "../Objects/Abilities/Items/ItemToNative";

import { useQueueModifiers } from "./ModifierManager";

import PhysicalItem from "../Objects/Base/PhysicalItem";
import Rune from "../Objects/Base/Rune";
import Tree from "../Objects/Base/Tree";
import Building from "../Objects/Base/Building";
import Tower from "../Objects/Base/Tower";
import Shop from "../Objects/Base/Shop";

import PlayerResource from "../Objects/GameResources/PlayerResource";
import Game from "../Objects/GameResources/GameRules";

export { PlayerResource, Game }

//let queueEntities: Entity[] = []; 
let queueEntitiesAsMap = new Map<C_BaseEntity, Entity>();

let AllEntities: Entity[] = [];
let EntitiesIDs: Entity[] = [];
let AllEntitiesAsMap = new Map<C_BaseEntity, Entity>();
let InStage = new Map<C_BaseEntity, Entity>();

export let LocalPlayer: Player;

class EntityManager {
	get LocalPlayer(): Player {
		return LocalPlayer
	}
	get LocalHero(): Hero {
		return LocalPlayer !== undefined ? LocalPlayer.Hero : undefined;
	}
	get AllEntities(): Entity[] {
		return AllEntities.slice();
	}
	EntityByIndex(index: number): Entity {
		return EntitiesIDs[index];
	}
	GetPlayerByID(playerID: number): Player {
		if (playerID === -1)
			return undefined;
		return AllEntities.find(entity => entity instanceof Player && entity.PlayerID === playerID) as Player;
	}
	GetEntityByNative(ent: C_BaseEntity, inStage: boolean = false): Entity {
		return findEntityNative(ent, inStage);
	}
	GetEntitiesByNative(ents: C_BaseEntity[], inStage: boolean = false): Entity[] {
		return findEntitiesNative(ents, inStage);
	}
	GetEntitiesInRange(vec: Vector3, range: number, filter?: (value: Entity) => boolean): Entity[] {
		return AllEntities.filter(entity => entity.Position.Distance(vec) <= range 
			|| !(filter === undefined || filter(entity) === false));
	}
}

const entityManager = new EntityManager();

export default global.EntityManager = entityManager;

Events.on("onLocalPlayerTeamAssigned", teamNum => {
	LocalPlayer = findEntityNative(LocalDOTAPlayer, true) as Player;

	useQueueEntities();

	EventsSDK.emit("onLocalPlayerTeamAssigned", false, teamNum);
})

Events.on("onEntityCreated", (ent, index) => {

	{ // add globals
		if (ent instanceof C_DOTA_PlayerResource) {
			PlayerResource.m_pBaseEntity = ent;
			PlayerResource.m_iIndex = index;
			return;
		}
		
		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = ent.m_pGameRules;
			return;
		}
		
		if (ent instanceof C_DOTAGameManagerProxy) {
			Game.m_GameManager = undefined;
			return;
		}
	}

	const entity = ClassFromNative(ent, index);
	
	if (LocalPlayer === undefined) {
		queueEntitiesAsMap.set(ent, entity);
		return;
	}
	
	AddToCache(entity);
})

Events.on("onEntityDestroyed", (ent, index) => {

	{ // delete global
		if (ent instanceof C_DOTA_PlayerResource) {
			PlayerResource.m_pBaseEntity = undefined;
			return;
		}

		if (ent instanceof C_DOTAGamerulesProxy) {
			Game.m_GameRules = undefined;
			return;
		}

		if (ent instanceof C_DOTAGameManagerProxy) {
			Game.m_GameManager = undefined;
			return;
		}
		
		if (ent instanceof C_DOTAPlayer && LocalPlayer !== undefined && LocalPlayer.m_pBaseEntity === ent)
			LocalPlayer = undefined;
	}
	
	DeleteFromCache(ent, index);
});

/* ================ RUNTIME CACHE ================ */

let CheckIsInStagingEntity = (ent: C_BaseEntity) => {
	// need find the best way
	if (ent instanceof C_DOTA_BaseNPC_Additive && ent.m_iUnitType === 0)
		return false;
	
	return (ent.m_pEntity.m_flags & (1 << 2)) === 0;
};

setInterval(() => {
	
	if (InStage.size === 0)
		return;
	
	// loop-optimizer: KEEP	// because this is Map
	InStage.forEach((entity, baseEntity) => {
		if (!CheckIsInStagingEntity(baseEntity))
			return;
		InStage.delete(baseEntity);
		AddToCache(entity)
	});
}, 0);

function AddToCache(entity: Entity) {
	//console.log("onEntityPreCreated SDK", entity.m_pBaseEntity, entity.Index);
	EventsSDK.emit("onEntityPreCreated", false, entity, entity.Index);

	if (!CheckIsInStagingEntity(entity.m_pBaseEntity)) {
		InStage.set(entity.m_pBaseEntity, entity);
		return;
	}
	
	const index = entity.Index;

	entity.IsValid = true;
	
	AllEntitiesAsMap.set(entity.m_pBaseEntity, entity);
	EntitiesIDs[index] = entity;
	AllEntities.push(entity);
	
	changeFieldsByEvents(entity as Unit);
	
	//console.log("onEntityCreated SDK", entity, entity.m_pBaseEntity, index);
	EventsSDK.emit("onEntityCreated", false, entity, index);
}

function DeleteFromCache(entNative: C_BaseEntity, index: number) {
	
	if (queueEntitiesAsMap.delete(entNative) || InStage.delete(entNative))
		return;
	
	const entity = AllEntitiesAsMap.get(entNative); // EntitiesIDs[index]; ???

	entity.IsValid = false;
	
	AllEntitiesAsMap.delete(entNative);
	delete EntitiesIDs[index];
	arrayRemove(AllEntities, entity);
	
	//console.log("onEntityDestroyed SDK", entity, entity.m_pBaseEntity, index);
	EventsSDK.emit("onEntityDestroyed", false, entity, index);
}

function findEntityNative(ent: C_BaseEntity, inStage: boolean = false): Entity {
	if (ent === undefined)
		return undefined;

	let entityFind = AllEntitiesAsMap.get(ent)
		
	if (entityFind !== undefined)
		return entityFind
	
	if (!inStage)
		return undefined;
		
	entityFind = InStage.get(ent)
	
	if (entityFind !== undefined)
		return entityFind
			
	return queueEntitiesAsMap.get(ent);
}

function findEntitiesNative(ents: C_BaseEntity[], inStage: boolean = false): Entity[] {
	
	let entities: Entity[] = []

	// loop-optimizer: FORWARD
	ents.forEach(entNative => {
		
		let entityFind = AllEntitiesAsMap.get(entNative)

		if (entityFind === undefined && inStage) {
			
			entityFind = InStage.get(entNative)

			if (entityFind === undefined)
				entityFind = queueEntitiesAsMap.get(entNative);
		}
	
		if (entityFind !== undefined)
			entities.push(entityFind);
	})
	
	return entities;
}

function ClassFromNative(ent: C_BaseEntity, index: number) {
	
	if (ent instanceof C_DOTAPlayer)
		return new Player(ent, index);

	if (ent instanceof C_DOTA_BaseNPC) {
		
		if (ent instanceof C_DOTA_BaseNPC_Building) {
			
			if (ent instanceof C_DOTA_BaseNPC_Tower)
				return new Tower(ent, index);
			
			if (ent instanceof C_DOTA_BaseNPC_Shop)
				return new Shop(ent, index);
			
			return new Building(ent, index);
		}
		
		if (ent instanceof C_DOTA_BaseNPC_Hero) {

			if (ent instanceof C_DOTA_Unit_Hero_Meepo)
				return new Meepo(ent, index);

			return new Hero(ent, index);
		}
		
		if (ent instanceof C_DOTA_Unit_Courier)
			return new Courier(ent, index);

		if (ent instanceof C_DOTA_BaseNPC_Creep)
			return new Creep(ent, index);
			
		return new Unit(ent, index);
	}

	if (ent instanceof C_DOTA_Item) {
		let constructor = ItemToNative[ent.constructor.name];
		if (constructor !== undefined)
			return constructor(ent, index);
		return new Item(ent, index);
	}
	
	if (ent instanceof C_DOTABaseAbility)
		return new Ability(ent, index);
	
	if (ent instanceof C_DOTA_Item_Physical)
		return new PhysicalItem(ent, index);
	
	if (ent instanceof C_DOTA_Item_Rune)
		return new Rune(ent, index);
	
	if (ent instanceof C_DOTA_MapTree)
		return new Tree(ent, index);
		
	return new Entity(ent, index);
}

/* ================ QUEUE CACHE ================ */

function useQueueEntities() {
	if (queueEntitiesAsMap.size === 0)
		return;
		
	// loop-optimizer: KEEP	// because this is Map
	queueEntitiesAsMap.forEach(entity => {
		AddToCache(entity);

		if (entity instanceof Unit)
			useQueueModifiers(entity);
	});
		
	queueEntitiesAsMap.clear();
}

/* ================ CHANGE FIELDS ================ */

function changeFieldsByEvents(unit: Unit) {
	if (!(unit instanceof Unit))
		return;
		
	const visibleTagged = unit.IsVisibleForTeamMask;

	if (visibleTagged > 0) {
		
		const isVisibleForEnemies = Unit.IsVisibleForEnemies(unit, visibleTagged);
		unit.IsVisibleForEnemies = isVisibleForEnemies;

		EventsSDK.emit("onTeamVisibilityChanged", false, unit, isVisibleForEnemies, visibleTagged)
	}
}