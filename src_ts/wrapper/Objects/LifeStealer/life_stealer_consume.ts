import Ability from "../Base/Ability"

export default class life_stealer_consume extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Life_Stealer_Consume
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_consume", life_stealer_consume)
