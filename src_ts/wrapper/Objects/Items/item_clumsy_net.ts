import Item from "../Base/Item"

export default class item_clumsy_net extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Clumsy_Net
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_clumsy_net", item_clumsy_net)
