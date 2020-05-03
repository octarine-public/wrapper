import Item from "../Base/Item"

export default class item_timeless_relic extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_timeless_relic", item_timeless_relic)
