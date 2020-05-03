import Item from "../Base/Item"

export default class item_maelstrom extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_maelstrom", item_maelstrom)
