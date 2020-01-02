import Hero from "../Base/Hero"

export default class Pugna extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Pugna
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Pugna", Pugna)