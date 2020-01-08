import Ability from "../Base/Ability"

export default class templar_assassin_self_trap extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_TemplarAssassin_SelfTrap
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_self_trap", templar_assassin_self_trap)
