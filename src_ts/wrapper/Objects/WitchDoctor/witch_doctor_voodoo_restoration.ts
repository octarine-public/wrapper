import Ability from "../Base/Ability"

export default class witch_doctor_voodoo_restoration extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_WitchDoctor_VoodooRestoration
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("witch_doctor_voodoo_restoration", witch_doctor_voodoo_restoration)
