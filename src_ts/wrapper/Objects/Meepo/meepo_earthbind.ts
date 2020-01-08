import Ability from "../Base/Ability"

export default class meepo_earthbind extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Meepo_Earthbind
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_earthbind", meepo_earthbind)
