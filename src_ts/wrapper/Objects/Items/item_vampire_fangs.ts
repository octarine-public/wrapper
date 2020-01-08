import Item from "../Base/Item"

export default class item_vampire_fangs extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Vampire_Fangs
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vampire_fangs", item_vampire_fangs)
