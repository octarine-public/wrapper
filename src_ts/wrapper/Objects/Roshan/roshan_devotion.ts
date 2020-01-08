import Ability from "../Base/Ability"

export default class roshan_devotion extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Roshan_Devotion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_devotion", roshan_devotion)
