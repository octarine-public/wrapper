import Item from "../Base/Item"

export default class item_dust extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dust", item_dust)
