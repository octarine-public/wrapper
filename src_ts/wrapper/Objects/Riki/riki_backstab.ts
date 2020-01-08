import Ability from "../Base/Ability"

export default class riki_backstab extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Riki_Backstab
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_backstab", riki_backstab)
