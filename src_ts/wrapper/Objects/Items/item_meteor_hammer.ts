import Item from "../Base/Item"

export default class item_meteor_hammer extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_meteor_hammer", item_meteor_hammer)
