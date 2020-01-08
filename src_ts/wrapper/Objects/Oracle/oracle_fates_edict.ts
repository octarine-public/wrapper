import Ability from "../Base/Ability"

export default class oracle_fates_edict extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Oracle_FatesEdict
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_fates_edict", oracle_fates_edict)
