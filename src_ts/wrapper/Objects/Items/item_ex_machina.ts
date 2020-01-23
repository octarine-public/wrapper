import Item from "../Base/Item"

export default class item_ex_machina extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Ex_Machina>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ex_machina", item_ex_machina)
