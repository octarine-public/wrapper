import Item from "../Base/Item"

export default class item_panic_button extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Panic_Button
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_panic_button", item_panic_button)
