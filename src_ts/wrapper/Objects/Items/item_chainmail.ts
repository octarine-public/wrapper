import Item from "../Base/Item"

export default class item_chainmail extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_chainmail", item_chainmail)
