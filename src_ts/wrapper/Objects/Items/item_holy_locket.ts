import Item from "../Base/Item"

export default class item_holy_locket extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_holy_locket", item_holy_locket)
