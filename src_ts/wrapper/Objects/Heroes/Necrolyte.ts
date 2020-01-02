import Hero from "../Base/Hero"

export default class Necrolyte extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Necrolyte
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Necrolyte", Necrolyte)