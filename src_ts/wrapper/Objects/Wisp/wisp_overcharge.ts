import Ability from "../Base/Ability"

export default class wisp_overcharge extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Wisp_Overcharge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_overcharge", wisp_overcharge)
