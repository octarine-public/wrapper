import Item from "../Base/Item"

export default class item_panic_button extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_panic_button", item_panic_button)
