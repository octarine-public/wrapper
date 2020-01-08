import Item from "../Base/Item"

export default class item_princes_knife extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Princes_Knife
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_princes_knife", item_princes_knife)
