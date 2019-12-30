import Ability from "../../Base/Ability"

export default class invoker_sun_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Invoker_SunStrike

	public get AOERadius(): number {
		return this.GetSpecialValue("area_of_effect")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_sun_strike", invoker_sun_strike)
