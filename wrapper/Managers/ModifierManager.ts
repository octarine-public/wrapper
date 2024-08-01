import { Vector4 } from "../Base/Vector4"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import { Ability } from "../Objects/Base/Ability"
import { Modifier } from "../Objects/Base/Modifier"
import { Unit } from "../Objects/Base/Unit"
import { ModifierSDKClass } from "../Objects/NativeToSDK"
import { GameState } from "../Utils/GameState"
import {
	ParseProtobufDesc,
	ParseProtobufNamed,
	RecursiveProtobuf
} from "../Utils/Protobuf"
import { QueueEvent } from "./EventsQueue"
import { EventsSDK } from "./EventsSDK"
import { StringTables } from "./StringTables"

const queuedEnts: (Unit | Ability)[] = []
const cooldownChanged = new Set<Ability>()

const activeModifiers = new Map<number, Modifier>()
const activeModifiersRaw = new Map<number, IModifier>()

export const ModifierManager = new (class CModifierManager {
	public readonly TemporaryUpdate: Modifier[] = []
	public readonly PermanentUpdate: Modifier[] = []

	public get AllModifiers() {
		return [...activeModifiers.values()]
	}

	public GetModifierByIndex(index: number): Nullable<Modifier> {
		return activeModifiers.get(index)
	}

	public PostDataUpdate() {
		const temporary = this.TemporaryUpdate
		for (let index = temporary.length - 1; index > -1; index--) {
			const mod = temporary[index]
			const owner = mod.Parent
			const isValid = mod.IsValid && owner !== undefined
			const hasBuff = owner?.HasBuffByName(mod.Name) ?? false
			if (!isValid || GameState.RawGameTime >= mod.DieTime || !hasBuff) {
				this.TemporaryUpdate.remove(mod)
				continue
			}
			mod.OnIntervalThink()
		}

		const permanent = this.PermanentUpdate
		for (let index = permanent.length - 1; index > -1; index--) {
			const mod = permanent[index]
			const owner = mod.Parent
			const isValid = mod.IsValid && owner !== undefined
			const hasBuff = owner?.HasBuffByName(mod.Name) ?? false
			if (!isValid || !hasBuff) {
				this.TemporaryUpdate.remove(mod)
				continue
			}
			mod.OnIntervalThink()
		}
	}

	public AddIntervalThinkTemporary(mod: Modifier) {
		if (mod.Duration === 0) {
			return
		}
		if (!this.TemporaryUpdate.includes(mod)) {
			this.TemporaryUpdate.push(mod)
		}
	}

	public AddIntervalThink(mod: Modifier) {
		if (!this.PermanentUpdate.includes(mod)) {
			this.PermanentUpdate.push(mod)
		}
	}
})()

export class IModifier {
	constructor(public readonly kv: RecursiveProtobuf) {
		if (!this.kv.has("creation_time")) {
			this.kv.set("creation_time", GameState.RawGameTime)
		}
	}
	public get EntryType() {
		return this.GetProperty<DOTA_MODIFIER_ENTRY_TYPE>("entry_type")
	}
	public get Parent() {
		return this.GetProperty<number>("parent")
	}
	public get Index() {
		return this.GetProperty<number>("index")
	}
	public get SerialNum() {
		return this.GetProperty<number>("serial_num")
	}
	public get ModifierClass() {
		return this.GetProperty<number>("modifier_class")
	}
	public get AbilityLevel() {
		return this.GetProperty<number>("ability_level")
	}
	public get IsAuraWithInRange() {
		return this.GetProperty<boolean>("aura_within_range")
	}
	public get StackCount() {
		return this.GetProperty<number>("stack_count")
	}
	public get CreationTime(): number {
		return this.GetProperty("creation_time") as number
	}
	public get Duration(): number {
		return this.GetProperty("duration") as number
	}
	public get Caster() {
		return this.GetProperty<number>("caster")
	}
	public get Ability() {
		return this.GetProperty<number>("ability")
	}
	public get Armor(): Nullable<number> {
		return this.GetProperty<number>("armor")
	}
	public get FadeTime() {
		return this.GetProperty<number>("fade_time")
	}
	public get Subtle() {
		return this.GetProperty<boolean>("subtle")
	}
	public get ChannelTime() {
		return this.GetProperty<number>("channel_time")
	}
	public get vStart() {
		return this.GetVector("v_start")
	}
	public get vEnd() {
		return this.GetVector("v_end")
	}
	public get PortalLoopAppear() {
		return this.GetProperty<string>("portal_loop_appear")
	}
	public get PortalLoopDisappear() {
		return this.GetProperty<string>("portal_loop_disappear")
	}
	public get HeroLoopAppear() {
		return this.GetProperty<string>("hero_loop_appear")
	}
	public get HeroLoopDisappear() {
		return this.GetProperty<string>("hero_loop_disappear")
	}
	public get MovementSpeed() {
		return this.GetProperty<number>("movement_speed")
	}
	public get IsAura() {
		return this.GetProperty<boolean>("aura")
	}
	public get Activity() {
		return this.GetProperty<number>("activity")
	}
	public get Damage() {
		return this.GetProperty<number>("damage")
	}
	public get Range() {
		return this.GetProperty<number>("range")
	}
	public get DDModifierID() {
		return this.GetProperty<number>("dd_modifier_index")
	}
	public get DDAbilityID() {
		return this.GetProperty<number>("dd_ability_id")
	}
	public get IllusionLevel() {
		return this.GetProperty<number>("illusion_level")
	}
	public get IsActive() {
		return this.GetProperty<boolean>("active")
	}
	public get PlayerIDs() {
		return this.GetProperty<string>("player_ids")
	}
	public get LuaName() {
		return this.GetProperty<string>("lua_name")
	}
	public get AttackSpeed() {
		return this.GetProperty<number>("attack_speed")
	}
	public get AuraOwner() {
		return this.GetProperty<number>("aura_owner")
	}
	public get BonusAllStats() {
		return this.GetProperty<number>("bonus_all_stats")
	}
	public get BonusHealth() {
		return this.GetProperty<number>("bonus_health")
	}
	public get BonusMana() {
		return this.GetProperty<number>("bonus_mana")
	}
	public get CustomEntity() {
		return this.GetProperty<number>("custom_entity")
	}
	public get IllusionLabel() {
		return this.GetProperty<string>("illusion_label")
	}
	public GetProperty<T>(name: string): Nullable<T> {
		const value = this.kv.get(name)
		if (value === undefined || !this.isValid(value)) {
			return undefined as Nullable<T>
		}
		return this.kv.get(name) as Nullable<T>
	}
	public GetVector(name: string): Nullable<Vector4> {
		const vec = this.GetProperty<Map<string, number>>(name)
		if (vec === undefined) {
			return undefined
		}
		return new Vector4(vec.get("x"), vec.get("y"), vec.get("z"), vec.get("w"))
	}

	private isValid<T>(value: T) {
		return value !== 16777215
	}
}

function EmitModifierCreated(modKV: IModifier) {
	if (
		modKV.Index === undefined ||
		modKV.SerialNum === undefined ||
		modKV.Parent === undefined
	) {
		return
	}

	const luaName = modKV.LuaName
	const Name =
		luaName === undefined || luaName === ""
			? StringTables.GetString("ModifierNames", modKV.ModifierClass as number)
			: luaName

	const instance = ModifierSDKClass.get(Name) ?? Modifier
	const mod = new instance(modKV)
	activeModifiers.set(mod.SerialNumber, mod)
	mod.Update()
}

function EmitModifierChanged(oldMod: Modifier, mod: IModifier) {
	oldMod.kv = mod
	oldMod.Update()
}

function EmitModifierRemoved(mod: Nullable<Modifier>) {
	if (mod !== undefined) {
		activeModifiers.delete(mod.SerialNumber)
		ModifierManager.TemporaryUpdate.remove(mod)
		ModifierManager.PermanentUpdate.remove(mod)
		mod.Remove()
	}
}

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof Unit || ent instanceof Ability) {
		queuedEnts.push(ent)
	}
})

EventsSDK.on("AbilityCooldownChanged", abil => {
	if (!cooldownChanged.has(abil) && abil.Cooldown !== 0) {
		cooldownChanged.add(abil)
	}
})

EventsSDK.on("AbilityLevelChanged", abil => {
	const owner = abil.Owner
	if (owner === undefined) {
		return
	}
	activeModifiers.forEach(mod => {
		if (mod.Ability !== undefined && owner === mod.Ability.Owner) {
			mod.OnAbilityLevelChanged()
		}
	})
})

EventsSDK.on("UnitLevelChanged", unit => {
	activeModifiers.forEach(mod => {
		if (unit === mod.Ability?.Owner || unit === mod.Parent || unit === mod.Caster) {
			mod.OnUnitLevelChanged()
		}
	})
})

EventsSDK.on("HasShardChanged", unit => {
	activeModifiers.forEach(mod => {
		if (mod.Ability !== undefined && unit === mod.Ability.Owner) {
			mod.OnShardChanged()
		}
	})
})

EventsSDK.on("HasScepterChanged", unit => {
	activeModifiers.forEach(mod => {
		if (mod.Ability !== undefined && unit === mod.Ability.Owner) {
			mod.OnScepterChanged()
		}
	})
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Unit || ent instanceof Ability) {
		if (ent instanceof Ability) {
			cooldownChanged.delete(ent)
		}
		queuedEnts.remove(ent)
	}
})

EventsSDK.on("PostDataUpdate", () => {
	if (queuedEnts.length !== 0) {
		for (let index = 0; index < queuedEnts.length; index++) {
			const ent = queuedEnts[index]
			if (ent instanceof Ability) {
				activeModifiers.forEach(mod => {
					if (ent.HandleMatches(mod.kv.Ability ?? 0)) {
						mod.Update()
					}
				})
			}
			if (ent instanceof Unit) {
				activeModifiers.forEach(mod => {
					if (
						ent.HandleMatches(mod.kv.Parent ?? 0) ||
						ent.HandleMatches(mod.kv.Caster ?? 0) ||
						ent.HandleMatches(mod.kv.AuraOwner ?? 0) ||
						ent.HandleMatches(mod.kv.CustomEntity ?? 0)
					) {
						mod.Update()
					}
				})
			}
		}
		queuedEnts.clear()
	}

	if (cooldownChanged.size !== 0) {
		activeModifiers.forEach(mod => {
			if (mod.Ability === undefined || !cooldownChanged.has(mod.Ability)) {
				return
			}
			// see: modifier_item_tranquil_boots
			if (mod.Ability.Cooldown === 0) {
				cooldownChanged.delete(mod.Ability)
			}
			mod.OnAbilityCooldownChanged()
		})
	}

	ModifierManager.PostDataUpdate()
})

EventsSDK.on("EntityDestroyed", ent => {
	activeModifiers.forEach(mod => {
		if (
			mod.Parent === ent ||
			mod.Ability === ent ||
			mod.Caster === ent ||
			mod.AuraOwner === ent
		) {
			mod.Update()
		}
	})
})

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
	optional string player_ids = 31;
	optional string lua_name = 32;
	optional int32 attack_speed = 33;
	optional uint32 aura_owner = 34 [default = 16777215];
	optional int32 bonus_all_stats = 35;
	optional int32 bonus_health = 36;
	optional int32 bonus_mana = 37;
	optional uint32 custom_entity = 38 [default = 16777215];
	optional bool aura_within_range = 39;
}
`)
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (name !== "ActiveModifiers") {
		return
	}
	QueueEvent(() =>
		update.forEach(([, modSerialized], key) => {
			const replaced = activeModifiersRaw.get(key)
			if (modSerialized.byteLength === 0 && replaced?.SerialNum !== undefined) {
				EmitModifierRemoved(activeModifiers.get(replaced.SerialNum))
				return
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
				EmitModifierRemoved(activeModifiers.get(replaced.SerialNum))
			}
			activeModifiersRaw.set(key, mod)
			const oldMod = activeModifiers.get(mod.SerialNum as number)
			switch (mod.EntryType) {
				case DOTA_MODIFIER_ENTRY_TYPE.DOTA_MODIFIER_ENTRY_TYPE_ACTIVE:
					if (oldMod === undefined) {
						EmitModifierCreated(mod)
					} else {
						EmitModifierChanged(oldMod, mod)
					}
					break
				default:
					EmitModifierRemoved(oldMod)
					break
			}
		})
	)
})

EventsSDK.on("RemoveAllStringTables", () => {
	activeModifiers.forEach(mod => EmitModifierRemoved(mod))
	activeModifiersRaw.clear()

	// just in case
	QueueEvent(() => {
		activeModifiers.forEach(mod => EmitModifierRemoved(mod))
		activeModifiersRaw.clear()
	})
})
