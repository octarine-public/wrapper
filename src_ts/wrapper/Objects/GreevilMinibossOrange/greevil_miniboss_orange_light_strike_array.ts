import Ability from "../Base/Ability"

export default class greevil_miniboss_orange_light_strike_array extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Orange_LightStrikeArray
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_orange_light_strike_array", greevil_miniboss_orange_light_strike_array)
