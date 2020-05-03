import Item from "../Base/Item"

export default class item_spell_prism extends Item {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spell_prism", item_spell_prism)
