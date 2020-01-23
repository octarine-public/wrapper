import Item from "../Base/Item"

export default class item_monkey_king_bar extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_MonkeyKingBar>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_monkey_king_bar", item_monkey_king_bar)
