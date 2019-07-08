import Item from "../../Base/Item"

export default class item_arcane_boots extends Item {
	readonly m_pBaseEntity: C_DOTA_Item_Arcane_Boots

	get AuraRadius(): number {
		return this.GetSpecialValue("replenish_radius")
	}
	get Radius(): number {
		return this.AuraRadius
	}
}