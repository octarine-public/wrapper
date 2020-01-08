import Ability from "../Base/Ability"

export default class silencer_glaives_of_wisdom extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Silencer_GlaivesOfWisdom
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("silencer_glaives_of_wisdom", silencer_glaives_of_wisdom)
