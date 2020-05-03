import Item from "../Base/Item"

export default class item_courier extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_courier", item_courier)
