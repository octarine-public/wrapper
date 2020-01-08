import Ability from "../Base/Ability"

export default class oracle_fortunes_end extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Oracle_FortunesEnd
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_fortunes_end", oracle_fortunes_end)
