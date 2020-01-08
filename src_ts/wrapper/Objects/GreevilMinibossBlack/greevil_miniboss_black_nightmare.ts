import Ability from "../Base/Ability"

export default class greevil_miniboss_black_nightmare extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Black_Nightmare
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_black_nightmare", greevil_miniboss_black_nightmare)
