import Ability from "../../Base/Ability"

export default class spirit_breaker_nether_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SpiritBreaker_NetherStrike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spirit_breaker_nether_strike", spirit_breaker_nether_strike)
