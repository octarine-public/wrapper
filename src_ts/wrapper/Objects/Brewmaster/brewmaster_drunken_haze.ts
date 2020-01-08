import Ability from "../Base/Ability"

export default class brewmaster_drunken_haze extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_DrunkenHaze
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_drunken_haze", brewmaster_drunken_haze)
