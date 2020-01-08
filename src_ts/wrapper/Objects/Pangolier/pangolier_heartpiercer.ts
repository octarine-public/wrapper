import Ability from "../Base/Ability"

export default class pangolier_heartpiercer extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pangolier_HeartPiercer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_heartpiercer", pangolier_heartpiercer)
