import { Vector3 } from "../Base/Vector3"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import { Ability } from "../Objects/Base/Ability"
import { Modifier } from "../Objects/Base/Modifier"
import { Unit } from "../Objects/Base/Unit"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import { GameState } from "../Utils/GameState"
import {
	ParseProtobufDesc,
	ParseProtobufNamed,
	RecursiveProtobuf,
} from "../Utils/Protobuf"
import { EventsSDK } from "./EventsSDK"

export class IModifier {
	constructor(public readonly kv: RecursiveProtobuf) {
		if (!this.kv.has("creation_time"))
			this.kv.set("creation_time", GameState.RawGameTime)
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
	public get BonusAllStats(): Nullable<number> {
		return this.GetProperty("bonus_all_stats")
	}
	public get BonusHealth(): Nullable<number> {
		return this.GetProperty("bonus_health")
	}
	public get BonusMana(): Nullable<number> {
		return this.GetProperty("bonus_mana")
	}
	public get CustomEntity(): Nullable<number> {
		return this.GetProperty("custom_entity")
	}
	public GetProperty<T>(name: string): Nullable<T> {
		return this.kv.get(name) as any as T
	}
	public GetVector(name: string): Nullable<Vector3> {
		const vec = this.GetProperty<Map<string, number>>(name)
		if (vec === undefined) return undefined
		return new Vector3(vec.get("x"), vec.get("y"), vec.get("z"))
	}
}

const activeModifiersRaw = new Map<number, IModifier>(),
	activeModifiers = new Map<number, Modifier>()

function EmitModifierCreated(modKV: IModifier) {
	if (
		modKV.Index === undefined ||
		modKV.SerialNum === undefined ||
		modKV.Parent === undefined
	)
		return
	const mod = new Modifier(modKV)
	activeModifiers.set(mod.SerialNumber, mod)
	mod.Update()
}
const queuedEnts: (Unit | Ability)[] = []
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Unit || ent instanceof Ability) queuedEnts.push(ent)
})
EventsSDK.on("EntityDestroyed", ent =>
	ArrayExtensions.arrayRemove(queuedEnts, ent)
)
EventsSDK.on("PostDataUpdate", () => {
	if (queuedEnts.length === 0) return
	for (const ent of queuedEnts) {
		if (ent instanceof Unit)
			for (const mod of activeModifiers.values())
				if (
					ent.HandleMatches(mod.kv.Parent ?? 0) ||
					ent.HandleMatches(mod.kv.Caster ?? 0) ||
					ent.HandleMatches(mod.kv.AuraOwner ?? 0) ||
					ent.HandleMatches(mod.kv.CustomEntity ?? 0)
				)
					mod.Update()
		if (ent instanceof Ability)
			for (const mod of activeModifiers.values())
				if (ent.HandleMatches(mod.kv.Ability ?? 0)) mod.Update()
	}
	queuedEnts.splice(0)
})
function EmitModifierRemoved(mod: Modifier) {
	activeModifiers.delete(mod.SerialNumber)
	mod.Remove()
}
EventsSDK.on("EntityDestroyed", ent => {
	for (const mod of activeModifiers.values())
		if (
			mod.Parent === ent ||
			mod.Ability === ent ||
			mod.Caster === ent ||
			mod.AuraOwner === ent
		)
			mod.Update()
})
function EmitModifierChanged(oldMod: Modifier, mod: IModifier) {
	oldMod.kv = mod
	oldMod.Update()
}
ParseProtobufDesc(`
enum DOTA_MODIFIER_ENTRY_TYPE {
	DOTA_MODIFIER_ENTRY_TYPE_ACTIVE = 1;
	DOTA_MODIFIER_ENTRY_TYPE_REMOVED = 2;
}

message CDOTAModifierBuffTableEntry {
	required .DOTA_MODIFIER_ENTRY_TYPE entry_type = 1 [default = DOTA_MODIFIER_ENTRY_TYPE_ACTIVE];
	required uint32 parent = 2 [default = 16777215];
	required int32 index = 3;
	required int32 serial_num = 4;
	optional int32 modifier_class = 5;
	optional int32 ability_level = 6;
	optional int32 stack_count = 7;
	optional float creation_time = 8;
	optional float duration = 9 [default = -1];
	optional uint32 caster = 10 [default = 16777215];
	optional uint32 ability = 11 [default = 16777215];
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
	optional int32 dd_ability_id = 28 [default = -1];
	optional string illusion_label = 29;
	optional bool active = 30;
	optional string player_ids = 31 [default = "-1"];
	optional string lua_name = 32;
	optional int32 attack_speed = 33;
	optional uint32 aura_owner = 34 [default = 16777215];
	optional int32 bonus_all_stats = 35;
	optional int32 bonus_health = 36;
	optional int32 bonus_mana = 37;
	optional uint32 custom_entity = 38 [default = 16777215];
}
`)
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (name !== "ActiveModifiers") return
	for (const [index, [, modSerialized]] of update) {
		const replaced = activeModifiersRaw.get(index)
		if (modSerialized.byteLength === 0 && replaced?.SerialNum !== undefined) {
			const replacedMod = activeModifiers.get(replaced.SerialNum)
			if (replacedMod !== undefined) EmitModifierRemoved(replacedMod)
			continue
		}
		const mod = new IModifier(
			ParseProtobufNamed(
				new Uint8Array(modSerialized),
				"CDOTAModifierBuffTableEntry"
			)
		)
		if (
			replaced?.SerialNum !== undefined &&
			replaced.SerialNum !== mod.SerialNum
		) {
			const replacedMod = activeModifiers.get(replaced.SerialNum)
			if (replacedMod !== undefined) EmitModifierRemoved(replacedMod)
		}
		activeModifiersRaw.set(index, mod)
		const oldMod = activeModifiers.get(mod.SerialNum as number)
		if (
			mod.EntryType === DOTA_MODIFIER_ENTRY_TYPE.DOTA_MODIFIER_ENTRY_TYPE_ACTIVE
		) {
			if (oldMod === undefined) EmitModifierCreated(mod)
			else EmitModifierChanged(oldMod, mod)
		} else if (oldMod !== undefined) EmitModifierRemoved(oldMod)
	}
})
EventsSDK.on("RemoveAllStringTables", () => {
	for (const mod of activeModifiers.values()) EmitModifierRemoved(mod)
	activeModifiers.clear()
})
