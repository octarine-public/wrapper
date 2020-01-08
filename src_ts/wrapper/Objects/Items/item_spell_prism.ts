import Item from "../Base/Item"

export default class item_spell_prism extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Spell_Prism
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_spell_prism", item_spell_prism)
