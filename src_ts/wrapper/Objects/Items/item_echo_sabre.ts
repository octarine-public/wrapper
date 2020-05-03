import Item from "../Base/Item"

export default class item_echo_sabre extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_echo_sabre", item_echo_sabre)
