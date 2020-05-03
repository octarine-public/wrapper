import Item from "../Base/Item"

export default class item_tome_of_knowledge extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tome_of_knowledge", item_tome_of_knowledge)
