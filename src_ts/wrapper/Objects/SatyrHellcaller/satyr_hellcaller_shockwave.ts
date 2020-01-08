import Ability from "../Base/Ability"

export default class satyr_hellcaller_shockwave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SatyrHellcaller_Shockwave
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("satyr_hellcaller_shockwave", satyr_hellcaller_shockwave)
