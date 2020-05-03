import Item from "../Base/Item"

export default class item_ultimate_orb extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ultimate_orb", item_ultimate_orb)
