import Ability from "../Base/Ability"

export default class mirana_leap extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Mirana_Leap
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mirana_leap", mirana_leap)
