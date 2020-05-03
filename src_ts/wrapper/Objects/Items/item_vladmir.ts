import Item from "../Base/Item"

export default class item_vladmir extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vladmir", item_vladmir)
