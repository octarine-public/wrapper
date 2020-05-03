import Item from "../Base/Item"

export default class item_tango extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tango", item_tango)
