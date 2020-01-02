import Hero from "../Base/Hero"

export default class Ursa extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Ursa
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Ursa", Ursa)