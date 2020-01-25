import item_travel_boots from "./item_travel_boots"

export default class item_travel_boots_2 extends item_travel_boots {
	public NativeEntity: Nullable<CDOTA_Item_Recipe_BootsOfTravel_2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_travel_boots_2", item_travel_boots_2)
