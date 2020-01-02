import Hero from "../Base/Hero"

export default class Slardar extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Slardar
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Slardar", Slardar)