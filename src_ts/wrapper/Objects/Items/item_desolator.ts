import Item from "../Base/Item"

export default class item_desolator extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_desolator", item_desolator)
