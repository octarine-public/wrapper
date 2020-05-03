import Item from "../Base/Item"

export default class item_arcane_ring extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_arcane_ring", item_arcane_ring)
