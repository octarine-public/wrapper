import Ability from "../../Base/Ability"

export default class viper_viper_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Viper_ViperStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("viper_viper_strike", viper_viper_strike)
