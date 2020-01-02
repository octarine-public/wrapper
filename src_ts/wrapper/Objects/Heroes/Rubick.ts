import Hero from "../Base/Hero"

export default class Rubick extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Rubick
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Rubick", Rubick)