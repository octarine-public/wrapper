import Item from "../Base/Item"

export default class item_solar_crest extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Solar_Crest>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_solar_crest", item_solar_crest)
