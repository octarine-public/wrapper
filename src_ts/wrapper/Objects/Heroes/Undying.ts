import Hero from "../Base/Hero"

export default class Undying extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Undying
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Undying", Undying)