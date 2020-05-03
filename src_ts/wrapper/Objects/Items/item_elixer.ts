import Item from "../Base/Item"

export default class item_elixer extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_elixer", item_elixer)
