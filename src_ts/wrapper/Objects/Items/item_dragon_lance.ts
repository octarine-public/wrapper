import Item from "../Base/Item"

export default class item_dragon_lance extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_dragon_lance", item_dragon_lance)
