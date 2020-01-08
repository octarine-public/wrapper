import Ability from "../Base/Ability"

export default class meepo_geostrike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Meepo_Geostrike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_geostrike", meepo_geostrike)
