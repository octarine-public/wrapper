import Item from "../Base/Item"

export default class item_vanguard extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_vanguard", item_vanguard)
