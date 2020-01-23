import Ability from "../../Base/Ability"

export default class enchantress_enchant extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enchantress_Enchant>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enchantress_enchant", enchantress_enchant)
