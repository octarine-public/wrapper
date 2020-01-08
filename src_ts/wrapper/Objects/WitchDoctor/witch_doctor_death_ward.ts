import Ability from "../Base/Ability"

export default class witch_doctor_death_ward extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_WitchDoctor_DeathWard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("witch_doctor_death_ward", witch_doctor_death_ward)
