import Item from "../Base/Item"

export default class item_apex extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Apex
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_apex", item_apex)