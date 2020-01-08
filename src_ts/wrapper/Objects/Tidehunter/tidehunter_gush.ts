import Ability from "../Base/Ability"

export default class tidehunter_gush extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tidehunter_Gush
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tidehunter_gush", tidehunter_gush)
