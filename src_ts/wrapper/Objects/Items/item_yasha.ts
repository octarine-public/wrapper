import Item from "../Base/Item"

export default class item_yasha extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_yasha", item_yasha)
