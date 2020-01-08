import Ability from "../Base/Ability"

export default class clinkz_death_pact extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Clinkz_DeathPact
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_death_pact", clinkz_death_pact)
