import Item from "../Base/Item"

export default class item_oblivion_staff extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_OblivionStaff
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_oblivion_staff", item_oblivion_staff)
