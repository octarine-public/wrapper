import Item from "../Base/Item"

export default class item_medallion_of_courage extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Medallion_Of_Courage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_medallion_of_courage", item_medallion_of_courage)
