import Hero from "../Base/Hero"

export default class Lich extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lich
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lich", Lich)
