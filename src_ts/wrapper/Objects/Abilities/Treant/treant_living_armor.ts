import Ability from "../../Base/Ability"

export default class treant_living_armor extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Treant_LivingArmor>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_living_armor", treant_living_armor)
