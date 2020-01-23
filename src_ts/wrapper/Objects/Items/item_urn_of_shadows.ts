import Item from "../Base/Item"

export default class item_urn_of_shadows extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Urn_Of_Shadows>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_urn_of_shadows", item_urn_of_shadows)
