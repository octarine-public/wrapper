import Item from "../Base/Item"

export default class item_soul_ring extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_soul_ring", item_soul_ring)
