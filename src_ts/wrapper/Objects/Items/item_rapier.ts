import Item from "../Base/Item"

export default class item_rapier extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_rapier", item_rapier)
