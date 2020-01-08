import Item from "../Base/Item"

export default class item_necronomicon extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Necronomicon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_necronomicon", item_necronomicon)
