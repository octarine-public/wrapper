import Ability from "../Base/Ability"

export default class satyr_soulstealer_mana_burn extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SatyrSoulstealer_ManaBurn
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("satyr_soulstealer_mana_burn", satyr_soulstealer_mana_burn)
