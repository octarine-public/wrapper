import Item from "../Base/Item"

export default class item_basher extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_CraniumBasher>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_basher", item_basher)
