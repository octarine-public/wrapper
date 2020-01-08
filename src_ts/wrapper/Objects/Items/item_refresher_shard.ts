import Item from "../Base/Item"

export default class item_refresher_shard extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_RefresherOrb_Shard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_refresher_shard", item_refresher_shard)
