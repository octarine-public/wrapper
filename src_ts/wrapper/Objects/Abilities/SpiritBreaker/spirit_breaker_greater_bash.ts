import Ability from "../../Base/Ability"

export default class spirit_breaker_greater_bash extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SpiritBreaker_GreaterBash>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spirit_breaker_greater_bash", spirit_breaker_greater_bash)
