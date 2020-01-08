import Ability from "../Base/Ability"

export default class wisp_relocate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Wisp_Relocate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("wisp_relocate", wisp_relocate)
