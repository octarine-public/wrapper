import Item from "../Base/Item"

export default class item_tango_single extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tango_single", item_tango_single)
