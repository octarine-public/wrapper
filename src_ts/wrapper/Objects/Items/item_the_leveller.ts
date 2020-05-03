import Item from "../Base/Item"

export default class item_the_leveller extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_the_leveller", item_the_leveller)
