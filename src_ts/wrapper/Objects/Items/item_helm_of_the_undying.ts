import Item from "../Base/Item"

export default class item_helm_of_the_undying extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Helm_Of_The_Undying>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_helm_of_the_undying", item_helm_of_the_undying)
