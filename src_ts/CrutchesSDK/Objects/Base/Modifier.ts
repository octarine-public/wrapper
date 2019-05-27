import Ability from "./Ability";
import { default as EntityManager, Game } from "../../Managers/EntityManager";
import Entity from "./Entity";
import Unit from "./Unit";

// AllowIllusionDuplicate
// CanParentBeAutoAttacked
// IsDebuff
// IsHidden
// IsPurgeException
// IsStunDebuff
// IsValid
// TextureName

export const TrueSightBuffs = [
	"modifier_truesight",
	"modifier_item_dustofappearance",
	"modifier_bloodseeker_thirst_vision",
	"modifier_bounty_hunter_track",
]

export const ScepterBuffs = [
	"modifier_item_ultimate_scepter",
	"modifier_item_ultimate_scepter_consumed",
	"modifier_wisp_tether_scepter",
]

const ScepterRegExp = /modifier_item_ultimate_scepter|modifier_wisp_tether_scepter/


export default class Modifier {
	
	/* ================== Static ================== */

	static HasTrueSightBuff(buffs: Modifier[]) {
		return buffs.some(buff => TrueSightBuffs.some(nameBuff => nameBuff === buff.Name))
	}
	
	static HasScepterBuff(buffs: Modifier[]) {
		return buffs.some(buff => ScepterRegExp.test(buff.Name));
	}

	/* =================== Fields =================== */

	m_pBuff: CDOTA_Buff
	private owner: Unit
	private m_bIsValid: boolean
	private m_Ability: Ability
	private m_Caster: Entity
	private m_Parent: Entity

	constructor(buff: CDOTA_Buff, owner: Unit) {
		this.m_pBuff = buff;
		this.owner = owner;
		this.m_bIsValid = true;
	}
	
	get Ability(): Ability {
		return this.m_Ability 
			|| (this.m_Ability = EntityManager.GetEntityByNative(this.m_pBuff.m_hAbility) as Ability);
	}
	get Attributes(): DOTAModifierAttribute_t {
		return this.m_pBuff.m_iAttributes;
	}
	get AuraRadius(): number {
		return this.m_pBuff.m_iAuraRadius;
	}
	get AuraSearchFlags(): number {
		return this.m_pBuff.m_iAuraSearchFlags;
	}
	get AuraSearchTeam(): DOTATeam_t {
		return this.m_pBuff.m_iAuraSearchTeam;
	}
	get AuraSearchType(): number {
		return this.m_pBuff.m_iAuraSearchType;
	}
	get Caster(): Entity {
		return this.m_Caster
			|| (this.m_Caster =EntityManager.GetEntityByNative(this.m_pBuff.m_hCaster));
	}
	get Class(): string {
		return this.m_pBuff.m_class;
	}
	get CreationTime(): number {
		return this.m_pBuff.m_flCreationTime;
	}
	get DieTime(): number {
		return this.m_pBuff.m_flDieTime;
	}
	get Duration(): number {
		return this.m_pBuff.m_flDuration;
	}
	get ElapsedTime(): number {
		return Math.max(this.CreationTime - Game.RawGameTime, 0)
	}
	get IsAura(): boolean {
		return this.m_pBuff.m_bIsAura;
	}
	get IsPurgable(): boolean {
		return this.m_pBuff.m_bPurgedDestroy
	}
	set IsValid(value: boolean) {
		this.IsValid = value;
	}
	get IsValid(): boolean {
		return this.m_bIsValid;
	}
	get LastAppliedTime(): number {
		return this.m_pBuff.m_flLastAppliedTime;
	}
	get ModifierAura(): string {
		return this.m_pBuff.m_szModifierAura;
	}
	get Name(): string {
		return this.m_pBuff.m_name;
	}
	get Owner(): Unit {
		return this.owner;
	}
	get Parent(): Entity {
		return this.m_Parent
			|| (this.m_Parent = EntityManager.GetEntityByNative(this.m_pBuff.m_hParent));
	}
	/*
	get Particles() {
		return this.m_pBaseEntity.m_iParticles
	}
	*/
	get RemainingTime(): number {
		return Math.max(this.DieTime - Game.RawGameTime, 0);
	}
	get StackCount(): number {
		return this.m_pBuff.m_iStackCount;
	}
	get Team(): DOTATeam_t {
		return this.m_pBuff.m_iTeam;
	}
	
	toString(): string {
		return this.Name;
	}
}