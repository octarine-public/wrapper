import Hero from "../Base/Hero"

export default class Tinker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Tinker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Tinker", Tinker)
