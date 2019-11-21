import { arrayRemove } from "../Utils/ArrayExtensions"
import { addArrayInMap, removeArrayInMap } from "../Utils/MapExtensions"

import Events from "./Events"

import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"
import { default as EntityManager } from "./EntityManager"
import EventsSDK from "./EventsSDK"

let ModifierManager = new (class ModifierManager {
	public readonly AllModifiersUnit = new Map<Unit, Modifier[]>()
	public readonly AllModifier = new Map<CDOTA_Buff, Modifier>()

	public GetBuffsByUnit(ent: Unit): Modifier[] {
		if (!ent.IsValid)
			return []

		return this.AllModifiersUnit.get(ent) || []
	}
})()
export default ModifierManager

Events.on("BuffAdded", (npc, buffNative) => {
	const unit = EntityManager.GetEntityByNative(npc, true) as Unit

	if (unit === undefined)
		throw "onBuffAdded. entity undefined. " + npc + " " + buffNative

	const buff = new Modifier(buffNative, unit)

	ModifierManager.AllModifier.set(buffNative, buff)

	addAndEmitModifier(unit, buff)
})

Events.on("BuffRemoved", (npc, buffNative) => {
	const buff = ModifierManager.AllModifier.get(buffNative)

	if (buff === undefined)
		return

	ModifierManager.AllModifier.delete(buffNative)

	const unit = EntityManager.GetEntityByNative(npc, true) as Unit

	if (unit === undefined)
		throw "onBuffRemoved. entity undefined. " + npc + " " + buffNative

	DeleteFromCache(unit, buff)

	changeFieldsByEvents(unit)

	EventsSDK.emit("BuffRemoved", false, unit, buff)
})

function AddToCache(buff: Modifier, unit: Unit) {
	addArrayInMap(ModifierManager.AllModifiersUnit, unit, buff)

	unit.ModifiersBook.Buffs.push(buff)
}

function DeleteFromCache(unit: Unit, buff: Modifier) {
	buff.IsValid = false

	removeArrayInMap(ModifierManager.AllModifiersUnit, unit, buff)

	arrayRemove(unit.ModifiersBook.Buffs, buff)
}

function addAndEmitModifier(unit: Unit, buff: Modifier) {
	AddToCache(buff, unit)

	changeFieldsByEvents(unit)

	EventsSDK.emit("BuffAdded", false, unit, buff)
}

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
