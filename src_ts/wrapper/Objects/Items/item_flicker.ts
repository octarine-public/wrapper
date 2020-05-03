import Item from "../Base/Item"

export default class item_flicker extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_flicker", item_flicker)
