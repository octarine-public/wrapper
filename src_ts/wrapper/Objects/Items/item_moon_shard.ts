import Item from "../Base/Item"

export default class item_moon_shard extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Moonshard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_moon_shard", item_moon_shard)