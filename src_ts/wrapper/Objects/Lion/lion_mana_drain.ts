import Ability from "../Base/Ability"

export default class lion_mana_drain extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lion_ManaDrain
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_mana_drain", lion_mana_drain)
