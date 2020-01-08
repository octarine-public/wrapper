import Ability from "../Base/Ability"

export default class death_prophet_witchcraft extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DeathProphet_Witchcraft
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("death_prophet_witchcraft", death_prophet_witchcraft)
