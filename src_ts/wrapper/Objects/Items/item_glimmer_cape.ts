import Item from "../Base/Item"

export default class item_glimmer_cape extends Item {
	public NativeEntity: Nullable<CDOTA_Item_GlimmerCape>
	public get IsInvisibilityType() {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_glimmer_cape", item_glimmer_cape)
