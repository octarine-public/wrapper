import Item from "../Base/Item"

export default class item_basher extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_basher", item_basher)
