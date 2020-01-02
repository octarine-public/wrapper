import Hero from "../Base/Hero"

export default class Mirana extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Mirana
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Mirana", Mirana)