import item_dagon from "./item_dagon"

export default class item_dagon_4 extends item_dagon {
	public NativeEntity: Nullable<C_DOTA_Item_Dagon_Upgraded4>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon_4", item_dagon_4)
