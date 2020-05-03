import Item from "../Base/Item"

export default class item_aegis extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_aegis", item_aegis)
