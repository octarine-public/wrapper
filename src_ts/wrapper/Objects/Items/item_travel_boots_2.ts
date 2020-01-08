import Item from "../Base/Item"

export default class item_travel_boots_2 extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Recipe_BootsOfTravel_2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_travel_boots_2", item_travel_boots_2)
