import Ability from "../Base/Ability"

export default class life_stealer_feast extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Life_Stealer_Feast
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_feast", life_stealer_feast)
