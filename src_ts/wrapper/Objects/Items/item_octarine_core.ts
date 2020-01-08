import Item from "../Base/Item"

export default class item_octarine_core extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Octarine_Core
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_octarine_core", item_octarine_core)
