import Hero from "../Base/Hero"

export default class Bane extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Bane
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Bane", Bane)
