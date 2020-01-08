import Item from "../Base/Item"

export default class item_dragon_scale extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Dragon_Scale
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dragon_scale", item_dragon_scale)
