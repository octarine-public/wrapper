import Ability from "../Base/Ability"

export default class disruptor_thunder_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Disruptor_Thunder_Strike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("disruptor_thunder_strike", disruptor_thunder_strike)