import Ability from "../Base/Ability"

export default class witch_doctor_paralyzing_cask extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_WitchDoctor_ParalyzingCask
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("witch_doctor_paralyzing_cask", witch_doctor_paralyzing_cask)
