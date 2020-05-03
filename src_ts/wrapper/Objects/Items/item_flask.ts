import Item from "../Base/Item"

export default class item_flask extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_flask", item_flask)
