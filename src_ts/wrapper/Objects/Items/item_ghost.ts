import Item from "../Base/Item"

export default class item_ghost extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ghost", item_ghost)
