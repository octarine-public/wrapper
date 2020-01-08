import Ability from "../Base/Ability"

export default class necronomicon_warrior_sight extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Necronomicon_Warrior_Sight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necronomicon_warrior_sight", necronomicon_warrior_sight)
