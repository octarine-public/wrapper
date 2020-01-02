import Hero from "../Base/Hero"

export default class Sniper extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Sniper
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Sniper", Sniper)