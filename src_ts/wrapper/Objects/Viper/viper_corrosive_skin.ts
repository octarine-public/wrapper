import Ability from "../Base/Ability"

export default class viper_corrosive_skin extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Viper_CorrosiveSkin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("viper_corrosive_skin", viper_corrosive_skin)
