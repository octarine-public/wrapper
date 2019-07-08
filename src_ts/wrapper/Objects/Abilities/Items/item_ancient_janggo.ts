import Item from "../../Base/Item"

export default class item_ancient_janggo extends Item {
	static ModifierName: string = "modifier_item_ancient_janggo_active"
	static AuraModifierName: string = "modifier_item_ancient_janggo_aura_effect"

	readonly m_pBaseEntity: C_DOTA_Item_Ancient_Janggo

	get AuraRadius(): number {
		return this.m_pBaseEntity.radius
	}
	get Radius(): number {
		return this.AuraRadius
	}

	CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
}