import { MaskToArrayBigInt, MaskToArrayNumber } from "../../Utils/BitsExtensions"
import AbilitySpecialData from "./AbilitySpecialData"

export default class AbilityData {
	public readonly Name: string
	public readonly AbilityBehavior: DOTA_ABILITY_BEHAVIOR[]
	public readonly AbilitySpecialData: AbilitySpecialData
	public readonly AbilityType: ABILITY_TYPES
	public readonly MaxLevel: number
	public readonly TextureName: string
	public readonly TargetFlags: DOTA_UNIT_TARGET_FLAGS[]
	public readonly TargetTeam: DOTA_UNIT_TARGET_TEAM[]
	public readonly TargetType: DOTA_UNIT_TARGET_TYPE[]
	public readonly SharedCooldownName: string
	public readonly ModelName: string
	public readonly ItemRecipeName: string
	public readonly IsItem: boolean
	public readonly IsGrantedByScepter: boolean
	public readonly ID: number
	public readonly EffectName: string
	public readonly Cost: number
	public readonly AlternateModelName: string
	public readonly SpecialValueCache = Object.create(null)

	constructor(public readonly m_pAbilityData: DOTAAbilityDefinition_t) {
		this.Name = m_pAbilityData.m_pszAbilityName || ""
		this.AbilityBehavior = MaskToArrayBigInt(m_pAbilityData.m_iAbilityBehavior)
		this.AbilitySpecialData = new AbilitySpecialData(m_pAbilityData.m_pSpecialAbilities)
		this.AbilityType = m_pAbilityData.m_iAbilityType
		this.MaxLevel = m_pAbilityData.m_iMaxLevel
		this.TextureName = m_pAbilityData.m_pszTextureName
		this.TargetFlags = MaskToArrayNumber(m_pAbilityData.m_iAbilityTargetFlags)
		this.TargetTeam = MaskToArrayNumber(m_pAbilityData.m_iAbilityTargetTeam)
		this.TargetType = MaskToArrayNumber(m_pAbilityData.m_iAbilityTargetType)
		this.SharedCooldownName = m_pAbilityData.m_pszSharedCooldownName
		this.ModelName = m_pAbilityData.m_pModelName
		this.ItemRecipeName = m_pAbilityData.m_pszItemRecipeName
		this.IsItem = this.Name.startsWith("item_") // m_pAbilityData.m_bIsItem
		this.IsGrantedByScepter = m_pAbilityData.m_bIsGrantedByScepter
		this.ID = m_pAbilityData.m_iAbilityID
		this.EffectName = m_pAbilityData.m_pEffectName
		this.Cost = m_pAbilityData.m_iItemCost
		this.AlternateModelName = m_pAbilityData.m_pModelAlternateName
	}

	get DamageType(): DAMAGE_TYPES {
		return this.m_pAbilityData.m_iAbilityDamageType
	}
	get DispellableType(): SPELL_DISPELLABLE_TYPES {
		return this.m_pAbilityData.m_iAbilityDispellableType
	}
	get LevelsBeetweenUpgrades(): number {
		return this.m_pAbilityData.m_iLevelsBetweenUpgrades
	}
	get RequiredLevel(): number {
		return this.m_pAbilityData.m_iRequiredLevel
	}
	get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.m_pAbilityData.m_iAbilityImmunityType
	}
}
