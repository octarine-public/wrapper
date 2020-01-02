import Hero from "../Base/Hero"

export default class Zeus extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Zuus
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Zuus", Zeus)
