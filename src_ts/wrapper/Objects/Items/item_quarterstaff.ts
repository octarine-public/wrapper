import Item from "../Base/Item"

export default class item_quarterstaff extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_quarterstaff", item_quarterstaff)
