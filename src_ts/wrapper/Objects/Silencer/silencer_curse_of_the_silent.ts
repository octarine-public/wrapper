import Ability from "../Base/Ability"

export default class silencer_curse_of_the_silent extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Silencer_CurseOfTheSilent
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("silencer_curse_of_the_silent", silencer_curse_of_the_silent)
