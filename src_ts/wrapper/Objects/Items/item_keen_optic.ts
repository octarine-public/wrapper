import Item from "../Base/Item"

export default class item_keen_optic extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Keen_Optic>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_keen_optic", item_keen_optic)
