import Item from "../Base/Item"

export default class item_apex extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_apex", item_apex)
