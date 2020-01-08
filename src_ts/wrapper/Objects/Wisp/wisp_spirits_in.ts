import Ability from "../Base/Ability"

export default class wisp_spirits_in extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Wisp_Spirits_In
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_spirits_in", wisp_spirits_in)
