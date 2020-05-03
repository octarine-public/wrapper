import Item from "../Base/Item"

export default class item_buckler extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_buckler", item_buckler)
