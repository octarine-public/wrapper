import { MaskToArrayBigInt, MaskToArrayNumber } from "../../Utils/BitsExtensions"
import AbilitySpecialData from "./AbilitySpecialData"

export default class AbilityData {

	public readonly Name = this.m_pAbilityData.m_pszAbilityName ?? "";
	public readonly AbilityBehavior: DOTA_ABILITY_BEHAVIOR[] = MaskToArrayBigInt(this.m_pAbilityData.m_iAbilityBehavior)
	public readonly AbilitySpecialData = new AbilitySpecialData(this.m_pAbilityData.m_pSpecialAbilities)
	public readonly AbilityType: ABILITY_TYPES = this.m_pAbilityData.m_iAbilityType
	public readonly MaxLevel = this.m_pAbilityData.m_iMaxLevel
	public readonly TextureName = this.m_pAbilityData.m_pszTextureName
	public readonly TargetFlags: DOTA_UNIT_TARGET_FLAGS[] = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetFlags)
	public readonly TargetTeam: DOTA_UNIT_TARGET_TEAM[] = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetTeam)
	public readonly TargetType: DOTA_UNIT_TARGET_TYPE[] = MaskToArrayNumber(this.m_pAbilityData.m_iAbilityTargetType)
	public readonly SharedCooldownName = this.m_pAbilityData.m_pszSharedCooldownName
	public readonly ModelName = this.m_pAbilityData.m_pModelName
	public readonly ItemRecipeName = this.m_pAbilityData.m_pszItemRecipeName
	public readonly IsItem = this.Name.startsWith("item_") // m_pAbilityData.m_bIsItem
	public readonly IsGrantedByScepter = this.m_pAbilityData.m_bIsGrantedByScepter
	public readonly ID = this.m_pAbilityData.m_iAbilityID
	public readonly EffectName = this.m_pAbilityData.m_pEffectName
	public readonly Cost = this.m_pAbilityData.m_iItemCost
	public readonly AlternateModelName = this.m_pAbilityData.m_pModelAlternateName
	public readonly SpecialValueCache = Object.create(null)

	constructor(public readonly m_pAbilityData: DOTAAbilityDefinition_t) { }

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
