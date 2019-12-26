import Events from "./Events"

import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"
import EventsSDK from "./EventsSDK"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import Game from "../Objects/GameResources/GameRules"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import EntityManager from "./EntityManager"
import { ParseProtobuf, ProtoType, ProtoDescription, ParseProtobufDescLine, RecursiveProtobuf } from "../Utils/ParseProtobuf"
import Vector3 from "../Base/Vector3"

export class IModifier {
	constructor(public readonly m_Protobuf: RecursiveProtobuf) {
		if (!this.m_Protobuf.has("creation_time"))
			this.m_Protobuf.set("creation_time", Game.RawGameTime)
	}
	public get EntryType(): Nullable<DOTA_MODIFIER_ENTRY_TYPE> {
		return this.GetProperty("entry_type")
	}
	public get Parent(): Nullable<number> {
		return this.GetProperty("parent")
	}
	public get Index(): Nullable<number> {
		return this.GetProperty("index")
	}
	public get SerialNum(): Nullable<number> {
		return this.GetProperty("serial_num")
	}
	public get ModifierClass(): Nullable<number> {
		return this.GetProperty("modifier_class")
	}
	public get AbilityLevel(): Nullable<number> {
		return this.GetProperty("ability_level")
	}
	public get StackCount(): Nullable<number> {
		return this.GetProperty("stack_count")
	}
	public get CreationTime(): Nullable<number> {
		return this.GetProperty("creation_time")
	}
	public get Duration(): Nullable<number> {
		return this.GetProperty("duration")
	}
	public get Caster(): Nullable<number> {
		return this.GetProperty("caster")
	}
	public get Ability(): Nullable<number> {
		return this.GetProperty("ability")
	}
	public get Armor(): Nullable<number> {
		return this.GetProperty("armor")
	}
	public get FadeTime(): Nullable<number> {
		return this.GetProperty("fade_time")
	}
	public get Subtle(): Nullable<boolean> {
		return this.GetProperty("subtle")
	}
	public get ChannelTime(): Nullable<number> {
		return this.GetProperty("channel_time")
	}
	public get vStart(): Nullable<Vector3> {
		return this.GetVector("v_start")
	}
	public get vEnd(): Nullable<Vector3> {
		return this.GetVector("v_end")
	}
	public get PortalLoopAppear(): Nullable<string> {
		return this.GetProperty("portal_loop_appear")
	}
	public get PortalLoopDisappear(): Nullable<string> {
		return this.GetProperty("portal_loop_disappear")
	}
	public get HeroLoopAppear(): Nullable<string> {
		return this.GetProperty("hero_loop_appear")
	}
	public get HeroLoopDisappear(): Nullable<string> {
		return this.GetProperty("hero_loop_disappear")
	}
	public get MovementSpeed(): Nullable<number> {
		return this.GetProperty("movement_speed")
	}
	public get IsAura(): Nullable<boolean> {
		return this.GetProperty("aura")
	}
	public get Activity(): Nullable<number> {
		return this.GetProperty("activity")
	}
	public get Damage(): Nullable<number> {
		return this.GetProperty("damage")
	}
	public get Range(): Nullable<number> {
		return this.GetProperty("range")
	}
	public get DDModifierIndex(): Nullable<number> {
		return this.GetProperty("dd_modifier_index")
	}
	public get DDAbilityID(): Nullable<number> {
		return this.GetProperty("dd_ability_id")
	}
	public get IllusionLevel(): Nullable<number> {
		return this.GetProperty("illusion_level")
	}
	public get IsActive(): Nullable<boolean> {
		return this.GetProperty("active")
	}
	public get PlayerIDs(): Nullable<string> {
		return this.GetProperty("player_ids")
	}
	public get LuaName(): Nullable<string> {
		return this.GetProperty("lua_name")
	}
	public get AttackSpeed(): Nullable<number> {
		return this.GetProperty("attack_speed")
	}
	public get AuraOwner(): Nullable<number> {
		return this.GetProperty("aura_owner")
	}
	public GetProperty<T>(name: string): Nullable<T> {
		return this.m_Protobuf.get(name) as any as T
	}
	public GetVector(name: string): Nullable<Vector3> {
		let vec = this.GetProperty<Map<string, number>>(name)
		if (vec === undefined)
			return undefined
		return new Vector3(vec.get("x"), vec.get("y"), vec.get("z"))
	}
}

let ActiveModifiersRaw = new Map<number, IModifier>(),
	ActiveModifiers = new Map<number, Modifier>()

function AddModifier(parent: Unit, mod: Modifier) {
	parent.Buffs.push(mod)
	changeFieldsByEvents(parent)
	EventsSDK.emit("ModifierCreated", false, mod)
}

function EmitModifierCreated(mod: IModifier) {
	if (mod.Index === undefined || mod.SerialNum === undefined || mod.Parent === undefined)
		return
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
const CMsgVector_desc = new Map<number, [/* name */ string, /* type */ ProtoType, /* proto description */ ProtoDescription?]>([
	[1, ["x", ProtoType.FLOAT32]],
	[2, ["y", ProtoType.FLOAT32]],
	[3, ["z", ProtoType.FLOAT32]],
])
const CDOTAModifierBuffTableEntry_desc = new Map<number, [/* name */ string, /* type */ ProtoType, /* proto description */ ProtoDescription?]>([
	[1, ["entry_type", ProtoType.ENUM]], // ParseProtobufDescLine("required .DOTA_MODIFIER_ENTRY_TYPE entry_type = 1"),
	ParseProtobufDescLine("required int32 parent = 2"),
	ParseProtobufDescLine("required int32 index = 3"),
	ParseProtobufDescLine("required int32 serial_num = 4"),
	ParseProtobufDescLine("optional int32 modifier_class = 5"),
	ParseProtobufDescLine("optional int32 ability_level = 6"),
	ParseProtobufDescLine("optional int32 stack_count = 7"),
	ParseProtobufDescLine("optional float creation_time = 8"),
	ParseProtobufDescLine("optional float duration = 9 [default = -1]"),
	ParseProtobufDescLine("optional int32 caster = 10"),
	ParseProtobufDescLine("optional int32 ability = 11"),
	ParseProtobufDescLine("optional int32 armor = 12"),
	ParseProtobufDescLine("optional float fade_time = 13"),
	ParseProtobufDescLine("optional bool subtle = 14"),
	ParseProtobufDescLine("optional float channel_time = 15"),
	[16, ["v_start", ProtoType.PROTO, CMsgVector_desc]], // ParseProtobufDescLine("optional .CMsgVector v_start = 16"),
	[17, ["v_end", ProtoType.PROTO, CMsgVector_desc]], // ParseProtobufDescLine("optional .CMsgVector v_end = 17"),
	ParseProtobufDescLine("optional string portal_loop_appear = 18"),
	ParseProtobufDescLine("optional string portal_loop_disappear = 19"),
	ParseProtobufDescLine("optional string hero_loop_appear = 20"),
	ParseProtobufDescLine("optional string hero_loop_disappear = 21"),
	ParseProtobufDescLine("optional int32 movement_speed = 22"),
	ParseProtobufDescLine("optional bool aura = 23"),
	ParseProtobufDescLine("optional int32 activity = 24"),
	ParseProtobufDescLine("optional int32 damage = 25"),
	ParseProtobufDescLine("optional int32 range = 26"),
	ParseProtobufDescLine("optional int32 dd_modifier_index = 27"),
	ParseProtobufDescLine("optional int32 dd_ability_id = 28"),
	ParseProtobufDescLine("optional string illusion_label = 29"),
	ParseProtobufDescLine("optional bool active = 30"),
	ParseProtobufDescLine("optional string player_ids = 31"),
	ParseProtobufDescLine("optional string lua_name = 32"),
	ParseProtobufDescLine("optional int32 attack_speed = 33"),
	ParseProtobufDescLine("optional int32 aura_owner = 34"),
])
export function OnActiveModifiersChanged(map: Map<number, [string, string]>) {
	// loop-optimizer: KEEP
	map.forEach(([_, mod_serialized], index) => {
		let mod = new IModifier(ParseProtobuf(mod_serialized, CDOTAModifierBuffTableEntry_desc))
		let replaced = ActiveModifiersRaw.get(index)
		if (replaced?.SerialNum !== undefined && replaced.SerialNum !== mod.SerialNum) {
			let replaced_mod = ActiveModifiers.get(replaced.SerialNum)
			if (replaced_mod !== undefined)
				EmitModifierRemoved(replaced_mod)
		}
		ActiveModifiersRaw.set(index, mod)
		let old_mod = ActiveModifiers.get(mod.SerialNum as number)
		if (mod.EntryType === DOTA_MODIFIER_ENTRY_TYPE.DOTA_MODIFIER_ENTRY_TYPE_ACTIVE) {
			if (old_mod === undefined)
				EmitModifierCreated(mod)
			else
				EmitModifierChanged(old_mod, mod)
		} else if (old_mod !== undefined)
			EmitModifierRemoved(old_mod)
	})
}
Events.on("RemoveAllStringTables", () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => EmitModifierRemoved(mod))
	ActiveModifiers.clear()
})
/*EventsSDK.on("Tick", () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		if (mod.Duration !== 0 && mod.DieTime < Game.RawGameTime) // TODO: should it be <=?
			EmitModifierRemoved(mod)
	})
})*/

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

declare global {
	var DebugBuffsParents: () => void
	var DebugBuffs: () => void
}

globalThis.DebugBuffsParents = () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		let parent = EntityManager.EntityByHandle(mod.m_pBuff.Parent)
		if (parent instanceof Unit)
			return
		console.log(parent?.m_pBaseEntity?.constructor?.name, mod.m_pBuff.Parent, mod.Name, mod.ElapsedTime, mod.m_pBuff.EntryType)
	})
}

globalThis.DebugBuffs = () => {
	// loop-optimizer: KEEP
	ActiveModifiers.forEach(mod => {
		console.log(mod.Parent?.m_pBaseEntity?.constructor?.name, mod.Name, mod.ElapsedTime, mod.Duration, mod.m_pBuff.EntryType)
	})
}
