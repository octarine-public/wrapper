import Item from "../Base/Item"

export default class item_void_stone extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_void_stone", item_void_stone)
