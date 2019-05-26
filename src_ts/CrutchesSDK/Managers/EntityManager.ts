import { arrayRemove, arrayRemoveCallBack } from "../Utils/Utils";
//import Debug from "../Utils/Debug";
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
import item_bottle from "../Objects/Abilities/Items/item_bottle";
import item_power_treads from "../Objects/Abilities/Items/item_power_treads";

import PhysicalItem from "../Objects/Base/PhysicalItem";
import Rune from "../Objects/Base/Rune";
import Tree from "../Objects/Base/Tree";
import Building from "../Objects/Base/Building";
import Tower from "../Objects/Base/Tower";
import Shop from "../Objects/Base/Shop";

import PlayerResource from "../Objects/GameResources/PlayerResource";
import Game from "../Objects/GameResources/GameRules";


export { PlayerResource, Game }

let AllEntities: Entity[] = [];
let EntitiesIDs: Entity[] = [];
let InStage: Entity[] = [];

let LocalDOTAPlayerCache: Player;

class EntityManager {
	get LocalPlayer(): Player {
		return LocalDOTAPlayerCache 
			|| (LocalDOTAPlayerCache = findEntityNative(LocalDOTAPlayer) as Player);
	}
	get LocalHero(): Hero {
		let localPlayer = this.LocalPlayer;
		
		if (localPlayer === undefined)
			return undefined;
		return localPlayer.Hero;
	}
	get AllEntities(): Entity[] {
		return AllEntities;
	}
	get InStage(): Entity[] {
		return InStage;
	}
	IsValid(ent: Entity): boolean {
		return AllEntities.includes(ent)
	}
	EntityByIndex(index: number): Entity {
		return EntitiesIDs[index];
	}
	GetEntityIndex(ent: Entity): number {
		return findEntityIndex(ent);
	}
	GetPlayerByID(playerID: number): Player {
		return AllEntities.find(entity => entity instanceof Player && entity.ID === playerID) as Player;
	}
	GetEntityByNative(ent: C_BaseEntity, inStage: boolean = false): Entity {
		return findEntityNative(ent, inStage);
	}
	GetEntitiesByNative(ents: C_BaseEntity[], filter?: (value: Entity) => boolean): Entity[] {
		return findEntitiesNative(ents, filter);
	}
	GetEntitiesInRange(vec: Vector3, range: number): Entity[] {
		return AllEntities.filter(ent => ent.Position.Distance(vec) <= range)
	}
}

const entityManager = new EntityManager();

export default global.EntityManager = entityManager;


//Events.on("onGameStarted", () => { });
/* Events.on("onGameEnded", () => {
	LocalPlayer = undefined;
}); */

Events.on("onEntityCreated", (ent, index) => {
	//console.log("onEntityCreated", ent, index);
	
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

	EventsSDK.emit("onEntityPreCreated", false, entity, index);
	
	if (!CheckIsInStagingEntity(ent)) {
		InStage.push(entity);
		return;
	}
	
	AddToCache(entity);
})

Events.on("onEntityDestroyed", (ent, index) => {
	//console.log("onEntityDestroyed", ent, index);

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
		
		if (ent instanceof C_DOTAPlayer) {
			if (LocalDOTAPlayerCache !== undefined && LocalDOTAPlayerCache.m_pBaseEntity === ent)
				LocalDOTAPlayerCache = undefined;
		}
	}
	
	DeleteFromCache(ent, index);
});

(function onUpdate() {
	setTimeout(0, () => {
		//console.log(1);
		try {
			for (let i = InStage.length; i--;) {

				let entity = InStage[i];
				
				if (CheckIsInStagingEntity(entity.m_pBaseEntity)) {
					//console.log("onEntityCreated_Loaded", entity, entity.m_pBaseEntity, entity.Index);
					InStage.splice(i, 1);
					AddToCache(entity);
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			onUpdate();
		}
	})
})();


function AddToCache(entity: Entity) {
	const index = entity.Index;

	entity.IsValid = true;

	EntitiesIDs[index] = entity;
	AllEntities.push(entity);

	EventsSDK.emit("onEntityCreated", false, entity, index);
}

function DeleteFromCache(ent: C_BaseEntity, index: number) {
	
	if (arrayRemoveCallBack(InStage, npc => npc.m_pBaseEntity === ent))
		return;
	
	const entity = EntitiesIDs[index];

	entity.IsValid = false;
	
	delete EntitiesIDs[index];
	
	arrayRemoveCallBack(AllEntities, npc => npc.m_pBaseEntity === ent);
	
	EventsSDK.emit("onEntityDestroyed", false, entity, index);
}

function CheckIsInStagingEntity(ent: C_BaseEntity) {
	return (ent.m_pEntity.m_flags & (1 << 2)) === 0;
}

function findEntityIndex(el: Entity): number {
	if (el === undefined) 
		return -1;
		
	return AllEntities.indexOf(el);
}

/* function findEntityNativeIndex(el: C_BaseEntity): number {
	if (el === undefined)
		return -1;

	return AllEntities.findIndex(entity => entity.m_pBaseEntity === el);
} */

function findEntityNative(el: C_BaseEntity, inStage: boolean = false): Entity {
	if (el === undefined)
		return undefined;

	let entity = AllEntities.find(entity => entity.m_pBaseEntity === el);
	
	if (entity !== undefined)
		return entity

	return inStage ? InStage.find(entity => entity.m_pBaseEntity === el) : undefined
}

function findEntitiesNative(ents: C_BaseEntity[], filter?: (value: Entity) => boolean): Entity[] {
	
	let entities: Entity[] = []

	ents.forEach(entNative => {
		
		let entity = AllEntities.find(entity => 
			(entity.m_pBaseEntity === entNative) || !(filter !== undefined && filter(entity) === false));
		
		if (entity === undefined)
			entity = InStage.find(entity =>
				(entity.m_pBaseEntity === entNative) || !(filter !== undefined && filter(entity) === false));
		
		if (entity !== undefined)
			entities.push(entity);
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
	
	if (ent instanceof C_DOTABaseAbility) {
		
		if (ent instanceof C_DOTA_Item) {
			
			if (ent instanceof C_DOTA_Item_EmptyBottle)
				return new item_bottle(ent, index);
				
			if (ent instanceof C_DOTA_Item_PowerTreads)
				return new item_power_treads(ent, index);
			
			return new Item(ent, index);
		}
		
		return new Ability(ent, index);
	}
	
	if (ent instanceof C_DOTA_Item_Physical)
		return new PhysicalItem(ent, index);
	
	if (ent instanceof C_DOTA_Item_Rune)
		return new Rune(ent, index);
	
	if (ent instanceof C_DOTA_MapTree)
		return new Tree(ent, index);
		
	if (ent instanceof C_DOTA_MapTree)
		return new Tree(ent, index);
		
	return new Entity(ent, index);
}
