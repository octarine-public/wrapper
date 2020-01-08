import Item from "../Base/Item"

export default class item_sphere extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Sphere
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sphere", item_sphere)
