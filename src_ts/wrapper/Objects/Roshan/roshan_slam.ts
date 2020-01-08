import Ability from "../Base/Ability"

export default class roshan_slam extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Roshan_Slam
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_slam", roshan_slam)
