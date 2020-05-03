import Item from "../Base/Item"

export default class item_point_booster extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_point_booster", item_point_booster)
