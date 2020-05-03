import Item from "../Base/Item"

export default class item_sphere extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_sphere", item_sphere)
