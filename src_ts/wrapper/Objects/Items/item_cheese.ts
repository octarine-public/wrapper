import Item from "../Base/Item"

export default class item_cheese extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_cheese", item_cheese)
