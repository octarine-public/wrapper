import Item from "../Base/Item"

export default class item_butterfly extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_butterfly", item_butterfly)
