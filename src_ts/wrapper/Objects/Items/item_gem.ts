import Item from "../Base/Item"

export default class item_gem extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_gem", item_gem)
