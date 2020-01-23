import Item from "../Base/Item"

export default class item_smoke_of_deceit extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Smoke_Of_Deceit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_smoke_of_deceit", item_smoke_of_deceit)
