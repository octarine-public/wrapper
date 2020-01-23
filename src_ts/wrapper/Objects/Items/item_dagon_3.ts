import item_dagon from "./item_dagon"

export default class item_dagon_3 extends item_dagon {
	public NativeEntity: Nullable<C_DOTA_Item_Dagon_Upgraded3>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon_3", item_dagon_3)
