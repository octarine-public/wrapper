import Ability from "../Base/Ability"

export default class roshan_spell_block extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Roshan_SpellBlock
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("roshan_spell_block", roshan_spell_block)