import Item from "../Base/Item"

export default class item_monkey_king_bar extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_monkey_king_bar", item_monkey_king_bar)
