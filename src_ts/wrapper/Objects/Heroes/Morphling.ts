import Hero from "../Base/Hero"

export default class Morphling extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Morphling
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Morphling", Morphling)
