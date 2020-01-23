import Ability from "../../Base/Ability"

export default class forest_troll_high_priest_mana_aura extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ForestTrollHighPriest_ManaAura>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("forest_troll_high_priest_mana_aura", forest_troll_high_priest_mana_aura)
