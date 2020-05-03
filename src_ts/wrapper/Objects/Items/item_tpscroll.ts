import Item from "../Base/Item"

export default class item_tpscroll extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_tpscroll", item_tpscroll)
