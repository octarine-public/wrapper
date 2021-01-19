import Vector3 from "../../Base/Vector3"
import EntityManager from "../../Managers/EntityManager"
import { IModifier } from "../../Managers/ModifierManager"
import * as StringTables from "../../Managers/StringTables"
import GameState from "../../Utils/GameState"
import AbilityData from "../DataBook/AbilityData"
import Ability from "./Ability"
import Entity from "./Entity"
import Unit from "./Unit"

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

const ScepterRegExp = /modifier_item_ultimate_scepter|modifier_wisp_tether_scepter/

export default class Modifier {
	public static HasTrueSightBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => TRUESIGHT_MODIFIERS.some(nameBuff => nameBuff === buff.Name))
	}
	public static HasScepterBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => ScepterRegExp.test(buff.Name))
	}

	public IsValid = true

	public readonly Index: number
	public readonly SerialNumber: number

	public readonly AbilityLevel: number
	public readonly IsAura: boolean
	public readonly Name: string
	public readonly DDAbilityName: string

	private Parent_: Nullable<Unit>
	private Ability_: Nullable<Ability>

	private Caster_: Nullable<Entity>
	private AuraOwner_: Nullable<Entity>

	constructor(public m_pBuff: IModifier) {
		this.Index = this.m_pBuff.Index as number
		this.SerialNumber = this.m_pBuff.SerialNum as number

		this.AbilityLevel = this.m_pBuff.AbilityLevel as number
		this.IsAura = this.m_pBuff.IsAura as boolean

		this.Caster_ = EntityManager.EntityByIndex(this.m_pBuff.Caster)
		this.AuraOwner_ = EntityManager.EntityByIndex(this.m_pBuff.AuraOwner)

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
		if (this.Name === "modifier_rattletrap_jetpack")
			return 260
		return 0
	}
	public get ShouldDoFlyHeightVisual(): boolean {
		return this.Name === "modifier_winter_wyvern_arctic_burn_flight"
	}
	public get Attributes(): DOTAModifierAttribute_t {
		return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_NONE
	}
	public get CreationTime(): number {
		return this.m_pBuff.CreationTime
	}
	public get DieTime(): number {
		return this.CreationTime + this.Duration
	}
	public get Duration(): number {
		return this.m_pBuff.Duration
	}
	public get ElapsedTime(): number {
		return Math.max(GameState.RawGameTime - this.CreationTime, 0)
	}
	public get Parent(): Nullable<Unit> {
		if (this.Parent_ === undefined) {
			const ent = EntityManager.EntityByIndex(this.m_pBuff.Parent)
			if (ent !== undefined && ent instanceof Unit)
				this.Parent_ = ent
		}
		return this.Parent_
	}
	public get Ability(): Nullable<Ability> {
		if (this.Ability_ === undefined)
			this.Ability_ = EntityManager.EntityByIndex(this.m_pBuff.Ability) as Nullable<Ability>
		return this.Ability_
	}
	public get Caster(): Nullable<Entity> {
		if (this.Caster_ === undefined)
			this.Caster_ = EntityManager.EntityByIndex(this.m_pBuff.Caster)
		return this.Caster_
	}
	public get AuraOwner(): Nullable<Entity> {
		if (this.AuraOwner_ === undefined)
			this.AuraOwner_ = EntityManager.EntityByIndex(this.m_pBuff.AuraOwner)
		return this.AuraOwner_
	}
	public get RemainingTime(): number {
		return Math.max(this.DieTime - GameState.RawGameTime, 0)
	}
	public get StackCount(): number {
		return this.m_pBuff.StackCount ?? 0
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

	public toString(): string {
		return this.Name
	}
	public toJSON() {
		return {
			IsValid: this.IsValid,
			Index: this.Index,
			SerialNumber: this.SerialNumber,
			AbilityLevel: this.AbilityLevel,
			IsAura: this.IsAura,
			CreationTime: this.CreationTime,
			DieTime: this.DieTime,
			Duration: this.Duration,
			ElapsedTime: this.ElapsedTime,
			Parent: this.Parent?.Index,
			Ability: this.Ability?.Index,
			Caster: this.Caster?.Index,
			AuraOwner: this.AuraOwner?.Index,
			RemainingTime: this.RemainingTime,
			StackCount: this.StackCount,
			Name: this.Name,
			vStart: this.vStart.toJSON(),
			vEnd: this.vEnd.toJSON(),
		}
	}
}
