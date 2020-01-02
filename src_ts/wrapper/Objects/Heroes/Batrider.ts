import Hero from "../Base/Hero"

export default class Batrider extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Batrider
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Batrider", Batrider)
