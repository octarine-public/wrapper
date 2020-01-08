import Ability from "../Base/Ability"

export default class greevil_miniboss_purple_plague_ward extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Purple_PlagueWard
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_purple_plague_ward", greevil_miniboss_purple_plague_ward)
