import Item from "../Base/Item"

export default class item_enchanted_quiver extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_enchanted_quiver", item_enchanted_quiver)
