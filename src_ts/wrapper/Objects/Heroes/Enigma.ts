import Hero from "../Base/Hero"

export default class Enigma extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Enigma
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Enigma", Enigma)