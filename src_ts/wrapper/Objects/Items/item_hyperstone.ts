import Item from "../Base/Item"

export default class item_hyperstone extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_hyperstone", item_hyperstone)
