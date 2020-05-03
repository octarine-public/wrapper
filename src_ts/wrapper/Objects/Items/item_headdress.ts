import Item from "../Base/Item"

export default class item_headdress extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_headdress", item_headdress)
