import Item from "../Base/Item"

export default class item_minotaur_horn extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Minotaur_Horn>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_minotaur_horn", item_minotaur_horn)
