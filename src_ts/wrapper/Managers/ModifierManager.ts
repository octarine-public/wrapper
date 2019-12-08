import Events, { IModifier } from "./Events"

import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"
import EventsSDK from "./EventsSDK"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import Game from "../Objects/GameResources/GameRules"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import EntityManager from "./EntityManager"

let ActiveModifiersRaw = new Map<number, IModifier>(),
	ActiveModifiers = new Map<number, Modifier>()

function AddModifier(parent: Unit, mod: Modifier) {
	parent.Buffs.push(mod)
	changeFieldsByEvents(parent)
	EventsSDK.emit("ModifierCreated", false, mod)
}

function EmitModifierCreated(mod: IModifier) {
	if (mod.index === undefined || mod.serial_num === undefined || mod.parent === undefined)
		return
	if (mod.creation_time === undefined)
		mod.creation_time = Game.RawGameTime
	let mod_ = new Modifier(mod)
	if (mod_.Duration !== 0 && mod_.DieTime < Game.RawGameTime)
		return
	ActiveModifiers.set(mod_.SerialNumber, mod_)
	//console.log("Created " + mod_.SerialNumber)
	let parent = mod_.Parent
	if (parent !== undefined)
		AddModifier(parent, mod_)
	EventsSDK.emit("ModifierCreatedRaw", false, mod_)
}
EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		if (mod.Parent !== ent)
			return
		AddModifier(ent, mod)
	})
})
function EmitModifierRemoved(mod: Modifier) {
	ActiveModifiers.delete(mod.SerialNumber)
	let parent = mod.Parent
	if (parent !== undefined) {
		ArrayExtensions.arrayRemove(parent.Buffs, mod)
		changeFieldsByEvents(parent)
		EventsSDK.emit("ModifierRemoved", false, mod)
	}
	EventsSDK.emit("ModifierRemovedRaw", false, mod)
}
Events.on("EntityDestroyed", ent => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		if (mod.Parent?.m_pBaseEntity !== ent)
			return
		EmitModifierRemoved(mod)
	})
})
function EmitModifierChanged(old_mod: Modifier, mod: IModifier) {
	old_mod.m_pBuff = mod
	if (old_mod.Parent !== undefined)
		EventsSDK.emit("ModifierChanged", false, old_mod)
	EventsSDK.emit("ModifierChangedRaw", false, old_mod)
}
Events.on("ActiveModifiersChanged", map => {
	// loop-optimizer: KEEP
	map.forEach((mod, index) => {
		let replaced = ActiveModifiersRaw.get(index)
		if (replaced?.serial_num !== undefined && replaced.serial_num !== mod.serial_num) {
			let replaced_mod = ActiveModifiers.get(replaced.serial_num)
			if (replaced_mod !== undefined)
				EmitModifierRemoved(replaced_mod)
		}
		ActiveModifiersRaw.set(index, mod)
		let old_mod = ActiveModifiers.get(mod.serial_num)
		if (mod.entry_type === DOTA_MODIFIER_ENTRY_TYPE.DOTA_MODIFIER_ENTRY_TYPE_ACTIVE) {
			if (old_mod === undefined)
				EmitModifierCreated(mod)
			else
				EmitModifierChanged(old_mod, mod)
		} else if (old_mod !== undefined)
			EmitModifierRemoved(old_mod)
	})
})
Events.on("RemoveAllStringTables", () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => EmitModifierRemoved(mod))
	ActiveModifiers.clear()
})
EventsSDK.on("Tick", () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		if (mod.Duration !== 0 && mod.DieTime < Game.RawGameTime) // TODO: should it be <=?
			EmitModifierRemoved(mod)
	})
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

global.DebugBuffsParents = () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		let parent = EntityManager.EntityByHandle(mod.m_pBuff.parent)
		if (parent instanceof Unit)
			return
		console.log(parent?.m_pBaseEntity?.constructor?.name, mod.m_pBuff.parent, mod.Name, mod.ElapsedTime, mod.m_pBuff.entry_type)
	})
}

global.DebugBuffs = () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		console.log(mod.Parent?.m_pBaseEntity?.constructor?.name, mod.Name, mod.ElapsedTime, mod.Duration, mod.m_pBuff.entry_type)
	})
}
