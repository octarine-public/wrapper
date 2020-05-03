import Item from "../Base/Item"

export default class item_paladin_sword extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_paladin_sword", item_paladin_sword)
