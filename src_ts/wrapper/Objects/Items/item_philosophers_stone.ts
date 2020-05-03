import Item from "../Base/Item"

export default class item_philosophers_stone extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_philosophers_stone", item_philosophers_stone)
