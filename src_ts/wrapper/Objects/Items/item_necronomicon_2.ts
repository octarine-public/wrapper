import item_necronomicon from "./item_necronomicon"

export default class item_necronomicon_2 extends item_necronomicon {
	public NativeEntity: Nullable<C_DOTA_Item_Necronomicon_Level2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_necronomicon_2", item_necronomicon_2)
