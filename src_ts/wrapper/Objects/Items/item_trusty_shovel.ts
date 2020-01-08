import Item from "../Base/Item"

export default class item_trusty_shovel extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Trusty_Shovel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_trusty_shovel", item_trusty_shovel)
