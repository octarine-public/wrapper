import Ability from "../Base/Ability"

export default class greevil_miniboss_sight extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Sight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_sight", greevil_miniboss_sight)
