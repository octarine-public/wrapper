import Item from "../Base/Item"

export default class item_kaya extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_kaya", item_kaya)
