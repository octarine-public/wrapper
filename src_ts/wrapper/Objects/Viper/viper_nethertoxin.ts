import Ability from "../Base/Ability"

export default class viper_nethertoxin extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Viper_Nethertoxin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("viper_nethertoxin", viper_nethertoxin)
