import { Vector4 } from "../Base/Vector4"
import { DOTA_MODIFIER_ENTRY_TYPE } from "../Enums/DOTA_MODIFIER_ENTRY_TYPE"
import { EventPriority } from "../Enums/EventPriority"
import { Ability } from "../Objects/Base/Ability"
import { Entity } from "../Objects/Base/Entity"
import { Modifier } from "../Objects/Base/Modifier"
import { Unit } from "../Objects/Base/Unit"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { ModifierSDKClass } from "../Objects/NativeToSDK"
import { GameState } from "../Utils/GameState"
import {
	ParseProtobufDesc,
	ParseProtobufNamed,
	RecursiveProtobuf
} from "../Utils/Protobuf"
import { EntityManager } from "./EntityManager"
import { QueueEvent } from "./EventsQueue"
import { EventsSDK } from "./EventsSDK"
import { StringTables } from "./StringTables"

const activeModifiers = new Map<number, Modifier>()
const activeModifiersRaw: Nullable<IModifier>[] = []
const activeModifiersUpdate: Modifier[] = []

export class IModifier {
	public readonly InternalName: string
	public readonly InternalDDAbilityName: string = "ability_base"
	public IsFake = false // TODO: e.g modifier_spirit_breaker_charge_of_darkness

	constructor(public readonly kv: RecursiveProtobuf) {
		if (!this.kv.has("creation_time")) {
			this.kv.set("creation_time", GameState.RawGameTime)
		}
		if (this.DDModifierID !== undefined) {
			const ddName = AbilityData.GetAbilityNameByID(this.DDModifierID)
			this.InternalDDAbilityName = ddName ?? "ability_base"
		}
		let name = ""
		if (this.LuaName === undefined || this.LuaName === "") {
			name = StringTables.GetString("ModifierNames", this.ModifierClass)
		}
		this.InternalName = name
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
		return this.GetProperty<number>("modifier_class") ?? 0
	}
	public get AbilityLevel() {
		return this.GetProperty<number>("ability_level")
	}
	public get AuraWithInRange() {
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
	public AddInternalModifier(modifier: Modifier) {
		if (!activeModifiersUpdate.includes(modifier)) {
			activeModifiersUpdate.push(modifier)
		}
	}
	public RemoveInternalModifier(modifier: Modifier) {
		if (activeModifiersUpdate.includes(modifier)) {
			activeModifiersUpdate.remove(modifier)
		}
	}
	private isValid<T>(value: T) {
		return value !== EntityManager.INVALID_HANDLE
	}
}

function ModifierPostDataUpdate() {
	for (let i = activeModifiersUpdate.length - 1; i > -1; i--) {
		const modifier = activeModifiersUpdate[i]
		if (modifier.IsValid) {
			modifier.PostDataUpdate()
		}
	}
}

function ShardOrScepterChanged(source: Unit, isShard: boolean) {
	activeModifiers.forEach(modifier => {
		if (
			modifier.Parent === source ||
			modifier.Caster === source ||
			modifier.AuraOwner === source ||
			modifier.Ability?.Owner === source
		) {
			if (isShard) {
				modifier.OnHasShardChanged()
				return
			}
			modifier.OnHasScepterChanged()
		}
	})
}

function UnitLevelChanged(source: Unit) {
	if (source.IsVisible) {
		return
	}
	activeModifiers.forEach(modifier => {
		if (
			modifier.Parent === source ||
			modifier.Caster === source ||
			modifier.AuraOwner === source ||
			modifier.Ability?.Owner === source
		) {
			modifier.OnAbilityLevelChanged()
		}
	})
}

function AbilityLevelChanged(abil: Ability) {
	const owner = abil.Owner
	if (owner === undefined || owner.IsVisible) {
		return
	}
	activeModifiers.forEach(modifier => {
		if (
			modifier.Ability === abil ||
			modifier.Parent === owner ||
			modifier.Caster === owner ||
			modifier.AuraOwner === owner
		) {
			modifier.OnAbilityLevelChanged()
		}
	})
}

function EmitModifierCreated(modKV: IModifier) {
	if (
		modKV.Index === undefined ||
		modKV.Parent === undefined ||
		modKV.SerialNum === undefined
	) {
		return
	}
	const modifier = new (ModifierSDKClass.get(modKV.InternalName) ?? Modifier)(modKV)
	activeModifiers.set(modifier.SerialNumber, modifier)
	modifier.Update()
}

function EmitModifierChanged(oldModifier: Modifier, newKV: IModifier) {
	oldModifier.kv = newKV
	oldModifier.Update()
}

function EmitModifierRemoved(modifier: Nullable<Modifier>) {
	if (modifier !== undefined) {
		activeModifiers.delete(modifier.SerialNumber)
		modifier.Remove()
	}
}

function EntityModifierChanged(entity: Entity) {
	if (entity instanceof Unit || entity instanceof Ability) {
		activeModifiers.forEach(mod => {
			if (
				entity.HandleMatches(mod.kv.Parent ?? 0) ||
				entity.HandleMatches(mod.kv.Caster ?? 0) ||
				entity.HandleMatches(mod.kv.AuraOwner ?? 0) ||
				entity.HandleMatches(mod.kv.CustomEntity ?? 0)
			) {
				mod.Update()
			}
		})
	}
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
	QueueEvent(() => {
		update.forEach(([, modSerialized], key) => {
			const replaced = activeModifiersRaw[key]
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
			activeModifiersRaw[key] = mod
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
	})
})

EventsSDK.on("EntityDestroyed", entity => EntityModifierChanged(entity))

EventsSDK.on("PreEntityCreated", entity => EntityModifierChanged(entity))

EventsSDK.on("RemoveAllStringTables", () => {
	activeModifiers.forEach(mod => EmitModifierRemoved(mod))
	activeModifiersRaw.clear()
	// just in case
	QueueEvent(() => {
		activeModifiers.forEach(mod => EmitModifierRemoved(mod))
		activeModifiersRaw.clear()
	})
})

EventsSDK.on("PostDataUpdate", () => ModifierPostDataUpdate(), EventPriority.IMMEDIATE)

EventsSDK.on("UnitLevelChanged", unit => UnitLevelChanged(unit), EventPriority.IMMEDIATE)

EventsSDK.on(
	"HasShardChanged",
	unit => ShardOrScepterChanged(unit, true),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"HasScepterChanged",
	unit => ShardOrScepterChanged(unit, false),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"AbilityLevelChanged",
	abil => AbilityLevelChanged(abil),
	EventPriority.IMMEDIATE
)
