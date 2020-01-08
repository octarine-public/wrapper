import Ability from "../Base/Ability"

export default class dark_troll_warlord_raise_dead extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkTrollWarlord_RaiseDead
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_troll_warlord_raise_dead", dark_troll_warlord_raise_dead)
