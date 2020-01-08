import Item from "../Base/Item"

export default class item_fallen_sky extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Fallen_Sky
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_fallen_sky", item_fallen_sky)
