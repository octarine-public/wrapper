import Ability from "../Base/Ability"

export default class mirana_arrow extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Mirana_Arrow
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mirana_arrow", mirana_arrow)
