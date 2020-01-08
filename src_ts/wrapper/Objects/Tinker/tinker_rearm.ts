import Ability from "../Base/Ability"

export default class tinker_rearm extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tinker_Rearm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_rearm", tinker_rearm)
