import Ability from "../Base/Ability"

export default class meepo_ransack extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Meepo_Ransack
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_ransack", meepo_ransack)
