import Ability from "../Base/Ability"

export default class weaver_shukuchi extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Weaver_Shukuchi
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("weaver_shukuchi", weaver_shukuchi)
