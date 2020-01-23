import Item from "../Base/Item"

export default class item_platemail extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_PlateMail>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_platemail", item_platemail)
