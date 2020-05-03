import Item from "../Base/Item"

export default class item_bloodstone extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bloodstone", item_bloodstone)
