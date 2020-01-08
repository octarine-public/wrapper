import Ability from "../Base/Ability"

export default class enraged_wildkin_tornado extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_EnragedWildkin_Tornado
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enraged_wildkin_tornado", enraged_wildkin_tornado)
