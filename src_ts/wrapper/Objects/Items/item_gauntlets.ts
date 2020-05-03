import Item from "../Base/Item"

export default class item_gauntlets extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_gauntlets", item_gauntlets)
