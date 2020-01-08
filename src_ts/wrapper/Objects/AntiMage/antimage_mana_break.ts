import Ability from "../Base/Ability"

export default class antimage_mana_break extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_AntiMage_ManaBreak
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("antimage_mana_break", antimage_mana_break)
