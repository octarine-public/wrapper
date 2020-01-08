import Item from "../Base/Item"

export default class item_kaya_and_sange extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_Kaya_And_Sange
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_kaya_and_sange", item_kaya_and_sange)
