import Ability from "../Base/Ability"

export default class chen_test_of_faith extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Chen_TestOfFaith
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chen_test_of_faith", chen_test_of_faith)
