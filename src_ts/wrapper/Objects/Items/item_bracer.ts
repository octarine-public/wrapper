import Item from "../Base/Item"

export default class item_bracer extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bracer", item_bracer)
