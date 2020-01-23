import Ability from "../../Base/Ability"

export default class alpha_wolf_critical_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_AlphaWolf_CriticalStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alpha_wolf_critical_strike", alpha_wolf_critical_strike)
