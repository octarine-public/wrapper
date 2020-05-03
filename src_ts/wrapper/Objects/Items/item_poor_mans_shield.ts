import Item from "../Base/Item"

export default class item_poor_mans_shield extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_poor_mans_shield", item_poor_mans_shield)
