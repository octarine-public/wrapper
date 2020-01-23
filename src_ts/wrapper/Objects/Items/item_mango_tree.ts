import Item from "../Base/Item"

export default class item_mango_tree extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Mango_Tree>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mango_tree", item_mango_tree)
