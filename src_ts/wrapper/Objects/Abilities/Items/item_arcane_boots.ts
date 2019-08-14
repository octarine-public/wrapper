import Item from "../../Base/Item"

export default class item_arcane_boots extends Item {
	public readonly m_pBaseEntity: C_DOTA_Item_Arcane_Boots

	public get AuraRadius(): number {
		return this.GetSpecialValue("replenish_radius")
	}
	public get Radius(): number {
		return this.AuraRadius
	}
}
