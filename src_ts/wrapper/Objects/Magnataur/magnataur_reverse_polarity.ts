import Ability from "../Base/Ability"

export default class magnataur_reverse_polarity extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Magnataur_ReversePolarity
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("magnataur_reverse_polarity", magnataur_reverse_polarity)
