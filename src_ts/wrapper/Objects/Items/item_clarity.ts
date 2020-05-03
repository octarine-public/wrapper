import Item from "../Base/Item"

export default class item_clarity extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_clarity", item_clarity)
