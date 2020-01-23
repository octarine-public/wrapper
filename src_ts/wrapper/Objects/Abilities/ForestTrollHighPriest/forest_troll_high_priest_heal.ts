import Ability from "../../Base/Ability"

export default class forest_troll_high_priest_heal extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ForestTrollHighPriest_Heal>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("forest_troll_high_priest_heal", forest_troll_high_priest_heal)
