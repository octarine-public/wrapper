import Ability from "../Base/Ability"

export default class meepo_divided_we_stand extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Meepo_DividedWeStand
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_divided_we_stand", meepo_divided_we_stand)
