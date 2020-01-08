import Ability from "../Base/Ability"

export default class leshrac_lightning_storm extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Leshrac_Lightning_Storm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("leshrac_lightning_storm", leshrac_lightning_storm)
