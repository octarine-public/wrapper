import Item from "../Base/Item"

export default class item_necronomicon_3 extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Necronomicon_Level3>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_necronomicon_3", item_necronomicon_3)
