import Item from "../Base/Item"

export default class item_ninja_gear extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ninja_gear", item_ninja_gear)
