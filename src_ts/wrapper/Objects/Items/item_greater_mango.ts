import Item from "../Base/Item"

export default class item_greater_mango extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_greater_mango", item_greater_mango)
