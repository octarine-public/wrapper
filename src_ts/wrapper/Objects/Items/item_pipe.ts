import Item from "../Base/Item"

export default class item_pipe extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_pipe", item_pipe)
