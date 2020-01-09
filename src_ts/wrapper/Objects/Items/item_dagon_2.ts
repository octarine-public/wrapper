import item_dagon from "./item_dagon"

export default class item_dagon_2 extends item_dagon {
	public readonly m_pBaseEntity!: C_DOTA_Item_Dagon_Upgraded2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dagon_2", item_dagon_2)
