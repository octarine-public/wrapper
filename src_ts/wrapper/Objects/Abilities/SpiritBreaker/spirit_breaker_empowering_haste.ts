import Ability from "../../Base/Ability"

export default class spirit_breaker_empowering_haste extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SpiritBreaker_EmpoweringHaste>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spirit_breaker_empowering_haste", spirit_breaker_empowering_haste)
