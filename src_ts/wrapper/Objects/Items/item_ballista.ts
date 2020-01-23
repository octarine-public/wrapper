import Item from "../Base/Item"

export default class item_ballista extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Ballista>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ballista", item_ballista)
