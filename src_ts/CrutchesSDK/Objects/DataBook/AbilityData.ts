import { MaskToArrayBigInt, MaskToArrayNumber } from "../../Utils/Utils";
import AbilitySpecialData from "./AbilitySpecialData";

export default class AbilityData {
	
	m_pAbilityData: DOTAAbilityData_t
	m_AbilitySpecialData: AbilitySpecialData
	
	constructor(data: DOTAAbilityData_t) {
		this.m_pAbilityData = data;
	}
	
	get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return MaskToArrayBigInt(this.m_pAbilityData.m_iAbilityBehavior)
	}
	
	get AbilitySpecialData(): AbilitySpecialData {
		return this.m_AbilitySpecialData
			|| (this.m_AbilitySpecialData = new AbilitySpecialData(this.m_pAbilityData.m_pSpecialAbilities));
	}
	
	get AbilityType(): ABILITY_TYPES {
		return this.m_pAbilityData.m_iAbilityType
	}
	get AlternateModelName(): string {
		return this.m_pAbilityData.m_pModelAlternateName;
	}
	get Cost(): number {
		return this.m_pAbilityData.m_iItemCost;
	}
	get DamageType(): DAMAGE_TYPES {
		return this.m_pAbilityData.m_iAbilityDamageType
	}
	get DispellableType(): SPELL_DISPELLABLE_TYPES {
		return this.m_pAbilityData.m_iAbilityDispellableType;
	}
	get EffectName(): string {
		return this.m_pAbilityData.m_pEffectName;
	}
	get ID(): number {
		return this.m_pAbilityData.m_iAbilityID;
	}
	get IsGrantedByScepter(): boolean {
		return this.m_pAbilityData.m_bIsGrantedByScepter;
	}
	get IsItem(): boolean {
		return this.m_pAbilityData.m_bIsItem
	}
	get ItemRecipeName(): string {
		return this.m_pAbilityData.m_pszItemRecipeName;
	}
	get LevelsBeetweenUpgrades(): number {
		return this.m_pAbilityData.m_iLevelsBetweenUpgrades;
	}
	get ModelName(): string {
		return this.m_pAbilityData.m_pModelName;
	}
	get Name(): string {
		return this.m_pAbilityData.m_pszAbilityName || ""
	}
	get RequiredLevel(): number {
		return this.m_pAbilityData.m_iRequiredLevel;
	}
	get SharedCooldownName(): string {
		return this.m_pAbilityData.m_pszSharedCooldownName
	}
	get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.m_pAbilityData.m_iAbilityImmunityType
	}
	get TargetFlags(): DOTA_UNIT_TARGET_FLAGS[] {
		return MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetFlags)
	}
	get TargetTeam(): DOTA_UNIT_TARGET_TEAM[] {
		return MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetTeam)
	}
	get TargetType(): DOTA_UNIT_TARGET_TYPE[] {
		return MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetType)
	}
	get TextureName(): string {
		return this.m_pAbilityData.m_pszTextureName
	}
}