import Item from "../Base/Item"

export default class item_octarine_core extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_octarine_core", item_octarine_core)
