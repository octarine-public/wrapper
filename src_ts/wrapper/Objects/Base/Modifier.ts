import EntityManager from "../../Managers/EntityManager"
import Ability from "./Ability"
import Entity from "./Entity"
import Unit from "./Unit"
import Game from "../GameResources/GameRules"
import { IModifier } from "../../Managers/Events"
import * as StringTables from "../../Managers/StringTables"

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
	/* ================== Static ================== */
	public static HasTrueSightBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => TRUESIGHT_MODIFIERS.some(nameBuff => nameBuff === buff.Name))
	}
	public static HasScepterBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => ScepterRegExp.test(buff.Name))
	}

	/* =================== Fields =================== */
	public readonly Index: number
	public readonly SerialNumber: number
	private Parent_: Unit
	public IsValid = true
	public readonly AbilityLevel: number
	public readonly IsAura: boolean
	public readonly CreationTime: number

	private Ability_: Ability
	private Caster_: Entity
	private AuraOwner_: Entity
	private Name_: string

	constructor(public m_pBuff: IModifier) {
		this.Index = this.m_pBuff.index
		this.SerialNumber = this.m_pBuff.serial_num
		this.AbilityLevel = this.m_pBuff.ability_level
		this.Caster_ = EntityManager.EntityByHandle(this.m_pBuff.caster)
		this.IsAura = this.m_pBuff.aura
		this.AuraOwner_ = EntityManager.EntityByHandle(this.m_pBuff.aura_owner)
		this.CreationTime = this.m_pBuff.creation_time
	}

	public get Attributes(): DOTAModifierAttribute_t {
		return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_NONE
	}
	public get DieTime(): number {
		return this.CreationTime + this.Duration
	}
	public get Duration(): number {
		return this.m_pBuff.duration ?? 0
	}
	public get ElapsedTime(): number {
		return Math.max(Game.RawGameTime - this.CreationTime, 0)
	}
	public get Parent(): Unit {
		if (this.Parent_ === undefined) {
			let ent = EntityManager.EntityByHandle(this.m_pBuff.parent)
			if (ent !== undefined) {
				if (ent instanceof Unit)
					this.Parent_ = ent
				/*else
					console.log(ent.m_pBaseEntity.constructor.name, this.m_pBuff.parent, this.Name)*/
			}
		}
		return this.Parent_
	}
	public get Ability(): Ability {
		if (this.Ability_ === undefined)
			this.Ability_ = EntityManager.EntityByHandle(this.m_pBuff.ability) as Ability
		return this.Ability_
	}
	public get Caster(): Entity {
		if (this.Caster_ === undefined)
			this.Caster_ = EntityManager.EntityByHandle(this.m_pBuff.caster)
		return this.Caster_
	}
	public get AuraOwner(): Entity {
		if (this.AuraOwner_ === undefined)
			this.AuraOwner_ = EntityManager.EntityByHandle(this.m_pBuff.aura_owner)
		return this.AuraOwner_
	}
	public get RemainingTime(): number {
		return Math.max(this.DieTime - Game.RawGameTime, 0)
	}
	public get StackCount(): number {
		return this.m_pBuff.stack_count
	}
	public get Name(): string {
		if (this.Name_ === undefined)
			this.Name_ = StringTables.GetString("ModifierNames", this.m_pBuff.modifier_class)
		return this.Name_
	}

	public toString(): string {
		return this.Name
	}
}
