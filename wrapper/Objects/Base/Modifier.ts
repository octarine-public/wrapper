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
	public readonly IsAura: boolean
	public readonly Name: string

	public AbilityLevel = 0
	public DDAbilityName = "" // should be initialized in AsyncCreate
	public Parent: Nullable<Unit>
	public Ability: Nullable<Ability>
	public Caster: Nullable<Entity>
	public AuraOwner: Nullable<Entity>

	constructor(public m_pBuff: IModifier) {
		this.Index = this.m_pBuff.Index as number
		this.SerialNumber = this.m_pBuff.SerialNum as number

		this.IsAura = this.m_pBuff.IsAura as boolean
		this.Update()

		const lua_name = this.m_pBuff.LuaName
		this.Name = lua_name === undefined || lua_name === ""
			? StringTables.GetString("ModifierNames", this.m_pBuff.ModifierClass as number)
			: lua_name
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
	public get CreationTime(): number {
		return this.m_pBuff.CreationTime
	}
	public get Armor(): Nullable<number> {
		return this.m_pBuff.Armor
	}
	public get AttackSpeed(): Nullable<number> {
		return this.m_pBuff.AttackSpeed
	}
	public get MovementSpeed(): Nullable<number> {
		return this.m_pBuff.MovementSpeed
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

	public async AsyncCreate(): Promise<void> {
		const DDAbilityID = this.m_pBuff.DDAbilityID
		const DDAbilityName = DDAbilityID !== undefined
			? await AbilityData.GetAbilityNameByID(DDAbilityID)
			: undefined
		this.DDAbilityName = DDAbilityName ?? "ability_base"
	}

	public Update(): void {
		this.Caster = EntityManager.EntityByIndex(this.m_pBuff.Caster)
		this.Ability = EntityManager.EntityByIndex(this.m_pBuff.Ability) as Nullable<Ability>
		this.AuraOwner = EntityManager.EntityByIndex(this.m_pBuff.AuraOwner)
		this.Parent = EntityManager.EntityByIndex(this.m_pBuff.Parent) as Nullable<Unit>
		this.AbilityLevel = this.m_pBuff.AbilityLevel ?? 0
	}
}
