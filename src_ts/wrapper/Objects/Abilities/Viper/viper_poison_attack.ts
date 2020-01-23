import Ability from "../../Base/Ability"

export default class viper_poison_attack extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Viper_PoisonAttack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("viper_poison_attack", viper_poison_attack)
