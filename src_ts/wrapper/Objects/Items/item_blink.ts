import Item from "../Base/Item"

export default class item_blink extends Item {
	public get BaseCastRange(): number {
		return this.GetSpecialValue("blink_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_blink", item_blink)
