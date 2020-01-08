import Ability from "../Base/Ability"

export default class roshan_inherent_buffs extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Roshan_InherentBuffs
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_inherent_buffs", roshan_inherent_buffs)
