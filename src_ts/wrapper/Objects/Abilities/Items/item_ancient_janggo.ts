import Item from "../../Base/Item"

export default class item_ancient_janggo extends Item {
	public static readonly ModifierName: string = "modifier_item_ancient_janggo_active"
	public static readonly AuraModifierName: string = "modifier_item_ancient_janggo_aura_effect"

	public readonly m_pBaseEntity: C_DOTA_Item_Ancient_Janggo

	public get AuraRadius(): number {
		return this.m_pBaseEntity.radius
	}
	public get Radius(): number {
		return this.AuraRadius
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
}
