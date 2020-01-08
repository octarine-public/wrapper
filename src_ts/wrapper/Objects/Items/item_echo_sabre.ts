import Item from "../Base/Item"

export default class item_echo_sabre extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_EchoSabre
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_echo_sabre", item_echo_sabre)
