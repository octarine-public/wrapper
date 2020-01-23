import Item from "../Base/Item"

export default class item_ultimate_scepter_2 extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_UltimateScepter_2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ultimate_scepter_2", item_ultimate_scepter_2)
