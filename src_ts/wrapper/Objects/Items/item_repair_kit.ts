import Item from "../Base/Item"

export default class item_repair_kit extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_repair_kit", item_repair_kit)
