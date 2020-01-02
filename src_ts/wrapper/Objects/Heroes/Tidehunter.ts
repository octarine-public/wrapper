import Hero from "../Base/Hero"

export default class Tidehunter extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Tidehunter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Tidehunter", Tidehunter)
