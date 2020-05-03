import Item from "../Base/Item"

export default class item_magic_wand extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_magic_wand", item_magic_wand)
