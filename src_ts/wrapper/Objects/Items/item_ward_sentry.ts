import Item from "../Base/Item"

export default class item_ward_sentry extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ward_sentry", item_ward_sentry)
