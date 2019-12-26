import Item from "../../Base/Item"

export default class item_assault extends Item {
	public static readonly AuraModifierName: string = "modifier_item_assault_negative_armor"

	public readonly m_pBaseEntity!: C_DOTA_Item_Assault_Cuirass
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_assault", item_assault)
