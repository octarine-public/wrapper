import Hero from "../Base/Hero"

export default class Magnus extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Magnataur
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Magnataur", Magnus)