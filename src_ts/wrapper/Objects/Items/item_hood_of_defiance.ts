import Item from "../Base/Item"

export default class item_hood_of_defiance extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Hood_Of_Defiance>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_hood_of_defiance", item_hood_of_defiance)
