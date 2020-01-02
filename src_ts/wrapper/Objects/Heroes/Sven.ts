import Hero from "../Base/Hero"

export default class Sven extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Sven
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Sven", Sven)
