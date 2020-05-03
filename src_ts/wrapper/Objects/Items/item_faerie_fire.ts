import Item from "../Base/Item"

export default class item_faerie_fire extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_faerie_fire", item_faerie_fire)
