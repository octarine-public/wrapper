import Item from "../Base/Item"

export default class item_necronomicon_2 extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Necronomicon_Level2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_necronomicon_2", item_necronomicon_2)
