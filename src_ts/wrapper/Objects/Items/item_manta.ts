import Item from "../Base/Item"

export default class item_manta extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_MantaStyle
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_manta", item_manta)
