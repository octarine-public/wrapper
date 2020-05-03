import Item from "../Base/Item"

export default class item_bloodthorn extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bloodthorn", item_bloodthorn)
