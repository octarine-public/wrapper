import Ability from "../Base/Ability"

export default class lycan_summon_wolves_critical_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lycan_SummonWolves_CriticalStrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_summon_wolves_critical_strike", lycan_summon_wolves_critical_strike)
