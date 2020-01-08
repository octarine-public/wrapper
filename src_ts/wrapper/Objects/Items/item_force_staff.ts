import Item from "../Base/Item"

export default class item_force_staff extends Item {
	public readonly m_pBaseEntity!: CDOTA_Item_ForceStaff
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_force_staff", item_force_staff)
