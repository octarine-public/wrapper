import Item from "../Base/Item"

export default class item_abyssal_blade extends Item {
	public static readonly TargetModifierTextureName: string = "item_abyssal_blade"
	public static readonly AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_STUNNED

	public readonly m_pBaseEntity!: C_DOTA_Item_AbyssalBlade
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_abyssal_blade", item_abyssal_blade)
