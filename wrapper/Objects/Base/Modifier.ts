import { Vector3 } from "../../Base/Vector3"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { IModifier } from "../../Managers/ModifierManager"
import * as StringTables from "../../Managers/StringTables"
import { arrayRemove } from "../../Utils/ArrayExtensions"
import { GameState } from "../../Utils/GameState"
import { AbilityData } from "../DataBook/AbilityData"
import { Ability } from "./Ability"
import { Unit } from "./Unit"

// AllowIllusionDuplicate
// CanParentBeAutoAttacked
// IsDebuff
// IsHidden
// IsPurgeException
// IsStunDebuff
// IsValid
// TextureName

export const TRUESIGHT_MODIFIERS = [
	"modifier_truesight",
	"modifier_item_dustofappearance",
	"modifier_bloodseeker_thirst_vision",
	"modifier_bounty_hunter_track",
]

export const SCEPTER_MODIFIERS = [
	"modifier_item_ultimate_scepter",
	"modifier_item_ultimate_scepter_consumed",
	"modifier_wisp_tether_scepter",
]

export const BLOCKING_DAMAGE_MODIFIERS = [
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_item_combo_breaker_buff",
	"modifier_templar_assassin_refraction_absorb",
]

export const REFLECTING_DAMAGE_MODIFIERS = [
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_item_blade_mail_reflect",
]

const ShardRegExp = /modifier_item_aghanims_shard/
const ScepterRegExp = /^modifier_(item_ultimate_scepter|wisp_tether_scepter)/

export class Modifier {
	public static HasTrueSightBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => TRUESIGHT_MODIFIERS.some(nameBuff => nameBuff === buff.Name))
	}
	public static HasScepterBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => ScepterRegExp.test(buff.Name))
	}
	public static HasShardBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => ShardRegExp.test(buff.Name))
	}

	public IsValid = true

	public readonly Index: number
	public readonly SerialNumber: number
	public readonly IsAura: boolean
	public readonly Name: string

	public CreationTime = 0
	public Armor = 0
	public AttackSpeed = 0
	public MovementSpeed = 0
	public BonusAllStats = 0
	public BonusHealth = 0
	public BonusMana = 0
	public CustomEntity: Nullable<Unit>
	public StackCount = 0
	public Duration = 0
	public AbilityLevel = 0
	public DDAbilityName: string
	public Parent: Nullable<Unit>
	public Ability: Nullable<Ability>
	public Caster: Nullable<Unit>
	public AuraOwner: Nullable<Unit>

	constructor(public m_pBuff: IModifier) {
		this.Index = this.m_pBuff.Index as number
		this.SerialNumber = this.m_pBuff.SerialNum as number

		this.IsAura = this.m_pBuff.IsAura as boolean

		const lua_name = this.m_pBuff.LuaName
		this.Name = lua_name === undefined || lua_name === ""
			? StringTables.GetString("ModifierNames", this.m_pBuff.ModifierClass as number)
			: lua_name

		const DDAbilityID = this.m_pBuff.DDAbilityID
		const DDAbilityName = DDAbilityID !== undefined
			? AbilityData.GetAbilityNameByID(DDAbilityID)
			: undefined
		this.DDAbilityName = DDAbilityName ?? "ability_base"
	}

	public get InvisibilityLevel(): number {
		if (
			this.Name === "modifier_monkey_king_bounce_leap"
			|| this.Name === "modifier_monkey_king_arc_to_ground"
		)
			return 0
		const fade_time = this.m_pBuff.FadeTime
		if (fade_time === undefined)
			return 0
		if (fade_time === 0)
			return 1
		return Math.min(this.ElapsedTime / (fade_time * 2), 1)
	}

	public get DeltaZ(): number {
		if (
			(
				this.Name === "modifier_monkey_king_bounce_leap"
				|| this.Name === "modifier_monkey_king_arc_to_ground"
			) && this.ElapsedTime < 10 // just in case buff bugs out
		)
			return this.m_pBuff.FadeTime ?? 0
		switch (this.Name) {
			case "modifier_rattletrap_jetpack":
				return 260
			case "modifier_monkey_king_bounce_perch":
			case "modifier_lina_flame_cloak":
				return 100
			default:
				return 0
		}
	}

	public get ShouldDoFlyHeightVisual(): boolean {
		return (
			this.Name === "modifier_winter_wyvern_arctic_burn_flight"
			|| this.Name === "modifier_courier_flying"
			|| this.Name === "modifier_night_stalker_darkness"
			|| this.Name === "modifier_monkey_king_bounce_perch"
		)
	}
	public get DieTime(): number {
		return this.CreationTime + this.Duration
	}
	public get ElapsedTime(): number {
		return Math.max(GameState.RawGameTime - this.CreationTime, 0)
	}
	public get RemainingTime(): number {
		return Math.max(this.DieTime - GameState.RawGameTime, 0)
	}
	public get DDModifierID(): Nullable<number> {
		return this.m_pBuff.DDModifierID
	}
	public get vStart(): Vector3 {
		const vec = this.m_pBuff.vStart

		if (vec === undefined)
			return new Vector3().Invalidate()

		return new Vector3(vec.x, vec.y, vec.z)
	}
	public get vEnd(): Vector3 {
		const vec = this.m_pBuff.vEnd

		if (vec === undefined)
			return new Vector3().Invalidate()

		return new Vector3(vec.x, vec.y, vec.z)
	}

	public Update(): void {
		const new_caster = EntityManager.EntityByIndex(this.m_pBuff.Caster) as Nullable<Unit>,
			new_ability = EntityManager.EntityByIndex(this.m_pBuff.Ability) as Nullable<Ability>,
			new_aura_owner = EntityManager.EntityByIndex(this.m_pBuff.AuraOwner) as Nullable<Unit>,
			new_parent = EntityManager.EntityByIndex(this.m_pBuff.Parent) as Nullable<Unit>,
			new_ability_level = this.m_pBuff.AbilityLevel ?? 0,
			new_duration = this.m_pBuff.Duration ?? 0,
			new_stack_count = this.m_pBuff.StackCount ?? 0,
			new_creation_time = this.m_pBuff.CreationTime ?? 0,
			new_armor = this.m_pBuff.Armor ?? 0,
			new_attack_speed = this.m_pBuff.AttackSpeed ?? 0,
			new_movement_speed = this.m_pBuff.MovementSpeed ?? 0,
			new_bonus_all_stats = this.m_pBuff.BonusAllStats ?? 0,
			new_bonus_health = this.m_pBuff.BonusHealth ?? 0,
			new_bonus_mana = this.m_pBuff.BonusMana ?? 0,
			new_custom_entity = EntityManager.EntityByIndex(this.m_pBuff.CustomEntity) as Nullable<Unit>

		if (this.Parent !== new_parent)
			this.Remove()
		let updated = false
		if (this.Caster !== new_caster) {
			this.Caster = new_caster
			updated = true
		}
		if (this.Ability !== new_ability) {
			this.Ability = new_ability
			updated = true
		}
		if (this.AuraOwner !== new_aura_owner) {
			this.AuraOwner = new_aura_owner
			updated = true
		}
		if (this.AbilityLevel !== new_ability_level) {
			this.AbilityLevel = new_ability_level
			updated = true
		}
		if (this.Duration !== new_duration) {
			this.Duration = new_duration
			updated = true
		}
		if (this.StackCount !== new_stack_count) {
			this.StackCount = new_stack_count
			updated = true
		}
		if (this.CreationTime !== new_creation_time) {
			this.CreationTime = new_creation_time
			updated = true
		}
		if (this.Armor !== new_armor) {
			this.Armor = new_armor
			updated = true
		}
		if (this.AttackSpeed !== new_attack_speed) {
			this.AttackSpeed = new_attack_speed
			updated = true
		}
		if (this.MovementSpeed !== new_movement_speed) {
			this.MovementSpeed = new_movement_speed
			updated = true
		}
		if (this.BonusAllStats !== new_bonus_all_stats) {
			this.BonusAllStats = new_bonus_all_stats
			updated = true
		}
		if (this.BonusHealth !== new_bonus_health) {
			this.BonusHealth = new_bonus_health
			updated = true
		}
		if (this.BonusMana !== new_bonus_mana) {
			this.BonusMana = new_bonus_mana
			updated = true
		}
		if (this.CustomEntity !== new_custom_entity) {
			this.CustomEntity = new_custom_entity
			updated = true
		}
		if (
			this.Duration !== -1
			&& this.DieTime < GameState.RawGameTime
			&& this.Name !== "modifier_legion_commander_overwhelming_odds"
		) {
			this.Remove()
			return
		}
		if (this.Parent !== new_parent) {
			this.Parent = new_parent
			this.AddModifier()
		} else if (this.Parent !== undefined && updated)
			EventsSDK.emit("ModifierChanged", false, this)
	}
	public Remove(): void {
		if (this.Parent === undefined || !this.Parent.Buffs.includes(this))
			return
		arrayRemove(this.Parent.Buffs, this)
		EventsSDK.emit("ModifierRemoved", false, this)
		this.Parent.ChangeFieldsByEvents()
	}
	private AddModifier(): void {
		if (this.Parent === undefined || this.Parent.Buffs.includes(this))
			return
		this.Parent.Buffs.push(this)
		EventsSDK.emit("ModifierCreated", false, this)
		this.Parent.ChangeFieldsByEvents()
	}
}
