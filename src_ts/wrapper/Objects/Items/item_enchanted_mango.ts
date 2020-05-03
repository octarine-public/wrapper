import Item from "../Base/Item"

export default class item_enchanted_mango extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_enchanted_mango", item_enchanted_mango)
