import Item from "../Base/Item"

export default class item_travel_boots extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Recipe_BootsOfTravel>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_travel_boots", item_travel_boots)
