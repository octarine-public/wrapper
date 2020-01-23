import Item from "../Base/Item"

export default class item_pocket_tower extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_PocketTower>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pocket_tower", item_pocket_tower)
