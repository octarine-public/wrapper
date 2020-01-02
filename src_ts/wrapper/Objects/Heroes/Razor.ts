import Hero from "../Base/Hero"

export default class Razor extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Razor
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Razor", Razor)