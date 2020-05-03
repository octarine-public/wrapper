import Item from "../Base/Item"

export default class item_necronomicon extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_necronomicon", item_necronomicon)
