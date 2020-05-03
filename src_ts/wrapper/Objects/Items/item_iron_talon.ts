import Item from "../Base/Item"

export default class item_iron_talon extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_iron_talon", item_iron_talon)
