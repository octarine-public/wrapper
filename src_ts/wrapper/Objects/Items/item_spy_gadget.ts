import Item from "../Base/Item"

export default class item_spy_gadget extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spy_gadget", item_spy_gadget)
