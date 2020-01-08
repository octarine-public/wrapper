import Ability from "../Base/Ability"

export default class undying_decay extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Undying_Decay
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_decay", undying_decay)
