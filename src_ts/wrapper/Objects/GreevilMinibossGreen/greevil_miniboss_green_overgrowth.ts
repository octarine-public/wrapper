import Ability from "../Base/Ability"

export default class greevil_miniboss_green_overgrowth extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Green_Overgrowth
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_green_overgrowth", greevil_miniboss_green_overgrowth)
