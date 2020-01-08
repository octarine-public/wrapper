import Ability from "../Base/Ability"

export default class disruptor_static_storm extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Disruptor_StaticStorm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("disruptor_static_storm", disruptor_static_storm)
