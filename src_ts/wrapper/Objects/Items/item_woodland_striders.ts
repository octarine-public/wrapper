import Item from "../Base/Item"

export default class item_woodland_striders extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Woodland_Striders
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_woodland_striders", item_woodland_striders)
