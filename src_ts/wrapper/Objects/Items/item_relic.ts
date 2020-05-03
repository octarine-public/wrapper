import Item from "../Base/Item"

export default class item_relic extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_relic", item_relic)
