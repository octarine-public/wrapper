import Ability from "../Base/Ability"

export default class clinkz_wind_walk extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Clinkz_WindWalk
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_wind_walk", clinkz_wind_walk)
