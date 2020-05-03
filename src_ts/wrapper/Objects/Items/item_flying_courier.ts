import Item from "../Base/Item"

export default class item_flying_courier extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_flying_courier", item_flying_courier)
