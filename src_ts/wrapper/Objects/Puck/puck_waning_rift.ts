import Ability from "../Base/Ability"

export default class puck_waning_rift extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Puck_WaningRift
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("puck_waning_rift", puck_waning_rift)
