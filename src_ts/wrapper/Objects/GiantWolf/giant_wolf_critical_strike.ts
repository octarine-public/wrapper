import Ability from "../Base/Ability"

export default class giant_wolf_critical_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_GiantWolf_CriticalStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("giant_wolf_critical_strike", giant_wolf_critical_strike)
