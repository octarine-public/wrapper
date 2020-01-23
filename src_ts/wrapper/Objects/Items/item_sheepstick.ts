import Item from "../Base/Item"

export default class item_sheepstick extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_SheepStick>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sheepstick", item_sheepstick)
