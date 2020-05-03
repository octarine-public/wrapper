import Item from "../Base/Item"

export default class item_gloves extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_gloves", item_gloves)
