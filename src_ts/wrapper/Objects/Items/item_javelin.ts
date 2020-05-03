import Item from "../Base/Item"

export default class item_javelin extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_javelin", item_javelin)
