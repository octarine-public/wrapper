import Hero from "../Base/Hero"

export default class Slark extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Slark
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Slark", Slark)
