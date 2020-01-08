import Ability from "../Base/Ability"

export default class greevil_miniboss_black_brain_sap extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Black_BrainSap
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_black_brain_sap", greevil_miniboss_black_brain_sap)
