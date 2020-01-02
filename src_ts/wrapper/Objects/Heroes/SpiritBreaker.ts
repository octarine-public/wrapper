import Hero from "../Base/Hero"

export default class SpiritBreaker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SpiritBreaker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_SpiritBreaker", SpiritBreaker)
