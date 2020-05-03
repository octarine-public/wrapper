import Item from "../Base/Item"

export default class item_boots extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_boots", item_boots)
