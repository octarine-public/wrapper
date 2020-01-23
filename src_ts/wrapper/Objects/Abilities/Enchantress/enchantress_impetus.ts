import Ability from "../../Base/Ability"

export default class enchantress_impetus extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enchantress_Impetus>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enchantress_impetus", enchantress_impetus)
