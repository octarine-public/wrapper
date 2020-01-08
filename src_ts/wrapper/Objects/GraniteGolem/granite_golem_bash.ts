import Ability from "../Base/Ability"

export default class granite_golem_bash extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_GraniteGolem_Bash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("granite_golem_bash", granite_golem_bash)
