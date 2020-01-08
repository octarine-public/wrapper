import Ability from "../Base/Ability"

export default class disruptor_glimpse extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Disruptor_Glimpse
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("disruptor_glimpse", disruptor_glimpse)
