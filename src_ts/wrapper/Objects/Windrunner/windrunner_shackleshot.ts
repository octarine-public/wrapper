import Ability from "../Base/Ability"

export default class windrunner_shackleshot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Windrunner_Shackleshot
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_shackleshot", windrunner_shackleshot)
