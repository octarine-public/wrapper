import Ability from "../Base/Ability"

export default class seasonal_festive_firework extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Seasonal_Festive_Firework
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_festive_firework", seasonal_festive_firework)
