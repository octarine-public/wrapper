import Item from "../Base/Item"

export default class item_ward_dispenser extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ward_dispenser", item_ward_dispenser)
