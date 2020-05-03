import Item from "../Base/Item"

export default class item_energy_booster extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_energy_booster", item_energy_booster)
