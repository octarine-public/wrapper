import Item from "../Base/Item"

export default class item_ethereal_blade extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Ethereal_Blade

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ethereal_blade", item_ethereal_blade)
