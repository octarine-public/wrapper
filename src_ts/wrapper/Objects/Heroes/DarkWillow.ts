import Hero from "../Base/Hero"

export default class DarkWillow extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DarkWillow
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DarkWillow", DarkWillow)
