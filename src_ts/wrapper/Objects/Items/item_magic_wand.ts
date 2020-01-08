import Item from "../Base/Item"

export default class item_magic_wand extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_MagicWand
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_magic_wand", item_magic_wand)
