import Ability from "../Base/Ability"

export default class tusk_walrus_punch extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tusk_WalrusPunch
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_walrus_punch", tusk_walrus_punch)
