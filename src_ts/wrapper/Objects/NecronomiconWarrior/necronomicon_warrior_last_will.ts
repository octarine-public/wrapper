import Ability from "../Base/Ability"

export default class necronomicon_warrior_last_will extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Necronomicon_Warrior_LastWill
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necronomicon_warrior_last_will", necronomicon_warrior_last_will)
