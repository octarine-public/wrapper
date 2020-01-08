import Ability from "../Base/Ability"

export default class viper_viper_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Viper_ViperStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("viper_viper_strike", viper_viper_strike)
