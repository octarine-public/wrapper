import Item from "../../Base/Item";

export default class item_abyssal_blade extends Item {
	static TargetModifierTextureName: string = "item_abyssal_blade";
	static AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_STUNNED;
	
	readonly m_pBaseEntity: C_DOTA_Item_AbyssalBlade;
}