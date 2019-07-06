export default class AbilitySpecialData {
	readonly m_pAbilitySpecialData: DOTASpecialAbility_t
	
	constructor(data: DOTASpecialAbility_t) {
		this.m_pAbilitySpecialData = data;
	}
	
	get Count(): number {
		return this.m_pAbilitySpecialData.m_nCount;
	}
	get IsSpellDamageField(): boolean {
		return this.m_pAbilitySpecialData.m_bSpellDamageField
	}
	get Name(): string {
		return this.m_pAbilitySpecialData.m_pszName
	}
	get SpecialBonusAbility(): string {
		return this.m_pAbilitySpecialData.m_pszSpecialBonusAbility;
	}
	
	/* Value(index: number): number {
		if (index >= this.Count)
			return 0;
		
		return 
	} */
}