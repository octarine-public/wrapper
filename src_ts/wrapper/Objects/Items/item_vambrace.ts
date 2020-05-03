import Item from "../Base/Item"

export default class item_vambrace extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vambrace", item_vambrace)
