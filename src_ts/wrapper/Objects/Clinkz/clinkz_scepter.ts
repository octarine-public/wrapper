import Ability from "../Base/Ability"

export default class clinkz_scepter extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Clinkz_Scepter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_scepter", clinkz_scepter)
