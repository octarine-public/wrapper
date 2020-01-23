import Item from "../Base/Item"

export default class item_orb_of_venom extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Orb_of_Venom>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_orb_of_venom", item_orb_of_venom)
