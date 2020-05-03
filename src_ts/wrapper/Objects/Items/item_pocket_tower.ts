import Item from "../Base/Item"

export default class item_pocket_tower extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pocket_tower", item_pocket_tower)
