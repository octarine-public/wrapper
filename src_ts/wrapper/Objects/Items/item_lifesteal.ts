import Item from "../Base/Item"

export default class item_lifesteal extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_lifesteal", item_lifesteal)
