import Item from "../Base/Item"

export default class item_royal_jelly extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_royal_jelly", item_royal_jelly)
