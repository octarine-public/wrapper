import Item from "../../Base/Item"

export default class item_assault extends Item {
	static AuraModifierName: string = "modifier_item_assault_negative_armor"

	readonly m_pBaseEntity: C_DOTA_Item_Assault_Cuirass
}