import Ability from "../Base/Ability"

export default class life_stealer_open_wounds extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Life_Stealer_Open_Wounds
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_open_wounds", life_stealer_open_wounds)
