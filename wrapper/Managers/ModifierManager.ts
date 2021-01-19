import Vector3 from "../Base/Vector3"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import Modifier from "../Objects/Base/Modifier"
import Unit from "../Objects/Base/Unit"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import GameState from "../Utils/GameState"
import { ParseProtobufDesc, ParseProtobufNamed, RecursiveProtobuf } from "../Utils/Protobuf"
import EntityManager from "./EntityManager"
import EventsSDK from "./EventsSDK"

export class IModifier {
	constructor(public readonly m_Protobuf: RecursiveProtobuf) {
		if (!this.m_Protobuf.has("creation_time"))
			this.m_Protobuf.set("creation_time", GameState.RawGameTime)
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
	public get CreationTime(): number {
		return this.GetProperty("creation_time") as number
	}
	public get Duration(): number {
		return this.GetProperty("duration") as number
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
	public get DDModifierID(): Nullable<number> {
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
		const vec = this.GetProperty<Map<string, number>>(name)
		if (vec === undefined)
			return undefined
		return new Vector3(vec.get("x"), vec.get("y"), vec.get("z"))
	}
}

const ActiveModifiersRaw = new Map<number, IModifier>(),
	ActiveModifiers = new Map<number, Modifier>()

function AddModifier(parent: Unit, mod: Modifier) {
	parent.Buffs.push(mod)
	changeFieldsByEvents(parent)
	EventsSDK.emit("ModifierCreated", false, mod)
}

function EmitModifierCreated(mod: IModifier) {
	if (mod.Index === undefined || mod.SerialNum === undefined || mod.Parent === undefined)
		return
	const mod_ = new Modifier(mod)
	const time = GameState.RawGameTime
	if (mod_.Duration !== -1 && mod_.DieTime < time)
		return
	ActiveModifiers.set(mod_.SerialNumber, mod_)
	//console.log("Created " + mod_.SerialNumber)
	const parent = mod_.Parent
	if (parent !== undefined)
		AddModifier(parent, mod_)
	EventsSDK.emit("ModifierCreatedRaw", false, mod_)
}
EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	ActiveModifiers.forEach(mod => {
		if (mod.Parent !== ent)
			return
		AddModifier(ent, mod)
	})
})
function EmitModifierRemoved(mod: Modifier) {
	ActiveModifiers.delete(mod.SerialNumber)
	const parent = mod.Parent
	if (parent !== undefined) {
		ArrayExtensions.arrayRemove(parent.Buffs, mod)
		changeFieldsByEvents(parent)
		EventsSDK.emit("ModifierRemoved", false, mod)
	}
	EventsSDK.emit("ModifierRemovedRaw", false, mod)
}
EventsSDK.on("EntityDestroyed", ent => {
	ActiveModifiers.forEach(mod => {
		if (mod.Parent !== ent)
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
ParseProtobufDesc(`
enum DOTA_MODIFIER_ENTRY_TYPE {
	DOTA_MODIFIER_ENTRY_TYPE_ACTIVE = 1;
	DOTA_MODIFIER_ENTRY_TYPE_REMOVED = 2;
}

message CDOTAModifierBuffTableEntry {
	required .DOTA_MODIFIER_ENTRY_TYPE entry_type = 1;
	required int32 parent = 2;
	required int32 index = 3;
	required int32 serial_num = 4;
	optional int32 modifier_class = 5;
	optional int32 ability_level = 6;
	optional int32 stack_count = 7;
	optional float creation_time = 8;
	optional float duration = 9 [default = -1];
	optional int32 caster = 10;
	optional int32 ability = 11;
	optional int32 armor = 12;
	optional float fade_time = 13;
	optional bool subtle = 14;
	optional float channel_time = 15;
	optional .CMsgVector v_start = 16;
	optional .CMsgVector v_end = 17;
	optional string portal_loop_appear = 18;
	optional string portal_loop_disappear = 19;
	optional string hero_loop_appear = 20;
	optional string hero_loop_disappear = 21;
	optional int32 movement_speed = 22;
	optional bool aura = 23;
	optional int32 activity = 24;
	optional int32 damage = 25;
	optional int32 range = 26;
	optional int32 dd_modifier_index = 27;
	optional int32 dd_ability_id = 28;
	optional string illusion_label = 29;
	optional bool active = 30;
	optional string player_ids = 31;
	optional string lua_name = 32;
	optional int32 attack_speed = 33;
	optional int32 aura_owner = 34;
}
`)
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (name !== "ActiveModifiers")
		return
	update.forEach(([_, mod_serialized], index) => {
		const replaced = ActiveModifiersRaw.get(index)
		if (mod_serialized.length === 0 && replaced?.SerialNum !== undefined) {
			const replaced_mod = ActiveModifiers.get(replaced.SerialNum)
			if (replaced_mod !== undefined)
				EmitModifierRemoved(replaced_mod)
			return
		}
		const mod = new IModifier(ParseProtobufNamed(mod_serialized, "CDOTAModifierBuffTableEntry"))
		if (replaced?.SerialNum !== undefined && replaced.SerialNum !== mod.SerialNum) {
			const replaced_mod = ActiveModifiers.get(replaced.SerialNum)
			if (replaced_mod !== undefined)
				EmitModifierRemoved(replaced_mod)
		}
		ActiveModifiersRaw.set(index, mod)
		const old_mod = ActiveModifiers.get(mod.SerialNum as number)
		if (mod.EntryType === DOTA_MODIFIER_ENTRY_TYPE.DOTA_MODIFIER_ENTRY_TYPE_ACTIVE) {
			if (old_mod === undefined)
				EmitModifierCreated(mod)
			else
				EmitModifierChanged(old_mod, mod)
		} else if (old_mod !== undefined)
			EmitModifierRemoved(old_mod)
	})
})
EventsSDK.on("RemoveAllStringTables", () => {
	ActiveModifiers.forEach(mod => EmitModifierRemoved(mod))
	ActiveModifiers.clear()
})
/*EventsSDK.on("Tick", () => {
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
	ActiveModifiers.forEach(mod => {
		const parent = EntityManager.EntityByIndex(mod.m_pBuff.Parent)
		if (parent instanceof Unit)
			return
		console.log(parent?.ClassName, mod.m_pBuff.Parent, mod.Name, mod.ElapsedTime, mod.m_pBuff.EntryType)
	})
}

globalThis.DebugBuffs = () => {
	ActiveModifiers.forEach(mod => {
		console.log(mod.Parent?.constructor?.name, mod.Name, mod.ElapsedTime, mod.Duration, mod.m_pBuff.EntryType)
	})
}
