import Item from "../Base/Item"

export default class item_heart extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_heart", item_heart)
