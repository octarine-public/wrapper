import Item from "../Base/Item"

export default class item_bfury extends Item {
	public get CastRangeOnWard(): number {
		return this.GetSpecialValue("cast_range_ward")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bfury", item_bfury)
