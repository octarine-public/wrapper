import Item from "../Base/Item"

export default class item_mithril_hammer extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_MithrilHammer>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mithril_hammer", item_mithril_hammer)
