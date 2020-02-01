import Item from "../Base/Item"

export default class item_dagon extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Dagon

	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon", item_dagon)
