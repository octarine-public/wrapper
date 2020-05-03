import Item from "../Base/Item"

export default class item_mjollnir extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mjollnir", item_mjollnir)
