import Ability from "../../Base/Ability"

export default class obsidian_destroyer_essence_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Obsidian_Destroyer_EssenceAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("obsidian_destroyer_essence_aura", obsidian_destroyer_essence_aura)
