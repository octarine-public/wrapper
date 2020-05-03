import Item from "../Base/Item"

export default class item_circlet extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_circlet", item_circlet)
