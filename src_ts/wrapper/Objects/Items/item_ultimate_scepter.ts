import Item from "../Base/Item"

export default class item_ultimate_scepter extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_UltimateScepter>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ultimate_scepter", item_ultimate_scepter)
