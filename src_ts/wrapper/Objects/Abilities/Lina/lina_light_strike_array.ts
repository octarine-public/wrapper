import Ability from "../../Base/Ability"

export default class lina_light_strike_array extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lina_LightStrikeArray

	public get AOERadius(): number {
		return this.GetSpecialValue("light_strike_array_aoe")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lina_light_strike_array", lina_light_strike_array)
