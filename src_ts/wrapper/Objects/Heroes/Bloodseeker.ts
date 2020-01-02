import Hero from "../Base/Hero"

export default class Bloodseeker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Bloodseeker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Batrider", Bloodseeker)
