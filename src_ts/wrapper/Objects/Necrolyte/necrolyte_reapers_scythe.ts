import Ability from "../Base/Ability"

export default class necrolyte_reapers_scythe extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Necrolyte_ReapersScythe
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necrolyte_reapers_scythe", necrolyte_reapers_scythe)
