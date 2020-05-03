import Item from "../Base/Item"

export default class item_infused_raindrop extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_infused_raindrop", item_infused_raindrop)
