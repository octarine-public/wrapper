import Ability from "../Base/Ability"

export default class clinkz_strafe extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Clinkz_Strafe
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_strafe", clinkz_strafe)
