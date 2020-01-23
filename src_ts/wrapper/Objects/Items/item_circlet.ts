import Item from "../Base/Item"

export default class item_circlet extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Circlet>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_circlet", item_circlet)
