import Ability from "../Base/Ability"

export default class sandking_caustic_finale extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SandKing_CausticFinale
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sandking_caustic_finale", sandking_caustic_finale)
