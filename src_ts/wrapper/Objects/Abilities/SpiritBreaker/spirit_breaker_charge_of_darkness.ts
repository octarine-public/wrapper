import Ability from "../../Base/Ability"

export default class spirit_breaker_charge_of_darkness extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SpiritBreaker_ChargeOfDarkness>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spirit_breaker_charge_of_darkness", spirit_breaker_charge_of_darkness)
