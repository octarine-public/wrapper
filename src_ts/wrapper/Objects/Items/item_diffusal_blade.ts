import Item from "../Base/Item"

export default class item_diffusal_blade extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Diffusal_Blade
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_diffusal_blade", item_diffusal_blade)