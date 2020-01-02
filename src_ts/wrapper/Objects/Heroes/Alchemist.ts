import Hero from "../Base/Hero"

export default class Alchemist extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Alchemist
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Alchemist", Alchemist)
