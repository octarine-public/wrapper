import Ability from "../Base/Ability"

export default class pangolier_lucky_shot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pangolier_LuckyShot
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pangolier_lucky_shot", pangolier_lucky_shot)
