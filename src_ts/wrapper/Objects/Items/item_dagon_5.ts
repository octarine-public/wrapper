import item_dagon from "./item_dagon"

export default class item_dagon_5 extends item_dagon {
	public NativeEntity: Nullable<C_DOTA_Item_Dagon_Upgraded5>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon_5", item_dagon_5)
