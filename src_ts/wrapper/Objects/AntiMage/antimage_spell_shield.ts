import Ability from "../Base/Ability"

export default class antimage_spell_shield extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_AntiMage_SpellShield
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("antimage_spell_shield", antimage_spell_shield)
