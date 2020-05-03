import Item from "../Base/Item"

export default class item_cloak extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_cloak", item_cloak)
