import Item from "../Base/Item"

export default class item_robe extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_robe", item_robe)
