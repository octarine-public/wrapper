import Item from "../Base/Item"

export default class item_super_blink extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_super_blink", item_super_blink)
