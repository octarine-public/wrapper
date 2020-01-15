import Item from "../Base/Item"

export default class item_nullifier extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Nullifier

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_nullifier", item_nullifier)
