import Item from "../Base/Item"

export default class item_boots_of_elves extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_BootsOfElven>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_boots_of_elves", item_boots_of_elves)
