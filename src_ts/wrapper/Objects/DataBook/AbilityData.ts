import { MaskToArrayBigInt, MaskToArrayNumber } from "../../Utils/Utils";
import AbilitySpecialData from "./AbilitySpecialData";

export default class AbilityData {
	readonly m_pAbilityData: DOTAAbilityData_t
	readonly Name: string
	readonly AbilityBehavior: DOTA_ABILITY_BEHAVIOR[]
	readonly AbilitySpecialData: AbilitySpecialData
	readonly AbilityType: ABILITY_TYPES
	readonly MaxLevel: number
	readonly TextureName: string
	readonly TargetFlags: DOTA_UNIT_TARGET_FLAGS[]
	readonly TargetTeam: DOTA_UNIT_TARGET_TEAM[]
	readonly TargetType: DOTA_UNIT_TARGET_TYPE[]
	readonly SharedCooldownName: string
	readonly ModelName: string
	readonly ItemRecipeName: string
	readonly IsItem: boolean
	readonly IsGrantedByScepter: boolean
	readonly ID: number
	readonly EffectName: string
	readonly Cost: number
	readonly AlternateModelName: string

	constructor(data: DOTAAbilityData_t) {
		this.m_pAbilityData = data;
		this.Name = this.m_pAbilityData.m_pszAbilityName || ""
		this.AbilityBehavior = MaskToArrayBigInt(this.m_pAbilityData.m_iAbilityBehavior)
		this.AbilitySpecialData = new AbilitySpecialData(this.m_pAbilityData.m_pSpecialAbilities)
		this.AbilityType = this.m_pAbilityData.m_iAbilityType
		this.MaxLevel = this.m_pAbilityData.m_iMaxLevel
		this.TextureName = this.m_pAbilityData.m_pszTextureName
		this.TargetFlags = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetFlags)
		this.TargetTeam = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetTeam)
		this.TargetType = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetType)
		this.SharedCooldownName = this.m_pAbilityData.m_pszSharedCooldownName
		this.ModelName = this.m_pAbilityData.m_pModelName
		this.ItemRecipeName = this.m_pAbilityData.m_pszItemRecipeName
		this.IsItem = this.m_pAbilityData.m_bIsItem
		this.IsGrantedByScepter = this.m_pAbilityData.m_bIsGrantedByScepter
		this.ID = this.m_pAbilityData.m_iAbilityID
		this.EffectName = this.m_pAbilityData.m_pEffectName
		this.Cost = this.m_pAbilityData.m_iItemCost
		this.AlternateModelName = this.m_pAbilityData.m_pModelAlternateName
	}
	
	get DamageType(): DAMAGE_TYPES {
		return this.m_pAbilityData.m_iAbilityDamageType
	}
	get DispellableType(): SPELL_DISPELLABLE_TYPES {
		return this.m_pAbilityData.m_iAbilityDispellableType;
	}
	get LevelsBeetweenUpgrades(): number {
		return this.m_pAbilityData.m_iLevelsBetweenUpgrades;
	}
	get RequiredLevel(): number {
		return this.m_pAbilityData.m_iRequiredLevel;
	}
	get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.m_pAbilityData.m_iAbilityImmunityType
	}
}
