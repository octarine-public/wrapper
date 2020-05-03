import Item from "../Base/Item"

export default class item_nullifier extends Item {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_nullifier", item_nullifier)
