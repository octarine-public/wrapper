import Item from "../Base/Item"

export default class item_sheepstick extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sheepstick", item_sheepstick)
