import Item from "../Base/Item"

export default class item_null_talisman extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_null_talisman", item_null_talisman)
