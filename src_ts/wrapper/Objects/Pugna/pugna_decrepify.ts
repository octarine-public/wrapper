import Ability from "../Base/Ability"

export default class pugna_decrepify extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pugna_Decrepify
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pugna_decrepify", pugna_decrepify)
