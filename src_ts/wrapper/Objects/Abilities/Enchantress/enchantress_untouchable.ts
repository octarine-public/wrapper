import Ability from "../../Base/Ability"

export default class enchantress_untouchable extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enchantress_Untouchable>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enchantress_untouchable", enchantress_untouchable)
