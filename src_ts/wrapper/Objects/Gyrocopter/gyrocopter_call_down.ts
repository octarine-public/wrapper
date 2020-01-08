import Ability from "../Base/Ability"

export default class gyrocopter_call_down extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Gyrocopter_Call_Down
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("gyrocopter_call_down", gyrocopter_call_down)
