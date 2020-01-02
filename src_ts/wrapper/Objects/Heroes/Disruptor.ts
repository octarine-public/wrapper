import Hero from "../Base/Hero"

export default class Disruptor extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Disruptor
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Disruptor", Disruptor)
