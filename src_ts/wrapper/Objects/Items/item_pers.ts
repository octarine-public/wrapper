import Item from "../Base/Item"

export default class item_pers extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pers", item_pers)
