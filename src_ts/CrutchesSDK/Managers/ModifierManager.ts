import { arrayRemove, arrayRemoveCallBack } from "../Utils/Utils";

import EventsSDK from "./Events";

import Modifier from "../Objects/Base/Modifier";
import Unit from "../Objects/Base/Unit";
import EntityManager from "./EntityManager";


let AllModifiers: Modifier[] = [];
let AllModifiersUnit: Array<[Modifier, Unit]> = [];
//let inStageEnt: CDOTA_Buff[] = [];

class ModifierManager {
	
	IsValid(buff: Modifier) {
		return AllModifiers.includes(buff);
	}
	GetBuffsByUnit(ent: Unit): Modifier[] {
		
		let buffs: Modifier[] = [];

		if (ent.IsValid) {
			
			for (let i = 0, len = AllModifiersUnit.length; i < len; i++) {
				
				let [buff, unit] = AllModifiersUnit[i];
				
				if (unit === ent /*&& !buff.m_pBuff.m_bMarkedForDeletion*/)
					buffs.push(buff);
			}
		}
		return buffs;
	}
	GetModifierByNative(buff: CDOTA_Buff): Modifier {
		return findModifierNative(buff);
	}
}

const modifierManager = new ModifierManager();

export default global.ModifierManager = modifierManager;

/* EventsSDK.on("onTick", () => {

	for (let i = tempBuffs.length; i--;) {
		
		let entity = EntityManager.GetEntityByNative(tempBuffs[i].m_hParent);
		
		if (entity !== undefined) {

			
			
			EventsSDK.emit("onEntityCreated", false, entity, id);
			tempBuffs.splice(i, 1);
		}
	}
}); */

Events.on("onBuffAdded", (npc, buffNative) => {
	//console.log("onBuffAdded", npc, buffNative, buffNative.m_iIndex);
	const entity = EntityManager.GetEntityByNative(npc, true) as Unit;
	
	if (entity === undefined)
		throw Error("onBuffAdded. entity undefined. " + npc + " " + buffNative)

	entity.ModifiersBook.m_hBuffs.push(buffNative);
	
	const buff = AddToCache(entity, buffNative);
	
	EventsSDK.emit("onBuffAdded", false, entity, buff);
})

Events.on("onBuffRemoved", (npc, buffNative) => {
	//console.log("onBuffRemoved", npc, buffNative, buffNative.m_iIndex);
	const entity = EntityManager.GetEntityByNative(npc, true) as Unit;
	
	if (entity === undefined)
		throw Error("onBuffRemoved. entity undefined. " + npc + " " + buffNative)
	
	arrayRemove(entity.ModifiersBook.m_hBuffs, buffNative);
		
	const buff = DeleteFromCache(entity, buffNative);
	
	if (buff === undefined)
		throw Error("onBuffRemoved. buff undefined. " + npc + " " + buffNative)
	
	EventsSDK.emit("onBuffRemoved", false, entity, buff);
})

function AddToCache(unit: Unit, buffNative: CDOTA_Buff) {
	//console.log("onEntityCreated", ent, id);

	const buff = new Modifier(buffNative, unit);

	AllModifiersUnit.push([buff, unit]);
	AllModifiers.push(buff);
	
	return buff;
}

function DeleteFromCache(npc: Unit, buffNative: CDOTA_Buff): Modifier {
	//console.log("onEntityDestroyed", ent, id);

	const buff = findModifierNative(buffNative);
	
	arrayRemoveCallBack(AllModifiers, buff => buff.m_pBuff === buffNative);
	arrayRemoveCallBack(AllModifiersUnit, ([buff, unit]) => buff.m_pBuff === buffNative && unit === npc);
	
	return buff;
}


function findModifierNative(el: CDOTA_Buff): Modifier {
	if (el === undefined)
		return undefined;

	return AllModifiers.find(buff => buff.m_pBuff === el);
}