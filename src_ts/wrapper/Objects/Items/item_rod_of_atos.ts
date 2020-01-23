import Item from "../Base/Item"

export default class item_rod_of_atos extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_RodOfAtos>

	public get Speed(): number {
		return 1500
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_rod_of_atos", item_rod_of_atos)
