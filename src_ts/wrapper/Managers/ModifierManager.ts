import { arrayRemove } from "../Utils/ArrayExtensions"

import Events from "./Events"

import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"
import { default as EntityManager } from "./EntityManager"
import EventsSDK from "./EventsSDK"

let ModifierCache = new Map<CDOTA_Buff, C_BaseEntity>()
let AllModifiers = new Map<CDOTA_Buff, Modifier>()

function AddBuff(buffNative: CDOTA_Buff, unit: Unit) {
	const buff = new Modifier(buffNative, unit)
	AllModifiers.set(buffNative, buff)
	unit.ModifiersBook.Buffs.push(buff)
	changeFieldsByEvents(unit)
	EventsSDK.emit("BuffAdded", false, unit, buff)
}

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	let native_ent = ent.m_pBaseEntity
	for (let [buff, ent_] of ModifierCache.entries()) {
		if (ent_ !== native_ent)
			continue
		ModifierCache.delete(buff)
		AddBuff(buff, ent)
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit))
		return
	let native_ent = ent.m_pBaseEntity
	for (let [buff, ent_] of ModifierCache.entries())
		if (ent_ === native_ent)
			ModifierCache.delete(buff)
})
Events.on("EntityDestroyed", ent => {
	for (let [buff, ent_] of ModifierCache.entries())
		if (ent_ === ent)
			ModifierCache.delete(buff)
})

global.DebugModifierLeak = () => console.log(ModifierCache.size)

Events.on("BuffAdded", (ent, buffNative) => {
	const unit = EntityManager.GetEntityByNative(ent) as Unit
	if (unit === undefined) {
		ModifierCache.set(buffNative, ent)
		return
	}
	AddBuff(buffNative, unit)
})

Events.on("BuffRemoved", (npc, buffNative) => {
	let buff = AllModifiers.get(buffNative)
	if (buff === undefined) {
		ModifierCache.delete(buffNative)
		return
	}

	AllModifiers.delete(buffNative)

	const unit = EntityManager.GetEntityByNative(npc) as Unit

	if (unit === undefined)
		throw "onBuffRemoved. entity undefined. " + npc + " " + buffNative

	buff.IsValid = false
	arrayRemove(unit.ModifiersBook.Buffs, buff)
	changeFieldsByEvents(unit)
	EventsSDK.emit("BuffRemoved", false, unit, buff)
})

function changeFieldsByEvents(unit: Unit) {
	const buffs = unit.ModifiersBook.Buffs

	{ // IsTrueSightedForEnemies
		const lastIsTrueSighted = unit.IsTrueSightedForEnemies
		const isTrueSighted = Modifier.HasTrueSightBuff(buffs)

		if (isTrueSighted !== lastIsTrueSighted) {
			unit.IsTrueSightedForEnemies = isTrueSighted
			EventsSDK.emit("TrueSightedChanged", false, unit)
		}
	}

	{ // HasScepter
		const lastHasScepter = unit.HasScepter
		const hasScepter = Modifier.HasScepterBuff(buffs)

		if (hasScepter !== lastHasScepter) {
			unit.HasScepterModifier = hasScepter
			EventsSDK.emit("HasScepterChanged", false, unit)
		}
	}
}
