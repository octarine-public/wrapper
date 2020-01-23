import Item from "../Base/Item"

export default class item_clumsy_net extends Item {
	public NativeEntity: Nullable<CDOTA_Item_Clumsy_Net>

	public get Speed(): number {
		return 900
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_clumsy_net", item_clumsy_net)
