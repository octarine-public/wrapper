import { arrayRemove } from "../Utils/ArrayExtensions";
import { addArrayInMap, findArrayInMap, removeArrayInMap } from "../Utils/MapExtensions";

import EventsSDK from "./Events";

import Modifier from "../Objects/Base/Modifier";
import Unit from "../Objects/Base/Unit";
import { default as EntityManager, LocalPlayer } from "./EntityManager";

let queueModifiers = new Map<Unit, Modifier[]>();
let AllModifiersUnit = new Map<Unit, Modifier[]>();
let AllModifier = new Map<CDOTA_Buff, Modifier>()

class ModifierManager {
	GetBuffsByUnit(ent: Unit): Modifier[] {
		if (!ent.IsValid)
			return [];

		return AllModifiersUnit.get(ent) || [];
	}
}

export default new ModifierManager();

Events.on("BuffAdded", (npc, buffNative) => {

	const unit = EntityManager.GetEntityByNative(npc, true) as Unit;
	
	if (unit === undefined)
		throw Error("onBuffAdded. entity undefined. " + npc + " " + buffNative)

	const buff = new Modifier(buffNative, unit);

	AllModifier.set(buffNative, buff);
	
	if (LocalPlayer === undefined) {
		addArrayInMap(queueModifiers, unit, buff);
		return;
	}
	
	addAndEmitModifier(unit, buff);
})

Events.on("BuffRemoved", (npc, buffNative) => {

	const buff = AllModifier.get(buffNative);
	
	if (buff === undefined)
		return
	
	AllModifier.delete(buffNative);
	
	const unit = EntityManager.GetEntityByNative(npc, true) as Unit;
	
	if (unit === undefined)
		throw Error("onBuffRemoved. entity undefined. " + npc + " " + buffNative)
	
	if (removeArrayInMap(queueModifiers, unit, buff))
		return;

	DeleteFromCache(unit, buff);
	
	changeFieldsByEvents(unit);
	
	EventsSDK.emit("BuffRemoved", false, unit, buff);
})

function AddToCache(buff: Modifier, unit: Unit) {
	
	addArrayInMap(AllModifiersUnit, unit, buff);

	unit.ModifiersBook.m_Buffs.push(buff);
}

function DeleteFromCache(unit: Unit, buff: Modifier) {

	buff.IsValid = false;
	
	removeArrayInMap(AllModifiersUnit, unit, buff)
	
	arrayRemove(unit.ModifiersBook.m_Buffs, buff);
}

function addAndEmitModifier(unit: Unit, buff: Modifier) {
	AddToCache(buff, unit);

	changeFieldsByEvents(unit);

	EventsSDK.emit("BuffAdded", false, unit, buff);
}

export function useQueueModifiers(owner: Unit) {
	if (queueModifiers.size === 0)
		return;

	let buffs = queueModifiers.get(owner);

	if (buffs === undefined)
		return;
	// loop-optimizer: KEEP	// because this is Map
	buffs.forEach(buff => addAndEmitModifier(owner, buff));
}

function changeFieldsByEvents(unit: Unit) {
	
	const buffs = unit.ModifiersBook.m_Buffs;

	{ // IsTrueSightedForEnemies
		const lastIsTrueSighted = unit.IsTrueSightedForEnemies;
		const isTrueSighted = Modifier.HasTrueSightBuff(buffs);

		if (isTrueSighted !== lastIsTrueSighted) {
			unit.IsTrueSightedForEnemies = isTrueSighted;
			EventsSDK.emit("TrueSightedChanged", false, unit, isTrueSighted);
		}
	}
	
	{ // HasScepter
		const lastHasScepter = unit.HasScepter;
		const hasScepter = Modifier.HasScepterBuff(buffs);

		if (hasScepter !== lastHasScepter) {
			unit.HasScepter = hasScepter;
			EventsSDK.emit("HasScepterChanged", false, unit, hasScepter);
		}
	}
}