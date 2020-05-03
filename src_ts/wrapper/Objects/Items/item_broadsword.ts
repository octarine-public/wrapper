import Item from "../Base/Item"

export default class item_broadsword extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_broadsword", item_broadsword)
