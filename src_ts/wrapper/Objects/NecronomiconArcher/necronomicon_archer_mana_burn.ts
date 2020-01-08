import Ability from "../Base/Ability"

export default class necronomicon_archer_mana_burn extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Necronomicon_Archer_ManaBurn
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necronomicon_archer_mana_burn", necronomicon_archer_mana_burn)
