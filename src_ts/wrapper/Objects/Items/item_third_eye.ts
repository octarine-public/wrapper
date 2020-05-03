import Item from "../Base/Item"

export default class item_third_eye extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_third_eye", item_third_eye)
