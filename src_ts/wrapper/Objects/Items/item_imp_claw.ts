import Item from "../Base/Item"

export default class item_imp_claw extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_imp_claw", item_imp_claw)
