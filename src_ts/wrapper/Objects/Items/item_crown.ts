import Item from "../Base/Item"

export default class item_crown extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_crown", item_crown)
