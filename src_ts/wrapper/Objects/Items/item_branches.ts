import Item from "../Base/Item"

export default class item_branches extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_branches", item_branches)
