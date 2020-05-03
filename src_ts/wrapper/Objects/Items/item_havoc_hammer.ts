import Item from "../Base/Item"

export default class item_havoc_hammer extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_havoc_hammer", item_havoc_hammer)
