import Ability from "../Base/Ability"

export default class techies_suicide extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Techies_Suicide
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_suicide", techies_suicide)
