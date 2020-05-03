import Item from "../Base/Item"

export default class item_ward_observer extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ward_observer", item_ward_observer)
