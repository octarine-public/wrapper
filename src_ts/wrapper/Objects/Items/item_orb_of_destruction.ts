import Item from "../Base/Item"

export default class item_orb_of_destruction extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Orb_Of_Destruction
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_orb_of_destruction", item_orb_of_destruction)
