import Ability from "../Base/Ability"

export default class tinker_laser extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tinker_Laser
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_laser", tinker_laser)
