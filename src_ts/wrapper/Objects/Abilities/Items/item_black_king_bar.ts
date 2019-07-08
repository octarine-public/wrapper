import Item from "../../Base/Item"

export default class item_black_king_bar extends Item {
	static AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_MAGIC_IMMUNE
	static ModifierName: string = "modifier_black_king_bar_immune"

	readonly m_pBaseEntity: C_DOTA_Item_Black_King_Bar
}