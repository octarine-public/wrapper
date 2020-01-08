import Item from "../Base/Item"

export default class item_chainmail extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_ChainMail
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_chainmail", item_chainmail)
