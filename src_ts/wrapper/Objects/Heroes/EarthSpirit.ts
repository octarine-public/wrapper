import Hero from "../Base/Hero"

export default class EarthSpirit extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_EarthSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_EarthSpirit", EarthSpirit)
